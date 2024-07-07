async function fetchPokemonDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get('id');
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

    try {
        const response = await fetch(url);
        const pokemonData = await response.json();
        const speciesResponse = await fetch(pokemonData.species.url);
        const speciesData = await speciesResponse.json();
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();
        
        displayPokemonDetails(pokemonData, speciesData, evolutionData);
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
    }
}

function displayPokemonDetails(pokemonData, speciesData, evolutionData) {
    const pokemonDetails = document.getElementById('pokemonDetails');
    const pokemonTypes = pokemonData.types.map(typeInfo => typeInfo.type.name).join(', ');
    const abilities = pokemonData.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ');
    const stats = pokemonData.stats.map(stat => `
        <div class="stat">
            <span class="stat-name">${stat.stat.name}:</span>
            <div class="stat-bar">
                <span style="width: ${stat.base_stat}%"></span>
            </div>
            <span>${stat.base_stat}</span>
        </div>
    `).join('');
    const evolutions = getEvolutions(evolutionData.chain);
    const moves = pokemonData.moves.map(moveInfo => `<li>${moveInfo.move.name}</li>`).join('');
    pokemonDetails.innerHTML = `
        <h2>${pokemonData.name}</h2>
        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
        <p><strong>ID:</strong> ${pokemonData.id}</p>
        <p><strong>Type:</strong> ${pokemonTypes}</p>
        <p><strong>Height:</strong> ${pokemonData.height}</p>
        <p><strong>Weight:</strong> ${pokemonData.weight}</p>
        <p><strong>Base Experience:</strong> ${pokemonData.base_experience}</p>
        <p><strong>Abilities:</strong> ${abilities}</p>
        <h3>Sprites</h3>
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
        <p>${evolutions}</p>
         <h3>Moves</h3>
        <ul>${moves}</ul>
        
    `;
    
    // Hide loading and show details
    document.getElementById('loading').style.display = 'none';
    pokemonDetails.style.display = 'block';
}

function getEvolutions(chain) {
    let evolutionText = '';
    let currentChain = chain;

    while (currentChain) {
        evolutionText += currentChain.species.name;
        if (currentChain.evolves_to.length > 0) {
            evolutionText += ' -> ';
            currentChain = currentChain.evolves_to[0];
        } else {
            currentChain = null;
        }
    }

    return evolutionText;
}

// Initial load
fetchPokemonDetails();
