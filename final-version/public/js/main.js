// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  const topicList = document.querySelector('.topic-list');
  if (!topicList) return;

  topicList.addEventListener('click', async (event) => {
    if (event.target.matches('.js-vote-btn')) {
      const topicId = event.target.dataset.id;
      try {
        const response = await fetch(`/topics/${topicId}/vote`, { method: 'POST' });
        const updatedTopics = await response.json();
        renderTopics(updatedTopics);
      } catch (error) {
        console.error('Error al votar por el tema:', error);
      }
    }
  });

  function renderTopics(topics) {
    topicList.innerHTML = '';
    topics.forEach(topic => {
      const topicElement = document.createElement('div');
      topicElement.className = 'topic';
      topicElement.dataset.id = topic.id;
      topicElement.innerHTML = `
        <a href="/topics/${topic.id}" class="topic__link">
          <span class="topic__title">${topic.title}</span>
        </a>
        <div class="topic__actions">
          <span class="topic__votes">${topic.votes} ❤️</span>
          <button class="topic__vote-button js-vote-btn" data-id="${topic.id}">Votar 👍</button>
        </div>
      `;
      topicList.appendChild(topicElement);
    });
  }
});

