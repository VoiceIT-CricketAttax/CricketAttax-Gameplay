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

// Toss result setup (can be randomized or controlled)
//let tossWinner = Math.random() < 0.5 ? 'player' : 'opponent';
let tossWinner =  localStorage.getItem('tossWinner');
console.log(tossWinner);
// let tossChoice = tossWinner === 'player' ? 'bat' : 'bowl'; // simplify: winner always bats
let tossChoice = localStorage.getItem('batOrField'); // simplify: winner always bats
console.log(tossChoice);
gameBoard.innerHTML = `<p>${tossWinner === 'player' ? 'You' : 'Opponent'} won the toss and chose to ${tossChoice}.</p>`;

// Render your players for selection
function renderYourPlayers() {
    playersGrid.innerHTML = '';

    if ((tossWinner === 'player' && tossChoice === 'Bat') || 
        (tossWinner === 'opponent' && tossChoice === 'Field')) {
        // Player is batting: select two players (striker + non-striker)
        gameBoard.innerHTML += `<p>Select Striker and Non-Striker.</p>`;
        selectedPlayers.forEach(playerObj => {
            const playerBox = document.createElement('div');
            playerBox.classList.add('player-box');

            const img = document.createElement('img');
            img.src = playerObj.image;
            img.alt = playerObj.name;

            playerBox.appendChild(img);

            const ovrMatch = playerObj.name.match(/\(OVR: (\d+)\)/);
            const ovr = ovrMatch ? parseInt(ovrMatch[1]) : 0;

            playerBox.addEventListener('click', () => selectPlayer({ name: playerObj.name, ovr }));
            playersGrid.appendChild(playerBox);
        });

    } else {
        // Player is bowling: select only one player
        gameBoard.innerHTML += `<p>Select one player to field/bowl.</p>`;
        selectedPlayers.forEach(playerObj => {
            const playerBox = document.createElement('div');
            playerBox.classList.add('player-box');

            const img = document.createElement('img');
            img.src = playerObj.image;
            img.alt = playerObj.name;

            playerBox.appendChild(img);

            const ovrMatch = playerObj.name.match(/\(OVR: (\d+)\)/);
            const ovr = ovrMatch ? parseInt(ovrMatch[1]) : 0;

            playerBox.addEventListener('click', () => {
                striker = { name: playerObj.name, ovr };
                startRound();
            });
            playersGrid.appendChild(playerBox);
        });
    }
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
    const opponentStriker = allPlayers[Math.floor(Math.random() * allPlayers.length)];
    let opponentNonStriker = allPlayers[Math.floor(Math.random() * allPlayers.length)];
    while (opponentNonStriker.name === opponentStriker.name) {
        opponentNonStriker = allPlayers[Math.floor(Math.random() * allPlayers.length)];
    }

    if ((tossWinner === 'player' && tossChoice === 'Bat') || 
        (tossWinner === 'opponent' && tossChoice === 'Field')) {
        // Player batting → compare player striker vs opponent random
        const opponent = allPlayers[Math.floor(Math.random() * allPlayers.length)];
        gameBoard.innerHTML = `
            <p><strong>Your Striker:</strong> ${striker.name} (OVR: ${striker.ovr})</p>
            <p><strong>Opponent Player:</strong> ${opponent.name} (OVR: ${opponent.ovr})</p>
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

    } else {
        // Opponent batting → compare opponent striker vs opponent non-striker
        gameBoard.innerHTML = `
            <p><strong>Opponent Striker:</strong> ${opponentStriker.name} (OVR: ${opponentStriker.ovr})</p>
            <p><strong>Opponent Non-Striker:</strong> ${opponentNonStriker.name} (OVR: ${opponentNonStriker.ovr})</p>
        `;

        if (opponentStriker.ovr > opponentNonStriker.ovr) {
            opponentPoints++;
            roundResult.textContent = 'Opponent striker wins this round!';
        } else if (opponentStriker.ovr < opponentNonStriker.ovr) {
            opponentPoints++;
            roundResult.textContent = 'Opponent non-striker wins this round!';
        } else {
            roundResult.textContent = 'It\'s a draw!';
        }
    }

    updateScoreboard();

    currentRound++;
    if (currentRound > maxRounds) {
        endGame();
    } else {
        striker = null;
        nonStriker = null;
        roundCountDiv.textContent = `Round ${currentRound} / ${maxRounds}`;
        renderYourPlayers();
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
