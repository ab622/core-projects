import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const endpoints = pgTable("endpoints", {
  id: serial("id").primaryKey(),
  path: text("path").notNull().unique(),
  method: text("method").notNull(),
  targetUrl: text("target_url").notNull(),
  description: text("description"),
  defaultPayload: jsonb("default_payload"),
  customHeaders: jsonb("custom_headers"),
  isActive: boolean("is_active").notNull().default(true),
  enableCors: boolean("enable_cors").notNull().default(true),
  enableLogging: boolean("enable_logging").notNull().default(true),
  mappingRules: jsonb("mapping_rules"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const requestLogs = pgTable("request_logs", {
  id: serial("id").primaryKey(),
  endpointId: integer("endpoint_id").references(() => endpoints.id),
  method: text("method").notNull(),
  path: text("path").notNull(),
  statusCode: integer("status_code").notNull(),
  responseTime: integer("response_time").notNull(), // in milliseconds
  requestBody: jsonb("request_body"),
  responseBody: jsonb("response_body"),
  headers: jsonb("headers"),
  clientIp: text("client_ip"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertEndpointSchema = createInsertSchema(endpoints).omit({
  id: true,
  createdAt: true,
}).extend({
  defaultPayload: z.string().optional().transform((val) => {
    if (!val || val.trim() === '') return null;
    try {
      return JSON.parse(val);
    } catch {
      throw new Error('Invalid JSON format');
    }
  }),
  customHeaders: z.string().optional().transform((val) => {
    if (!val || val.trim() === '') return null;
    try {
      return JSON.parse(val);
    } catch {
      throw new Error('Invalid JSON format');
    }
  }),
  mappingRules: z.string().optional().transform((val) => {
    if (!val || val.trim() === '') return null;
    try {
      return JSON.parse(val);
    } catch {
      throw new Error('Invalid JSON format');
    }
  }),
});

export const insertRequestLogSchema = createInsertSchema(requestLogs).omit({
  id: true,
  timestamp: true,
});

export type InsertEndpoint = z.infer<typeof insertEndpointSchema>;
export type Endpoint = typeof endpoints.$inferSelect;
export type InsertRequestLog = z.infer<typeof insertRequestLogSchema>;
export type RequestLog = typeof requestLogs.$inferSelect;

// Users table (keeping existing)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export interface MappingRule {
  inputPattern: string;
  outputPayload: Record<string, any>;
}
