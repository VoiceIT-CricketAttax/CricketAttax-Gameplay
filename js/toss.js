const selectedPlayers = JSON.parse(localStorage.getItem('selectedPlayers')) || [];
const playersGrid = document.getElementById('players-grid');
const headBtn = document.getElementById('head-btn');
const tailBtn = document.getElementById('tail-btn');
const tossResult = document.getElementById('toss-result');
const batFieldChoice = document.getElementById('bat-field-choice');
const batBtn = document.getElementById('bat-btn');
const fieldBtn = document.getElementById('field-btn');

if (selectedPlayers.length === 0) {
    playersGrid.textContent = 'No players selected!';
} else {
    selectedPlayers.forEach(playerName => {
        const playerBox = document.createElement('div');
        playerBox.classList.add('player-box');
        playerBox.textContent = playerName;
        playersGrid.appendChild(playerBox);
    });
}

function performToss(userChoice) {
    tossResult.textContent = 'Spinning the coin... 🌀';
    setTimeout(() => {
        const coin = Math.random() < 0.5 ? 'Head' : 'Tail';
        const youWon = userChoice === coin;
        tossResult.textContent = `Coin landed on ${coin}. ${youWon ? 'You have won the toss!' : 'Opponent has won the toss!'}`;

        if (youWon) {
            batFieldChoice.style.display = 'block';
        } else {
            setTimeout(() => {
                alert('Opponent chose to Bat. Moving to game...');
                window.location.href = 'Game.html';
            }, 2000);
        }
    }, 1500);
}

headBtn.addEventListener('click', () => performToss('Head'));
tailBtn.addEventListener('click', () => performToss('Tail'));

batBtn.addEventListener('click', () => {
    localStorage.setItem('batOrField', 'Bat');
    window.location.href = 'Game.html';
});

fieldBtn.addEventListener('click', () => {
    localStorage.setItem('batOrField', 'Field');
    window.location.href = 'Game.html';
});
