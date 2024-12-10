const express = require('express');
const axios = require('axios');

const app = express();

// Ruta para skipear la canción
app.get('/skipsong', async (req, res) => {
  try {
    // Llama a la API de Nightbot para skipear la canción
    const response = await axios.post(
      'https://api.nightbot.tv/1/song_requests/queue/skip',
      {}, // Sin body
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`, // Usa la variable de entorno para el token
        },
      }
    );

    // Respuesta en caso de éxito
    res.status(200).send('¡La canción ha sido saltada con éxito!');
  } catch (error) {
    // Manejo de errores
    console.error('Error al intentar skipear la canción:', error.response?.data || error.message);
    res.status(500).send('Hubo un problema al intentar skipear la canción.');
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
