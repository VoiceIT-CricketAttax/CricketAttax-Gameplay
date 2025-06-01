const selectedPlayers = JSON.parse(localStorage.getItem('selectedPlayers')) || [];
const playersGrid = document.getElementById('players-grid');
const gameBoard = document.getElementById('game-board');
const roundResult = document.getElementById('round-result');
const playerPointsDiv = document.getElementById('player-points');
const opponentPointsDiv = document.getElementById('opponent-points');
const roundCountDiv = document.getElementById('round-count');

const allPlayers = [
    { name: "Opponent 1", ovr: 85 },
    { name: "Opponent 2", ovr: 70 },
    { name: "Opponent 3", ovr: 90 },
    { name: "Opponent 4", ovr: 65 },
    { name: "Opponent 5", ovr: 78 }
];

let striker = null;
let nonStriker = null;
let playerPoints = 0;
let opponentPoints = 0;
let currentRound = 1;
const maxRounds = 20;

function renderYourPlayers() {
    playersGrid.innerHTML = '';
    selectedPlayers.forEach(player => {
        const [name, ovrText] = player.split(' (OVR: ');
        const ovr = parseInt(ovrText.replace(')', ''));
        const playerBox = document.createElement('div');
        playerBox.classList.add('player-box');
        playerBox.textContent = `${name} (OVR: ${ovr})`;
        playerBox.addEventListener('click', () => selectPlayer({ name, ovr }));
        playersGrid.appendChild(playerBox);
    });
}

function selectPlayer(player) {
    if (!striker) {
        striker = player;
        gameBoard.innerHTML = `<p>Striker selected: ${player.name} (OVR: ${player.ovr})<br>Select Non-Striker.</p>`;
    } else if (!nonStriker && player.name !== striker.name) {
        nonStriker = player;
        gameBoard.innerHTML = `
            <p>Striker: ${striker.name} (OVR: ${striker.ovr})</p>
            <p>Non-Striker: ${nonStriker.name} (OVR: ${nonStriker.ovr})</p>
            <button id="start-round">Start Round</button>
        `;
        document.getElementById('start-round').addEventListener('click', startRound);
    }
}

function startRound() {
    const opponent = allPlayers[Math.floor(Math.random() * allPlayers.length)];
    gameBoard.innerHTML = `
        <div>
            <p><strong>Your Striker:</strong> ${striker.name} (OVR: ${striker.ovr})</p>
            <p><strong>Opponent Player:</strong> ${opponent.name} (OVR: ${opponent.ovr})</p>
        </div>
    `;

    if (striker.ovr > opponent.ovr) {
        playerPoints++;
        roundResult.textContent = 'You win this round!';
    } else if (striker.ovr < opponent.ovr) {
        opponentPoints++;
        roundResult.textContent = 'Opponent wins this round!';
    } else {
        roundResult.textContent = 'It\'s a draw!';
    }

    updateScoreboard();

    currentRound++;
    if (currentRound > maxRounds) {
        endGame();
    } else {
        striker = null;
        nonStriker = null;
        roundCountDiv.textContent = `Round ${currentRound} / ${maxRounds}`;
        gameBoard.innerHTML += `<p>Select two new players for next round.</p>`;
    }
}

function updateScoreboard() {
    playerPointsDiv.textContent = `Your Points: ${playerPoints}`;
    opponentPointsDiv.textContent = `Opponent Points: ${opponentPoints}`;
}

function endGame() {
    let finalMessage = '';
    if (playerPoints > opponentPoints) {
        finalMessage = 'You win the match!';
    } else if (playerPoints < opponentPoints) {
        finalMessage = 'Opponent wins the match!';
    } else {
        finalMessage = 'The match is a draw!';
    }

    gameBoard.innerHTML = `<h2>Game Over</h2><p>${finalMessage}</p>`;
    roundResult.textContent = '';
}

renderYourPlayers();
updateScoreboard();
