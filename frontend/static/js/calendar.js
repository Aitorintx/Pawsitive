let currentDate = new Date(); 



function generateCalendar() {
    const monthName = document.getElementById('month-name');
    const calendarDates = document.getElementById('calendar-dates');
    const eventList = document.getElementById('event-list');

    const firstDay = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 0));
    const lastDay = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getUTCDay(); 
    
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    monthName.innerText = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    calendarDates.innerHTML = '';
    
    for (let i = 0; i < startDay; i++) {
        calendarDates.innerHTML += '<div class="calendar-date"></div>';
    }

    // Generar los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const dateElement = document.createElement('div');
        dateElement.classList.add('calendar-date');
        dateElement.innerText = day;
        dateElement.setAttribute('data-date', `${day}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`);
        calendarDates.appendChild(dateElement);
    }
}

function obtenerEventosDelUsuario() {
    const token = localStorage.getItem("authToken");  
    if (!token) {
        console.error("Token no encontrado");
        return;
    }

    
    fetch('http://localhost:3000/api/eventos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token // Pasar el token en el encabezado
        }
    })
    .then(response => response.json())  // Convertir la respuesta a JSON
    .then(data => {
        const container = document.getElementById('mascotas-container');
        if (data.message) {
            container.innerHTML = `
                <div class="no-mascotas-message">
                    <p>OUCHHH! No tienes mascotas registradas!</p>
                    <img src="static/images/perro-triste.png" alt="No mascotas" class="no-mascotas-image">
                </div>`;
        } else {
            const eventListContainer = document.getElementById('event-list'); // El contenedor de la lista de eventos

            
            eventListContainer.innerHTML = '';

            const currentDate = new Date();
            const currentDateString = currentDate.toISOString().split('T')[0]; 

        
            const upcomingEvents = data.filter(evento => evento.fecha >= currentDateString);

            upcomingEvents.forEach(evento => {
                const eventoListItem = document.createElement('li');
                const hora=formatTime(evento.hora)
                let icon = '';
                let color = '';
                if (evento.tipo_recordatorio === 'Vacuna') {
                    icon = '💉'; 
                    color = 'blue'; 
                } else if (evento.tipo_recordatorio === 'Visita Veterinaria') {
                    icon = '🐾'; 
                    color = 'orange'; 
                } else if (evento.tipo_recordatorio === 'Operación') {
                    icon = '🔪'; 
                    color = 'red'; 
                } else if (evento.tipo_recordatorio === 'Comida') {
                    icon = '🍖'; 
                    color = 'green'; 
                }

                
                eventoListItem.innerHTML = `
                    <span style="color: ${color};">${icon}</span>
                    <strong>${evento.fecha}</strong> - 
                    <strong>${evento.tipo_recordatorio}</strong> - 
                    <strong>${hora}</strong> - 
                    <strong>${evento.mascota}</strong>`;
                
                eventListContainer.appendChild(eventoListItem);
            });
        }
    })
    .catch(error => console.error('Error al cargar las eventos:', error));
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600); 
    const minutes = Math.floor((seconds % 3600) / 60); 
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
    


document.getElementById('prev-month').addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();  
});

document.getElementById('next-month').addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();  
});

document.getElementById('add-event-button').addEventListener('click', function() {
    fetch('/crearEvento')  
        .then(response => response.text())  
        .then(html => {
            const contenedorElemento = document.getElementById('app-container');
            if (contenedorElemento){
                contenedorElemento.innerHTML = '';  
                contenedorElemento.innerHTML = html;
                window.location.href='/crearEvento';
            }
            
        })
        .catch(error => {
            console.warn('Error al cargar el template:', error);
        });
});

function loadContent(url) {
    fetch(url)
        .then(response => response.text()) // Obtiene el HTML de la nueva página
        .then(html => {
            const contenedorElemento = document.getElementById('app-container');
            contenedorElemento.innerHTML = html;  // Solo actualiza el contenido dinámico
            window.location.href= url;
        })
        .catch(error => {
            console.warn('Error al cargar el contenido:', error);
        });
}

document.getElementById('Volver').addEventListener('click', function() {
    loadContent('/pantallaInicio');  
});

window.onload = () => {
    generateCalendar();
    obtenerEventosDelUsuario();
};
