import {
  users,
  categories,
  tasks,
  focusSessions,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Task,
  type InsertTask,
  type FocusSession,
  type InsertFocusSession,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Category operations
  getCategories(userId: string): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  
  // Task operations
  getTasks(userId: string, filters?: { categoryId?: string; isCompleted?: boolean; date?: string }): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  completeTask(id: string): Promise<Task>;
  
  // Focus session operations
  getFocusSessions(userId: string, dateFrom?: string, dateTo?: string): Promise<FocusSession[]>;
  createFocusSession(session: InsertFocusSession): Promise<FocusSession>;
  completeFocusSession(id: string): Promise<FocusSession>;
  
  // Analytics
  getTaskStats(userId: string, dateFrom?: string, dateTo?: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    totalFocusTime: number;
    completionRate: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getCategories(userId: string): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId))
      .orderBy(categories.name);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  async getTasks(
    userId: string,
    filters?: { categoryId?: string; isCompleted?: boolean; date?: string }
  ): Promise<Task[]> {
    let conditions = [eq(tasks.userId, userId)];

    if (filters?.categoryId) {
      conditions.push(eq(tasks.categoryId, filters.categoryId));
    }

    if (filters?.isCompleted !== undefined) {
      conditions.push(eq(tasks.isCompleted, filters.isCompleted));
    }

    if (filters?.date) {
      conditions.push(eq(tasks.scheduledDate, filters.date));
    }

    return await db
      .select()
      .from(tasks)
      .where(and(...conditions))
      .orderBy(desc(tasks.createdAt));
  }

  async getTask(id: string): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values(task)
      .returning();
    return newTask;
  }

  async updateTask(id: string, task: Partial<InsertTask>): Promise<Task> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ ...task, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  async completeTask(id: string): Promise<Task> {
    const [completedTask] = await db
      .update(tasks)
      .set({ 
        isCompleted: true, 
        completedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(tasks.id, id))
      .returning();
    return completedTask;
  }

  async getFocusSessions(
    userId: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<FocusSession[]> {
    let conditions = [eq(focusSessions.userId, userId)];

    if (dateFrom) {
      conditions.push(gte(focusSessions.startedAt, new Date(dateFrom)));
    }

    if (dateTo) {
      conditions.push(lte(focusSessions.startedAt, new Date(dateTo)));
    }

    return await db
      .select()
      .from(focusSessions)
      .where(and(...conditions))
      .orderBy(desc(focusSessions.startedAt));
  }

  async createFocusSession(session: InsertFocusSession): Promise<FocusSession> {
    const [newSession] = await db
      .insert(focusSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async completeFocusSession(id: string): Promise<FocusSession> {
    const [completedSession] = await db
      .update(focusSessions)
      .set({ 
        isCompleted: true, 
        completedAt: new Date()
      })
      .where(eq(focusSessions.id, id))
      .returning();
    return completedSession;
  }

  async getTaskStats(
    userId: string,
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    totalTasks: number;
    completedTasks: number;
    totalFocusTime: number;
    completionRate: number;
  }> {
    let taskConditions = [eq(tasks.userId, userId)];
    let focusConditions = [eq(focusSessions.userId, userId), eq(focusSessions.isCompleted, true)];

    if (dateFrom) {
      taskConditions.push(gte(tasks.createdAt, new Date(dateFrom)));
      focusConditions.push(gte(focusSessions.startedAt, new Date(dateFrom)));
    }

    if (dateTo) {
      taskConditions.push(lte(tasks.createdAt, new Date(dateTo)));
      focusConditions.push(lte(focusSessions.startedAt, new Date(dateTo)));
    }

    const [taskStats] = await db
      .select({
        total: sql<number>`count(*)`,
        completed: sql<number>`count(case when ${tasks.isCompleted} then 1 end)`,
      })
      .from(tasks)
      .where(and(...taskConditions));

    const [focusStats] = await db
      .select({
        totalMinutes: sql<number>`coalesce(sum(${focusSessions.duration}), 0)`,
      })
      .from(focusSessions)
      .where(and(...focusConditions));

    const completionRate = taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0;

    return {
      totalTasks: taskStats.total,
      completedTasks: taskStats.completed,
      totalFocusTime: focusStats.totalMinutes,
      completionRate: Math.round(completionRate),
    };
  }
}

export const storage = new DatabaseStorage();
