// public/js/main.js

document.addEventListener('DOMContentLoaded', () => {
  const topicList = document.querySelector('.topic-list');
  const modal = document.getElementById('edit-modal');
  const editForm = document.getElementById('edit-form');
  const cancelBtn = document.getElementById('cancel-edit-btn');
  const topicIdField = document.getElementById('edit-topic-id');
  const topicTitleField = document.getElementById('edit-topic-title');
  const topicLinkField = document.getElementById('edit-topic-link');

  if (!topicList || !modal) return;

  // --- Funciones para abrir y cerrar la modal ---
  const openModal = () => modal.classList.remove('hidden');
  const closeModal = () => modal.classList.add('hidden');

  // Cerrar modal al hacer clic en el botón de cancelar o fuera de ella
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // --- Delegación de eventos para la lista de temas ---
  topicList.addEventListener('click', async (event) => {
    const target = event.target;
    const topicId = target.dataset.id;

    // --- Lógica para Editar ---
    if (target.matches('.js-edit-btn')) {
      // 1. Pedimos los datos del tema al servidor
      const response = await fetch(`/topics/${topicId}`);
      const topic = await response.json();
      
      // 2. Llenamos el formulario de la modal con los datos
      topicIdField.value = topic.id;
      topicTitleField.value = topic.title;
      topicLinkField.value = topic.link || ''; // Si el link es null, ponemos un string vacío
      
      // 3. Mostramos la modal
      openModal();
    }

    // --- Lógica para Votar (sin cambios) ---
    if (target.matches('.js-vote-btn')) {
      try {
        const response = await fetch(`/topics/${topicId}/vote`, { method: 'POST' });
        const updatedTopics = await response.json();
        renderTopics(updatedTopics);
      } catch (error) {
        console.error('Error al votar:', error);
      }
    }

    // --- Lógica para Eliminar (sin cambios) ---
    if (target.matches('.js-delete-btn')) {
      try {
        const response = await fetch(`/topics/${topicId}/delete`, { method: 'POST' });
        const updatedTopics = await response.json();
        renderTopics(updatedTopics);
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  });

  // --- Lógica para enviar el formulario de edición ---
  editForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitamos que la página se recargue
    
    const id = topicIdField.value;
    const title = topicTitleField.value;
    const link = topicLinkField.value;

    try {
      const response = await fetch(`/topics/${id}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Le decimos al servidor que enviamos JSON
        },
        body: JSON.stringify({ title, link }), // Convertimos los datos a un string JSON
      });

      const updatedTopics = await response.json();
      
      closeModal(); // Cerramos la modal
      renderTopics(updatedTopics); // Redibujamos la lista
    } catch (error) {
      console.error('Error al actualizar el tema:', error);
    }
  });


  // --- Función para renderizar los temas (con una mejora) ---
  function renderTopics(topics) {
    topicList.innerHTML = '';
    
    topics.forEach(topic => {
      const topicElement = document.createElement('div');
      topicElement.className = 'topic';
      topicElement.dataset.id = topic.id;
      
      // Si hay un enlace, el título será un link. Si no, solo texto.
      const titleHTML = topic.link
        ? `<a href="${topic.link}" target="_blank" class="topic__title--link">${topic.title}</a>`
        : `<span class="topic__title">${topic.title}</span>`;

      topicElement.innerHTML = `
        <div class="topic__details">
          ${titleHTML}
          <span class="topic__votes">${topic.votes} ❤️</span>
        </div>
        <div class="topic__actions">
          <button class="topic__vote-button js-vote-btn" data-id="${topic.id}">Votar 👍</button>
          <button class="topic__edit-button js-edit-btn" data-id="${topic.id}">✏️</button>
          <button class="topic__delete-button js-delete-btn" data-id="${topic.id}">🗑️</button>
        </div>
      `;
      topicList.appendChild(topicElement);
    });
  }
});