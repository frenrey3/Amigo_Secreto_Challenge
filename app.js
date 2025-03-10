let listaNombres = [];
const MAX_AMIGOS = 10;

// Función para mostrar notificaciones con animaciones mejoradas
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.getElementById('notificaciones');
    notificacion.textContent = mensaje;
    notificacion.className = `notification-box notification-${tipo}`;
    
    // Forzar un reflow para asegurar que la animación se ejecute
    void notificacion.offsetWidth;
    
    // Añadir la clase visible para iniciar la animación
    notificacion.classList.add('visible');

    setTimeout(() => {
        notificacion.classList.remove('visible');
    }, 3000);
}

// Función para actualizar la lista de amigos con animaciones
function actualizarListaAmigos() {
    const container = document.getElementById('listaAmigosContainer');
    
    // Preservamos el título
    let titulo = container.querySelector('.friends-list-title');
    if (!titulo) {
        titulo = document.createElement('h2');
        titulo.className = 'friends-list-title';
        titulo.textContent = 'Amigos agregados';
    }
    
    container.innerHTML = '';
    container.appendChild(titulo);
    
    // Si no hay amigos, mostrar un mensaje
    if (listaNombres.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-list-message';
        emptyMessage.textContent = 'Añade amigos para el sorteo';
        container.appendChild(emptyMessage);
    }
    
    // Añadir cada amigo con un pequeño retraso para animación escalonada
    listaNombres.forEach((nombre, index) => {
        const friendItem = document.createElement('div');
        friendItem.className = 'friend-item';
        friendItem.style.animationDelay = `${index * 0.1}s`;
        
        // Capitalizar el nombre para mejor presentación
        const nombreCapitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1);
        
        friendItem.innerHTML = `
            <span>${nombreCapitalizado}</span>
            <button class="delete-friend" onclick="eliminarAmigo(${index})" aria-label="Eliminar ${nombreCapitalizado}">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(friendItem);
    });
    
    // Actualizar el estado de los botones
    actualizarEstadoBotones();
}

function eliminarAmigo(index) {
    // Animar la eliminación
    const friendItems = document.querySelectorAll('.friend-item');
    if (friendItems[index]) {
        friendItems[index].classList.add('removing');
        
        // Esperar a que termine la animación antes de eliminar
        setTimeout(() => {
            listaNombres.splice(index, 1);
            actualizarListaAmigos();
            mostrarNotificacion('✅ Amigo eliminado correctamente');
        }, 300);
    } else {
        // Si no se encuentra el elemento, eliminar directamente
        listaNombres.splice(index, 1);
        actualizarListaAmigos();
        mostrarNotificacion('✅ Amigo eliminado correctamente');
    }
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

    // Añadir con efecto de "rebote"
    listaNombres.push(nombre);
    actualizarListaAmigos();
    
    // Efecto visual de éxito en el botón
    const addButton = document.querySelector('.button-add');
    addButton.classList.add('success-animation');
    setTimeout(() => addButton.classList.remove('success-animation'), 700);
    
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
    
    if (listaNombres.length < 2) {
        mostrarNotificacion('⚠️ Necesitas al menos 2 amigos para el sorteo', 'error');
        return;
    }

    // Iniciar animación de sorteo
    amigoSeleccionado.textContent = '...';
    resultado.classList.remove('hidden');
    
    // Cambiar el botón durante el sorteo
    const originalButtonText = sortearButton.innerHTML;
    sortearButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sorteando...';
    sortearButton.disabled = true;
    
    // Efecto de selección aleatoria
    let counter = 0;
    const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * listaNombres.length);
        const tempName = listaNombres[randomIndex];
        amigoSeleccionado.textContent = tempName;
        counter++;
        
        if (counter > 10) {
            clearInterval(interval);
            
            // Selección final
            setTimeout(() => {
                const indiceAleatorio = Math.floor(Math.random() * listaNombres.length);
                const ganador = listaNombres[indiceAleatorio];
                
                // Capitalizar el nombre del ganador
                const ganadorCapitalizado = ganador.charAt(0).toUpperCase() + ganador.slice(1);
                
                // Animación final
                amigoSeleccionado.textContent = '';
                amigoSeleccionado.classList.add('reveal-animation');
                
                setTimeout(() => {
                    amigoSeleccionado.textContent = `🎉 ${ganadorCapitalizado} 🎉`;
                    mostrarNotificacion('✅ Amigo secreto sorteado correctamente');
                    resetButton.disabled = false;
                    sortearButton.innerHTML = originalButtonText;
                    sortearButton.disabled = false;
                    amigoSeleccionado.classList.remove('reveal-animation');
                    
                    // Añadir confeti para celebrar
                    mostrarConfeti();
                }, 500);
            }, 500);
        }
    }, 100);
}

function mostrarConfeti() {
    // Crear elementos de confeti
    for (let i = 0; i < 100; i++) {
        createConfetti();
    }
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Colores aleatorios para el confeti
    const colors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Posición y animación aleatoria
    const left = Math.random() * 100;
    const size = Math.random() * 10 + 5;
    const duration = Math.random() * 3 + 2;
    
    confetti.style.backgroundColor = randomColor;
    confetti.style.left = `${left}vw`;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.animationDuration = `${duration}s`;
    
    document.body.appendChild(confetti);
    
    // Eliminar confeti después de la animación
    setTimeout(() => {
        confetti.remove();
    }, duration * 1000);
}

function reiniciarJuego() {
    // Añadir animación de reinicio
    const container = document.getElementById('listaAmigosContainer');
    container.classList.add('reset-animation');
    
    setTimeout(() => {
        listaNombres = [];
        actualizarListaAmigos();
        document.getElementById('amigoSeleccionado').textContent = 'Sortea para descubrir';
        mostrarNotificacion('🔄 Juego reiniciado correctamente');
        
        // Restablecer estados
        document.querySelector('.button-reset').disabled = true;
        document.querySelector('.button-draw').disabled = false;
        
        container.classList.remove('reset-animation');
    }, 300);
}

function salir() {
    const modal = document.createElement('div');
    modal.className = 'exit-modal';
    modal.innerHTML = `
        <div class="exit-modal-content">
            <h3>¿Estás seguro que quieres salir?</h3>
            <div class="exit-modal-buttons">
                <button id="cancelExit" class="modal-button cancel-button">Cancelar</button>
                <button id="confirmExit" class="modal-button confirm-button">Salir</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Añadir animación de entrada
    setTimeout(() => modal.classList.add('visible'), 10);
    
    document.getElementById('cancelExit').addEventListener('click', () => {
        modal.classList.remove('visible');
        setTimeout(() => modal.remove(), 300);
    });
    
    document.getElementById('confirmExit').addEventListener('click', () => {
        window.close();
        // Si window.close no funciona (por restricciones del navegador)
        modal.innerHTML = `
            <div class="exit-modal-content">
                <h3>Puedes cerrar esta ventana</h3>
                <p>Gracias por usar Amigo Secreto</p>
                <button id="okButton" class="modal-button confirm-button">OK</button>
            </div>
        `;
        
        document.getElementById('okButton').addEventListener('click', () => {
            modal.classList.remove('visible');
            setTimeout(() => modal.remove(), 300);
        });
    });
}

function actualizarEstadoBotones() {
    const resetButton = document.querySelector('.button-reset');
    const sortearButton = document.querySelector('.button-draw');
    const addButton = document.querySelector('.button-add');
    const input = document.getElementById('amigo');
    
    // Actualizar estado del botón añadir
    addButton.disabled = !input.value.trim();
    
    // Actualizar estado del botón sortear
    sortearButton.disabled = listaNombres.length < 2;
    
    // El botón de reinicio se habilita después de un sorteo
}

// Eventos
document.getElementById('amigo').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        agregarAmigo();
    }
});

