//récupération des paramètres et de l'id
const PARAMS = new URLSearchParams(document.location.search);
const FILM_ID = PARAMS.get("id");
const REVIEW_TEXT_INPUT = document.getElementById("review-text-input");
const SUBMIT_BUTTON = document.getElementById("save-button");
const REVIEW_READ_VIEW = document.getElementById("review-read-view");
const REVIEW_EDIT_VIEW = document.getElementById("review-edit-view");
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
const INPUT_CAMERA = document.getElementById("mfw-file-input");
const PREVIEW_IMG = document.getElementById("mfw-preview");
const BTN_SELFIE = document.getElementById("start-cam-button");
const CONTAINER_START = document.getElementById("start-cam-container");
const CONTAINER_RESULT = document.getElementById("result-container");

let photoToSave = null;

//écouteurs d'événements
SUBMIT_BUTTON.addEventListener("click", saveReview);
EDIT_BUTTON.addEventListener("click", toggleEditMode);
CANCEL_BUTTON.addEventListener("click", toggleEditMode);
GEO_BUTTON.addEventListener("click", geoLocation);
BTN_SELFIE.addEventListener("click", openCamera);
INPUT_CAMERA.addEventListener("change", selectedFile);


//ouvre le sélecteur de fichier (caméra)
function openCamera() {
    INPUT_CAMERA.click();
}

//gestion du fichier sélectionné
function selectedFile(event) {
    const file = event.target.files[0];

    if (file) {
        photoToSave = file;

        PREVIEW_IMG.src = URL.createObjectURL(file);

        CONTAINER_START.classList.add("d-none");
        CONTAINER_RESULT.classList.remove("d-none");
    }
}

//bascule entre le mode lecture et édition
async function toggleEditMode() {
    if (REVIEW_EDIT_VIEW.classList.contains("d-none")) {
        //mode lecture -> mode édition
        REVIEW_EDIT_VIEW.classList.remove("d-none");
        REVIEW_READ_VIEW.classList.add("d-none");
        const REVIEW = await getMovieReview(FILM_ID);
        if (REVIEW) {
            prepareEditValues(REVIEW);
        }
    } else {
        //mode édition -> mode lecture
        REVIEW_EDIT_VIEW.classList.add("d-none");
        REVIEW_READ_VIEW.classList.remove("d-none");
    }
}

//fonction principale
main();
async function main() {
    const IS_LIKED = await checkIfMovieLiked(parseInt(FILM_ID));
    let FILM;
    if (IS_LIKED) {
        FILM = IS_LIKED;
    } else {
        FILM = await getFilmData(FILM_ID);
    }

    const REVIEW = await getMovieReview(FILM_ID);
    if (REVIEW) {

        createReviewReadCard(REVIEW.review);

        REVIEW_EDIT_VIEW.classList.add("d-none");
        REVIEW_READ_VIEW.classList.remove("d-none");

    } else {
        // Default to Edit Mode (already set in HTML)
        REVIEW_EDIT_VIEW.classList.remove("d-none");
        REVIEW_READ_VIEW.classList.add("d-none");
    }
    createMovieCard(FILM);

}
//remplit les infos du film
function createMovieCard(FILM) {
    const YEAR = FILM.release_date.substring(0, 4);

    MOVIE_TITLE.innerHTML = FILM.title;
    document.getElementById("review-backdrop").style.backgroundImage = `url('https://image.tmdb.org/t/p/original${FILM.backdrop_path}')`;
    MOVIE_POSTER.src = `https://image.tmdb.org/t/p/original${FILM.poster_path}`;
    MOVIE_YEAR.innerHTML = YEAR;
    MOVIE_OVERVIEW.innerHTML = FILM.overview;

}
//remplit la carte review en lecture
function createReviewReadCard(REVIEW) {
    const RATING = REVIEW.rating;
    READ_TEXT.innerHTML = REVIEW.text;
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
    getMFWImageFromCache(FILM_ID);

}
//récupère la photo selfie depuis le cache
async function getMFWImageFromCache(FILM_ID) {
    const CACHE = await caches.open("mfw-cache"); // ouverture du cache mfw-cache
    const RESPONSE = await CACHE.match("/mfw/" + FILM_ID); //creer chemin
    const IMG_TAG = document.getElementById("read-mfw-image");
    const IMG_CONTAINER = document.getElementById("read-mfw-container");

    if (RESPONSE) {
        const IMG = await RESPONSE.blob();
        IMG_TAG.src = URL.createObjectURL(IMG);
        IMG_CONTAINER.classList.remove("d-none");

    } else { IMG_CONTAINER.classList.add("d-none"); }
}
//sauvegarde la review en db et la photo en cache
async function saveReview() {
    const REVIEW = { rating: getRating(), text: REVIEW_TEXT_INPUT.value, location: LOCATION_INPUT.value, mfw: `${FILM_ID}-mfw` };
    submitMovieReview(FILM_ID, REVIEW);
    if (photoToSave) {
        const CACHE = await caches.open('mfw-cache');

        const response = new Response(photoToSave, { //réponse http fictive pour le cache
            headers: { 'Content-Type': photoToSave.type }
        });
        await CACHE.put(`/mfw/${FILM_ID}`, response); //fausse url de stockage
    }



    createReviewReadCard(REVIEW);
    toggleEditMode();

    if (!await checkIfMovieLiked(parseInt(FILM_ID))) {
        onLikeButtonClick(await getFilmData(FILM_ID));

    }
}
//récupère la note sélectionnée
function getRating() {
  let value = 0;
    if (STAR_5.checked) { value = 1; }
    if (STAR_4.checked) { value = 2; }
    if (STAR_3.checked) { value = 3; }
    if (STAR_2.checked) { value = 4; }
    if (STAR_1.checked) { value = 5; }
    return value;
}
//coche les étoiles selon la note
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
//prépare les champs avec les valeurs existantes
function prepareEditValues(REVIEW) {
    REVIEW_TEXT_INPUT.value = REVIEW.review.text;
    LOCATION_INPUT.value = REVIEW.review.location;
    setRating(REVIEW.review.rating);
}
//déclenche la géolocalisation
async function geoLocation() {
    navigator.geolocation.getCurrentPosition(convertCoordinates,errorOnGeoloc);
}
//convertit les coordonnées en adresse textuelle
async function convertCoordinates(pos) {
    const RESPONSE = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`);
    const RESPONSE_JSON = await RESPONSE.json();
    LOCATION_INPUT.value = `${RESPONSE_JSON.address.house_number} ${RESPONSE_JSON.address.road}, ${RESPONSE_JSON.address.postcode} ${RESPONSE_JSON.address.municipality}`;
}
function errorOnGeoLoc(event){
  console.error("ERREUR LORS DE LA GEOLOCALISATION : ", event);
}
