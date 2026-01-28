

const TRENDING_CONTAINER = document.getElementById("trending-container");

main();

async function main() {
    createTrendingCaroussel();
}
async function createTrendingCaroussel() {
    console.debug("createTrendingCaroussel");
    const MOVIES = await getTrendingMovies();
    console.debug(MOVIES);
    let html = "";
    for (element of MOVIES) {
        html = + `<a href="./film/?id=${element.id}" class="trending-card">
    <img src="https://image.tmdb.org/t/p/w342${element.poster_path}" class="img-fluid" alt="${element.title}">
    </a>`;
    }
    TRENDING_CONTAINER.innerHTML = html;

}