
async function getEvolutionDetails(pokemonName) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
  return await response.json();
}

function getColorByType(type) {
  switch (type) {
    case "fire": return "orange";
    case "water": return "blue";
    case "grass": return "green";
    case "electric": return "yellow";
    case "ice": return "lightblue";
    case "fighting": return "brown";
    case "poison": return "purple";
    case "ground": return "sandybrown";
    case "flying": return "skyblue";
    case "psychic": return "pink";
    case "bug": return "limegreen";
    case "rock": return "gray";
    case "ghost": return "indigo";
    case "dragon": return "gold";
    case "dark": return "gray";
    case "steel": return "lightgray";
    case "fairy": return "lightpink";
    default: return "white";
  }
}

async function getEvolutions(chain) {
  let currentChain = chain;
  const evolutionDetails = [];

  while (currentChain) {
    const evolutionDetail = {
      name: currentChain.species.name,
      imageUrl: '',
      minLevel: null
    };

    if (currentChain.evolves_to.length > 0) {
      const evolutionMethod = currentChain.evolves_to[0].evolution_details[0];
      evolutionDetail.minLevel = evolutionMethod.min_level ?? 'N/A';
    }

    const pokemonDetails = await getEvolutionDetails(currentChain.species.name);
    evolutionDetail.imageUrl = pokemonDetails.sprites.front_default;

    evolutionDetails.push(evolutionDetail);

    if (currentChain.evolves_to.length > 0) {
      currentChain = currentChain.evolves_to[0];
    } else {
      currentChain = null;
    }
  }

  return evolutionDetails;
}

async function fetchMoveDetails(moveUrl) {
  const response = await fetch(moveUrl);
  return await response.json();
}

