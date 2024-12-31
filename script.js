// JavaScript für das Spiel "Rudel Ofenfrischer Lachanfälle"

let players = [];
let teams = [];
let currentTeamIndex = 0;
let currentPhase = 1;
const teamScores = {};
const teamRotation = {}; // Track player rotations per team

// Spieler hinzufügen
const addPlayer = () => {
  const playerNameInput = document.getElementById("player-name");
  const playerName = playerNameInput.value.trim();

  if (playerName) {
    players.push(playerName);
    const playerList = document.getElementById("player-list");
    const listItem = document.createElement("li");
    listItem.textContent = playerName;
    playerList.appendChild(listItem);
    playerNameInput.value = "";
  }
};

// Spiel starten und Teams dynamisch erstellen
const startGame = () => {
  if (players.length < 2) {
    alert("Bitte füge mindestens 2 Spieler hinzu!");
    return;
  }

  // Anzahl der Teams basierend auf Spielerzahl bestimmen
  const numberOfTeams = Math.min(players.length, 3); // Maximal 3 Teams
  const teamNames = ["Scherzkekse", "Toast-Torpedos", "Die Lachkrämpfer"];
  teams = Array.from({ length: numberOfTeams }, (_, i) => ({
    name: teamNames[i],
    members: [],
  }));

  // Spieler zufällig auf Teams verteilen
  const shuffledPlayers = players.sort(() => Math.random() - 0.5);
  shuffledPlayers.forEach((player, index) => {
    const team = teams[index % teams.length];
    team.members.push(player);
    if (!teamScores[team.name]) {
      teamScores[team.name] = 3; // Jeder startet mit 3 Leben
    }
    teamRotation[team.name] = 0; // Initialize rotation index for each team
  });

  // Phase 2: Team-Präsentation starten
  document.getElementById("player-setup").style.display = "none";
  showTeamPresentation();
  updateProgressBar(2, 4);
};

// Team-Präsentation anzeigen
const showTeamPresentation = () => {
  const teamPresentation = document.getElementById("team-presentation");
  const teamNameElement = document.getElementById("team-name");
  const teamMembersElement = document.getElementById("team-members");

  const team = teams[currentTeamIndex];
  teamNameElement.textContent = team.name;

  // Zeige Mitglieder
  teamMembersElement.innerHTML = "";
  team.members.forEach((member) => {
    const memberElement = document.createElement("div");
    memberElement.textContent = member;
    memberElement.style.animation = "slideIn 1s ease-in-out";
    teamMembersElement.appendChild(memberElement);
  });

  teamPresentation.style.display = "flex";
};

// Nächstes Team anzeigen
const nextTeam = () => {
  currentTeamIndex++;
  if (currentTeamIndex < teams.length) {
    showTeamPresentation();
  } else {
    // Zur nächsten Phase wechseln
    document.getElementById("team-presentation").style.display = "none";
    document.getElementById("game-phase").style.display = "block";
    updateProgressBar(3, 4);
    updateTeamLives();
  }
};

// Nächsten Spieler und Team ermitteln
/* const getNextTeamAndPlayer = () => {
  const team = teams[currentTeamIndex];
  currentTeamIndex = (currentTeamIndex + 1) % teams.length; // Zyklischer Wechsel der Teams

  const player = getNextPlayerForTeam(team.name);

  return { teamName: team.name, player };
}; */
const getNextTeamAndPlayer = () => {
  // Sicherstellen, dass Teams existieren
  if (teams.length === 0) {
    console.error("Fehler: Es gibt keine Teams. Wurde das Spiel gestartet?");
    return { teamName: null, player: null };
  }

  // Sicherstellen, dass der Index gültig ist
  if (currentTeamIndex < 0 || currentTeamIndex >= teams.length) {
    console.error(
      "Fehler: currentTeamIndex ist außerhalb des gültigen Bereichs."
    );
    currentTeamIndex = 0; // Zurücksetzen auf einen gültigen Wert
  }

  // Team und Spieler ermitteln
  const team = teams[currentTeamIndex];
  currentTeamIndex = (currentTeamIndex + 1) % teams.length; // Zyklischer Wechsel der Teams

  const player = getNextPlayerForTeam(team.name);

  return { teamName: team.name, player };
};

