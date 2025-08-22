import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  // ← Ajoutez cette ligne
import { Ollama } from 'ollama';

const app = express();

// ← Ajoutez cette configuration CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-frontend-domain.com'
  ],
  credentials: true
}));

app.use(bodyParser.json());

// Configuration Ollama
const ollama = new Ollama({
  host: 'https://ollama.com',
  headers: {
    Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
  },
});

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Serveur API Ollama en ligne!' });
});

// Route API
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const r = await ollama.chat({
      model: 'gpt-oss:20b',
      messages,
    });

    res.json(r);
  } catch (err) {
    console.error('Erreur Ollama:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default app;