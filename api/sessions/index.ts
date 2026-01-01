import { storage } from "../../server/storage";

export default async function handler(req: any, res: any) {
  try {
    if (req.method === 'GET') {
      const sessions = await storage.getSessions();
      return new Response(JSON.stringify(sessions), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (req.method === 'POST') {
      const session = await storage.createSession(req.body);
      return new Response(JSON.stringify(session), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error('API Error in /api/sessions:', err);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error', 
      message: err.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const config = {
  runtime: 'edge',
};
