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
let span = document.getElementsByClassName("close")[0];
let respuestaE = 0;
let respuestaR = 0;
let cambiojugador = 1;
let descalificaciones = 0;
let rondas = 5;
let contadorRondas = 0;

let respuestas = ["chelo", "piano", "violin", "guitarra", "tambor"]; // Puntajes de los jugadores

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


      event.preventDefault(); // Evitar que la página se recargue
      modalCrearPartida.classList.remove("displayblock");
      let botones = document.querySelectorAll(".bton");
      botones.forEach(function(boton) {
        boton.addEventListener("click", function() {
          window.location.href = "start_game.html";
        });
      });
      let divHTML = game.innerHTML;
      localStorage.setItem("miDivGuardado", divHTML); //guardamos la sala creada en LocalStorage
      localStorage.setItem("tiempoPreguntaSelect", tiempoPreguntaSelect); //guardamos la sala creada en LocalStorage
      localStorage.setItem("tiempoRespuestaSelect", tiempoRespuestaSelect); //guardamos la sala creada en LocalStorage

      console.log(tiempoPreguntaSelect);
      console.log(tiempoRespuestaSelect);
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
    // Obtener la cadena del div guardado en localStorage
    let divGuardado = localStorage.getItem("miDivGuardado");

    // Verificar si se encontró un div guardado
    if (divGuardado !== null) {
      // Crear un elemento div para mostrar el div guardado
      let divMostrado = document.createElement("div");
      divMostrado.innerHTML = divGuardado;
      console.log();
      divMostrado.classList = "game";
      // Agregar el div mostrado al DOM
      container.appendChild(divMostrado);
    }


}

if (pathname.includes("start_game.html")) {
  document.getElementById('ronda').textContent = contadorRondas + "/" +rondas ;
  document.getElementById('btn-enviar-pregunta').disabled = true;
  let tiempoP = localStorage.getItem("tiempoPreguntaSelect");
  let tiempoA = localStorage.getItem("tiempoRespuestaSelect");
  let modal = document.getElementById("myModal");

  if (tiempoP !== null && tiempoA !== null) {
    tiempoPreguntaSelect = tiempoP;
    tiempoRespuestaSelect= tiempoA;
  }
  console.log(tiempoPreguntaSelect);
  console.log(tiempoRespuestaSelect);
  let currentPlayer = 1; // Jugador actual
  let timerPregunta = tiempoPreguntaSelect; // Tiempo restante pra hacer la pregunta
  let timerRespuesta = tiempoRespuestaSelect; // Tiempo restante para hacer la respuesta


  let playerScores = [0, 0, 0, 0, 0]; // Puntajes de los jugadores
  let strikes = [0, 0, 0, 0, 0]; // Faltas de los jugadores
  let disqualifications = [0, 0, 0, 0, 0]; // Descalificaciones de los jugadores

  // Función para responder a una pregunta
  /*
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
*/

  // Función para actualizar el temporizador en la vista
  let timerId;
  function updateTimer(tipoTimer) {
    document.getElementById('timer').textContent = tipoTimer + ' s';
      if (tipoTimer > 0) {
        // Limpiar el timeout anterior si existe
        if (timerId) {
          clearTimeout(timerId);
        }
        // Iniciar un nuevo timeout
        timerId = setTimeout(function() {
          tipoTimer--;
          if (respuestaE==1){
            timerRespuesta = tipoTimer;
          }
          updateTimer(tipoTimer);
        }, 1000);
      }
    
    if(tipoTimer==0 && respuestaE==0 ){
      //abrir un modal
      showFalta();
      let currentP = "strikes-"+cambiojugador;
      let currentS = "state-"+cambiojugador;

      let faltas1=document.getElementById(currentP);
      if(faltas1==3){
        descalificaciones++;
        let disq = "disqualifications-"+cambiojugador;
        document.getElementById(disq).textContent = "SI";
        document.getElementById(descalificaciones-totales).textContent = descalificaciones;
      }
      else{
        let faltas2= parseInt(faltas1.textContent) + 1;

        document.getElementById(currentP).textContent = faltas2;
        document.getElementById(currentS).textContent = "Jugador";
      }

      cambiojugador++;
      let currentSiguiente = "state-"+cambiojugador;
      document.getElementById(currentSiguiente).textContent = "Pregunton";
      document.getElementById('current-player').textContent = "jugador"+ cambiojugador+1;
    

    }

    if(tipoTimer==0 && respuestaR==0 ){
      //abrir un modal
      showFalta();
      let currentP = "strikes-"+cambiojugador;
   

      let faltas1=document.getElementById(currentP);
      if(faltas1==3){
        descalificaciones++;
        let disq = "disqualifications-"+cambiojugador;
        document.getElementById(disq).textContent = "SI";
        document.getElementById(descalificaciones-totales).textContent = descalificaciones;
      }
      else{
        let faltas2= parseInt(faltas1.textContent) + 1;

        document.getElementById(currentP).textContent = faltas2;
      }
    }
  }
  // Reiniciar el timer con un nuevo valor
  function reiniciarTimer(nuevoValor) {
    // Limpiar el timeout anterior si existe
    if (timerId) {
      clearTimeout(timerId);
    }
    // Iniciar un nuevo timeout con el nuevo valor
    updateTimer(nuevoValor);
  }

  // Iniciar el temporizador cuando se haga click en empezar
  document.getElementById('btn-empezar').addEventListener('click', function() {
    updateTimer(timerPregunta);
    document.getElementById('btn-empezar').disabled = true;
    document.getElementById('btn-enviar-pregunta').disabled = false;
    contadorRondas++;
    document.getElementById('ronda').textContent = contadorRondas + "/" +rondas ;
  });

  let answerContainer = document.getElementById('answer-area');
  //vemos la pregunta que se envio 
  document.getElementById('btn-enviar-pregunta').addEventListener('click', function() {
    respuestaE++;
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
    reiniciarTimer(timerRespuesta);
  });

  let respuestasContainer = document.getElementById('respuestas-area');
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
    respuestaR++;
    respuestasContainer.classList.remove("btn-hidden");
    respuestasContainer.classList.add("displayblock");
    reiniciarTimer(timerRespuesta+90);
    setTimeout(showRespuestas(), 10000);
  });
  function showFalta(){
    modal.classList.toggle("modalBlock");
    span.onclick = function() {
        modal.classList.toggle("modalBlock");
        if(respuestaE==0){
          timerPregunta=tiempoPreguntaSelect;
          updateTimer(timerPregunta);
        }
    }
    
}
function showRespuestas(){
  let containerRespuestas = document.getElementById("containerRespuestas");
  for(let i = 0; i<5; i++){
    let respuesta = document.createElement("div");
    let selector = document.createElement('select');
    const opciones = [
      { valor: 'buena', texto: 'Buena' },
      { valor: 'mas_o_menos', texto: 'Mas o menos' },
      { valor: 'mala', texto: 'Mala' }
    ];
    
    // Llenar el selector con las opciones
    opciones.forEach(opcion => {
      const optionElement = document.createElement('option');
      optionElement.value = opcion.valor;
      optionElement.textContent = opcion.texto;
      selector.appendChild(optionElement);
    });
    console.log(selector);
    
    respuesta.classList = "respuestas";
    respuesta.textContent = respuestas[i];
    respuesta.appendChild(selector);
    //incluimos las respuestas en el contenedor
    containerRespuestas.appendChild(respuesta);

    }
}
document.getElementById('btn-enviar-calificaciones').addEventListener('click', function() {
  document.getElementById('btn-enviar-calificaciones').classList.toggle("btn-hidden");
  reiniciarTimer(30);
});
}