/******************************************************************************/
/* Recherche TMDB et gestion de la barre de recherche                         */
/******************************************************************************/

/******************************************************************************/
/* Constantes                                                                 */
/******************************************************************************/

const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzAwODk3NTQ0ZTUwZTg5N2Y4ZGZhNzlkNzY4YjcxNyIsIm5iZiI6MTY1NjI3ODM4NC4xNTYsInN1YiI6IjYyYjhjZDcwMTdjNDQzMDA2MDRiMjEwOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZNZGW6-VnxqWAMDfqYZYtNRxbdZfLgqcMu3mysVMv-c';
const SEARCHBAR = document.getElementById("searchbar");
const SEARCHBAR_DROPDOWN = bootstrap.Dropdown.getOrCreateInstance(SEARCHBAR); //instancier le dropdown
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

//mise à jour du dropdown searchbar
function updateSearchBar() {
    const SEARCHBAR_STRING = SEARCHBAR.value; //récupérer la valeur de la searchbar
    if (SEARCHBAR_STRING != '') { //si searchbar non vide
        if (!navigator.onLine) { //si non connecté à internet
            SEARCHBAR_DROPDOWN_LIST.innerHTML = '<li class="p-3 text-center text-secondary small">Research is only available online</li>'; //message searchbar indispo hors ligne
            SEARCHBAR_DROPDOWN.show(); //afficher le dropdown
        }else{
              searchTmdb(SEARCHBAR_STRING); //sinon effectuer la recherche
              SEARCHBAR_DROPDOWN.show(); //afficher dropdown
            }
    } else {
        SEARCHBAR_DROPDOWN.hide(); //si rien de tapé, cacher le dropdown
    }
}
function selectSearchBar() { //lorsque l'utilisateur clique dans la searchbar
    LOGO.style.opacity = "0"; //masquer le logo
    LOGO.style.pointerEvents = "none"; //empêcher le clic sur le logo
    if (PAGE_TITLE) { PAGE_TITLE.style.opacity = "0"; }  //masquer le titre si il existe
    updateSearchBar(); //mettre à jour la searchbar
    SEARCHBAR.style.width = "75vw"; //élargir la searchbar
    SEARCHBAR.placeholder = "Search..."; //changer le texte placeholder de loupe à search...
}
function deselectSearchBar() { //lorsque l'utilisateur clique en dehors de la searchbar

    setTimeout(resetSearchBar, 200); //délai avant exécution pour éviter de casser les liens du dropdown

}
function resetSearchBar() { //remise à zéro searchbar (voir selectsearchbar)
    SEARCHBAR_DROPDOWN.hide();
    SEARCHBAR.style.width = "36px";
    SEARCHBAR.placeholder = "⌕";
    SEARCHBAR.value = "";
    LOGO.style.opacity = "1";
    LOGO.style.pointerEvents = "auto";
    if (PAGE_TITLE) PAGE_TITLE.style.opacity = "1";
}


function createSeachDropdownHtmlList(array) { //création du dropdown avec les éléments récupérés
    let html = '';
    for (let element of array) { //itérer pour chaque objet du tableau renvoyé par tmdb
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

async function searchTmdb(SEARCHSTRING) { //recherche par string dans l'api tmdb
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TMDB_TOKEN}` //token utilisateur api défini en haut
        }
    };

    const RESPONSE = await fetch('https://api.themoviedb.org/3/search/movie?query=' + SEARCHSTRING + '&include_adult=false&language=en-US&page=1', options);
    const RESPONSE_JSON = await RESPONSE.json();

    //mode opératoire proposé par la doc de tmdb
    //fetch('https://api.themoviedb.org/3/search/movie?query=' + SEARCHSTRING + '&include_adult=false&language=en-US&page=1', options)
    //    .then(res => res.json())
    //    .then(res => console.log(res.results))
    //    .catch(err => console.error(err));


    createSeachDropdownHtmlList(RESPONSE_JSON.results); //créer la liste
}

//récupérer les infos d'un film par son id
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

//récupérer le cast d'un film par son id
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

//récupérer les tendances de la semaine
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

//récupérer les tendances de la journée
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
