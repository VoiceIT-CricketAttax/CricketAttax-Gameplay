const playerGrid = document.querySelector('.player-grid');
const enterGameBtn = document.getElementById('enter-game-btn');
const popupOverlay = document.querySelector('.popup-overlay');
const popupPlayerList = document.querySelector('.popup-player-list');
const confirmBtn = document.getElementById('confirm-btn');
const changeBtn = document.getElementById('change-btn');

for (let i = 1; i <= 25; i++) {
    const playerBox = document.createElement('div');
    playerBox.classList.add('player-box');
    playerBox.textContent = `Player ${i} (OVR: ${Math.floor(Math.random() * 100)})`;

    playerBox.addEventListener('click', () => {
        const selectedPlayers = document.querySelectorAll('.player-box.selected');

        if (playerBox.classList.contains('selected')) {
            playerBox.classList.remove('selected');
        } else if (selectedPlayers.length < 11) {
            playerBox.classList.add('selected');
        } else {
            alert('You can only select 11 players. Deselect one to choose another.');
        }

        const updatedSelectedPlayers = document.querySelectorAll('.player-box.selected');
        enterGameBtn.disabled = updatedSelectedPlayers.length !== 11;

        const selectedPlayerGrid = document.querySelector('.selected-player-grid');
        selectedPlayerGrid.innerHTML = '';
        updatedSelectedPlayers.forEach((player) => {
            const selectedPlayerBox = document.createElement('div');
            selectedPlayerBox.classList.add('selected-player-box');
            selectedPlayerBox.textContent = player.textContent;
            selectedPlayerGrid.appendChild(selectedPlayerBox);
        });
    });

    playerGrid.appendChild(playerBox);
}

enterGameBtn.addEventListener('click', () => {
    const selectedPlayers = document.querySelectorAll('.player-box.selected');
    if (selectedPlayers.length !== 11) {
        alert('Choose 11 players to continue the game.');
    } else {
        popupPlayerList.innerHTML = '';
        selectedPlayers.forEach((player) => {
            const playerItem = document.createElement('div');
            playerItem.textContent = player.textContent;
            popupPlayerList.appendChild(playerItem);
        });
        popupOverlay.style.display = 'flex';
    }
});

confirmBtn.addEventListener('click', () => {
    const selectedPlayers = Array.from(document.querySelectorAll('.player-box.selected')).map(player => player.textContent);
    localStorage.setItem('selectedPlayers', JSON.stringify(selectedPlayers));

    popupOverlay.innerHTML = `
        <div class="popup">
            <h2>Loading...</h2>
            <div class="loader"></div>
            <p>Waiting for opponent to finish selecting...</p>
        </div>
    `;

    setTimeout(() => {
        window.location.href = 'toss.html';
    }, 2000);
});

changeBtn.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
});

