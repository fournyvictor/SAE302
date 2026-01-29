/******************************************************************************/
/* Recherche TMDB et gestion de la barre de recherche                         */
/******************************************************************************/

/******************************************************************************/
/* Constantes                                                                 */
/******************************************************************************/

const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzAwODk3NTQ0ZTUwZTg5N2Y4ZGZhNzlkNzY4YjcxNyIsIm5iZiI6MTY1NjI3ODM4NC4xNTYsInN1YiI6IjYyYjhjZDcwMTdjNDQzMDA2MDRiMjEwOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZNZGW6-VnxqWAMDfqYZYtNRxbdZfLgqcMu3mysVMv-c';
const SEARCHBAR = document.getElementById("searchbar");
const SEARCHBAR_DROPDOWN = bootstrap.Dropdown.getOrCreateInstance(SEARCHBAR);
const SEARCHBAR_DROPDOWN_LIST = document.getElementById("searchbar-dropdown-menu-list");
const LOGO = document.getElementById("logo");
const PAGE_TITLE = document.getElementById("page-title");


/******************************************************************************/
/* EventListeners                                                             */
/******************************************************************************/

SEARCHBAR.addEventListener("input", updateSearchBar);
SEARCHBAR.addEventListener("focus", selectSearchBar);
SEARCHBAR.addEventListener("blur", deselectSearchBar);


/******************************************************************************/
/* Gestion searchbar                                                          */
/******************************************************************************/

function updateSearchBar() {
    const SEARCHBAR_STRING = SEARCHBAR.value;
    if (SEARCHBAR_STRING != '') {
        if (!navigator.onLine) {
            SEARCHBAR_DROPDOWN_LIST.innerHTML = '<li class="p-3 text-center text-secondary small">Research is only available online</li>';
            SEARCHBAR_DROPDOWN.show();
            return;
        }
        searchTmdb(SEARCHBAR_STRING);
        SEARCHBAR_DROPDOWN.show();

    } else {
        SEARCHBAR_DROPDOWN.hide();
    }
}
function selectSearchBar() {
    LOGO.style.opacity = "0";
    LOGO.style.pointerEvents = "none";
    if (PAGE_TITLE) PAGE_TITLE.style.opacity = "0";
    updateSearchBar();
    SEARCHBAR.style.width = "75vw";
    SEARCHBAR.placeholder = "Search...";
}
function deselectSearchBar() {

    setTimeout(resetSearchBar, 200);

}
function resetSearchBar() {
    SEARCHBAR_DROPDOWN.hide();
    SEARCHBAR.style.width = "36px";
    SEARCHBAR.placeholder = "⌕";
    SEARCHBAR.value = "";
    LOGO.style.opacity = "1";
    LOGO.style.pointerEvents = "auto";
    if (PAGE_TITLE) PAGE_TITLE.style.opacity = "1";
}

function createSeachDropdownHtmlList(array) {
    let html = '';
    for (let element of array) {
        html += `<li><a href="./film/?id=${element.id}">
                <div class="card dropdown-search-card">
                    <div class="d-flex">
                        
                            <img src="https://image.tmdb.org/t/p/w342${element.poster_path}" class="rounded-start" alt="${element.title} poster">
                        
                        
                            <div class="card-body">
                                <h5 class="card-title">${element.title}</h5>
                                    <p class="card-text"><small class="year-card">${element.release_date.substring(0, 4)}</small></p>
                                    <p class="card-text card-text-truncate">${element.overview}</p>
                            
                        </div>
                    </div>
                </div></a></li>`;
    }
    SEARCHBAR_DROPDOWN_LIST.innerHTML = html;
}


/******************************************************************************/
/* Fonctions api tmdb                                                         */
/******************************************************************************/

async function searchTmdb(SEARCHSTRING) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_TOKEN}`
        }
    };

    const RESPONSE = await fetch('https://api.themoviedb.org/3/search/movie?query=' + SEARCHSTRING + '&include_adult=false&language=en-US&page=1', options);
    const RESPONSE_JSON = await RESPONSE.json();

    //Mode opératoire proposé par la doc de tmdb
    //fetch('https://api.themoviedb.org/3/search/movie?query=' + SEARCHSTRING + '&include_adult=false&language=en-US&page=1', options)
    //    .then(res => res.json())
    //    .then(res => console.log(res.results))
    //    .catch(err => console.error(err));


    createSeachDropdownHtmlList(RESPONSE_JSON.results);
}

async function getFilmData(ID) {

    const OPTIONS = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_TOKEN}`
        }
    };


    const RESPONSE = await fetch(`https://api.themoviedb.org/3/movie/${ID}?language=en-US`, OPTIONS);
    const RESPONSE_JSON = await RESPONSE.json();
    return RESPONSE_JSON;
}

async function getMovieCast(ID) {
    const OPTIONS = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_TOKEN}`
        }
    };

    const RESPONSE = await fetch(`https://api.themoviedb.org/3/movie/${ID}/credits?language=en-US`, OPTIONS);
    const RESPONSE_JSON = await RESPONSE.json();
    return RESPONSE_JSON.cast;
}

async function getTrendingMovies() {
    const OPTIONS = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_TOKEN}`
        }
    };

    const RESPONSE = await fetch('https://api.themoviedb.org/3/trending/movie/week?language=en-US', OPTIONS);
    const RESPONSE_JSON = await RESPONSE.json();
    return RESPONSE_JSON.results;
}
async function getTrendingMoviesToday() {
    const OPTIONS = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_TOKEN}`
        }
    };

    const RESPONSE = await fetch('https://api.themoviedb.org/3/trending/movie/day?language=en-US', OPTIONS);
    const RESPONSE_JSON = await RESPONSE.json();
    return RESPONSE_JSON.results;
}