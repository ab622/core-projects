import { 
  endpoints, 
  requestLogs, 
  users, 
  type Endpoint, 
  type InsertEndpoint,
  type RequestLog,
  type InsertRequestLog,
  type User, 
  type InsertUser 
} from "@shared/schema";

export interface Settings {
  darkMode: boolean;
  notifications: boolean;
  updates: boolean;
  name: string;
  email: string;
}

export interface IStorage {
  // User methods (existing)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Endpoint methods
  getAllEndpoints(): Promise<Endpoint[]>;
  getEndpoint(id: number): Promise<Endpoint | undefined>;
  getEndpointByPath(path: string, method: string): Promise<Endpoint | undefined>;
  createEndpoint(endpoint: InsertEndpoint): Promise<Endpoint>;
  updateEndpoint(id: number, endpoint: Partial<InsertEndpoint>): Promise<Endpoint | undefined>;
  deleteEndpoint(id: number): Promise<boolean>;
  
  // Request log methods
  createRequestLog(log: InsertRequestLog): Promise<RequestLog>;
  getRecentLogs(limit?: number): Promise<RequestLog[]>;
  getEndpointLogs(endpointId: number, limit?: number): Promise<RequestLog[]>;
  
  // Stats methods
  getStats(): Promise<{
    totalEndpoints: number;
    requestsToday: number;
    successRate: number;
    avgResponseTime: number;
  }>;

  // Settings methods
  getSettings(): Promise<Settings>;
  updateSettings(settings: Partial<Settings>): Promise<Settings>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private endpoints: Map<number, Endpoint>;
  private requestLogs: Map<number, RequestLog>;
  private currentUserId: number;
  private currentEndpointId: number;
  private currentLogId: number;
  private settings: Settings;

  constructor() {
    this.users = new Map();
    this.endpoints = new Map();
    this.requestLogs = new Map();
    this.currentUserId = 1;
    this.currentEndpointId = 1;
    this.currentLogId = 1;
    this.settings = {
      darkMode: false,
      notifications: true,
      updates: true,
      name: "User",
      email: "user@example.com"
    };
  }



  // User methods (existing)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Endpoint methods
  async getAllEndpoints(): Promise<Endpoint[]> {
    return Array.from(this.endpoints.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getEndpoint(id: number): Promise<Endpoint | undefined> {
    return this.endpoints.get(id);
  }

  async getEndpointByPath(path: string, method: string): Promise<Endpoint | undefined> {
    return Array.from(this.endpoints.values()).find(
      endpoint => endpoint.path === path && endpoint.method.toLowerCase() === method.toLowerCase() && endpoint.isActive
    );
  }

  async createEndpoint(insertEndpoint: InsertEndpoint): Promise<Endpoint> {
    const id = this.currentEndpointId++;
    const endpoint: Endpoint = { 
      path: insertEndpoint.path,
      method: insertEndpoint.method,
      targetUrl: insertEndpoint.targetUrl,
      description: insertEndpoint.description || null,
      defaultPayload: insertEndpoint.defaultPayload || null,
      customHeaders: insertEndpoint.customHeaders || null,
      mappingRules: insertEndpoint.mappingRules || null,
      isActive: insertEndpoint.isActive ?? true,
      enableCors: insertEndpoint.enableCors ?? true,
      enableLogging: insertEndpoint.enableLogging ?? true,
      id,
      createdAt: new Date()
    };
    this.endpoints.set(id, endpoint);
    return endpoint;
  }

  async updateEndpoint(id: number, updateData: Partial<InsertEndpoint>): Promise<Endpoint | undefined> {
    const existing = this.endpoints.get(id);
    if (!existing) return undefined;
    
    const updated: Endpoint = { ...existing, ...updateData };
    this.endpoints.set(id, updated);
    return updated;
  }

  async deleteEndpoint(id: number): Promise<boolean> {
    return this.endpoints.delete(id);
  }

  // Request log methods
  async createRequestLog(insertLog: InsertRequestLog): Promise<RequestLog> {
    const id = this.currentLogId++;
    const log: RequestLog = { 
      ...insertLog,
      endpointId: insertLog.endpointId || null,
      requestBody: insertLog.requestBody || null,
      responseBody: insertLog.responseBody || null,
      headers: insertLog.headers || {},
      clientIp: insertLog.clientIp || null,
      userAgent: insertLog.userAgent || null,
      id,
      timestamp: new Date()
    };
    this.requestLogs.set(id, log);
    return log;
  }

  async getRecentLogs(limit: number = 50): Promise<RequestLog[]> {
    return Array.from(this.requestLogs.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async getEndpointLogs(endpointId: number, limit: number = 50): Promise<RequestLog[]> {
    return Array.from(this.requestLogs.values())
      .filter(log => log.endpointId === endpointId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Stats methods
  async getStats(): Promise<{
    totalEndpoints: number;
    requestsToday: number;
    successRate: number;
    avgResponseTime: number;
  }> {
    const totalEndpoints = this.endpoints.size;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayLogs = Array.from(this.requestLogs.values())
      .filter(log => new Date(log.timestamp) >= today);
    
    const requestsToday = todayLogs.length;
    
    const successfulRequests = todayLogs.filter(log => 
      log.statusCode >= 200 && log.statusCode < 400
    ).length;
    
    const successRate = requestsToday > 0 ? (successfulRequests / requestsToday) * 100 : 100;
    
    const avgResponseTime = todayLogs.length > 0 ? 
      todayLogs.reduce((sum, log) => sum + log.responseTime, 0) / todayLogs.length : 0;

    return {
      totalEndpoints,
      requestsToday,
      successRate: Math.round(successRate * 10) / 10,
      avgResponseTime: Math.round(avgResponseTime)
    };
  }

  // Settings methods
  async getSettings(): Promise<Settings> {
    return this.settings;
  }

  async updateSettings(settings: Partial<Settings>): Promise<Settings> {
    this.settings = { ...this.settings, ...settings };
    return this.settings;
  }
}

export const storage = new MemStorage();
