const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const gameSection = document.getElementById('game-section');
const gameContainer = document.getElementById('game-container');
const loginSection = document.getElementById('login-section');
let pathname = window.location.pathname;
let preguntaEnviada;
let respuestaEnviada;
let tiempoPreguntaSelect;
let tiempoRespuestaSelect;
let nombreInput;

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
}


if (pathname.includes("join_game.html")) {
    generatorGames();
    let btnCrearPartida = document.getElementById('crear');
    let modalCrearPartida = document.getElementById('modalCrearPartida');
    let closeBtn = document.getElementsByClassName('close')[0];
    let crearBtn = document.getElementById("btn-crear");

    btnCrearPartida.onclick = function() {
      modalCrearPartida.classList.toggle("displayblock");
    }

    closeBtn.onclick = function() {
      modalCrearPartida.classList.remove("displayblock");
    }

    window.onclick = function(event) {
      if (event.target == modalCrearPartida) {
        modalCrearPartida.classList.toggle("displayblock");
      }
    }

    crearBtn.addEventListener("click", function() {
      nombreInput = document.getElementById("nombre").value;
      tiempoPreguntaSelect = document.getElementById("tiempoPregunta").value;
      tiempoRespuestaSelect = document.getElementById("tiempoRespuesta").value;

      //agregamos la partida en los juegos disponibles
      let game = document.createElement("div");
      let button = document.createElement("button");
      let tiempo1= document.createElement("h3");
      let tiempo2= document.createElement("h3");

      //asignamos las clases a lo creado
      tiempo1.textContent = "Tiempo preguntas: " + tiempoPreguntaSelect + "s";
      tiempo2.textContent = "Tiempo respuestas: " + tiempoRespuestaSelect + "s";
      game.classList = "game";
      game.textContent = nombreInput + "🔹 (0/13) participantes";
      game.appendChild(tiempo1);
      game.appendChild(tiempo2);
      button.textContent = "Unirse";
      button.classList = "bton";
      game.appendChild(button);

      //incluimos los juegos en el contenedor
      container.appendChild(game);

      console.log("Evento de clic agregado");
      event.preventDefault(); // Evitar que la página se recargue
      modalCrearPartida.classList.remove("displayblock");
      let botones = document.querySelectorAll(".bton");
      botones.forEach(function(boton) {
        boton.addEventListener("click", function() {
          window.location.href = "start_game.html";
        });
      });
    });

    let botones = document.querySelectorAll(".bton");
    botones.forEach(function(boton) {
      boton.addEventListener("click", function() {
        window.location.href = "start_game.html";
      });
    });
}

//generamos las partidas ya existentes
function generatorGames(){;
    let container = document.getElementById("container"); 
    
    let count=1;
    for(let i = 0; i<10; i++ ) { 
        let game = document.createElement("div");
        let button = document.createElement("button");
        let tiempo1= document.createElement("h3");
        let tiempo2= document.createElement("h3");

        tiempo1.textContent = "Tiempo preguntas: " + 60 + "s";
        tiempo2.textContent = "Tiempo respuestas: " + 60 + "s";
  
        //asignamos las clases a lo creado
        game.classList = "game";
        game.textContent = "Sala: "+ count + " 🔹 (0/13) participantes";
        count++;
        game.appendChild(tiempo1);
        game.appendChild(tiempo2);
        button.textContent = "Unirse";
        button.classList = "bton";
        game.appendChild(button);
  
        //incluimos los juegos en el contenedor
        container.appendChild(game);
      
    };

}

if (pathname.includes("start_game.html")) {
  let currentPlayer = 1; // Jugador actual
  let timer = tiempoPreguntaSelect; // Tiempo restante
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

  let answerContainer = document.getElementById('answer-area');
  //vemos la pregunta que se envio 
  document.getElementById('btn-enviar-pregunta').addEventListener('click', function() {
    let questionInput = document.getElementById("question"); // Obtén el elemento input por su ID
    let questionValue = questionInput.value; // Accede al valor del input
    preguntaEnviada = questionValue;
    document.getElementById('btn-enviar-pregunta').classList.toggle("btn-hidden");
    
    let questionContainer = document.getElementById('question-container');

    questionContainer.removeChild(questionInput);

    let text = document.createElement("div");
    text.classList.add("text-game-section");
    text.textContent = preguntaEnviada;
    questionContainer.appendChild(text);

    
    answerContainer.classList.remove("btn-hidden");
    answerContainer.classList.add("displayblock");
    console.log(answerContainer);
    
  });

  document.getElementById('btn-enviar-respuesta').addEventListener('click', function() {
    let answerInput = document.getElementById("answer-input"); // Obtén el elemento input por su ID
    let answerValue = answerInput.value; // Accede al valor del input
    respuestaEnviada = answerValue;
    document.getElementById('btn-enviar-respuesta').classList.toggle("btn-hidden");
    
    answerContainer.removeChild(answerInput);

    let textAnswer = document.createElement("div");
    textAnswer.classList.add("text-game-section");
    textAnswer.textContent = respuestaEnviada;
    answerContainer.appendChild(textAnswer);
    
  });
}