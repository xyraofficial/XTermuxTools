import { 
  type ChatMessage, 
  type InsertChatMessage, 
  type ChatSession, 
  type InsertChatSession,
  chatMessages, 
  chatSessions 
} from "../shared/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  getSessions(): Promise<ChatSession[]>;
  createSession(session: InsertChatSession): Promise<ChatSession>;
  getMessages(sessionId: number): Promise<ChatMessage[]>;
  addMessage(message: InsertChatMessage): Promise<ChatMessage>;
  clearSession(sessionId: number): Promise<void>;
  deleteSession(sessionId: number): Promise<void>;
  updateSessionTitle(sessionId: number, title: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getSessions(): Promise<ChatSession[]> {
    return db.select().from(chatSessions).orderBy(desc(chatSessions.createdAt)).all();
  }

  async createSession(session: InsertChatSession): Promise<ChatSession> {
    const [newSession] = db.insert(chatSessions).values(session).returning().all();
    return newSession;
  }

  async getMessages(sessionId: number): Promise<ChatMessage[]> {
    return db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId)).orderBy(chatMessages.id).all();
  }

  async addMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = db.insert(chatMessages).values(message).returning().all();
    return newMessage;
  }

  async clearSession(sessionId: number): Promise<void> {
    db.delete(chatMessages).where(eq(chatMessages.sessionId, sessionId)).run();
  }

  async deleteSession(sessionId: number): Promise<void> {
    db.delete(chatMessages).where(eq(chatMessages.sessionId, sessionId)).run();
    db.delete(chatSessions).where(eq(chatSessions.id, sessionId)).run();
  }

  async updateSessionTitle(sessionId: number, title: string): Promise<void> {
    db.update(chatSessions).set({ title }).where(eq(chatSessions.id, sessionId)).run();
  }
}

export const storage = new DatabaseStorage();
