// Conexión automática al servidor (no importa si es localhost o IP pública)
var socket = io();

// Referencias a elementos del DOM
var persona = document.getElementById('persona'),
    appChat = document.getElementById('app-chat'),
    panelBienvenida = document.getElementById('panel-bienvenida'),
    usuario = document.getElementById('usuario'),
    mensaje = document.getElementById('mensaje'),
    botonEnviar = document.getElementById('enviar'),
    escribiendoMensaje = document.getElementById('escribiendo-mensaje'),
    output = document.getElementById('output');

// Cargar el sonido de notificación
var notificationSound = new Audio('/notification.mp3.mp3');

// Evento al hacer clic en "Enviar"
botonEnviar.addEventListener('click', function() {
    if (mensaje.value) {
        socket.emit('chat', {
            mensaje: mensaje.value,
            usuario: usuario.value
        });
    }
    mensaje.value = '';
});

// Evento mientras escribe un mensaje
mensaje.addEventListener('keyup', function() {
    if (persona.value) {
        socket.emit('typing', {
            nombre: usuario.value,
            texto: mensaje.value
        });
    }
});

// Escuchar mensajes del servidor
socket.on('chat', function(data) {
    escribiendoMensaje.innerHTML = "";
    output.innerHTML += '<p><strong>' + data.usuario + ':</strong> ' + data.mensaje + '</p>';

    // 🔔 Reproducir sonido si el mensaje no es del propio usuario
    if (data.usuario !== usuario.value) {
        notificationSound.play().catch(err => {
            console.log("No se pudo reproducir el sonido automáticamente:", err);
        });
    }
});

// Escuchar indicador de escritura
socket.on('typing', function(data) {
    if (data.texto) {
        escribiendoMensaje.innerHTML = '<p><em>' + data.nombre + ' está escribiendo un mensaje...</em></p>';
    } else {
        escribiendoMensaje.innerHTML = '';
    }
});

// Función para ingresar al chat
function ingresarAlChat() {
    if (persona.value) {
        panelBienvenida.style.display = "none";
        appChat.style.display = "block";
        var nombreDelUsuario = persona.value;
        usuario.value = nombreDelUsuario;
        usuario.readOnly = true;
    }
}
