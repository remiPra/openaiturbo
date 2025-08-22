export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      // Pour Vercel, on peut utiliser une bibliothèque comme 'formidable'
      // ou traiter directement le multipart
      const formData = new FormData();
      formData.append('file', req.body.audio, 'recording.wav');
      formData.append('model', 'whisper-large-v3-turbo');
      formData.append('language', 'fr');
      formData.append('response_format', 'json');
  
      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: formData,
      });
  
      const result = await response.json();
      res.json(result);
    } catch (error) {
      console.error('Erreur transcription:', error);
      res.status(500).json({ error: 'Échec de la transcription' });
    }
  }