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
        
        displayPokemonDetails(pokemonData, evolutionData);
    } catch (error) {
        console.error('Error fetching Pokémon details:', error);
    }
}

async function fetchMoveDetails(moveUrl) {
    try {
        const response = await fetch(moveUrl);
        return await response.json();
    } catch (error) {
        console.error('Error fetching move details:', error);
    }
}

// Initial load
fetchPokemonDetails();
