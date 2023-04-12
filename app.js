const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const gameSection = document.getElementById('game-section');
const gameContainer = document.getElementById('game-container');
const loginSection = document.getElementById('login-section');
let pathname = window.location.pathname;

if (pathname.includes("create_game.html")) {
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar que el formulario se envíe automáticamente

  const username = document.getElementById('username-input').value;
  const password = document.getElementById('password-input').value;

  // Crear objeto de datos
  const data = {
    username: username,
    password: password
  };
  // Enviar solicitud POST a la API
  try {
    const response = await fetch('https://trivia-bck.herokuapp.com/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      // El inicio de sesión fue exitoso
      const result = await response.json();
      // Hacer algo con la respuesta del servidor, por ejemplo, redirigir a una página de inicio
      console.log('Inicio de sesión exitoso:', result);
      console.log(result.refresh);
    } else {
      // Mostrar mensaje de error si la respuesta del servidor no es exitosa
      const error = await response.json();
      errorMessage.textContent = error.message;
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
});



// Agregar evento de click al botón de inicio de sesión
document.getElementById('login-button').addEventListener('click', function() {
  window.location.href = "join_game.html";
  /*
  // Ocultar sección de inicio de sesión
  loginSection.style.display = 'none';
  // Mostrar sección del juego
  gameSection.style.display = 'block';
  gameContainer.style.display= 'flex' ;
  */

});



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
}

2
//generamos las partidas ya existentes
function generatorGames(){;
  if (pathname.includes("join_game.html")) {
    let container = document.getElementById("container"); 
    let count=1;
    for(let i = 0; i<10; i++ ) { 
        let game = document.createElement("div");
        let br = document.createElement("br");
        let button = document.createElement("button");
  
        //asignamos las clases a lo creado
        game.classList = "game";
        game.textContent = "Sala: "+ count + " 🔹 (0/5) participantes";
        count++;
        game.appendChild(br);
        game.appendChild(br);
        button.textContent = "Unirse";
        button.classList = "bton";
        game.appendChild(button);
  
        //incluimos los juegos en el contenedor
        container.appendChild(game);
      
    };
}
}
generatorGames();