// Nächsten Spieler im Team ermitteln
const getNextPlayerForTeam = (teamName) => {
  const team = teams.find((t) => t.name === teamName);
  if (!team) return null;

  const playerIndex = teamRotation[teamName];
  const player = team.members[playerIndex];

  teamRotation[teamName] = (playerIndex + 1) % team.members.length;

  return player;
};

// Spieler mit Animation anzeigen
const displayCurrentPlayerWithAnimation = (teamName, player) => {
  const playerDisplay = document.getElementById("current-player-display");

  if (!playerDisplay) {
    console.error(
      "Element 'current-player-display' existiert nicht. Bitte prüfe den HTML-Code."
    );
    return;
  }

  playerDisplay.innerHTML = `
    <div class="player-animation">
      <h2>${player}</h2>
      <p>aus dem Team ${teamName}</p>
    </div>
  `;

  const waitingGif = document.createElement("img");
  waitingGif.src = `https://media.giphy.com/media/3o7aD5tv1ogNBtDhDi/giphy.gif`;
  waitingGif.alt = "Waiting Animation";
  waitingGif.style.maxWidth = "200px";
  waitingGif.style.marginTop = "20px";

  playerDisplay.appendChild(waitingGif);
  playerDisplay.style.display = "block";
};

// Kategorie auswählen
const categories = ["Scherzkekse", "Tanzen", "Zeichnen", "Pantomime", "Singen"];

const selectCategory = () => {
  const { teamName, player } = getNextTeamAndPlayer();

  if (!teamName || !player) {
    alert("Es gibt keine Teams oder Spieler. Bitte starte das Spiel neu.");
    return;
  }

  displayCurrentPlayerWithAnimation(teamName, player);

  const randomIndex = Math.floor(Math.random() * categories.length);
  const selectedCategory = categories[randomIndex];

  document.getElementById(
    "category-display"
  ).textContent = `Kategorie: ${selectedCategory}`;

  fetchTask(selectedCategory);
  updateProgressBar(4, 4);
};

/*
const selectCategory = () => {
  const { teamName, player } = getNextTeamAndPlayer();

  displayCurrentPlayerWithAnimation(teamName, player);

  const randomIndex = Math.floor(Math.random() * categories.length);
  const selectedCategory = categories[randomIndex];

  document.getElementById(
    "category-display"
  ).textContent = `Kategorie: ${selectedCategory}`;

  fetchTask(selectedCategory);
  updateProgressBar(4, 4);
}; */

// Aufgabe abrufen
const fetchTask = (category) => {
  const task = `**Aufgabe für Kategorie ${category}**: Habt Spaß und lacht!`;
  document.getElementById("current-task").textContent = task;
  document.getElementById("category-section").style.display = "none";
  document.getElementById("task-section").style.display = "block";
};

// Lebensanzeige aktualisieren
function updateTeamLives() {
  const livesContainer = document.getElementById("team-lives");
  livesContainer.innerHTML = "";

  for (const [team, lives] of Object.entries(teamScores)) {
    const teamObject = teams.find((t) => t.name === team);
    if (!teamObject) {
      console.error(`Kein Team mit dem Namen ${team} gefunden.`);
      continue;
    }

    const teamDiv = document.createElement("div");
    teamDiv.style.marginBottom = "15px";
    teamDiv.style.padding = "10px";
    teamDiv.style.border = "1px solid #ddd";
    teamDiv.style.borderRadius = "8px";
    teamDiv.style.backgroundColor = "#f9f9f9";
    teamDiv.style.display = "flex";
    teamDiv.style.alignItems = "center";

    const decreaseLifeButton = document.createElement("button");
    decreaseLifeButton.textContent = "-";
    decreaseLifeButton.style.marginRight = "10px";
    decreaseLifeButton.addEventListener("click", () => {
      if (teamScores[team] > 0) {
        teamScores[team]--;
        checkGameStatus();
        updateTeamLives();
      }
    });

    const increaseLifeButton = document.createElement("button");
    increaseLifeButton.textContent = "+";
    increaseLifeButton.style.marginLeft = "10px";
    increaseLifeButton.addEventListener("click", () => {
      teamScores[team]++;
      updateTeamLives();
    });

    const teamName = document.createElement("h3");
    teamName.textContent = `${team}: ${"❤️".repeat(lives)}`;
    teamName.style.flexGrow = "1";
    teamName.style.textAlign = "center";

    const membersList = document.createElement("ul");
    teamObject.members.forEach((player) => {
      const memberItem = document.createElement("li");
      memberItem.textContent = player;
      membersList.appendChild(memberItem);
    });

    teamDiv.appendChild(decreaseLifeButton);
    teamDiv.appendChild(teamName);
    teamDiv.appendChild(increaseLifeButton);
    teamDiv.appendChild(membersList);
    livesContainer.appendChild(teamDiv);
  }
}

