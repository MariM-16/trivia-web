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
let tokenAccess;
let tokenRefresh;

let respuestas = ["chelo", "piano", "violin", "guitarra", "tambor"]; // Puntajes de los jugadores

if (pathname.includes("create_game.html")) {
  const errorContainer = document.getElementById('errorContainer');
  errorContainer.classList.add("modalNone");

  document.getElementById('login-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevenir la acción por defecto del formulario

    // Obtener los valores de usuario y contraseña del formulario
    var username = document.getElementById('username-input').value;
    var password = document.getElementById('password-input').value;

    // Datos del cuerpo de la solicitud en formato JSON
    var data = {
        username: username,
        password: password
    };

    // Configurar opciones de la solicitud
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    // Realizar la solicitud POST para el login
    fetch('https://trivia-bck.herokuapp.com/api/token/', options)
    .then(function(response) {
        if (response.ok) {
            console.log(response);
            return response.json();
            
        } else {
            // Manejar errores de respuesta
            errorContainer.classList.remove("modalNone");
            errorContainer.textContent = 'Error en la solicitud: ' + response.status + ' Intentelo de nuevo';
            throw new Error('Error en la solicitud: ' + response.status + ' Intentelo de nuevo');
        }
    })
    .then(function(data) {
        tokenAccess = data.access;
        tokenRefresh = data.refresh;
        console.log(data.access);
        console.log(data.refresh);
        localStorage.setItem('tokenAccess', tokenAccess);
        localStorage.setItem('tokenRefresh', tokenRefresh);
        setCookie('token_access', data.access, 4);
        setCookie('token_refresh', data.refresh, 24);

        const expires_in = 300000; // 5 minutos en milisegundos
        setTimeout(refreshToken, expires_in - 60000); // Renovar token_access 1 minuto antes de que expire       

        window.location.href = 'join_game.html';
    })
    .catch(function(error) {
        // Manejar errores de la solicitud
        console.log(error);
        errorContainer.textContent = ' ' + error.message;
    });
});
}

function getCookie(name) {
  const cookieValue = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)');
  return cookieValue ? cookieValue.pop() : '';
}
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}


function refreshToken() {
  const tokenRefresh = getCookie('token_refresh');
  if (tokenRefresh) {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: tokenRefresh })
    };
    fetch('https://trivia-bck.herokuapp.com/api/token/refresh', options)
      .then(response => {
        if (response.ok) {
          response.json().then(data => {
            setCookie('token_access', data.access, 4);
            setCookie('token_refresh', data.refresh, 24);
          });
        } else {
          console.error('Error refreshing token');
        }
      })
      .catch(error => console.error('Error refreshing token:', error));
  } else {
    console.error('Refresh token not found');
  }
}

function checkSession() {
  // Obtener el token de acceso de las cookies
  const tokenAccess = getCookie('token_access');

  if (tokenAccess) {
    // Decodificar el token de acceso para obtener la fecha de expiración
    //const { exp } = jwt_decode(tokenAccess);
    console.log(tokenAccess);
    // Comprobar si el token de acceso ha expirado
    if (Date.now() >= exp * 1000) {
      // Obtener el token de actualización de las cookies
      const tokenRefresh = getCookie('token_refresh');

      if (tokenRefresh) {
        // Utilizar el token de actualización para obtener uno nuevo
        fetch('https://trivia-bck.herokuapp.com/api/token/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refresh: tokenRefresh
          })
        })
        .then(response => response.json())
        .then(data => {
          // Almacenar el nuevo token de acceso en cookies
          setCookie('token_access', data.access, 4);
        })
        .catch(error => console.error(error));
      } else {
        console.error('No hay token de actualización en las cookies');
      }
    }
  } else {
    console.error('No hay token de acceso en las cookies');
  }
}


