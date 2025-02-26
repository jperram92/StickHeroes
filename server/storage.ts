import { User, InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateCharacter(userId: number, character: User["character"]): Promise<User>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  sessionStore: session.Store;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      character: { color: "#000000", height: 1, width: 1 },
      position: { x: 0, y: 0, z: 0 },
    };
    this.users.set(id, user);
    return user;
  }

  async updateCharacter(userId: number, character: User["character"]): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    const updated = { ...user, character };
    this.users.set(userId, updated);
    return updated;
  }
}

export const storage = new MemStorage();
