// api/chat.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { messages, model = 'gpt-oss:20b', stream = false, options } = req.body || {};

    const response = await axios.post(
      'https://ollama.com/api/chat',
      { model, messages, stream, options },
      {
        headers: {
          'Content-Type': 'application/json',
          // <<< clé Turbo
          'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`,
        },
        timeout: 120000,
      }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    // Log utile pour voir l’erreur réelle dans Vercel → Logs
    console.error('Erreur proxy Ollama:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status, 'Data:', error.response.data);
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ error: 'Erreur proxy côté serveur.' });
  }
}
