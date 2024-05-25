document.getElementById('formulario-evento').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const titulo = prompt('Ingrese el título del evento');
    const descripcion = prompt('Ingrese la descripción del evento');

    try {
        const response = await fetch('/eventos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fecha, hora, titulo, descripcion })
        });

        if (response.ok) {
            alert('Evento creado exitosamente');
            obtenerEventos();
        } else {
            const errorMessage = await response.text();
            alert(`Error al agregar el evento: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error al agregar el evento:', error);
        alert('Error al agregar el evento. Por favor, inténtalo de nuevo.');
    }
});

// Función para obtener y mostrar los eventos
async function obtenerEventos() {
    try {
        const response = await fetch('/eventos');
        const eventos = await response.json();

        const eventosContainer = document.getElementById('eventos');
        eventosContainer.innerHTML = '';

        eventos.forEach(evento => {
            const eventoElement = document.createElement('div');
            eventoElement.classList.add('evento');
            
            const eventoText = document.createElement('p');
            eventoText.textContent = `${evento.fecha} ${evento.hora}: ${evento.titulo}`;
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => eliminarEvento(evento.fecha, evento.hora));

            eventoElement.appendChild(eventoText);
            eventoElement.appendChild(deleteButton);
            eventosContainer.appendChild(eventoElement);
        });
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        alert('Error al obtener los eventos. Por favor, inténtalo de nuevo.');
    }
}

// Función para eliminar un evento
async function eliminarEvento(fecha, hora) {
    try {
        const response = await fetch('/eventos', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fecha, hora })
        });

        if (response.ok) {
            alert('Evento eliminado exitosamente');
            obtenerEventos();
        } else {
            const errorMessage = await response.text();
            alert(`Error al eliminar el evento: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error al eliminar el evento:', error);
        alert('Error al eliminar el evento. Por favor, inténtalo de nuevo.');
    }
}

// Llamar a obtenerEventos al cargar la página
obtenerEventos();
