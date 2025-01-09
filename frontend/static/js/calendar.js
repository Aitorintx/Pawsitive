// Variables para el calendario
let currentDate = new Date(); // Fecha actual



// Función para generar el calendario para el mes y año actuales
function generateCalendar() {
    const monthName = document.getElementById('month-name');
    const calendarDates = document.getElementById('calendar-dates');
    const eventList = document.getElementById('event-list');

    // Obtener el primer día del mes actual
    const firstDay = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 0));
    const lastDay = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getUTCDay(); 
    
    // Actualizar el nombre del mes
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    monthName.innerText = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Limpiar fechas previas
    calendarDates.innerHTML = '';
    
    // Generar los días en blanco antes de que inicie el mes
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

    // Mostrar eventos para este mes (simulación con datos estáticos)
    const events = [
        { date: '01/01/2025', description: 'Vacuna - 11:30', color: 'blue' },
        { date: '04/01/2025', description: 'Cita Vet. - 09:30', color: 'orange' }
    ];

    // Limpiar la lista de eventos
    eventList.innerHTML = '';

    // Agregar los eventos a la lista
    events.forEach(event => {
        const listItem = document.createElement('li');
        listItem.classList.add('event');
        listItem.innerHTML = `<span class="event-dot ${event.color}"></span> ${event.description}`;
        eventList.appendChild(listItem);
    });
    
}

// Funciones para cambiar el mes
document.getElementById('prev-month').addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar();  // Regenerar el calendario para el mes anterior
});

document.getElementById('next-month').addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar();  // Regenerar el calendario para el mes siguiente
});

// Inicializar el calendario al cargar la página
generateCalendar();
