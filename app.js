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
let contadorRondas = 0;
let tokenAccess;
let tokenRefresh;
let nosy="";
let etapa="";
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
        localStorage.setItem('tokenAccess', tokenAccess);
        localStorage.setItem('tokenRefresh', tokenRefresh);
        setCookie('token_access', data.access, 4);
        setCookie('token_refresh', data.refresh, 24);

        const expires_in = 300000; // 5 minutos en milisegundos
        fetch('https://trivia-bck.herokuapp.com/api/profile/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenAccess}`
          }
          })
        .then(response => response.json())
        .then(data => {
          setCookie('playerid', data.id);
          console.log("user"+ data.username );
          setCookie('playerusername', data.username);
          window.location.href = 'join_game.html';
        })
        
        
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

if (pathname.includes("join_game.html")) {
  playerusername=getCookie('playerusername');
  document.getElementById('act').addEventListener('click',act);

  const errorContainer = document.getElementById('errorContainer');
  errorContainer.classList.add("modalNone");
  token=getCookie('token_access');
  tokenr=getCookie('token_refresh');
  localStorage.setItem('tokenAccess', token);
  localStorage.setItem('tokenRefresh', tokenr);
  tokenAccess = localStorage.getItem('tokenAccess');
  tokenRefresh = localStorage.getItem('tokenRefresh');
  fetch('https://trivia-bck.herokuapp.com/api/games/', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      if (response.status === 401) { 
        return fetch('https://trivia-bck.herokuapp.com/api/token/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          //body: JSON.stringify({ refresh: tokenRefresh }) 
          body: JSON.stringify({ refresh: tokenr }) 

        })

        .then(function(response) {
          if (response.ok) {
              return response.json();          
          } 
        })
        .then(function(data) {
            tokenAccess = data.access;
            localStorage.setItem('tokenAccess', tokenAccess);
            //setCookie('token_access', data.access, 4);
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
    document.getElementById('btn-crear').addEventListener('click',newGame);

    crearBtn.addEventListener("click", function() {
    document.getElementById('btn-crear').addEventListener('click',newGame);
/* Cambié esto hacia la funcion newGame
      nombreInput = document.getElementById("nombre").value;
      tiempoPreguntaSelect = document.getElementById("tiempoPregunta").value;
      tiempoRespuestaSelect = document.getElementById("tiempoRespuesta").value;
          // Datos del cuerpo de la solicitud en formato JSON
 
      let JSON_OBJECT = {'name': nombreInput, 'question_time': tiempoPreguntaSelect, 'answer_time': tiempoRespuestaSelect};
      localStorage.setItem('players','');
      token=getCookie('token_access');
      tokenr=getCookie('token_refresh');

      fetch('https://trivia-bck.herokuapp.com/api/games/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify((JSON_OBJECT))
      })
        .then(response => {
          console.log(response);
          console.log(response.data);
          if (response.status === 401) { 
            return fetch('https://trivia-bck.herokuapp.com/api/token/refresh/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              //body: JSON.stringify({ refresh: tokenRefresh }) 
              body: JSON.stringify({ refresh: tokenr }) 

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
                tokenAccess = data.access;
                localStorage.setItem('tokenAccess', tokenAccess);
                //setCookie('token_access', data.access, 4);
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
        //location.reload();
         */
    });
   
    let botones = document.querySelectorAll('.bton');


    botones.forEach(boton => {
      boton.addEventListener('click', event => {

        const botonClicado = event.target;
        let id_juego = botonClicado.id;
        token=getCookie('token_access');
        tokenr=getCookie('token_refresh');
        localStorage.setItem('id_juego', id_juego);
      });
      
    });
}

/*prueba de crear juego*/
function newGame(){
  const xhttp = new XMLHttpRequest();

  token=getCookie('token_access');
  tokenr=getCookie('token_refresh');
  nombreInput = document.getElementById("nombre").value;
  tiempoPreguntaSelect = document.getElementById("tiempoPregunta").value;
  tiempoRespuestaSelect = document.getElementById("tiempoRespuesta").value;
      // Datos del cuerpo de la solicitud en formato JSON
  let JSON_OBJECT = {'name': nombreInput, 'question_time': tiempoPreguntaSelect, 'answer_time': tiempoRespuestaSelect};
  console.log(JSON_OBJECT);
  xhttp.open("POST", "https://trivia-bck.herokuapp.com/api/games/");
  xhttp.setRequestHeader("Authorization","Bearer " + token)
  xhttp.setRequestHeader("Content-Type","application/json")
  xhttp.send(JSON.stringify(JSON_OBJECT));
  /*fetch('https://trivia-bck.herokuapp.com/api/token/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          //body: JSON.stringify({ refresh: tokenRefresh }) 
          body: JSON.stringify({ refresh: tokenr }) 

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
            tokenAccess = data.access;
            localStorage.setItem('tokenAccess', tokenAccess);
            //setCookie('token_access', data.access, 4);
            tokenAccess = localStorage.getItem('tokenAccess');})

      fetch('https://trivia-bck.herokuapp.com/api/games/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenAccess}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify((JSON_OBJECT))
      })
      .then(function(response) {
        if (response.ok) {
            console.log(response);
            return response.json();          
        } 
        else{
          // Manejar errores de respuesta
          errorContainer.classList.remove("modalNone");
          errorContainer.textContent = 'Error en la solicitud: ' + response.status + ' Intentelo de nuevo';
          throw new Error('Error en la solicitud: ' + response.status + ' Intentelo de nuevo');
        }
      })*/
}
/*fin aqui*/

//generamos las partidas ya existentes
function generatorGames(){
    let data = localStorage.getItem('data');
    let container = document.getElementById("container"); 
    
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
    let tool= document.createElement("span");
    let questionTimeH3 = document.createElement("h3");
    let answerTimeH3 = document.createElement("h3");
    let joinButton = document.createElement("button");
    
    nameH3.textContent = "Sala: "+ game.name + " 🔹 players: " +  game.player_count;
    tool.textContent = "Creador: "+ game.creator.username + "Participantes: " + game.players.username;
    questionTimeH3.textContent = "Tiempo pregunta: " + game.question_time+ "s";
    answerTimeH3.textContent = "Tiempo respuesta: " + game.answer_time+ "s";
    joinButton.textContent = "Unirse";
    joinButton.classList = "bton";
    joinButton.id=game.id;
    joinButton.creator=game.creator.id;
    joinButton.question=game.question_time;
    joinButton.answer=game.answer_time;
    joinButton.players=game.players;
    //joinButton.addEventListener("click", () => joinGame(game));
    
    gameDiv.classList = "game";
    gameDiv.appendChild(nameH3);
    gameDiv.appendChild(questionTimeH3);
    gameDiv.appendChild(answerTimeH3);
    gameDiv.appendChild(joinButton);

    // Agregar el elemento HTML al contenedor
    container.appendChild(gameDiv);
  });
  let botones = document.querySelectorAll('.bton');


    botones.forEach(boton => {
      boton.addEventListener('click', event => {

        const botonClicado = event.target;
        let id_juego = botonClicado.id;
        console.log(JSON.stringify(botonClicado));
        
        token=getCookie('token_access');
        tokenr=getCookie('token_refresh');
        localStorage.setItem('id_juego', id_juego);
        setCookie("game_id",id_juego);
        setCookie("creator", botonClicado.creator);
        
        playerslist=JSON.stringify(botonClicado.players);
        setCookie("playerslist", playerslist);
        setCookie('tiempoPreguntaSelect',botonClicado.question);
        setCookie("tiempoRespuestaSelect",botonClicado.answer);

        let link = `https://trivia-bck.herokuapp.com/api/games/${id_juego}/join_game/`;
        console.log(link);

        fetch(link, {
          method: 'POST',
          headers: {
            //'Authorization': `Bearer ${tokenAccess}`,
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            if (response.status === 401) { 
              return fetch('https://trivia-bck.herokuapp.com/api/token/refresh/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                //body: JSON.stringify({ refresh: tokenRefresh }) 
                body: JSON.stringify({ refresh: tokenr }) 

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
                  tokenAccess = data.access;
                  localStorage.setItem('tokenAccess', tokenAccess);
                  
                  token=getCookie('token_access');
                  tokenr=getCookie('token_refresh');
                  tokena = localStorage.getItem('tokenAcces');
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
          .then(function(data) {
            console.log(data);
            tokenAccess = data.access;
            localStorage.setItem('tokenAccess', tokenAccess);            
            token=getCookie('token_access');
            tokenr=getCookie('token_refresh');
            tokena = localStorage.getItem('tokenAcces');
            tokenAccess = localStorage.getItem('tokenAccess');
            window.location.href = 'start_game.html';
          })
      });
      
    });
})
.catch(error => console.error(error));
}

if (pathname.includes("start_game.html")) {
  token=getCookie('token_access');
  localStorage.setItem('tokenAccess',token)
  tokenr=getCookie('token_refresh');
  gameId=getCookie("game_id");
  creator=getCookie("creator");
  playerslist=getCookie("playerslist");
  console.log("gameid: "+gameId);
  let players_data = {};
  let players = [];
  let faults = 0;
  let time;
  question_time=getCookie('tiempoPreguntaSelect');
  answer_time= getCookie("tiempoRespuestaSelect");
  
  
  
  localStorage.setItem('tiempoPreguntaSelect',question_time);
  localStorage.setItem("tiempoRespuestaSelect",answer_time);
  
  if (getCookie("playerid") === creator) {
    document.getElementById("mod-start-rondas").classList.remove("hidden");
    //document.getElementById("status-container").classList.add("hidden");
  }
  else {
    document.getElementById("esperar").classList.remove('hidden');
  }
  if ( playerslist != '') {
    JSON.parse(playerslist).forEach(element => {
      document.getElementById('players').innerHTML += "<li>"+ element.id +" "+ element.username +"</li>";
      players.push(element.username);
    })
  }
  let socket = new WebSocket("wss://trivia-bck.herokuapp.com/ws/trivia/" + gameId + "/?token=" + token);
  socket.onopen = function(e) {
    console.log("Conexion establecida");
    console.log("Datos recibidos del servidor: " + JSON.stringify(e));
  };
  
  socket.onmessage = function(event) {
    
    console.log("Datos recibidos del servidor: " + event.data);
    data = JSON.parse(event.data)
    switch (data.type) {
    case "error":
      console.log("error");
      //document.getElementById('error').innerHTML = data.message;
      alert( data.message);
      document.getElementById('mod-start-rondas').classList.remove('hidden');
      //document.getElementById("status-container").classList.add("hidden");
      break;
    case "player_joined":
      console.log("Nuevo jugador " + data.username + data.id); 
      alert("Nuevo jugador " + data.username);
      if (!players.includes(data.username)){
        players.push(data.username);
        document.getElementById('players').innerHTML += "<li class='players'>"+ data.id + " " + data.username +"</li>"; 
      }      
      break;
    case "player_unjoined":
      console.log("Jugador desconectado " + data.username + data.id);
      players_data[data.userid].status = "Disconnected"
      alert("Jugador desconectado " + data.username);
      players.splice(players.indexOf(data.username),1);
      document.getElementById('players').innerHTML = "";
      players.forEach(element => {
        document.getElementById('players').innerHTML += "<li>"+ element +"</li>"; 
      })
      document.getElementById('players').innerHTML = '';
      Object.keys(players_data).forEach(element => {
        document.getElementById('players').innerHTML += '<li class="user_info">' +
        '<div>'+ players_data[element.userid]+ " " +players_data[element].username + '</div>' +
        '<div> P: '+ players_data[element].points + '</div>' +
        '<div> S: '+ players_data[element].status + '</div>' +
        '</li>'
      })
      break;
    case "game_started":
      document.getElementById("esperar").classList.add('hidden');
      document.getElementById("mod-start-rondas").classList.add('hidden');
      console.log("INICIÓ EL JUEGO ");
      if (data.nosy_id === parseInt(getCookie('playerid'))){
        preg();
        document.getElementById('nosy-player').innerHTML = data.nosy_id;
        localStorage.setItem("nosy","True");
      }
      else{
        play();
        document.getElementById('nosy-player').innerHTML = data.nosy_id;
        localStorage.setItem("nosy","True");
      }
      //updateTimer(timerPregunta);
      document.getElementById('btn-empezar').disabled = true;
      document.getElementById('btn-enviar-pregunta').disabled = false;
      contadorRondas++;
      rounds_number=getCookie("rondas");
      document.getElementById('ronda').textContent = contadorRondas + "/" +rounds_number ;
      let link = `https://trivia-bck.herokuapp.com/api/games/${gameId}/state/`;

  fetch(link, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tokenAccess}`,
      'Content-Type': 'application/json'
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
          else{
            // Manejar errores de respuesta
            //errorContainer.classList.remove("modalNone");
            //errorContainer.textContent = 'Error en la solicitud: ' + response.status + ' Intentelo de nuevo';
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
    .then(function(data) {
      console.log(data);
    })
      data.players.forEach(element =>{
        players_data[element.userid] = {"username": element.username,"points":0,"status":"OK"};
      })
      console.log(JSON.stringify(data.players) + "ESTE ES");
      console.log(players_data);
      document.getElementById('players').innerHTML = '';
      Object.keys(players_data).forEach(element => {
        document.getElementById('players').innerHTML += '<li class="user_info">' +
        '<div>'+ players_data[element.userid] + " " +players_data[element].username + '</div>' +
        '<div> P: '+ players_data[element].points + '</div>' +
        '<div> S: '+ players_data[element].status + '</div>' +
        '</li>'
      })
      break;
    case "round_started":
      etapa="Pregunton preg";
      document.getElementById('etapa').innerHTML = etapa;
      localStorage.setItem("rondaact",data.round_number);
      contadorRondas=localStorage.getItem("rondaact");
      document.getElementById('ronda').textContent = contadorRondas + "/" +rounds_number ;
      Object.keys(players_data).forEach(element => {
        if (data.nosy_id === players_data[element].id){
          nosy=players_data[element].username;
        }
      })
      console.log("INICIÓ LA RONDA, preguntón "+ data.nosy_id + " " +nosy);
      if (data.nosy_id === parseInt(getCookie('playerid'))){
        preg();
        document.getElementById('nosy-player').innerHTML = data.nosy_id;
        localStorage.setItem("nosy","True");
      }
      else {
        document.getElementById('nosy-player').innerHTML = data.nosy_id ;
        play();
        document.getElementById("answer-nosy-text").innerHTML = "Respuesta del preguntón";
        localStorage.setItem("nosy","False");
      }
      time = parseInt(localStorage.getItem("tiempoPreguntaSelect"));

      break;
    case "round_question":
      etapa="Players resp";
      document.getElementById('etapa').innerHTML = etapa;
      console.log("INICIÓ LA RONDA respuesta");
      if(localStorage.getItem("nosy") === "False") {
        play();
        document.getElementById("question2").innerHTML = data.question;
      }
      else {
        preg();
        
      }
      time = parseInt(localStorage.getItem("tiempoRespuestaSelect"));

      break;
    case "round_answer":
      etapa="Pregunton ev";
      document.getElementById('etapa').innerHTML = etapa;
      console.log("INICIÓ LA RONDA respuestas, preguntón "+ data.nosy_id + data.username);
      data.userid;
      //showRespuestas();
      document.getElementById("evaluateAnswers").innerHTML += '<div>'+
        '<label class="view-labels">'+ data.answer +'</label>'+
        '<div><select class="userQualify">'+
        '<option value=' + 0 + ',' + data.userid + '>Mala</option>'+
        '<option value=' + 1 + ',' + data.userid + '>Mas o Menos</option>'+
        '<option value=' + 2 + ',' + data.userid + '>Buena</option>'+
        '</select></div>'+
        '</div>'
      break;
    case "answer_time_ended":
      console.log("Se acabó el tiempo de respuesta");
      if (localStorage.getItem("nosy") === "True"){
        document.getElementById("respuestas-area").classList.remove("hidden");
      }
      time = 90;
      break;
    case "round_review_answer":
      etapa="Players ev";
      document.getElementById('etapa').innerHTML = etapa;
      console.log("Inicia la evaluación");
      if (localStorage.getItem("nosy") === "False"){
        document.getElementById("feedback-nosy");

        evaluation = grade(data.grade);

        console.log(data.grade);
        document.getElementById("answer-nosy-text").innerHTML = data.correct_answer;
        /*
        document.getElementById("feedback-nosy").innerHTML = "<div>"+
          "<div class='view-labels'>RESPUESTA ENTREGADA: " + data.correct_answer + "</div>" +
          "</div>"
        */
      }
      //showRespuestas();
      time = 30;
      break;
    case "round_result":
      console.log("resultados");
      Object.keys(players_data).forEach(element => {
        players_data[element].points = data.game_scores[element];
      })
      document.getElementById('players').innerHTML = '';
      Object.keys(players_data).forEach(element => {
        document.getElementById('players').innerHTML += '<li class="user_info">' +
        '<div>'+ players_data[element.userid]+players_data[element].username + '</div>' +
        '<div> P: '+ players_data[element].points + '</div>' +
        '<div> S: '+ players_data[element].status + '</div>' +
        '</li>'
      })
    case "user_fault":
      if (data.player_id === parseInt(getCookie("playerid"))) {
        
        switch (data.category) {
          case "QT":
            faults += 2;
            break;
          case "AT":
            faults += 1;
            break;
          case "ET":
            faults += 1;
            break;
          case "FT":
            faults += 1;
            break;
          case "FF":
            faults += 1;
            break;
          default:
            break;
        }
        //document.getElementById('faults').innerHTML = "Faltas: " + faults;
        console.log("faltas id " + faults);
        alert("No entregó a tiempo "+ data.category + " ! tienes una falta")
        //showFalta();
      }
      break;
    case "user_disqualified":
      console.log("Usuario descalificado" + data.player_id);
      players_data[data.player_id].status = "Disqualified"
      document.getElementById('players').innerHTML = '';
      Object.keys(players_data).forEach(element => {
        document.getElementById('players').innerHTML += '<li class="user_info">' +
        '<div>'+ players_data[element.userid] + " " +players_data[element].username + '</div>' +
        '<div> P: '+ players_data[element].points + '</div>' +
        '<div> S: '+ players_data[element].status + '</div>' +
        '</li>'
      });
      if (data.player_id===getCookie("playerid")){
        alert('Has sido descalificado');
        document.getElementById("status-container").classList.remove("hidden");
        document.getElementById("mod-start-rondas").classList.add("hidden");
        document.getElementById("game-section").classList.add("hidden");
        document.getElementById("game-section-player").classList.add("hidden");
      }
      break;
    case "game_canceled":
      alert('Juego cancelado '+'<li class="user_info">' +
      '<div>'+ players_data[element.userid] + " " +players_data[element].username + '</div>' +
      '<div> P: '+ players_data[element].points + '</div>' +
      '<div> S: '+ players_data[element].status + '</div>' +
      '</li>');
      window.location.href = 'join_game.html';
      break;
    case "game_deleted":
      alert('Juego eliminado');
      window.location.href = 'join_game.html';
      break;
    case "game_result":
      console.log("Resultados finales");
      Object.keys(players_data).forEach(element =>{
        players_data[element].points = data.game_scores[element];
        document.getElementById('players').innerHTML += '<li class="user_info">' +
        '<div>'+ players_data[element.userid]+ " " +players_data[element].username + '</div>' +
        '<div> P: '+ players_data[element].points + '</div>' +
        '<div> S: '+ players_data[element].status + '</div>' +
        '</li>'
      })
      alert("Juego terminado");

      break;
    default:
      break;
  }

  };

  document.getElementById('btn-enviar-pregunta').disabled = true;
  let modal = document.getElementById("myModal");

  document.getElementById('act').addEventListener('click',act);
  

  function start(){
    rounds_number=document.getElementById('rounds').value;
    localStorage.setItem("rondas",rounds_number);
    setCookie("rondas",rounds_number);
    JSON_Object = { "action": "start", "rounds": rounds_number};
    socket.send(JSON.stringify(JSON_Object));
    document.getElementById("mod-start-rondas").classList.add("hidden");
    document.getElementById("status-container").classList.remove("hidden");
  }

  function preg(){
    document.getElementById("game-section").classList.remove("hidden");
    document.getElementById("game-section-player").classList.add("hidden")
  }
  function play(){
    document.getElementById("game-section-player").classList.remove("hidden");
    document.getElementById("game-section").classList.add("hidden");
  }
  
function sendQuestion() {
  JSON_Object = { "action": "question", "text": document.getElementById('question').value};
  socket.send(JSON.stringify(JSON_Object));
  JSON_Object = { "action": "answer", "text": document.getElementById('answer-input').value};
  socket.send(JSON.stringify(JSON_Object));
}

function sendAnswer() {
  JSON_Object = { "action": "answer", "text": document.getElementById('answer-input2').value};
  socket.send(JSON.stringify(JSON_Object));
}
function grade(number) {
  switch (number) {
    case 0:
      return "Mala"
    case 1:
      return "Mas o Menos"
    case 2:
      return "Buena"
    default:
      break;
  }
}
function sendQualify() {
  document.querySelectorAll(".userQualify").forEach(element=>{
    data = element.value.split(',');
    JSON_Object = { "action": "qualify", "userid": data[1],"grade": data[0]};
    socket.send(JSON.stringify(JSON_Object));
  })
  document.getElementById("evaluateAnswers").innerHTML = "";
  //reiniciarTimer(30);  
  time = 30;    
}
document.getElementById("timeers").innerHTML = localStorage.getItem("tiempoPreguntaSelect");
setInterval(timeer,1000);

function timeer() {
  if (time > 0){
    time --;
    document.getElementById("timeers").innerHTML = time;
  }
}
function sendReview() {
  if (data.correct_answer===null){
    review="false";
  }
  else{
    review= document.getElementById('answer-ev-button').value;
  }
  JSON_Object = { "action": "assess", "correctness": review};
  socket.send(JSON.stringify(JSON_Object));
}

  // Iniciar el temporizador cuando se haga click en empezar
  document.getElementById('btn-empezar').addEventListener('click', function() {
    start();
  });

  let answerContainer = document.getElementById('answer-area');
  //vemos la pregunta que se envio 
  document.getElementById('btn-enviar-pregunta').addEventListener('click', function() {
    respuestaE++;
    let questionInput = document.getElementById("question"); // Obtén el elemento input por su ID
    let questionValue = questionInput.value; // Accede al valor del input
    preguntaEnviada = questionValue;
    JSON_Object = { "action": "question", "text": preguntaEnviada};
    socket.send(JSON.stringify(JSON_Object));
    //document.getElementById('btn-enviar-pregunta').classList.toggle("btn-hidden");


    let questionContainer = document.getElementById('question-container');

    //questionContainer.removeChild(questionInput);
    let text = document.createElement("div");
    text.classList.add("text-game-section");
    text.textContent = preguntaEnviada;
    //questionContainer.appendChild(text); 
    answerContainer.classList.remove("btn-hidden");
    answerContainer.classList.add("displayblock");
    console.log(answerContainer);
    
  });
  document.getElementById('btn-enviar-respuesta').addEventListener('click', function() {
    let answerpInput = document.getElementById("answer-input"); // Obtén el elemento input por su ID
    let answerpValue = answerpInput.value; // Accede al valor del input
    respuestaEnviadap = answerpValue;
    JSON_Object = { "action": "answer", "text": respuestaEnviadap};
    socket.send(JSON.stringify(JSON_Object));
    //document.getElementById('btn-enviar-respuesta').classList.toggle("btn-hidden");
    })

  let respuestasContainer = document.getElementById('respuestas-area');
  document.getElementById('btn-enviar-respuesta').addEventListener('click', function() {
    
    let answerInput = document.getElementById("answer-input"); // Obtén el elemento input por su ID
    let answerValue = answerInput.value; // Accede al valor del input
    respuestaEnviada = answerValue;
    //document.getElementById('btn-enviar-respuesta').classList.toggle("btn-hidden");
    
    answerContainer.removeChild(answerInput);

    let textAnswer = document.createElement("div");
    textAnswer.classList.add("text-game-section");
    textAnswer.textContent = respuestaEnviada;
    answerContainer.appendChild(textAnswer);
    respuestaR++;
    respuestasContainer.classList.remove("btn-hidden");
    respuestasContainer.classList.add("displayblock");
    //reiniciarTimer(timerRespuesta+90);
    //setTimeout(showRespuestas(), 30);
  });
  document.getElementById('answer-button').addEventListener('click',sendAnswer);
  document.getElementById("btn-enviar-pregunta").addEventListener('click',sendQuestion);
  document.getElementById("btn-enviar-calificaciones").addEventListener('click',sendQualify);
  document.getElementById('answer-ev-button').addEventListener('click',sendReview);
  
  let answerAreaPlayers = document.getElementById('answer-area-players');
  document.getElementById('answer-button').addEventListener('click', function() {
    
    let answerInput = document.getElementById("answer-input2"); // Obtén el elemento input por su ID
    let answerValue = answerInput.value; // Accede al valor del input
    respuestaEnviada = answerValue;
    /*
    sendAnswer();
    document.getElementById('answer-button').classList.toggle("btn-hidden");
    */
    //answerAreaPlayers.removeChild(answerInput);

    let textAnswer = document.createElement("div");
    textAnswer.classList.add("text-game-section");
    textAnswer.textContent = respuestaEnviada;
    answerContainer.appendChild(textAnswer);
    respuestaR++;
    respuestasContainer.classList.remove("btn-hidden");
    respuestasContainer.classList.add("displayblock");
    document.getElementById('answer-ev-button').addEventListener('click',sendReview);
    //reiniciarTimer();
    //setTimeout(showRespuestas(), 30);
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
    respuesta.appendChild(selector);
    //incluimos las respuestas en el contenedor
    containerRespuestas.appendChild(respuesta);

    }
}
playerusername=getCookie('playerusername');
document.getElementById('name').innerHTML = "Nombre: " +playerusername;

document.getElementById('btn-enviar-calificaciones').addEventListener('click', function() {
  document.getElementById('btn-enviar-calificaciones').classList.toggle("btn-hidden");
  //reiniciarTimer(30);
});
}
function act(){
  token=getCookie('token_access');
  tokenr=getCookie('token_refresh');
  fetch('https://trivia-bck.herokuapp.com/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        //body: JSON.stringify({ refresh: tokenRefresh }) 
        body: JSON.stringify({ refresh: tokenr }) 

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
          tokenAccess = data.access;
          localStorage.setItem('tokenAccess', tokenAccess);
          //setCookie('token_access', data.access, 4);
          tokenAccess = localStorage.getItem('tokenAccess');
          console.log("se actualizó");
        })
}
