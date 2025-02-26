import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  character: jsonb("character").$type<{
    color: string;
    height: number;
    width: number;
  }>().notNull().default({ color: "#000000", height: 1, width: 1 }),
  position: jsonb("position").$type<{
    x: number;
    y: number;
    z: number;
  }>().notNull().default({ x: 0, y: 0, z: 0 }),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const chatSchema = z.object({
  type: z.enum(["message", "join", "leave"]),
  username: z.string(),
  message: z.string().optional(),
});

export type ChatMessage = z.infer<typeof chatSchema>;
