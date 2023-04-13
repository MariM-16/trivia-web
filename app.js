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
      let nombreInput = document.getElementById("nombre").value;
      let tiempoPreguntaSelect = document.getElementById("tiempoPregunta").value;
      let tiempoRespuestaSelect = document.getElementById("tiempoRespuesta").value;

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

    });

    let botones = document.querySelectorAll(".bton");
    botones.forEach(function(boton) {
      boton.addEventListener("click", function() {
        window.location.href = "game.html";
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