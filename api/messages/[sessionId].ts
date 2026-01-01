import { storage } from "../../server/storage";

export default async function handler(req: any, res: any) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get('sessionId');
  
  if (!sessionId && req.method === 'GET') {
    return new Response(JSON.stringify({ error: 'Session ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    if (req.method === 'GET') {
      const messages = await storage.getMessages(parseInt(sessionId as string));
      return new Response(JSON.stringify(messages), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (req.method === 'DELETE') {
      await storage.clearSession(parseInt(sessionId as string));
      return new Response(null, { status: 204 });
    }
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    console.error(`API Error in /api/messages/${sessionId}:`, err);
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