// Spielstatus prüfen
function checkGameStatus() {
  const activeTeams = Object.entries(teamScores).filter(
    ([team, lives]) => lives > 0
  );

  const statusContainer = document.getElementById("status-container");
  statusContainer.innerHTML = "";

  if (activeTeams.length === 0) {
    const message = document.createElement("p");
    message.textContent =
      "Alle Teams sind ausgeschieden! Niemand hat gewonnen.";
    statusContainer.appendChild(message);
    showWinnerOverlay("Keiner");
  } else if (activeTeams.length === 1) {
    const winningTeam = activeTeams[0][0];
    showWinnerOverlay(winningTeam);
  }
}

// Gewinner-Overlay anzeigen
function showWinnerOverlay(winningTeam) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  overlay.style.color = "white";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "1000";

  const message = document.createElement("h1");
  message.textContent =
    winningTeam === "Keiner"
      ? "Niemand hat gewonnen!"
      : `Das Team ${winningTeam} hat gewonnen! 🎉`;
  message.style.fontSize = "3rem";
  message.style.textAlign = "center";

  const resetButton = document.createElement("button");
  resetButton.textContent = "Spiel zurücksetzen";
  resetButton.style.marginTop = "20px";
  resetButton.style.padding = "15px 30px";
  resetButton.style.fontSize = "1.5rem";
  resetButton.style.borderRadius = "10px";
  resetButton.style.border = "none";
  resetButton.style.backgroundColor = "#28a745";
  resetButton.style.color = "white";
  resetButton.style.cursor = "pointer";
  resetButton.addEventListener("click", () => {
    document.body.removeChild(overlay);
    resetGame();
  });

  overlay.appendChild(message);
  overlay.appendChild(resetButton);
  document.body.appendChild(overlay);
}

// Spiel zurücksetzen
function resetGame() {
  players = [];
  teams = [];
  currentTeamIndex = 0;
  Object.keys(teamScores).forEach((team) => (teamScores[team] = 3));

  const playerList = document.getElementById("player-list");
  playerList.innerHTML = "";

  document.getElementById("player-setup").style.display = "block";
  document.getElementById("team-presentation").style.display = "none";
  document.getElementById("game-phase").style.display = "none";
  document.getElementById("task-section").style.display = "none";
  document.getElementById("category-section").style.display = "none";

  updateProgressBar(1, 4);
  updateTeamLives();
}

// Fortschrittsleiste aktualisieren
function updateProgressBar(phase, totalPhases) {
  const progressIndicator = document.getElementById("progress-indicator");
  progressIndicator.textContent =
    `Phase ${phase} von ${totalPhases}: ` +
    (phase === 1
      ? "Spieler hinzufügen"
      : phase === 2
      ? "Team-Präsentation"
      : phase === 3
      ? "Kategorie auswählen"
      : "Aufgabe");
}

// Event-Listener für Spieler hinzufügen
const addPlayerButton = document.getElementById("add-player");
if (addPlayerButton) {
  addPlayerButton.addEventListener("click", addPlayer);
}

document.getElementById("start-game").addEventListener("click", startGame);
document.getElementById("next-team-button").addEventListener("click", nextTeam);
document
  .getElementById("start-category-selection")
  .addEventListener("click", selectCategory);
