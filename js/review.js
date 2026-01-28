const PARAMS = new URLSearchParams(document.location.search);
const FILM_ID = PARAMS.get("id");
const INPUT_FIELD = document.getElementById("input-field");
const SUBMIT_BUTTON = document.getElementById("submit-button");

SUBMIT_BUTTON.addEventListener("click", submitMovieReview.bind(FILM_ID, INPUT_FIELD.value));

main();
async function main() {
    REVIEW = await getMovieReview(FILM_ID);
    console.debug(REVIEW);
    let review_text;
    if (REVIEW) {
        console.debug("review existante");
        review_text = REVIEW.review;
    } else {
        console.debug("review inexistante");
        review_text = null;
    }
    console.debug(review_text);


}