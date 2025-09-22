// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // --- Selectores de Elementos ---
  const topicList = document.querySelector('.topic-list');
  const modal = document.getElementById('edit-topic-modal');
  const editForm = document.getElementById('edit-topic-form');
  const cancelBtn = document.getElementById('cancel-edit-topic-btn');
  const editIdField = document.getElementById('edit-topic-id');
  const editTitleField = document.getElementById('edit-topic-title');

  // Si los elementos principales no existen, no continuamos para evitar errores.
  if (!topicList || !modal) return;

  // --- Lógica de la Modal ---
  const openModal = () => modal.classList.remove('hidden');
  const closeModal = () => modal.classList.add('hidden');

  cancelBtn.addEventListener('click', closeModal);

  // Cierra la modal si se hace clic fuera del contenido
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // --- Manejo del Formulario de Edición (Actualizado con PUT) ---
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = editIdField.value;
    const title = editTitleField.value;
    
    // Petición con el método PUT para actualizar el recurso
    const response = await fetch(`/topics/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    // Si la actualización fue exitosa, el servidor devuelve la lista actualizada
    if (response.ok) {
      const updatedTopics = await response.json();
      closeModal();
      renderTopics(updatedTopics); // Actualiza la vista sin recargar la página
    } else {
      console.error('Error al actualizar el tema');
    }
  });

  // --- Delegación de Eventos para la Lista de Temas ---
  topicList.addEventListener('click', async (event) => {
    // Nos aseguramos de que el objetivo sea un botón con `data-id`
    const target = event.target.closest('button[data-id]');
    if (!target) return;

    const id = target.dataset.id;

    // --- Lógica para Abrir Modal de Edición ---
    if (target.matches('.js-edit-topic-btn')) {
      // Obtenemos los datos actuales del tema para rellenar el formulario
      const response = await fetch(`/api/topics/${id}`);
      const topic = await response.json();
      
      editIdField.value = topic.id;
      editTitleField.value = topic.title;
      openModal();
    }

    // --- Lógica para Eliminar (Actualizado con DELETE) ---
    if (target.matches('.js-delete-topic-btn')) {
      if (!confirm('¿Estás seguro de que quieres eliminar este tema? Se borrarán también todos sus enlaces.')) {
        return;
      }

      // Petición con el método DELETE para eliminar el recurso
      const response = await fetch(`/topics/${id}`, { 
        method: 'DELETE' 
      });

      // Si la eliminación fue exitosa, el servidor devuelve la lista actualizada
      if (response.ok) {
        const updatedTopics = await response.json();
        renderTopics(updatedTopics); // Actualiza la vista
      } else {
        console.error('Error al eliminar el tema');
      }
    }

    // --- Lógica para Votar ---
    if (target.matches('.js-vote-btn')) {
      const response = await fetch(`/topics/${id}/vote`, { method: 'POST' });
      const updatedTopics = await response.json();
      renderTopics(updatedTopics);
    }
  });

  // --- Función para Renderizar la Lista de Temas ---
  // Esta función reconstruye el HTML de la lista de temas.
  function renderTopics(topics) {
    topicList.innerHTML = ''; // Limpia la lista actual
    topics.forEach(topic => {
      const element = document.createElement('div');
      element.className = 'topic';
      element.dataset.id = topic.id;
      element.innerHTML = `
        <a href="/topics/${topic.id}" class="topic__link">
          <span class="topic__title">${topic.title}</span>
        </a>
        <div class="topic__actions">
          <span class="topic__votes">${topic.votes} ❤️</span>
          <button class="topic__vote-button js-vote-btn" data-id="${topic.id}">Votar 👍</button>
          <button class="topic__action-btn js-edit-topic-btn" data-id="${topic.id}" title="Editar Tema">✏️</button>
          <button class="topic__action-btn js-delete-topic-btn" data-id="${topic.id}" title="Eliminar Tema">🗑️</button>
        </div>
      `;
      topicList.appendChild(element);
    });
  }
});