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
    selectedPlayers.forEach(playerObj => {
        const playerBox = document.createElement('div');
        playerBox.classList.add('selected-player-box');

        const img = document.createElement('img');
        img.src = playerObj.image;
        img.alt = playerObj.name;
        img.style.width = '100%';

        playerBox.appendChild(img);
        playersGrid.appendChild(playerBox);
    });
}

function performToss(userChoice) {
    headBtn.disabled = true;
    tailBtn.disabled = true;
    tossResult.textContent = 'Spinning the coin... 🌀';
    setTimeout(() => {
        const coin = Math.random() < 0.5 ? 'Head' : 'Tail';
        const youWon = userChoice === coin;
        tossResult.textContent = `Coin landed on ${coin}. ${youWon ? 'You have won the toss!' : 'Opponent has won the toss!'}`;

        if (youWon) {
            // Player won toss → let them choose Bat or Field
            localStorage.setItem('tossWinner', 'player');
            batFieldChoice.style.display = 'block';
        } else {
            // Opponent won toss → opponent randomly chooses
            localStorage.setItem('tossWinner', 'opponent');
            const opponentChoice = Math.random() < 0.5 ? 'Bat' : 'Field';
            localStorage.setItem('batOrField', opponentChoice);

            setTimeout(() => {
                alert(`Opponent chose to ${opponentChoice}. Moving to game...`);
                window.location.href = 'Game.html';
            }, 2000);
        }
    }, 1500);
}

headBtn.addEventListener('click', () => performToss('Head'));
tailBtn.addEventListener('click', () => performToss('Tail'));


batBtn.addEventListener('click', () => {
    localStorage.setItem('batOrField', 'Bat');
    window.location.href = 'game.html';
});

fieldBtn.addEventListener('click', () => {
    localStorage.setItem('batOrField', 'Field');
    window.location.href = 'game.html';
});
