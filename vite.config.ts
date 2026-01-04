import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import OpenAI from 'openai';

const app = express();
app.use(express.json());

// OpenRouter Configuration
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://replit.com', // Optional, for OpenRouter rankings
    'X-Title': 'XTermux Toolbox', // Optional
  }
});

app.post('/api/ai/chat/completions', async (req, res) => {
  try {
    const { messages, model = "deepseek/deepseek-chat" } = req.body;
    const response = await openrouter.chat.completions.create({
      model,
      messages,
      max_tokens: 1024, // Further reduced to ensure affordability on free/low-credit accounts
    });
    res.json(response);
  } catch (error) {
    console.error("OpenRouter Proxy Error:", error);
    res.status(500).json({ error: "AI Processing Failed" });
  }
});

const aiProxyPlugin = () => ({
  name: 'ai-proxy',
  configureServer(server) {
    server.middlewares.use(app);
  }
});

export default defineConfig({
  plugins: [react(), aiProxyPlugin()],
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-markdown', '@supabase/supabase-js'],
          'icons': ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 5000,
    host: '0.0.0.0',
    allowedHosts: true,
  },
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || process.env.GROQ_API_KEY || ''),
    'process.env.GROQ_API_KEY': JSON.stringify(process.env.GROQ_API_KEY || ''),
  }
});
