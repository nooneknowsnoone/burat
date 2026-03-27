const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

/**
 * 🎵 Search songs
 * Example: /api/search?q=eminem
 */
app.get('/api/search', async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const response = await axios.get(`https://api.lyrics.ovh/suggest/${query}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search songs' });
  }
});

/**
 * 🎤 Get lyrics
 * Example: /api/lyrics?artist=Eminem&title=Lose Yourself
 */
app.get('/api/lyrics', async (req, res) => {
  const { artist, title } = req.query;

  if (!artist || !title) {
    return res.status(400).json({ error: 'Artist and title are required' });
  }

  try {
    const response = await axios.get(
      `https://api.lyrics.ovh/v1/${artist}/${title}`
    );

    res.json({
      artist,
      title,
      lyrics: response.data.lyrics
    });
  } catch (error) {
    res.status(500).json({ error: 'Lyrics not found' });
  }
});

/**
 * 🏠 Root route
 */
app.get('/', (req, res) => {
  res.send('🎶 Lyrics API is running...');
});

/**
 * 🚀 Start server
 */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});