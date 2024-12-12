const express = require('express');
const axios = require('axios');

const app = express();

// Ruta para skipear la canción
app.get('/skipsong', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.nightbot.tv/1/song_requests/queue/skip',
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );
    res.status(200).send('¡La canción ha sido saltada con éxito!');
  } catch (error) {
    console.error('Error al intentar skipear la canción:', error.response?.data || error.message);
    res.status(500).send('Hubo un problema al intentar skipear la canción.');
  }
});

// Ruta para obtener la cola de canciones
app.get('/queue', async (req, res) => {
  try {
    const response = await axios.get('https://api.nightbot.tv/1/song_requests/queue', {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });
    res.status(200).json(response.data); // Devuelve la cola completa como JSON
  } catch (error) {
    console.error('Error al obtener la cola:', error.response?.data || error.message);
    res.status(500).send('Hubo un problema al intentar obtener la cola de canciones.');
  }
});

// Ruta para reanudar la canción
app.post('/play', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.nightbot.tv/1/song_requests/queue/play',
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );
    res.status(200).json(response.data); // Respuesta completa de la API
  } catch (error) {
    console.error('Error al intentar reanudar la canción:', error.response?.data || error.message);
    res.status(500).send('Hubo un problema al intentar reanudar la canción.');
  }
});

// Ruta para pausar la canción
app.post('/pause', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.nightbot.tv/1/song_requests/queue/pause',
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      }
    );
    res.status(200).json(response.data); // Respuesta completa de la API
  } catch (error) {
    console.error('Error al intentar pausar la canción:', error.response?.data || error.message);
    res.status(500).send('Hubo un problema al intentar pausar la canción.');
  }
});

// Ruta para verificar el estado de la API
app.get('/status', (req, res) => {
  res.status(200).send('API funcionando');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