document.getElementById('amigo').addEventListener('input', function() {
    const addButton = document.querySelector('.button-add');
    addButton.disabled = this.value.trim() === '';
});

document.addEventListener('DOMContentLoaded', () => {
    actualizarListaAmigos();
    
    const addButton = document.querySelector('.button-add');
    const resetButton = document.querySelector('.button-reset');
    const sortearButton = document.querySelector('.button-draw');
    
    // Inicializar estados
    addButton.disabled = true;
    resetButton.disabled = true;
    sortearButton.disabled = true;
    
    // Añadir estilos adicionales para las animaciones
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(10px); }
        }
        
        @keyframes removeItem {
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
            40% {transform: translateY(-20px);}
            60% {transform: translateY(-10px);}
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes confettiFall {
            0% { transform: translateY(-100vh) rotate(0deg); }
            100% { transform: translateY(100vh) rotate(360deg); }
        }
        
        .friend-item {
            animation: fadeIn 0.3s ease forwards;
        }
        
        .friend-item.removing {
            animation: removeItem 0.3s ease forwards;
        }
        
        .success-animation {
            animation: pulse 0.7s ease;
        }
        
        .reveal-animation {
            animation: bounce 1s ease;
        }
        
        .reset-animation {
            animation: fadeOut 0.3s ease;
        }
        
        .empty-list-message {
            text-align: center;
            color: #a0aec0;
            padding: 20px;
            font-style: italic;
        }
        
        .confetti {
            position: fixed;
            top: -10px;
            animation: confettiFall linear forwards;
            z-index: 1000;
        }
        
        .exit-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 2000;
        }
        
        .exit-modal.visible {
            opacity: 1;
        }
        
        .exit-modal-content {
            background: white;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            transform: translateY(20px);
            transition: transform 0.3s ease;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            max-width: 90%;
            width: 400px;
        }
        
        .exit-modal.visible .exit-modal-content {
            transform: translateY(0);
        }
        
        .exit-modal h3 {
            margin-top: 0;
            color: #2d3748;
        }
        
        .exit-modal-buttons {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 24px;
        }
        
        .modal-button {
            padding: 10px 20px;
            border-radius: 8px;
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .cancel-button {
            background: #edf2f7;
            color: #4a5568;
        }
        
        .confirm-button {
            background: #e53e3e;
            color: white;
        }
        
        .modal-button:hover {
            filter: brightness(0.9);
        }
    `;
    
    document.head.appendChild(styleElement);
    
    console.log('Script cargado correctamente');
});