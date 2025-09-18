// public/js/topic-detail.js
document.addEventListener('DOMContentLoaded', () => {
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

  // --- ENVIAR FORMULARIO DE AÑADIR SUBTEMA ---
  addSubtopicForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = e.target.elements.title.value;
    const link = e.target.elements.link.value;
    const response = await fetch(`/topics/${TOPIC_ID}/subtopics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, link }),
    });
    const updatedSubtopics = await response.json();
    renderSubtopics(updatedSubtopics);
    e.target.reset();
  });

  // --- ENVIAR FORMULARIO DE EDICIÓN ---
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = editIdField.value;
    const title = editTitleField.value;
    const link = editLinkField.value;
    const response = await fetch(`/subtopics/${id}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, link, topic_id: TOPIC_ID }),
    });
    const updatedSubtopics = await response.json();
    closeModal();
    renderSubtopics(updatedSubtopics);
  });

  // --- MANEJO DE CLICS EN LA LISTA (VOTAR, EDITAR, ELIMINAR) ---
  subtopicList.addEventListener('click', async (e) => {
    const target = e.target;
    const id = target.dataset.id;
    if (!id) return;

    let url, method = 'POST', body = { topic_id: TOPIC_ID };

    if (target.matches('.js-edit-btn')) {
      const title = target.closest('.subtopic').querySelector('.subtopic__title').textContent;
      const link = target.closest('.subtopic').querySelector('.subtopic__title').href;
      editIdField.value = id;
      editTitleField.value = title;
      editLinkField.value = link;
      openModal();
      return;
    }
    
    if (target.matches('.js-delete-btn')) url = `/subtopics/${id}/delete`;
    if (target.matches('.js-upvote-btn')) url = `/subtopics/${id}/upvote`;
    if (target.matches('.js-downvote-btn')) url = `/subtopics/${id}/downvote`;
    
    if (!url) return;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const updatedSubtopics = await response.json();
    renderSubtopics(updatedSubtopics);
  });

  // --- FUNCIÓN PARA RENDERIZAR LA LISTA DE SUBTEMAS ---
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