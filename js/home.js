

const TRENDING_CONTAINER = document.getElementById("trending-container");
const TRENDING_CONTAINER_TODAY = document.getElementById("trending-container-today");
main();

async function main() {
    if (!navigator.onLine) {
        const message = '<p class="text-secondary small italic px-3">Trending movies will be updated once you are back online</p>';
        TRENDING_CONTAINER.innerHTML = message;
        TRENDING_CONTAINER_TODAY.innerHTML = message;
        return;
    }
    createTrendingCarousselDay();
    createTrendingCaroussel();
}
async function createTrendingCaroussel() {
    const MOVIES = await getTrendingMovies();
    let html = "";
    for (element of MOVIES) {
        html += `<a href="./film/?id=${element.id}" class="trending-card">
    <img src="https://image.tmdb.org/t/p/w342${element.poster_path}" class="img-fluid" alt="${element.title}">
    </a>`;
    }
    TRENDING_CONTAINER.innerHTML = html;
}
async function createTrendingCarousselDay() {
    const MOVIES = await getTrendingMoviesToday();
    let html = "";
    for (element of MOVIES) {
        html += `<a href="./film/?id=${element.id}" class="trending-card">
    <img src="https://image.tmdb.org/t/p/w342${element.poster_path}" class="img-fluid" alt="${element.title}">
    </a>`;
    }
    TRENDING_CONTAINER_TODAY.innerHTML = html;
}