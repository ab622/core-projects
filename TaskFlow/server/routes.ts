import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertCategorySchema, insertFocusSessionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock user ID for development
  const MOCK_USER_ID = "dev-user-123";

  // Category routes
  app.get('/api/categories', async (req: any, res) => {
    try {
      const categories = await storage.getCategories(MOCK_USER_ID);
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', async (req: any, res) => {
    try {
      const categoryData = insertCategorySchema.parse({ ...req.body, userId: MOCK_USER_ID });
      const category = await storage.createCategory(categoryData);
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put('/api/categories/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const categoryData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, categoryData);
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete('/api/categories/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCategory(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Task routes
  app.get('/api/tasks', async (req: any, res) => {
    try {
      const { categoryId, isCompleted, date } = req.query;
      
      const filters: any = {};
      if (categoryId) filters.categoryId = categoryId;
      if (isCompleted !== undefined) filters.isCompleted = isCompleted === 'true';
      if (date) filters.date = date;

      const tasks = await storage.getTasks(MOCK_USER_ID, filters);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.get('/api/tasks/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const task = await storage.getTask(id);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error fetching task:", error);
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  app.post('/api/tasks', async (req: any, res) => {
    try {
      const taskData = insertTaskSchema.parse({ ...req.body, userId: MOCK_USER_ID });
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put('/api/tasks/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const taskData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(id, taskData);
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.post('/api/tasks/:id/complete', async (req: any, res) => {
    try {
      const { id } = req.params;
      const task = await storage.completeTask(id);
      res.json(task);
    } catch (error) {
      console.error("Error completing task:", error);
      res.status(500).json({ message: "Failed to complete task" });
    }
  });

  app.delete('/api/tasks/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTask(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Focus session routes
  app.get('/api/focus-sessions', async (req: any, res) => {
    try {
      const { dateFrom, dateTo } = req.query;
      const sessions = await storage.getFocusSessions(MOCK_USER_ID, dateFrom as string, dateTo as string);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching focus sessions:", error);
      res.status(500).json({ message: "Failed to fetch focus sessions" });
    }
  });

  app.post('/api/focus-sessions', async (req: any, res) => {
    try {
      const sessionData = insertFocusSessionSchema.parse({ ...req.body, userId: MOCK_USER_ID });
      const session = await storage.createFocusSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating focus session:", error);
      res.status(500).json({ message: "Failed to create focus session" });
    }
  });

  app.post('/api/focus-sessions/:id/complete', async (req: any, res) => {
    try {
      const { id } = req.params;
      const session = await storage.completeFocusSession(id);
      res.json(session);
    } catch (error) {
      console.error("Error completing focus session:", error);
      res.status(500).json({ message: "Failed to complete focus session" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/stats', async (req: any, res) => {
    try {
      const { dateFrom, dateTo } = req.query;
      const stats = await storage.getTaskStats(MOCK_USER_ID, dateFrom as string, dateTo as string);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
