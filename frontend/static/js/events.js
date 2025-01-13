function obtenerMascotas() {
    const token = localStorage.getItem("authToken");  
    if (!token) {
        console.error("Token no encontrado");
        return;
    }

    fetch('http://localhost:3000/api/mascotas', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token 
        }
    })
    .then(response => response.json())  
    .then(data => {
        const mascotaSelect = document.getElementById('mascota');
        mascotaSelect.innerHTML = '';
        
        data.forEach(mascota => {
            const option = document.createElement('option');
            option.value = mascota.Nombre;  
            option.textContent = mascota.Nombre;  
            mascotaSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error al cargar las mascotas:', error));
}
function crearEvento() {
    const token = localStorage.getItem("authToken");  
    if (!token) {
        console.error("Token no encontrado");
        return;
    }

    
    const evento = document.getElementById('event-type').value;
    const fechaHora = document.getElementById('event-date').value;
    const mascota = document.getElementById('mascota').value;

    if (!evento || !fechaHora || !mascota) {
        alert("Por favor, completa todos los campos.");
        return;
    }
    

    fetch('http://localhost:3000/api/regEvento', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("authToken")
            },
        body: JSON.stringify({ evento: evento, fechaHora: fechaHora, mascota: mascota })
    })
    .then(response => response.json())  
    .then(data => {
        if (data.success) {
            alert("Evento Registrado!");
            window.location.href = "/calendario";  
        } else {
            alert("Error al registrar evento: " + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Hubo un problema al intentar registrar el usuario.");
    });
}

document.getElementById('submit-button').addEventListener('click', function() {
    crearEvento();  
});



window.onload = obtenerMascotas;

document.getElementById('back-button').addEventListener('click', function() {
    fetch('/calendario')  // Realiza la solicitud a la ruta de registro
        .then(response => response.text())  // Recibe el contenido de la página
        .then(html => {
            // Inserta el contenido de registro.html en el contenedor
            const contenedorElemento = document.getElementById('app-container');
            if (contenedorElemento){
                contenedorElemento.innerHTML = '';  // Borra el contenido anterior
                contenedorElemento.innerHTML = html;
                window.location.href='/calendario';
            }
            
        })
        .catch(error => {
            console.warn('Error al cargar el template:', error);
        });
});
