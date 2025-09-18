// public/js/topic-detail.js

// Espera a que todo el HTML de la página se cargue antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos los elementos clave de la página con los que vamos a interactuar.
    const subtopicList = document.querySelector('.subtopic-list');
    const addSubtopicForm = document.getElementById('add-subtopic-form');

    // Si alguno de los elementos principales no existe, detenemos el script para evitar errores.
    if (!subtopicList || !addSubtopicForm) {
        return;
    }

    // --- MANEJO DEL FORMULARIO PARA AÑADIR NUEVOS SUBTEMAS ---
    addSubtopicForm.addEventListener('submit', async (event) => {
        // Prevenimos el comportamiento por defecto del formulario (que es recargar la página).
        event.preventDefault();

        // Obtenemos los valores de los campos del formulario.
        const titleInput = addSubtopicForm.querySelector('input[name="title"]');
        const linkInput = addSubtopicForm.querySelector('input[name="link"]');
        const title = titleInput.value;
        const link = linkInput.value;

        // Una validación simple para asegurarnos de que no estén vacíos.
        if (!title || !link) {
            alert('Por favor, completa ambos campos.');
            return;
        }

        try {
            // 👇 ESTE ES EL BLOQUE NUEVO Y CORREGIDO 👇
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Enviamos el ID del tema padre para que el servidor sepa qué lista devolver
                body: JSON.stringify({ topic_id: TOPIC_ID }),
            });
            const updatedSubtopics = await response.json();
            
            renderSubtopics(updatedSubtopics);
        } catch (error) {
            console.error('Error al votar:', error);
        }
    });

    // --- MANEJO DE VOTOS (UPVOTE/DOWNVOTE) USANDO DELEGACIÓN DE EVENTOS ---
    subtopicList.addEventListener('click', async (event) => {
        const target = event.target;
        const subtopicId = target.dataset.id;
        let url = '';

        // Determinamos qué botón se presionó y definimos la URL correspondiente.
        if (target.matches('.js-upvote-btn')) {
            url = `/subtopics/${subtopicId}/upvote`;
        } else if (target.matches('.js-downvote-btn')) {
            url = `/subtopics/${subtopicId}/downvote`;
        } else {
            // Si no se hizo clic en un botón de voto, no hacemos nada.
            return;
        }
        
        try {
            // Enviamos la solicitud de voto al servidor.
            const response = await fetch(url, { 
                method: 'POST' 
            });
            const updatedSubtopics = await response.json();
            
            // Redibujamos la lista con los nuevos conteos de votos.
            renderSubtopics(updatedSubtopics);
        } catch (error) {
            console.error('Error al votar:', error);
        }
    });

    /**
     * Función que renderiza (dibuja) la lista completa de subtemas en el DOM.
     * @param {Array} subtopics - Un array de objetos, donde cada objeto es un subtema.
     */
    function renderSubtopics(subtopics) {
        // Limpiamos la lista actual para evitar duplicados.
        subtopicList.innerHTML = '';

        // Si no hay subtemas, mostramos un mensaje.
        if (subtopics.length === 0) {
            subtopicList.innerHTML = '<p class="empty-list-message">Aún no hay subtemas. ¡Sé el primero en añadir uno!</p>';
            return;
        }

        // Recorremos el array y creamos el HTML para cada subtema.
        subtopics.forEach(subtopic => {
            const subtopicElement = document.createElement('div');
            subtopicElement.className = 'subtopic';
            subtopicElement.dataset.id = subtopic.id;

            subtopicElement.innerHTML = `
                <a href="${subtopic.link}" target="_blank" class="subtopic__title">${subtopic.title}</a>
                <div class="subtopic__actions">
                    <button class="subtopic__vote-btn js-upvote-btn" data-id="${subtopic.id}">▲</button>
                    <span class="subtopic__votes">${subtopic.votes}</span>
                    <button class="subtopic__vote-btn js-downvote-btn" data-id="${subtopic.id}">▼</button>
                </div>
            `;
            // Añadimos el elemento recién creado a la lista en la página.
            subtopicList.appendChild(subtopicElement);
        });
    }
});