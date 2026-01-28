const PARAMS = new URLSearchParams(document.location.search);
const FILM_ID = PARAMS.get("id");
const INPUT_FIELD = document.getElementById("review-text-input");
const SUBMIT_BUTTON = document.getElementById("save-button");
const START_CAM_BUTTON = document.getElementById("start-cam-button");
const REVIEW_ReadView = document.getElementById("review-read-view");
const REVIEW_EditView = document.getElementById("review-edit-view");
const EDIT_BUTTON = document.getElementById("edit-button");
const CANCEL_BUTTON = document.getElementById("cancel-button");
const SNAP_BUTTON = document.getElementById("snap-button");
const RETAKE_BUTTON = document.getElementById("retake-button");
const MOVIE_TITLE = document.getElementById("review-movie-title");
const MOVIE_POSTER = document.getElementById("review-movie-poster");
const MOVIE_YEAR = document.getElementById("review-movie-year");
const MOVIE_OVERVIEW = document.getElementById("review-movie-overview");
const READ_TEXT = document.getElementById("read-text");


SUBMIT_BUTTON.addEventListener("click", sendReviewToDB);
START_CAM_BUTTON.addEventListener("click", startCamera);
EDIT_BUTTON.addEventListener("click", toggleEditMode);
CANCEL_BUTTON.addEventListener("click", toggleEditMode);

function toggleEditMode() {
    console.debug("toggleEditMode");
    if (REVIEW_EditView.classList.contains("d-none")) {
        // En mode Lecture -> Passage en mode Edition
        REVIEW_EditView.classList.remove("d-none");
        REVIEW_ReadView.classList.add("d-none");
    } else {
        // En mode Edition -> Passage en mode Lecture
        REVIEW_EditView.classList.add("d-none");
        REVIEW_ReadView.classList.remove("d-none");
    }
}

main();
async function main() {
    const IS_LIKED = await checkIfMovieLiked(parseInt(FILM_ID));
    let FILM;
    console.debug(IS_LIKED);
    if (IS_LIKED) {
        FILM = IS_LIKED;
        console.debug("Données du film lues en DB");
    } else {
        console.debug("Données du film lues depuis l'api");
        FILM = await getFilmData(FILM_ID);
    }

    REVIEW = await getMovieReview(FILM_ID);
    console.debug(REVIEW);
    let review_text;
    if (REVIEW) {
        console.debug("review existante");
        review_text = REVIEW.review;
        READ_TEXT.innerHTML = review_text

        // Switch to Read Mode
        REVIEW_EditView.classList.add("d-none");
        REVIEW_ReadView.classList.remove("d-none");

    } else {
        console.debug("review inexistante");
        review_text = null;
        // Default to Edit Mode (already set in HTML)
        REVIEW_EditView.classList.remove("d-none");
        REVIEW_ReadView.classList.add("d-none");
    }
    createMovieCard(FILM);
    console.debug(review_text);

}
function sendReviewToDB() {
    console.debug("envoi de la review");
    submitMovieReview(FILM_ID, INPUT_FIELD.value);
}
function startCamera() {
    console.debug("starting camera");
}
function createMovieCard(FILM) {
    const YEAR = FILM.release_date.substring(0, 4);

    MOVIE_TITLE.innerHTML = FILM.title;
    MOVIE_POSTER.src = `https://image.tmdb.org/t/p/original${FILM.poster_path}`;
    MOVIE_YEAR.innerHTML = YEAR;
    MOVIE_OVERVIEW.innerHTML = FILM.overview;

}