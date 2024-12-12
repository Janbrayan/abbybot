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

    // Extraer los detalles de la canción actual
    const currentSong = response.data._currentSong;
    if (currentSong) {
      const songTitle = currentSong.track.title || 'Sin título';
      const artistName = currentSong.track.artist || 'Artista desconocido';

      // Crear un mensaje con el título y el artista
      const message = `La canción es "${songTitle}" - ${artistName}`;
      res.status(200).send(message); // Enviar el mensaje
    } else {
      res.status(200).send('No hay canción en reproducción.'); // Si no hay canción
    }
  } catch (error) {
    console.error('Error al obtener la cola:', error.response?.data || error.message);
    res.status(500).send('Hubo un problema al intentar obtener la cola de canciones.');
  }
});

// Ruta para reanudar la canción
app.get('/play', async (req, res) => {
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
    res.status(200).send('La canción ha sido reanudada.');
  } catch (error) {
    console.error('Error al intentar reanudar la canción:', error.response?.data || error.message);
    res.status(500).send('Hubo un problema al intentar reanudar la canción.');
  }
});

// Ruta para pausar la canción
app.get('/pause', async (req, res) => {
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
    res.status(200).send('La canción ha sido pausada.');
  } catch (error) {
    console.error('Error al intentar pausar la canción:', error.response?.data || error.message);
    res.status(500).send('Hubo un problema al intentar pausar la canción.');
  }
});

// Ruta para eliminar una canción por posición
app.delete('/remove/:position', async (req, res) => {
  try {
    const position = parseInt(req.params.position, 10);

    // Validar la posición
    if (isNaN(position) || position < 1) {
      return res.status(400).send('La posición debe ser un número mayor o igual a 1.');
    }

    // Obtener la cola de canciones
    const queueResponse = await axios.get('https://api.nightbot.tv/1/song_requests/queue', {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });

    const queue = queueResponse.data.queue;

    // Verificar si la posición es válida
    if (position > queue.length) {
      return res.status(400).send('La posición excede el número de canciones en la cola.');
    }

    // Obtener el ID y el título de la canción en la posición
    const song = queue[position - 1];
    const songId = song._id;
    const songTitle = song.track.title;

    // Eliminar la canción por ID
    await axios.delete(`https://api.nightbot.tv/1/song_requests/queue/${songId}`, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });

    res.status(200).send(`La canción "${songTitle}" en la posición ${position} ha sido eliminada.`);
  } catch (error) {
    console.error('Error al intentar eliminar la canción:', error.response?.data || error.message);
    res.status(500).send('Hubo un problema al intentar eliminar la canción.');
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
