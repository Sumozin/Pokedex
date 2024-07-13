let offset = 0;
const limit = 50; // Number of Pokémon to load at a time

async function fetchPokemon(offset, limit) {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const pokemonPromises = data.results.map((pokemon) =>
      fetch(pokemon.url).then((res) => res.json())
    );
    const pokemonDataArray = await Promise.all(pokemonPromises);
    pokemonDataArray.sort((a, b) => a.id - b.id); // Ensure the order
    pokemonDataArray.forEach((pokemonData) => displayPokemon(pokemonData));
    showContent()
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
  }
}

function getColorByType(type) {
  switch (type) {
    case "fire":
      return "orange";
    case "water":
      return "blue";
    case "grass":
      return "green";
    case "electric":
      return "yellow";
    case "ice":
      return "lightblue";
    case "fighting":
      return "brown";
    case "poison":
      return "purple";
    case "ground":
      return "sandybrown";
    case "flying":
      return "skyblue";
    case "psychic":
      return "pink";
    case "bug":
      return "limegreen";
    case "rock":
      return "gray";
    case "ghost":
      return "indigo";
    case "dragon":
      return "gold";
    case "dark":
      return "gray";
    case "steel":
      return "lightgray";
    case "fairy":
      return "lightpink";
    default:
      return "white";
  }
}

function displayPokemon(pokemonData) {
    const pokedex = document.getElementById('pokedex');
    const pokemonCard = document.createElement('div');
    const pokemonTypes = pokemonData.types.map((typeInfo) => typeInfo.type.name);
    const primaryType = pokemonTypes[0];
    const secondType = pokemonTypes[1];
    const backgroundColor = getColorByType(primaryType);
    const backgroundColorsecond = secondType ? getColorByType(secondType) : 'white'; // Default color if second type is undefined

const classtype = pokemonTypes.length === 1 ? 'singletype' : 'twotype';

    pokemonCard.innerHTML = `
        <a href="view/detail.html?id=${pokemonData.id}">
            <div class="pokemon-card">
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <p><strong>Id:</strong> ${pokemonData.id}</p>
                <h3>${pokemonData.name}</h3>
                <div class="pokemon-type ${classtype} ">
                    <div class="pokemon-div-type" style="background-color: ${backgroundColor};">${primaryType}</div>
                    ${secondType ? `<div class="pokemon-div-type" style="background-color: ${backgroundColorsecond};">${secondType}</div>` : ''}
                </div>
            </div>
        </a>
    `;
    pokedex.appendChild(pokemonCard);
}

function showContent() {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('show-pokedex').style.display = 'block';
}

function loadMorePokemon() {
  fetchPokemon(offset, limit);
  offset += limit;
}

// Initial load
loadMorePokemon();
