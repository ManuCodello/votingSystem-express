document.addEventListener('DOMContentLoaded', () => {
  const topicList = document.querySelector('.topic-list');

  // Si no encontramos la lista, no hacemos nada.
  if (!topicList) return;

  // Usamos delegación de eventos para manejar los clics de forma eficiente
  topicList.addEventListener('click', async (event) => {
    const target = event.target;
    
    // Verificamos si se hizo clic en un botón de votar
    if (target.matches('.js-vote-btn')) {
      const topicId = target.dataset.id;
      
      try {
        // Hacemos la solicitud POST al servidor en segundo plano
        const response = await fetch(`/topics/${topicId}/vote`, {
          method: 'POST',
        });
        const updatedTopics = await response.json();
        
        // Actualizamos la lista con los nuevos datos
        renderTopics(updatedTopics);
      } catch (error) {
        console.error('Error al votar:', error);
      }
    }

    // Verificamos si se hizo clic en un botón de eliminar
    if (target.matches('.js-delete-btn')) {
      const topicId = target.dataset.id;

      try {
        // Hacemos la solicitud POST al servidor
        const response = await fetch(`/topics/${topicId}/delete`, {
          method: 'POST', // Los formularios solo envían GET/POST, lo mantenemos simple
        });
        const updatedTopics = await response.json();
        
        // Actualizamos la lista con los nuevos datos
        renderTopics(updatedTopics);
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  });

  // Función para "redibujar" la lista de temas
  function renderTopics(topics) {
    // Limpiamos la lista actual
    topicList.innerHTML = '';
    
    // Creamos y añadimos el HTML para cada tema
    topics.forEach(topic => {
      const topicElement = document.createElement('div');
      topicElement.className = 'topic';
      topicElement.dataset.id = topic.id;
      
      topicElement.innerHTML = `
        <div class="topic__details">
          <span class="topic__title">${topic.title}</span>
          <span class="topic__votes">${topic.votes} ❤️</span>
        </div>
        <div class="topic__actions">
          <button class="topic__vote-button js-vote-btn" data-id="${topic.id}">Votar 👍</button>
          <button class="topic__delete-button js-delete-btn" data-id="${topic.id}">🗑️</button>
        </div>
      `;
      topicList.appendChild(topicElement);
    });
  }
});
    