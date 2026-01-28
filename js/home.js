

const TRENDING_CONTAINER = document.getElementById("trending-container");

main();

async function main() {

}
async function createTrendingCaroussel() {
    const MOVIES = await getTrendingMovies();
    let html = "";
    for (element of MOVIES) {
        html = + `<a href="./film/?id=${element.id}" class="trending-card">
    <img src="https://image.tmdb.org/t/p/w342${element.poster_path}" class="img-fluid" alt="${element.title}">
    </a>`
    }

}