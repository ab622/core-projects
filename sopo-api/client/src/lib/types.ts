export interface Endpoint {
  id: number;
  path: string;
  method: string;
  targetUrl: string;
  description?: string | null;
  defaultPayload?: any;
  customHeaders?: any;
  isActive: boolean;
  enableCors: boolean;
  enableLogging: boolean;
  createdAt: Date | string;
}

export interface RequestLog {
  id: number;
  endpointId?: number;
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  requestBody?: any;
  responseBody?: any;
  headers?: any;
  clientIp?: string;
  userAgent?: string;
  timestamp: Date | string;
}

export interface Stats {
  totalEndpoints: number;
  requestsToday: number;
  successRate: number;
  avgResponseTime: number;
}
