document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', async (event) => {
        const voteButton = event.target.closest('.vote-btn');
        if (!voteButton) return;
        event.preventDefault();
        const { type, topicId, linkId } = voteButton.dataset;
        let url = `/topics/${topicId}`;
        if (type === 'link') url += `/links/${linkId}`;
        url += '/vote';
        try {
            const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
            if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
            const data = await response.json();
            if (data.success) {
                const countElement = voteButton.querySelector('.vote-count');
                if (countElement) {
                    countElement.textContent = data.newVoteCount;
                    voteButton.style.transform = 'scale(1.1)';
                    setTimeout(() => voteButton.style.transform = 'scale(1)', 150);
                }
            } else {
                console.error('Vote failed:', data.message);
            }
        } catch (error) {
            console.error('Error processing vote:', error);
        }
    });
});
