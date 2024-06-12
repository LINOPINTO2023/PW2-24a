const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
app.use(express.static('pub'));
app.use(cors);
app.listen(8000, ()=> {
    console.log("Escuchando en el puerto 8080")
})
app.get('/', (request, response)=>{
    response.sendFile(path.resolve(__dirname, 'pub' , 'index.html'));
});
// API para mostrar los eventos
app.get('/show', async (request, response)=>{
    const events = await getEvents();
    response.json(events);

});

app.post('/', async (request, response)=>{
    //aqui coloco el codigo para crear el directorio con la fecha y el evento con la hora
    console.log('hasta aqui todo bem');
    const { date, hour, text } = request.body;

  if (!date || !hour || !text) {
    return response.status(400).json({ error: 'Missing date, hour, or text' });
  }
  const firstLine = text.split('\n')[0];
  const dirPath = path.join(__dirname, 'Eventos', date);
  const filePath = path.join(dirPath, `${hour}.txt`);

  try {
    // Create the directory if it doesn't exist
    console.log(`Creating directory: ${dirPath}`);
    await fs.promises.mkdir(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);


    // Write the event text to the file
    console.log(`Writing file: ${filePath}`);
    await fs.promises.writeFile(filePath, text);
    console.log(`File written: ${filePath}`);

    response.status(201).json({ message: 'Event created successfully: ' + "\n" + firstLine});
  } catch (err) {
    console.error('Error creating event:', err);
    response.status(500).json({ error: 'Failed to create event' });
  }

});
app.delete('/', async (request, response)=>{
    const { date, hour } = request.body;

  if (!date || !hour) {
    return response.status(400).json({ error: 'Missing date or hour' });
  }

  const filePath = path.join(__dirname, 'Eventos', date, `${hour}.txt`);

  try {
    await fs.promises.unlink(filePath);
    response.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    if (err.code === 'ENOENT') {
      response.status(404).json({ error: 'Event not found' });
    } else {
      console.error('Error deleting event:', err);
      response.status(500).json({ error: 'Failed to delete event' });
    }
  }

});

const getEvents = async () => {
  const eventosDir = path.join(__dirname, 'Eventos');
  const events = {};

  try {
    const directories = await fs.promises.readdir(eventosDir, { withFileTypes: true });

    for (const dir of directories) {
      if (dir.isDirectory()) {
        const dirPath = path.join(eventosDir, dir.name);
        const files = await fs.promises.readdir(dirPath);

        events[dir.name] = [];

        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const content = await fs.promises.readFile(filePath, 'utf-8');
          const [title, ...rest] = content.split('\n');

          events[dir.name].push({
            title: title.trim(),
            content: rest.join('\n').trim()
          });
        }
      }
    }
  } catch (err) {
    console.error('Error reading events:', err);
  }

  return events;
};
