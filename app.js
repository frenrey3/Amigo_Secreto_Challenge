let listaNombres = [];
const MAX_AMIGOS = 6;

function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.getElementById('notificaciones');
    notificacion.textContent = mensaje;
    notificacion.className = `notification-box visible notification-${tipo}`;

    setTimeout(() => {
        notificacion.classList.remove('visible');
    }, 3000);
}

function actualizarListaAmigos() {
    const container = document.getElementById('listaAmigosContainer');
    // Guardamos el título antes de limpiar el contenedor
    const titulo = container.querySelector('.friends-list-title');
    container.innerHTML = '';
    // Volvemos a añadir el título
    if (titulo) {
        container.appendChild(titulo);
    }
    listaNombres.forEach((nombre, index) => {
        const friendItem = document.createElement('div');
        friendItem.className = 'friend-item';
        friendItem.innerHTML = `
            <span>${nombre}</span>
            <button class="delete-friend" onclick="eliminarAmigo(${index})">×</button>
        `;
        container.appendChild(friendItem);
    });
}

function eliminarAmigo(index) {
    listaNombres.splice(index, 1);
    actualizarListaAmigos();
    mostrarNotificacion('Amigo eliminado correctamente');
}

function agregarAmigo() {
    const input = document.getElementById('amigo');
    const nombre = input.value.trim().toLowerCase();

    if (!nombre) {
        mostrarNotificacion('⚠️ El nombre no puede estar vacío', 'error');
        return;
    }

    if (listaNombres.length >= MAX_AMIGOS) {
        mostrarNotificacion(`❌ No se pueden agregar más de ${MAX_AMIGOS} amigos`, 'error');
        input.value = '';
        return;
    }

    if (listaNombres.includes(nombre)) {
        mostrarNotificacion('❌ Este nombre ya está en la lista', 'error');
        input.value = '';
        input.focus();
        return;
    }

    listaNombres.push(nombre);
    actualizarListaAmigos();
    input.value = '';
    mostrarNotificacion('✅ Amigo agregado correctamente');
    input.focus();
}

function sortearAmigo() {
    const resultado = document.getElementById('resultado');
    const amigoSeleccionado = document.getElementById('amigoSeleccionado');
    const sortearButton = document.querySelector('.button-draw');
    const resetButton = document.querySelector('.button-reset');

    if (listaNombres.length === 0) {
        mostrarNotificacion('❌ No hay amigos en la lista', 'error');
        return;
    }

    amigoSeleccionado.textContent = '...';
    resultado.classList.remove('hidden');
    sortearButton.textContent = 'Sorteando...';
    sortearButton.disabled = true;
    
    setTimeout(() => {
        const indiceAleatorio = Math.floor(Math.random() * listaNombres.length);
        const ganador = listaNombres[indiceAleatorio];
        amigoSeleccionado.textContent = `🎉 ${ganador} 🎉`;
        mostrarNotificacion('✅ Amigo secreto sorteado correctamente');
        resetButton.disabled = false;
        sortearButton.textContent = 'Sortear amigo';
        sortearButton.disabled = false;
    }, 2000);
}

function reiniciarJuego() {
    listaNombres = [];
    actualizarListaAmigos();
    document.getElementById('amigoSeleccionado').textContent = 'Sortea para descubrir';
    mostrarNotificacion('🔄 Juego reiniciado correctamente');
    document.querySelector('.button-reset').disabled = true;
    document.querySelector('.button-draw').disabled = false;
    
    // Mostrar el contenedor de resultado
    const resultadoContainer = document.getElementById('resultado');
    resultadoContainer.classList.remove('hidden');
}

function salir() {
    if (confirm('¿Estás seguro que quieres salir?')) {
        window.close();
    }
}

document.getElementById('amigo').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        agregarAmigo();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    actualizarListaAmigos();
    const addButton = document.querySelector('.button-add');
    const inputAmigo = document.getElementById('amigo');
    const resetButton = document.querySelector('.button-reset');

    inputAmigo.addEventListener('input', function() {
        addButton.disabled = this.value.trim() === '';
    });

    addButton.disabled = true;
    resetButton.disabled = true;
    console.log('Script cargado correctamente');
});