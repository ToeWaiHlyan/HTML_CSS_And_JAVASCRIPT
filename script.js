let maxPokemon = 10;
const list     = document.querySelector('.list');
const searchInput = document.querySelector('.search-input');
const numberFilter = document.querySelector('.number-filter');
const nameFilter   = document.querySelector('.name-filter');
const notFoundMessage = document.querySelector('.not-found-message');

let allPokemons = [];
fetchPokemon()

async function fetchPokemon()
{
    try
    {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maxPokemon}&offset=0`);
        if(!response.ok)
        {
            throw new error(`Can not Fetch Pokemon Data`);
        };

        const data = await response.json();
        allPokemons = data.results;
        displayPokemon(allPokemons);
    }

    catch(error)
    {
        console.error(error);
    }
};


async function fetchPokemonDataBeforeRedirect(id) 
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
      return true;  
    }
    catch (error) 
    {
      console.error("Failed to fetch Pokemon data before redirect");
    }
}


/*Display Pokemon*/
function displayPokemon(allPokemons)
{
    list.innerHTML = '';
    allPokemons.forEach((pokemon)=>
    {
        const pokemonId = pokemon.url.split('/')[6];
        const listItem  = document.createElement('div');
        listItem.className = 'list-item';
        listItem.innerHTML =
        `
        <div class="number-wrap">
        <p class="caption">#${pokemonId}</p>
        </div>
        <div class="img-wrap">
            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg" alt="${pokemon.name}">
        </div>
        <div class="name-wrap">
            <p>${pokemon.name.toUpperCase()}</p>
        </div>
        `;

        listItem.addEventListener('click',async()=>
        {
            const success = await fetchPokemonDataBeforeRedirect(pokemonId);
            if(success)
            {
                window.location.href = `./detail.html?id=${pokemonId}`;
            }
        })

        list.appendChild(listItem);
    })
};


/*sort container*/
const filter = document.querySelector('.sort');
const filterContainer = document.querySelector('.filter-container');

filter.addEventListener('click',()=>
{
    filterContainer.classList.toggle('show-filter-container')  
});


/*Search Pokemon*/
searchInput.addEventListener('keyup',handleSearch);

function handleSearch()
{
    const search = searchInput.value.toLowerCase();
    let filteredPokemons;

    if (numberFilter.checked)
    {
        filteredPokemons = allPokemons.filter((pokemon)=>
        {
            const pokemonId = pokemon.url.split('/')[6];
            return pokemonId.startsWith(search);
        })
    }

    else if (nameFilter.checked)
    {
        filteredPokemons = allPokemons.filter((pokemon)=>
        {
            return pokemon.name.toLowerCase().includes(search);
        })
    }

    else
    {
        filteredPokemons = allPokemons;
    }

    displayPokemon(filteredPokemons);

    if(filteredPokemons.length === 0)
    {
        notFoundMessage.style.display = 'block';
    }
    
    else 
    {
        notFoundMessage.style.display = 'none';
    }

    if(searchInput.length === 0)
    {
        displayPokemon(allPokemons)
    }
}

/*Close Icon*/
const closeIcon = document.querySelector('.search-close-icon');

searchInput.addEventListener('input',()=>
{
    handleInputChange(searchInput);
});

function handleInputChange(searchInput)
{
    const inputValue = searchInput.value;

    if (inputValue !== '')
    {
        closeIcon.classList.add('search-close-icon-visible');
    }
    else
    {
        closeIcon.classList.remove('search-close-icon-visible');
    }
};

closeIcon.addEventListener('click',()=>
{
    searchInput.value = '';
    closeIcon.classList.remove('search-close-icon-visible');
    displayPokemon(allPokemons);
})
