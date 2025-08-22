import express from 'express';
import bodyParser from 'body-parser';
import { Ollama } from 'ollama';

const app = express();
app.use(bodyParser.json());

// config Ollama Turbo
const ollama = new Ollama({
  host: 'https://ollama.com',
  headers: {
    Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
  },
});

// route API
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

// ⚠️ au lieu de app.listen, on exporte l'app
export default app;
