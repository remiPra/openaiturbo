import app from './servers.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur API Ollama démarré sur le port ${PORT}`);
  console.log(`📡 Endpoint disponible: http://localhost:${PORT}/api/chat`);
});