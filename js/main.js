const POKEMON_TOTAL = 151;
const SILUETAS_CANTIDAD = 5;

let enemigos = [];
let opciones = [];
let seleccionados = [];
let puntaje = 500;

const enemigoTeamDiv = document.getElementById('enemigo-team');
const siluetasDiv = document.getElementById('siluetas');
const resultadoDiv = document.getElementById('resultado');
const textoResultado = document.getElementById('texto-resultado');
const btnBatallar = document.getElementById('btn-batallar');
const btnReiniciar = document.getElementById('btn-reiniciar');
const puntajeSpan = document.getElementById('puntaje');

async function obtenerPokemon(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return await res.json();
}

function obtenerIDsUnicos(cantidad, excluir = []) {
  const ids = new Set();
  while (ids.size < cantidad) {
    let id = Math.floor(Math.random() * POKEMON_TOTAL) + 1;
    if (!excluir.includes(id)) {
      ids.add(id);
    }
  }
  return [...ids];
}

function crearImgPokemon(pokemon, esSilueta = false, index = null) {
  const img = document.createElement('img');
  img.src = pokemon.sprites.front_default;
  img.alt = pokemon.name;

  if (esSilueta) {
    img.classList.add('silueta');
    img.dataset.id = pokemon.id;
    img.dataset.index = index;

    img.addEventListener('click', () => {
      if (seleccionados.includes(pokemon.id)) {
        seleccionados = seleccionados.filter(id => id !== pokemon.id);
        img.classList.remove('seleccionada');
      } else if (seleccionados.length < 2) {
        seleccionados.push(pokemon.id);
        img.classList.add('seleccionada');
      }

      btnBatallar.disabled = seleccionados.length !== 2;
    });
  }

  return img;
}

async function armarJuego() {
  enemigoTeamDiv.innerHTML = '';
  siluetasDiv.innerHTML = '';
  resultadoDiv.classList.add('d-none');
  btnBatallar.disabled = true;
  btnBatallar.style.display = 'inline-block'; // Lo vuelve a mostrar
  seleccionados = [];

  const idsEnemigos = obtenerIDsUnicos(2);
  enemigos = await Promise.all(idsEnemigos.map(id => obtenerPokemon(id)));

  enemigos.forEach(poke => {
    const img = crearImgPokemon(poke);
    enemigoTeamDiv.appendChild(img);
  });

  const idsOpciones = obtenerIDsUnicos(SILUETAS_CANTIDAD, idsEnemigos);
  opciones = await Promise.all(idsOpciones.map(id => obtenerPokemon(id)));

  opciones.forEach((poke, index) => {
    const img = crearImgPokemon(poke, true, index);
    siluetasDiv.appendChild(img);
  });
}


function calcularFuerza(pokemons) {
  return pokemons.reduce((fuerza, poke) => {
    return fuerza + poke.stats[0].base_stat + poke.stats[1].base_stat + poke.stats[2].base_stat;
  }, 0);
}

async function resolverBatalla() {
  btnBatallar.style.display = 'none'; // Oculta el botón al batallar

  const seleccionadosPokemons = await Promise.all(seleccionados.map(id => obtenerPokemon(id)));

  const fuerzaJugador = calcularFuerza(seleccionadosPokemons);
  const fuerzaEnemigo = calcularFuerza(enemigos);

  let mensaje = '';

  if (fuerzaJugador > fuerzaEnemigo) {
    mensaje = '🔥 ¡Ganaste la batalla! Tus Pokémon fueron superiores.';
    puntaje += 100;
  } else if (fuerzaJugador < fuerzaEnemigo) {
    mensaje = '💀 Perdiste... El equipo enemigo era más fuerte.';
    puntaje -= 100;
  } else {
    mensaje = '😐 Empate. ¡Qué batalla pareja!';
  }

  actualizarPuntaje();
  textoResultado.textContent = mensaje;
  resultadoDiv.classList.remove('d-none');
}


function actualizarPuntaje() {
  puntajeSpan.textContent = puntaje;
}

btnBatallar.addEventListener('click', resolverBatalla);
btnReiniciar.addEventListener('click', armarJuego);

armarJuego();

const tiendaItems = document.querySelectorAll('.tienda-opcion');
const medallasContenedor = document.getElementById('medallas-contenedor');
const body = document.body;

const fondos = {
  fondo1: "url('https://images.wikidexcdn.net/mwuploads/esssbwiki/2/2c/latest/20180819065319/Estadio_Pok%C3%A9mon_2_SSBU.jpg')"
};

const medallas = {
  medalla1: "https://images.wikidexcdn.net/mwuploads/wikidex/9/93/latest/20180812035749/Medalla_Volc%C3%A1n.png",
  medalla2: "https://images.wikidexcdn.net/mwuploads/wikidex/e/e6/latest/20180812014833/Medalla_Trueno.png",
  medalla3: "https://images.wikidexcdn.net/mwuploads/wikidex/0/09/latest/20180812034547/Medalla_Arco%C3%ADris.png"
};

tiendaItems.forEach(btn => {
  btn.addEventListener('click', () => {
    const tipo = btn.dataset.tipo;
    const id = btn.dataset.id;
    const costo = parseInt(btn.dataset.costo);

    if (puntaje < costo) {
      alert("⚠️ No tenés suficientes puntos.");
      return;
    }

    puntaje -= costo;
    actualizarPuntaje();

    if (tipo === "fondo") {
      body.style.backgroundImage = fondos[id];
      body.style.backgroundSize = "cover";
      body.style.backgroundAttachment = "fixed";
    }

    if (tipo === "medalla") {
      const img = document.createElement("img");
      img.src = medallas[id];
      img.alt = id;
      img.title = id;
      medallasContenedor.appendChild(img);
    }

    btn.remove(); // Saca la opción de la tienda
  });
});