async function displayPokemonDetails(pokemonData, evolutionData) {
  const pokemonDetails = document.getElementById('pokemonDetails');

  // Moves
  const levelUpMoves = pokemonData.moves.filter(moveInfo => moveInfo.version_group_details.some(detail => detail.move_learn_method.name === 'level-up'));
  const tmMoves = pokemonData.moves.filter(moveInfo => moveInfo.version_group_details.some(detail => detail.move_learn_method.name === 'machine'));

  const levelUpMovesPromises = levelUpMoves.map(async moveInfo => {
    const moveDetails = await fetchMoveDetails(moveInfo.move.url);
    const typemove = moveDetails.type.name;
    const colortype = getColorByType(typemove);
    return `
      <tr>
        <th>${moveDetails.name}</th>
        <td style="background-color: ${colortype};">${moveDetails.type.name}</td>
        <td>${moveDetails.power ?? 'N/A'}</td>
        <td>${moveDetails.accuracy ?? 'N/A'}</td>
        <td>${moveDetails.pp}</td>
      </tr>
    `;
  });

  const tmMovesPromises = tmMoves.map(async moveInfo => {
    const moveDetails = await fetchMoveDetails(moveInfo.move.url);
    const typemove = moveDetails.type.name;
    const colortype = getColorByType(typemove);
    return `
      <tr>
        <th>${moveDetails.name}</th>
        <td style="background-color: ${colortype};">${moveDetails.type.name}</td>
        <td>${moveDetails.power ?? 'N/A'}</td>
        <td>${moveDetails.accuracy ?? 'N/A'}</td>
        <td>${moveDetails.pp}</td>
      </tr>
    `;
  });

  const levelUpMovesHTML = await Promise.all(levelUpMovesPromises);
  const tmMovesHTML = await Promise.all(tmMovesPromises);

  // tipos do pokemon
  const pokemonTypes = pokemonData.types.map(typeInfo => typeInfo.type.name);
  const primaryType = pokemonTypes[0];
  const secondType = pokemonTypes[1];
  const backgroundColor = getColorByType(primaryType);
  const backgroundColorsecond = secondType ? getColorByType(secondType) : 'white'; // Default color if second type is undefined

  // habilidade do pokemon
  const abilities = pokemonData.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ');

  // status
  const stats = pokemonData.stats.map(stat => `
    <div class="stat">
      <span class="stat-name">${stat.stat.name}:</span>
      <div class="stat-bar">
        <span style="max-width: ${stat.base_stat}%"></span>
      </div>
      <span>${stat.base_stat}</span>
    </div>
  `).join('');

  // evoluçao
  const evolutions = await getEvolutions(evolutionData.chain);
  const evolutionHTML = evolutions.map(evo => `
    <div class="evolution">
      <img src="${evo.imageUrl}" alt="${evo.name}">
      <p>${evo.name} ${evo.minLevel ? ` (Level ${evo.minLevel})` : ''}</p>
    </div>
  `).join('');

  let evolutionContainerClass = '';
  if (evolutions.length === 1) {
    evolutionContainerClass = 'single';
  } else if (evolutions.length === 2) {
    evolutionContainerClass = 'two';
  } else if (evolutions.length === 3) {
    evolutionContainerClass = 'three';
  }

  pokemonDetails.innerHTML = `
   <div class="infoPrincipal">
      <div>
        <h2>${pokemonData.name}<span class="id-text">ID:${pokemonData.id}</span></h2>
        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
      </div>
      <div class="infoSegundaria">
        <p class="pInfoSegudaria"><strong>Height</strong> <br> ${pokemonData.height}</p>
        <p class="pInfoSegudaria"><strong>Weight</strong> <br> ${pokemonData.weight}</p>
        <p class="pInfoSegudaria"><strong>Base Experience</strong> <br> ${pokemonData.base_experience}</p>
        <p class="pInfoSegudaria"><strong>Abilities</strong> <br> ${abilities}</p>
      </div>
    </div>
     <div style="text-align:left;">
        <strong>Type</strong>
          <div class="divType">
            <div class="pokemon-div-type" style="background-color: ${backgroundColor};"> ${primaryType}</div>
            ${secondType ? `<div class="pokemon-div-type" style="background-color: ${backgroundColorsecond};">${secondType}</div>` : ''}
          </div>      
      </div>
    <h3>Angulos</h3>
    <img src="${pokemonData.sprites.front_default}" alt="Front Default">
    <img src="${pokemonData.sprites.back_default}" alt="Back Default">
    <img src="${pokemonData.sprites.front_shiny}" alt="Front Shiny">
    <img src="${pokemonData.sprites.back_shiny}" alt="Back Shiny">
    ${pokemonData.sprites.front_female ? `<img src="${pokemonData.sprites.front_female}" alt="Front Female">` : ''}
    ${pokemonData.sprites.back_female ? `<img src="${pokemonData.sprites.back_female}" alt="Back Female">` : ''}
    ${pokemonData.sprites.front_shiny_female ? `<img src="${pokemonData.sprites.front_shiny_female}" alt="Front Shiny Female">` : ''}
    ${pokemonData.sprites.back_shiny_female ? `<img src="${pokemonData.sprites.back_shiny_female}" alt="Back Shiny Female">` : ''}
    <h3>Base Stats</h3>
    ${stats}
    <h3>Evolutions</h3>
    <div class="div-evolution ${evolutionContainerClass}" id="evolution-container">${evolutionHTML}</div>
    <h3>Moves Learned by Level-Up</h3>
    <div class="table-container">
      <table>
        <thead>
         <tr>
            <th scope="col">Move</th>
            <th scope="col">Type</th>
            <th scope="col">Power</th>
            <th scope="col">Accuracy</th>
            <th scope="col">PP</th>
          </tr>
        </thead>
        <tbody>${levelUpMovesHTML.join('')}</tbody>
      </table>
    </div>
    <h3>Moves Learned by TM</h3>
    <div class="table-container"> 
      <table>
        <thead>
          <tr>
            <th scope="col">Move</th>
            <th scope="col">Type</th>
            <th scope="col">Power</th>
            <th scope="col">Accuracy</th>
            <th scope="col">PP</th>
          </tr>
        </thead>
        <tbody>${tmMovesHTML.join('')}</tbody>
      </table>
    </div> 
  `;

  // Hide loading and show details
  document.getElementById('loading').style.display = 'none';
  pokemonDetails.style.display = 'block';
}