if (pathname.includes("join_game.html")) {
  const errorContainer = document.getElementById('errorContainer');
  errorContainer.classList.add("modalNone");
  
  tokenAccess = localStorage.getItem('tokenAccess');
  tokenRefresh = localStorage.getItem('tokenRefresh');
  fetch('https://trivia-bck.herokuapp.com/api/games/', {
    headers: {
      'Authorization': `Bearer ${tokenAccess}`
    }
  })
    .then(response => {
      if (response.status === 401) { 
        return fetch('https://trivia-bck.herokuapp.com/api/token/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refresh: tokenRefresh }) 
        })

        .then(function(response) {
          if (response.ok) {
              return response.json();          
          } 
        })
        .then(function(data) {
          console.log(data);
            tokenAccess = data.access;
            localStorage.setItem('tokenAccess', tokenAccess);
            tokenAccess = localStorage.getItem('tokenAccess');
            fetch('https://trivia-bck.herokuapp.com/api/games/', {
              headers: {
                'Authorization': `Bearer ${tokenAccess}`
              }
            })
            .then(function(response) {
              if (response.ok) {
                  return response.json();          
              } 
            })
            .then(data => {
              console.log(data); 
            })
        })
      } else {
        return response.json();
      }
    })
    .then(data => {
      console.log(data);
      let gamesJSON = JSON.stringify(data);
      localStorage.setItem('data', gamesJSON);
    })
    .catch(error => console.error(error));

    generatorGames();
    checkSession();
    let btnCrearPartida = document.getElementById('crear');
    let modalCrearPartida = document.getElementById('modalCrearPartida');
    let closeBtn = document.getElementsByClassName('close')[0];
    let crearBtn = document.getElementById("btn-crear");


    btnCrearPartida.addEventListener("click", function() {
      modalCrearPartida.classList.remove("modalNone");
      modalCrearPartida.classList.add("modal");
      console.log("asdksakosdko");
  });

    closeBtn.addEventListener("click", function() {
      modalCrearPartida.classList.remove("modal");
      modalCrearPartida.classList.add("modalNone");
    });

    window.onclick = function(event) {
      if (event.target == modalCrearPartida) {
        modalCrearPartida.classList.remove("modal");
        modalCrearPartida.classList.add("modalNone");
      }
    }

    crearBtn.addEventListener("click", function() {
    
      nombreInput = document.getElementById("nombre").value;
      tiempoPreguntaSelect = document.getElementById("tiempoPregunta").value;
      tiempoRespuestaSelect = document.getElementById("tiempoRespuesta").value;
          // Datos del cuerpo de la solicitud en formato JSON
      var data = {
        name: nombreInput,
        question_time: tiempoPreguntaSelect,
        answer_time: tiempoRespuestaSelect
      };

      fetch('https://trivia-bck.herokuapp.com/api/games/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenAccess}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          if (response.status === 401) { 
            return fetch('https://trivia-bck.herokuapp.com/api/token/refresh/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ refresh: tokenRefresh }) 
            })
    
            .then(function(response) {
              if (response.ok) {
                  return response.json();          
              } 
              else{
                // Manejar errores de respuesta
                errorContainer.classList.remove("modalNone");
                errorContainer.textContent = 'Error en la solicitud: ' + response.status + ' Intentelo de nuevo';
                throw new Error('Error en la solicitud: ' + response.status + ' Intentelo de nuevo');
              }
            })
            .then(function(data) {
              console.log(data);
                tokenAccess = data.access;
                localStorage.setItem('tokenAccess', tokenAccess);
                tokenAccess = localStorage.getItem('tokenAccess');
                fetch('https://trivia-bck.herokuapp.com/api/games/', {
                  headers: {
                    'Authorization': `Bearer ${tokenAccess}`
                  }
                })
                .then(function(response) {
                  if (response.ok) {
                      return response.json();          
                  } 
                })
                .then(data => {
                  console.log(data); 
                })
            })
          } else {
            return response.json();
            
          }
        })
        .catch(function(error) {

          errorContainer.classList.remove("modalNone");
          errorContainer.textContent = 'Error en la solicitud: ' + response.status + ' Intentelo de nuevo';
          throw new Error('Error en la solicitud: ' + response.status + ' Intentelo de nuevo');
        
      });
        location.reload();
    });
}

//generamos las partidas ya existentes
function generatorGames(){;
    let data = localStorage.getItem('data');
    let container = document.getElementById("container"); 
    let juegos;
    try {
       juegos = JSON.parse(data);
    } catch (error) {
      location.reload();
    }
    
    let count=1;
    // Obtener los juegos disponibles
fetch('https://trivia-bck.herokuapp.com/api/games/', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getCookie('token_access')}`
  }
  })
.then(response => response.json())
.then(games => {
  // Obtener el contenedor donde se mostrarán los juegos
  let container = document.getElementById("container"); 
  
  // Iterar sobre cada juego y crear un elemento HTML para mostrarlo
  games.forEach(game => {
    let gameDiv = document.createElement("div");
    let nameH3 = document.createElement("h4");
    let questionTimeH3 = document.createElement("h3");
    let answerTimeH3 = document.createElement("h3");
    let joinButton = document.createElement("button");
    
    nameH3.textContent = "Sala: "+ game.name + " 🔹 players: " +  game.player_count;
    questionTimeH3.textContent = "Tiempo pregunta: " + game.question_time + "s";
    answerTimeH3.textContent = "Tiempo respuesta: " + game.answer_time + "s";
    joinButton.textContent = "Unirse";
    joinButton.classList = "bton";
    joinButton.addEventListener("click", () => joinGame(game.id));

    gameDiv.classList = "game";
    gameDiv.appendChild(nameH3);
    gameDiv.appendChild(questionTimeH3);
    gameDiv.appendChild(answerTimeH3);
    gameDiv.appendChild(joinButton);

    // Agregar el elemento HTML al contenedor
    container.appendChild(gameDiv);
  });
})
.catch(error => console.error(error));

// Función para unirse a un juego
function joinGame(gameId) {
fetch(`https://trivia-bck.herokuapp.com/api/games/${gameId}/join_game/`, { method: "POST" })
  .then(response => {
    if (!response.ok) {
      throw new Error("No se pudo unir al juego");
    }
    // Redirigir al usuario al juego
    window.location.href = `https://trivia-frontend.netlify.app/game.html?id=${gameId}`;
  })
  .catch(error => console.error(error));
}
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
      //showFalta();
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
      //showFalta();
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