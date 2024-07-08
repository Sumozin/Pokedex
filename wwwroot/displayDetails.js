
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

async function displayPokemonDetails(pokemonData, evolutionData) {
    const pokemonDetails = document.getElementById('pokemonDetails');

    // Moves
    const levelUpMoves = pokemonData.moves.filter(moveInfo => moveInfo.version_group_details.some(detail => detail.move_learn_method.name === 'level-up'));
    const tmMoves = pokemonData.moves.filter(moveInfo => moveInfo.version_group_details.some(detail => detail.move_learn_method.name === 'machine'));

    const levelUpMovesPromises = levelUpMoves.map(async moveInfo => {
        const moveDetails = await fetchMoveDetails(moveInfo.move.url);
        return `
            <tr>
                <th>${moveDetails.name}</th>
                <td>${moveDetails.type.name}</td>
                <td>${moveDetails.power ?? 'N/A'}</td>
                <td>${moveDetails.accuracy ?? 'N/A'}</td>
                <td>${moveDetails.pp}</td>
            </tr>
        `;
    });

    const tmMovesPromises = tmMoves.map(async moveInfo => {
        const moveDetails = await fetchMoveDetails(moveInfo.move.url);
        return `
            <tr>
                <th>${moveDetails.name}</th>
                <td>${moveDetails.type.name}</td>
                <td>${moveDetails.power ?? 'N/A'}</td>
                <td>${moveDetails.accuracy ?? 'N/A'}</td>
                <td>${moveDetails.pp}</td>
            </tr>
        `;
    });

    const levelUpMovesHTML = await Promise.all(levelUpMovesPromises);
    const tmMovesHTML = await Promise.all(tmMovesPromises);

    // tipos do pokemon
    const pokemonTypes = pokemonData.types.map(typeInfo => typeInfo.type.name).join(', ');

    // habilidade do pokemon
    const abilities = pokemonData.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ');

    // status
    const stats = pokemonData.stats.map(stat => `
        <div class="stat">
            <span class="stat-name">${stat.stat.name}:</span>
            <div class="stat-bar">
                <span style="width: ${stat.base_stat}%"></span>
            </div>
            <span>${stat.base_stat}</span>
        </div>
    `).join('');

    // evoluçao
    const evolutions = getEvolutions(evolutionData.chain);

   

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
        <h3>Moves Learned by Level-Up</h3>
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
        <h3>Moves Learned by TM</h3>
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
    `;

    // Hide loading and show details
    document.getElementById('loading').style.display = 'none';
    pokemonDetails.style.display = 'block';
}
