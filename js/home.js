/******************************************************************************/
/* page d'accueil                                                             */
/******************************************************************************/

/******************************************************************************/
/* constantes                                                                 */
/******************************************************************************/

const TRENDING_CONTAINER = document.getElementById("trending-container");
const TRENDING_CONTAINER_TODAY = document.getElementById("trending-container-today");


main();

async function main() {
    //si pas d'internet, messages d'erreur pour les carrousels
    if (!navigator.onLine) {
        const message = '<p class="text-secondary small italic px-3">Trending movies will be updated once you are back online</p>';
        TRENDING_CONTAINER.innerHTML = message;
        TRENDING_CONTAINER_TODAY.innerHTML = message;
        return;
    }
    createTrendingCarousselDay();
    createTrendingCaroussel();
}
//créer le carrousel des tendances hebdomadaires
async function createTrendingCaroussel() {
    const MOVIES = await getTrendingMovies();//récupérer les tendances hebdomadaires
    let html = "";
    for (element of MOVIES) { //itérer et fabriquer la carte
        html += `<a href="./film/?id=${element.id}" class="trending-card">
    <img src="https://image.tmdb.org/t/p/w342${element.poster_path}" class="img-fluid" alt="${element.title}">
    </a>`;
    }
    TRENDING_CONTAINER.innerHTML = html; //mettre à jour le html
}

//créer le carrousel des tendances du jour
async function createTrendingCarousselDay() {
    const MOVIES = await getTrendingMoviesToday(); //récupérer les tendances du jour
    let html = "";
    for (element of MOVIES) { //itérer et fabriquer la carte
        html += `<a href="./film/?id=${element.id}" class="trending-card">
    <img src="https://image.tmdb.org/t/p/w342${element.poster_path}" class="img-fluid" alt="${element.title}">
    </a>`;
    }
    TRENDING_CONTAINER_TODAY.innerHTML = html; //mettre à jour le html
}