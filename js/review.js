const PARAMS = new URLSearchParams(document.location.search);
const FILM_ID = PARAMS.get("id");
const REVIEW_TEXT_INPUT = document.getElementById("review-text-input");
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
const READ_STARS = document.getElementById("read-stars");
const READ_LOCATION = document.getElementById("read-location");
const LOCATION_INPUT = document.getElementById("location-input");
const GEO_BUTTON = document.getElementById("geo-button");
const STAR_1 = document.getElementById("star1");
const STAR_2 = document.getElementById("star2");
const STAR_3 = document.getElementById("star3");
const STAR_4 = document.getElementById("star4");
const STAR_5 = document.getElementById("star5");


SUBMIT_BUTTON.addEventListener("click", saveReview);
START_CAM_BUTTON.addEventListener("click", startCamera);
EDIT_BUTTON.addEventListener("click", toggleEditMode);
CANCEL_BUTTON.addEventListener("click", toggleEditMode);
GEO_BUTTON.addEventListener("click", geoLocation);

async function toggleEditMode() {
    console.debug("toggleEditMode");
    if (REVIEW_EditView.classList.contains("d-none")) {
        // En mode Lecture -> Passage en mode Edition
        REVIEW_EditView.classList.remove("d-none");
        REVIEW_ReadView.classList.add("d-none");
        const REVIEW = await getMovieReview(FILM_ID);
        if (REVIEW) {
            prepareEditValues(REVIEW);
        }
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

        createReviewReadCard(REVIEW.review);

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

function startCamera() {
    console.debug("starting camera");
}
function createMovieCard(FILM) {
    const YEAR = FILM.release_date.substring(0, 4);

    MOVIE_TITLE.innerHTML = FILM.title;
    document.getElementById("review-backdrop").style.backgroundImage = `url('https://image.tmdb.org/t/p/original${FILM.backdrop_path}')`;
    MOVIE_POSTER.src = `https://image.tmdb.org/t/p/original${FILM.poster_path}`;
    MOVIE_YEAR.innerHTML = YEAR;
    MOVIE_OVERVIEW.innerHTML = FILM.overview;

}
function createReviewReadCard(REVIEW) {
    console.debug(REVIEW);
    const RATING = REVIEW.rating;
    review_text = REVIEW.text;
    READ_TEXT.innerHTML = review_text
    let starsHtml = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= RATING) {
            starsHtml += "★";
        } else {
            starsHtml += "☆";
        }
    }
    READ_STARS.innerHTML = starsHtml;
    READ_LOCATION.innerHTML = REVIEW.location;

}
function saveReview() {
    const REVIEW = { rating: getRating(), text: REVIEW_TEXT_INPUT.value, location: LOCATION_INPUT.value, mfw: `${FILM_ID}-mfw` };
    submitMovieReview(FILM_ID, REVIEW);
    createReviewReadCard(REVIEW);
    toggleEditMode();
}
function getRating() {
    if (STAR_5.checked) { return 5; }
    if (STAR_4.checked) { return 4; }
    if (STAR_3.checked) { return 3; }
    if (STAR_2.checked) { return 2; }
    if (STAR_1.checked) { return 1; }
    return 0;
}
function setRating(VALUE) {
    switch (VALUE) {
        case 1:
            STAR_1.checked = true;
            break;
        case 2:
            STAR_2.checked = true;
            break;
        case 3:
            STAR_3.checked = true;
            break;
        case 4:
            STAR_4.checked = true;
            break;
        case 5:
            STAR_5.checked = true;
            break;
        default:
            break;
    }

}
function prepareEditValues(REVIEW) {
    REVIEW_TEXT_INPUT.value = REVIEW.review.text;
    LOCATION_INPUT.value = REVIEW.review.location;
    setRating(REVIEW.review.rating);
}
async function geoLocation() {
    const LOCATION = navigator.geolocation.getCurrentPosition();
    console.debug(LOCATION.coords.latitute);
    console.debug(LOCATION.coords.longitude);

    //const COORDINATES = 

    //LOCATION_INPUT.value = 
}