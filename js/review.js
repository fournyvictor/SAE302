const PARAMS = new URLSearchParams(document.location.search);
const FILM_ID = PARAMS.get("id");

main();
console.debug(FILM_ID);
async function main() {
    REVIEW = getMovieReview(FILM_ID);
    console.debug(REVIEW);
}