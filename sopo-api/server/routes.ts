import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEndpointSchema, insertRequestLogSchema } from "@shared/schema";
import { z } from "zod";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes for endpoint management
  app.get("/api/endpoints", async (req, res) => {
    try {
      const endpoints = await storage.getAllEndpoints();
      res.json(endpoints);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch endpoints" });
    }
  });

  app.post("/api/endpoints", async (req, res) => {
    try {
      const validatedData = insertEndpointSchema.parse(req.body);
      
      // Check if path already exists
      const existing = await storage.getEndpointByPath(validatedData.path, validatedData.method);
      if (existing) {
        return res.status(400).json({ message: "Endpoint with this path and method already exists" });
      }
      
      const endpoint = await storage.createEndpoint(validatedData);
      res.status(201).json(endpoint);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create endpoint" });
    }
  });

  app.put("/api/endpoints/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertEndpointSchema.partial().parse(req.body);
      
      const updated = await storage.updateEndpoint(id, validatedData);
      if (!updated) {
        return res.status(404).json({ message: "Endpoint not found" });
      }
      
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update endpoint" });
    }
  });

  app.delete("/api/endpoints/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteEndpoint(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Endpoint not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete endpoint" });
    }
  });

  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      
      // Set cache headers for faster performance
      res.set('Cache-Control', 'public, max-age=60'); // Cache for 1 minute
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Recent activity logs
  app.get("/api/logs", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20; // Reduce default limit for faster response
      const logs = await storage.getRecentLogs(limit);
      
      // Set cache headers for better performance
      res.set('Cache-Control', 'public, max-age=30'); // Cache for 30 seconds
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch logs" });
    }
  });

  // Proxy middleware for configured endpoints
  app.use(async (req, res, next) => {
    const startTime = Date.now();
    
    // Skip if this is an API route
    if (req.path.startsWith('/api/')) {
      return next();
    }
    
    try {
      // Find matching endpoint
      const endpoint = await storage.getEndpointByPath(req.path, req.method);
      
      if (!endpoint) {
        return next(); // Let other middleware handle it
      }

      if (!endpoint.isActive) {
        return res.status(503).json({ 
          message: "Endpoint is currently disabled",
          path: req.path 
        });
      }

      // Set CORS headers if enabled
      if (endpoint.enableCors) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        
        if (req.method === 'OPTIONS') {
          return res.status(200).send();
        }
      }

      // Prepare request with proper headers for CORS and keep-alive
      const requestHeaders = {
        'content-type': req.headers['content-type'] || 'application/json',
        'accept': req.headers['accept'] || 'application/json',
        'user-agent': 'REST-Express-Proxy/1.0',
        'connection': 'keep-alive',
        'keep-alive': 'timeout=120',
        'origin': undefined, // Remove origin to avoid CORS issues
        'referer': undefined // Remove referer to avoid CORS issues
      };

      // Add custom headers if defined for this endpoint
      if (endpoint.customHeaders) {
        Object.assign(requestHeaders, endpoint.customHeaders);
      }

      // Use default payload if request body is empty and endpoint has default payload
      let requestData = req.body;
      if ((!requestData || Object.keys(requestData).length === 0) && endpoint.defaultPayload) {
        requestData = endpoint.defaultPayload;
      }

      const axiosConfig = {
        method: req.method.toLowerCase(),
        url: endpoint.targetUrl,
        headers: requestHeaders,
        data: requestData,
        params: req.query,
        timeout: 300000, // 5 minutes timeout for background operations
        validateStatus: () => true, // Accept all status codes
        maxRedirects: 5,
        responseType: 'json' as const,
        // Keep connection alive for longer operations
        httpAgent: false,
        httpsAgent: false
      };

      // Log the request for debugging
      console.log('Proxying request:', {
        method: req.method,
        path: req.path,
        targetUrl: endpoint.targetUrl,
        hasCustomHeaders: !!endpoint.customHeaders,
        hasDefaultPayload: !!endpoint.defaultPayload,
        timeout: '2 minutes'
      });

      console.log('Request payload:', requestData);

      // Send immediate response without waiting
      res.status(202).json({
        message: "Request sent successfully",
        details: {
          path: req.path,
          method: req.method,
          targetUrl: endpoint.targetUrl,
          timestamp: new Date().toISOString(),
          status: "processing"
        }
      });

      // Fire and forget - make the request in background (no await!)
      setImmediate(() => {
        axios(axiosConfig).then(response => {
        console.log('Background response received:', {
          path: req.path,
          status: response.status,
          statusText: response.statusText,
          hasData: !!response.data
        });
        
        const responseTime = Date.now() - startTime;
        
        // Log successful requests if enabled
        if (endpoint.enableLogging) {
          storage.createRequestLog({
            endpointId: endpoint.id,
            method: req.method,
            path: req.path,
            statusCode: response.status,
            responseTime,
            requestBody: requestData,
            responseBody: response.data,
            headers: req.headers,
            clientIp: req.ip || req.connection.remoteAddress || 'unknown',
            userAgent: req.get('User-Agent') || 'unknown',
          }).catch(err => console.error('Failed to log request:', err));
        }
      }).catch(error => {
        console.error('Background request failed:', {
          path: req.path,
          error: error.message,
          code: error.code
        });
        
        const responseTime = Date.now() - startTime;
        
        // Log failed requests too
        if (endpoint.enableLogging) {
          storage.createRequestLog({
            endpointId: endpoint.id,
            method: req.method,
            path: req.path,
            statusCode: error.response?.status || 500,
            responseTime,
            requestBody: requestData,
            responseBody: error.response?.data || { 
              error: error.message,
              code: error.code,
              details: "Background request failed" 
            },
            headers: req.headers,
            clientIp: req.ip || req.connection.remoteAddress || 'unknown',
            userAgent: req.get('User-Agent') || 'unknown',
          }).catch(err => console.error('Failed to log failed request:', err));
        }
        });
      });

    } catch (error: any) {
      console.error('Failed to initiate proxy request:', {
        path: req.path,
        method: req.method,
        error: error.message
      });
      
      res.status(500).json({
        message: "Failed to initiate request",
        error: error.message,
        path: req.path
      });
    }
  });

  const httpServer = createServer(app);
  // Settings endpoints
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const settings = await storage.updateSettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  return httpServer;
}
