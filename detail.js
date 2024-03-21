const backToHome = document.querySelector('.back-to-home-icon');

backToHome.addEventListener('click',()=>
{
    window.location.href='./index.html';
});

let currentPokemonId = null;
document.addEventListener('DOMContentLoaded',()=>
{
    const pokemonId   = new URLSearchParams(window.location.search).get('id');
    const id          = pokemonId;

    currentPokemonId = id;
    loadPokemon(id);
})


async function loadPokemon(id)
{
    try 
    {
        const [pokemon, pokemonSpecies] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
            res.json()
            ),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) =>
            res.json()
            ),
        ]);

        const powerContainer = document.querySelector('.power-container');
        powerContainer.innerHTML = '';

        const aboutContainer = document.querySelector('.about-container .pokemon-ability');
        aboutContainer.innerHTML = '';

        /*Display Pokemon */
        if(currentPokemonId === id)
        {
            displayPokemonsDetails(pokemon);
            const pokemonPowerExplain = powerExplain(pokemonSpecies);
            document.querySelector('.pokemon-power-explain').textContent = pokemonPowerExplain;

            const leftArrow = document.querySelector('.chevron_left');
            const rightArrow = document.querySelector('.chevron_right');

            const changeIdToNumber = Number(id);

            leftArrow.removeEventListener('click',navigatePokemon);
            rightArrow.removeEventListener('click',navigatePokemon);

            if(changeIdToNumber !== 1)
            {
                leftArrow.addEventListener('click',()=>
                {
                    navigatePokemon(changeIdToNumber - 1);
                });
            }

            if (changeIdToNumber !== 10)
            {
                rightArrow.addEventListener('click',()=>
                {
                    navigatePokemon(changeIdToNumber + 1);
                })
            }

            window.history.pushState({}, "", `./detail.html?id=${id}`);
        };
        return true;
    }

    catch(error)
    {
        console.error(error);
        return false;
    }
};

async function navigatePokemon(id)
{
    currentPokemonId = id;
    await loadPokemon(id);
}

function capitalizeFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


/*BackGround Color */
const typeColors = 
{
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    dark: "#EE99AC",
};

function setElementStyles(elements , cssProperty , value)
{
    elements.forEach((element)=>
    {
        element.style[cssProperty] = value;
    });
};

function rgabColor(hexColor)
{
    return[
        parseInt(hexColor.slice(1,3),16),
        parseInt(hexColor.slice(3,5),16),
        parseInt(hexColor.slice(5,7),16),
    ].join(', ');
};

function setBackgroundColor(pokemon)
{
    const mainType = pokemon.types[0].type.name;
    const color    = typeColors[mainType];

    const detailMainElement = document.querySelector('.detail-main');
    setElementStyles([detailMainElement],'backgroundColor',color);
    setElementStyles([detailMainElement],'borderColor',color);

    setElementStyles(document.querySelectorAll('.pokemon-about .type'),'backgroundColor',color);

    setElementStyles(document.querySelectorAll('.stats-container .stats'),'color',color);

    setElementStyles(document.querySelectorAll('.progress-bar'),'color',color);

    const rgbaColor = rgabColor(color);
    const styleTag  = document.createElement('style');
    styleTag.innerHTML = 
    `
    .stats-container .progress-bar::-webkit-progress-bar
    {
        background-color: rgba(${rgbaColor}, 0.5);
    }

    .stats-container .progress-bar::-webkit-progress-value
    {
        background-color : ${color};
        border-radius    : 4px;
    }
    `;

    document.head.appendChild(styleTag);
}


/*Pokemon Detail Display*/
const pokemonName = document.querySelector('.pokemon-name');
const pokemonId   = document.querySelector('.pokemon-id');
const pokemonImage = document.querySelector('.pokemon-img');
const pokemonWeight = document.querySelector('.pokemon-weight');
const pokemonHeight = document.querySelector('.pokemon-height');

function displayPokemonsDetails(pokemon)
{
    const {name , id , height , weight , types , abilities , stats} = pokemon;

    const capitalizePokemonName = capitalizeFirstLetter(name);
    pokemonName.textContent     = capitalizePokemonName;
    pokemonId.textContent       = `#${String(id).padStart(3,0)}`;
    pokemonImage.src            =
    `
    https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${id}.svg
    `
    pokemonImage.alt            = name;


    let aboutHTML = '';
    types.forEach(({type})=>
    {
        aboutHTML +=
        `
        <p class="type">${capitalizeFirstLetter(type.name)}</p>
        `;
    });
    document.querySelector('.pokemon-about').innerHTML = aboutHTML;

    pokemonWeight.textContent = `${weight/10}kg`
    pokemonHeight.textContent = `${height/10}m`;

    let abilitiesHTML = '';
    abilities.forEach(({ability})=>
    {
        abilitiesHTML+=
        `
        <p class="ability">${capitalizeFirstLetter(ability.name)}</p>
        `;
    });
    document.querySelector('.pokemon-ability').innerHTML = abilitiesHTML;

    let statsHTML = '';
    stats.forEach(({stat, base_stat})=>
    {
        statsHTML+=
        `
        <div class="${stat.name}-container">
        <p class="stats">${capitalizeFirstLetter(stat.name)}</p>
        <div class="base-stats-line"></div>
        <p class="ability">${String(base_stat).padStart(3,0)}</p>
        <progress value="${base_stat}" max="100" id="progress-bar" class="progress-bar">${base_stat}</progress>
        </div>
        `
    });

    document.querySelector('.stats-container').innerHTML = statsHTML;

    setBackgroundColor(pokemon);
}


function powerExplain(pokemonSpecies)
{   
    for (let entry of pokemonSpecies.flavor_text_entries)
    {
        if (entry.language.name === 'en')
        {
            let flavor = entry.flavor_text.replace(/\f/g," ");
            return flavor;
        }
    }
    return '';
}