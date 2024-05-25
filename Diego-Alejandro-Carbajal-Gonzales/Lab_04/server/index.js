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
                const times = fs.readdirSync(dateDir);
                times.forEach(time => {
                    const eventPath = path.join(dateDir, time);
                    if (fs.statSync(eventPath).isFile()) {
                        const eventTitle = fs.readFileSync(eventPath, 'utf8').split('\n')[0];
                        eventos.push({
                            fecha: date,
                            hora: time.replace('.txt', ''),
                            titulo: eventTitle
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
    const eventPath = path.join(eventDir, `${hora}.txt`);

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
    const { fecha, hora, titulo, descripcion } = req.body;
    const eventPath = path.join(__dirname, '../agenda', fecha, `${hora}.txt`);

    if (!fs.existsSync(eventPath)) {
        res.status(404).send('El evento no existe');
        return;
    }

    fs.writeFile(eventPath, `${titulo}\n${descripcion}`, err => {
        if (err) {
            console.error('Error al editar el archivo del evento:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        res.status(200).send('Evento editado exitosamente');
    });
});

// Ruta para eliminar un evento
app.delete('/eventos', (req, res) => {
    const { fecha, hora } = req.body;
    const eventPath = path.join(__dirname, '../agenda', fecha, `${hora}.txt`);

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
