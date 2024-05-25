const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Ruta para obtener los eventos
app.get('/eventos', (req, res) => {
    const agendaDir = path.join(__dirname, '../agenda');
    fs.readdir(agendaDir, (err, dates) => {
        if (err) {
            console.error('Error al leer el directorio de la agenda:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        let eventos = [];
        dates.forEach(date => {
            const dateDir = path.join(agendaDir, date);
            if (fs.statSync(dateDir).isDirectory()) {
                const events = fs.readdirSync(dateDir);
                events.forEach(event => {
                    const eventPath = path.join(dateDir, event);
                    if (fs.statSync(eventPath).isFile()) {
                        const [hora, title] = event.replace('.txt', '').split('_');
                        const eventContent = fs.readFileSync(eventPath, 'utf8');
                        const [titulo, ...descripcionArr] = eventContent.split('\n');
                        const descripcion = descripcionArr.join('\n');
                        eventos.push({
                            fecha: date,
                            hora,
                            titulo,
                            descripcion,
                            fileName: event
                        });
                    }
                });
            }
        });

        res.json(eventos);
    });
});

// Ruta para crear un nuevo evento
app.post('/eventos', (req, res) => {
    const { fecha, hora, titulo, descripcion } = req.body;

    const eventDir = path.join(__dirname, '../agenda', fecha);
    const eventPath = path.join(eventDir, `${hora}_${titulo}.txt`);

    if (!fs.existsSync(eventDir)) {
        fs.mkdirSync(eventDir, { recursive: true });
    }

    if (fs.existsSync(eventPath)) {
        res.status(400).send('Ya existe un evento para la fecha y hora especificadas');
        return;
    }

    fs.writeFile(eventPath, `${titulo}\n${descripcion}`, err => {
        if (err) {
            console.error('Error al crear el archivo del evento:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.status(201).send('Evento creado exitosamente');
    });
});

// Ruta para editar un evento
app.put('/eventos', (req, res) => {
    const { fecha, hora, titulo, descripcion, fileName } = req.body;
    const eventDir = path.join(__dirname, '../agenda', fecha);
    const oldEventPath = path.join(eventDir, fileName);
    const newEventPath = path.join(eventDir, `${hora}_${titulo}.txt`);

    if (!fs.existsSync(oldEventPath)) {
        res.status(404).send('El evento no existe');
        return;
    }

    fs.writeFile(newEventPath, `${titulo}\n${descripcion}`, err => {
        if (err) {
            console.error('Error al editar el archivo del evento:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }

        if (oldEventPath !== newEventPath) {
            fs.unlinkSync(oldEventPath);
        }

        res.status(200).send('Evento editado exitosamente');
    });
});

// Ruta para eliminar un evento
app.delete('/eventos', (req, res) => {
    const { fecha, hora, titulo } = req.body;
    const eventDir = path.join(__dirname, '../agenda', fecha);
    const eventPath = path.join(eventDir, `${hora}_${titulo}.txt`);

    if (!fs.existsSync(eventPath)) {
        res.status(404).send('El evento no existe');
        return;
    }

    fs.unlink(eventPath, err => {
        if (err) {
            console.error('Error al eliminar el archivo del evento:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.status(200).send('Evento eliminado exitosamente');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});
