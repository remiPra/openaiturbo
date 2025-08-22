const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const FormData = require('form-data');
require('dotenv').config();

// Configuration de Multer pour gérer les fichiers envoyés
const upload = multer({ dest: 'uploads/' });

// Initialisation du serveur Express
const app = express();
const port = 3001;

// Middlewares pour les requêtes JSON et CORS
app.use(cors());
app.use(express.json());

// Définition des clés API à partir des variables d'environnement
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Endpoint pour le chatbot Ollama Turbo
app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post(
      'https://ollama.com/api/chat',
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${OLLAMA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Erreur du proxy Ollama:', error.message);
    res.status(500).json({ error: 'Erreur du serveur proxy pour Ollama.' });
  }
});

// Endpoint pour la transcription audio (Groq Whisper)
// Note: 'upload.single('audio')' gère l'envoi du fichier nommé 'audio'
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  // Vérifie si un fichier a été uploadé
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier audio n\'a été envoyé.' });
  }

  const audioFilePath = req.file.path;
  const audioFileName = req.file.originalname;

  try {
    const formData = new FormData();
    
    // Ajoute le fichier audio au formulaire de données
    formData.append('file', fs.createReadStream(audioFilePath), {
      filename: audioFileName,
      contentType: req.file.mimetype,
    });
    
    // Ajoute les autres paramètres pour l'API de Groq
    formData.append('model', 'whisper-large-v3-turbo');
    formData.append('language', 'fr');
    formData.append('response_format', 'json');

    // Envoie la requête à l'API de Groq
    const response = await axios.post(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
      }
    );

    // Renvoie la réponse de Groq au client
    res.json(response.data);

  } catch (error) {
    console.error('Erreur de transcription:', error.message);
    res.status(500).json({ error: 'Échec de la transcription.' });
  } finally {
    // Nettoie le fichier temporaire, qu'il y ait eu une erreur ou non
    fs.unlink(audioFilePath, (err) => {
      if (err) console.error('Erreur lors de la suppression du fichier temporaire:', err);
    });
  }
});

// Démarre le serveur
app.listen(port, () => {
  console.log(`Serveur proxy démarré sur http://localhost:${port}`);
});
