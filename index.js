const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));

/**
 * 🔌 API RESPONSE (JSON)
 */
app.get('/api/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({
      success: false,
      message: 'City is required'
    });
  }

  try {
    // Get coordinates
    const geo = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );

    if (!geo.data.results) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    const { latitude, longitude, name, country } = geo.data.results[0];

    // Get weather
    const weather = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    // 🔌 API RESPONSE
    res.json({
      success: true,
      data: {
        city: name,
        country: country,
        temperature: weather.data.current_weather.temperature,
        windspeed: weather.data.current_weather.windspeed
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather'
    });
  }
});

/**
 * 🌐 FRONTEND
 */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});