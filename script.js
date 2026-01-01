document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule');
    const searchInput = document.getElementById('search');
    let talks = [];

    fetch('talks.json')
        .then(response => response.json())
        .then(data => {
            talks = data;
            renderSchedule(talks);
        });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTalks = talks.filter(talk => 
            talk.categories.some(category => category.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filteredTalks);
    });

    function renderSchedule(talksToRender) {
        scheduleContainer.innerHTML = '';
        let startTime = new Date();
        startTime.setHours(10, 0, 0, 0);

        talksToRender.forEach((talk, index) => {
            if (index === 3) {
                // Lunch Break
                const lunchEndTime = new Date(startTime.getTime() + 60 * 60 * 1000);
                scheduleContainer.innerHTML += `
                    <div class="schedule-item break">
                        <div class="time">${formatTime(startTime)} - ${formatTime(lunchEndTime)}</div>
                        <h2>Lunch Break</h2>
                    </div>
                `;
                startTime = lunchEndTime;
            }

            const endTime = new Date(startTime.getTime() + talk.duration * 60 * 1000);
            
            scheduleContainer.innerHTML += `
                <div class="schedule-item">
                    <div class="time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
                    <h2>${talk.title}</h2>
                    <div class="speakers">By: ${talk.speakers.join(', ')}</div>
                    <div class="categories">
                        ${talk.categories.map(cat => `<span class="category">${cat}</span>`).join('')}
                    </div>
                    <p>${talk.description}</p>
                </div>
            `;

            // 10 minute break
            startTime = new Date(endTime.getTime() + 10 * 60 * 1000);
        });
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
});
