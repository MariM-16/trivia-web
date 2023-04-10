let currentPlayer = 1; // Jugador actual
let timer = 30; // Tiempo restante
let question = "¿Cuál es la capital de Francia?"; // Pregunta actual
let playerScores = [0, 0, 0, 0, 0]; // Puntajes de los jugadores
let strikes = [0, 0, 0, 0, 0]; // Faltas de los jugadores
let disqualifications = [0, 0, 0, 0, 0]; // Descalificaciones de los jugadores

// Función para responder a una pregunta
function answerQuestion(option) {
  // Verificar si la opción seleccionada es la respuesta correcta (por ejemplo, opción 1 es la respuesta correcta)
  if (option === '1') {
    playerScores[currentPlayer - 1] += 1; // Incrementar el puntaje del jugador actual
  } else {
    strikes[currentPlayer - 1] += 1; // Incrementar las faltas del jugador actual
  }

  // Cambiar al siguiente jugador
  currentPlayer = (currentPlayer % 5) + 1;
  
  // Actualizar la pregunta y el jugador actual en la vista
  document.getElementById('question').textContent = question;
  document.getElementById('current-player').textContent = 'Jugador ' + currentPlayer;
  document.getElementById('score-' + currentPlayer).textContent = playerScores[currentPlayer - 1];
  document.getElementById('strikes-' + currentPlayer).textContent = strikes[currentPlayer - 1];

  // Reiniciar el temporizador
  timer = 30;
  updateTimer();

  // Verificar si un jugador ha alcanzado 3 faltas, lo cual resulta en una descalificación
  if (strikes[currentPlayer - 1] === 3) {
    disqualifications[currentPlayer - 1] += 1; // Incrementar las descalificaciones del jugador actual
    document.getElementById('disqualifications-' + currentPlayer).textContent = disqualifications[currentPlayer - 1];
    currentPlayer = (currentPlayer % 5) + 1; // Cambiar al siguiente jugador
    document.getElementById('current-player').textContent = 'Jugador ' + currentPlayer;
    timer = 30;
    updateTimer();
  }
}

// Función para actualizar el temporizador en la vista
function updateTimer() {
  document.getElementById('timer').textContent = timer + ' segundos';
  if (timer > 0) {
    setTimeout(function() {
      timer--;
      updateTimer();
    }, 1000);
  }
}

// Iniciar el temporizador cuando se cargue la página
window.onload = function() {
  updateTimer();
}
