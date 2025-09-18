// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // --- Selectores de Elementos ---
  const topicList = document.querySelector('.topic-list');
  const modal = document.getElementById('edit-topic-modal');
  const editForm = document.getElementById('edit-topic-form');
  const cancelBtn = document.getElementById('cancel-edit-topic-btn');
  const editIdField = document.getElementById('edit-topic-id');
  const editTitleField = document.getElementById('edit-topic-title');

  if (!topicList || !modal) return;

  // --- Lógica de la Modal ---
  const openModal = () => modal.classList.remove('hidden');
  const closeModal = () => modal.classList.add('hidden');
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => e.target === modal && closeModal());

  // --- Manejo del Formulario de Edición ---
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = editIdField.value;
    const title = editTitleField.value;
    
    const response = await fetch(`/topics/${id}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    const updatedTopics = await response.json();
    closeModal();
    renderTopics(updatedTopics);
  });

  // --- Delegación de Eventos para la Lista de Temas ---
  topicList.addEventListener('click', async (event) => {
    const target = event.target;
    const id = target.dataset.id;
    if (!id) return;

    // --- Lógica para Editar ---
    if (target.matches('.js-edit-topic-btn')) {
      const response = await fetch(`/api/topics/${id}`);
      const topic = await response.json();
      
      editIdField.value = topic.id;
      editTitleField.value = topic.title;
      openModal();
    }

    // --- Lógica para Eliminar ---
    if (target.matches('.js-delete-topic-btn')) {
      if (!confirm('¿Estás seguro de que quieres eliminar este tema? Se borrarán también todos sus enlaces.')) {
        return;
      }
      const response = await fetch(`/topics/${id}/delete`, { method: 'POST' });
      const updatedTopics = await response.json();
      renderTopics(updatedTopics);
    }

    // --- Lógica para Votar ---
    if (target.matches('.js-vote-btn')) {
      const response = await fetch(`/topics/${id}/vote`, { method: 'POST' });
      const updatedTopics = await response.json();
      renderTopics(updatedTopics);
    }
  });

  // --- Función para Renderizar la Lista de Temas ---
  function renderTopics(topics) {
    topicList.innerHTML = '';
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

