// public/js/topic-detail.js
document.addEventListener('DOMContentLoaded', () => {
  // --- SELECTORES DE ELEMENTOS ---
  const subtopicList = document.querySelector('.subtopic-list');
  const addSubtopicForm = document.getElementById('add-subtopic-form');
  const modal = document.getElementById('edit-modal');
  const editForm = document.getElementById('edit-form');
  const cancelBtn = document.getElementById('cancel-edit-btn');
  const editIdField = document.getElementById('edit-subtopic-id');
  const editTitleField = document.getElementById('edit-subtopic-title');
  const editLinkField = document.getElementById('edit-subtopic-link');

  if (!subtopicList || !addSubtopicForm || !modal) return;

  // --- MANEJO DE LA MODAL ---
  const openModal = () => modal.classList.remove('hidden');
  const closeModal = () => modal.classList.add('hidden');
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => e.target === modal && closeModal());

  // --- ENVIAR FORMULARIO DE AÑADIR SUBTEMA (Sin cambios) ---
  addSubtopicForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = e.target.elements.title.value;
    const link = e.target.elements.link.value;
    // Esta ruta ya usa POST para crear, lo cual es correcto.
    const response = await fetch(`/topics/${TOPIC_ID}/subtopics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, link }),
    });
    const updatedSubtopics = await response.json();
    renderSubtopics(updatedSubtopics);
    e.target.reset();
  });

  // --- ENVIAR FORMULARIO DE EDICIÓN (Actualizado a PUT) ---
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = editIdField.value;
    const title = editTitleField.value;
    const link = editLinkField.value;

    // CAMBIO AQUÍ: Se usa el método PUT y la URL simplificada.
    const response = await fetch(`/subtopics/${id}`, {
      method: 'PUT', // <-- Método cambiado a PUT
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, link, topic_id: TOPIC_ID }),
    });

    const updatedSubtopics = await response.json();
    closeModal();
    renderSubtopics(updatedSubtopics);
  });

  // --- MANEJO DE CLICS EN LA LISTA (VOTAR, EDITAR, ELIMINAR) ---
  // Reestructurado para mayor claridad
  subtopicList.addEventListener('click', async (e) => {
    const target = e.target.closest('button'); // Asegura que capturamos el botón
    if (!target) return;

    const id = target.dataset.id;
    if (!id) return;

    // --- Caso 1: Botón de Editar (abre la modal) ---
    if (target.matches('.js-edit-btn')) {
      const subtopicElement = target.closest('.subtopic');
      const title = subtopicElement.querySelector('.subtopic__title').textContent;
      const link = subtopicElement.querySelector('.subtopic__title').href;
      
      editIdField.value = id;
      editTitleField.value = title;
      editLinkField.value = link;
      openModal();
      return; // Termina la ejecución aquí
    }
    
    // --- Caso 2: Botón de Eliminar (Actualizado a DELETE) ---
    if (target.matches('.js-delete-btn')) {
      if (!confirm('¿Estás seguro de que quieres eliminar este subtema?')) return;
      
      // CAMBIO AQUÍ: Se usa el método DELETE y la URL simplificada.
      const response = await fetch(`/subtopics/${id}`, {
        method: 'DELETE', // <-- Método cambiado a DELETE
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic_id: TOPIC_ID }) // Enviamos topic_id por si el backend lo necesita
      });
      
      const updatedSubtopics = await response.json();
      renderSubtopics(updatedSubtopics);
      return; // Termina la ejecución aquí
    }

    // --- Caso 3: Botones de Votar (siguen usando POST) ---
    let url;
    if (target.matches('.js-upvote-btn')) url = `/subtopics/${id}/upvote`;
    if (target.matches('.js-downvote-btn')) url = `/subtopics/${id}/downvote`;
    
    if (!url) return; // Si no es un botón de voto, no hacemos nada más

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic_id: TOPIC_ID }),
    });
    
    const updatedSubtopics = await response.json();
    renderSubtopics(updatedSubtopics);
  });

  // --- FUNCIÓN PARA RENDERIZAR LA LISTA DE SUBTEMAS (Sin cambios) ---
  function renderSubtopics(subtopics) {
    subtopicList.innerHTML = '';
    if (subtopics.length === 0) {
      subtopicList.innerHTML = '<p class="empty-list-message">Aún no hay enlaces. ¡Sé el primero en añadir uno!</p>';
      return;
    }
    subtopics.forEach(subtopic => {
      const element = document.createElement('div');
      element.className = 'subtopic';
      element.dataset.id = subtopic.id;
      element.innerHTML = `
        <a href="${subtopic.link}" target="_blank" class="subtopic__title">${subtopic.title}</a>
        <div class="subtopic__actions">
          <button class="subtopic__action-btn js-edit-btn" data-id="${subtopic.id}" title="Editar">✏️</button>
          <button class="subtopic__action-btn js-delete-btn" data-id="${subtopic.id}" title="Eliminar">🗑️</button>
          <button class="subtopic__vote-btn js-upvote-btn" data-id="${subtopic.id}" title="Votar a favor">▲</button>
          <span class="subtopic__votes">${subtopic.votes}</span>
          <button class="subtopic__vote-btn js-downvote-btn" data-id="${subtopic.id}" title="Votar en contra">▼</button>
        </div>
      `;
      subtopicList.appendChild(element);
    });
  }
});