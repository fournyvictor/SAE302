const PARAMS = new URLSearchParams(document.location.search);
const FILM_ID = PARAMS.get("id");
const FILM_CONTAINER = document.getElementById("film-container");
const DATA_BACKDROP_IMAGE = document.getElementById("data-backdrop-image");
const DATA_IMAGE_POSTER = document.getElementById("data-image-poster");
const DATA_FILM_TITLE = document.getElementById("data-film-title");
const DATA_FILM_YEAR = document.getElementById("data-film-year");
const DATA_ORIGINAL_TITLE = document.getElementById("data-original-title");
const DATA_FILM_TAGLINE = document.getElementById("data-film-tagline");
const DATA_FILM_OVERVIEW = document.getElementById("data-film-overview");
const CAST_LIST = document.getElementById("cast-list");
const LIKE_BUTTON = document.getElementById("like-button");
const REVIEW_BUTTON = document.getElementById("review-button");
const LIKE_BUTTON_IMAGE = document.getElementById("like-button-image");



LIKE_BUTTON.addEventListener("click", onLikeButtonClick);
REVIEW_BUTTON.addEventListener("click", onReviewButtonClick);

let is_movie_liked = false;


main();

async function main() {

    if (FILM_ID) {
        checkIfMovieLiked();
        console.debug(FILM_ID);
        const CAST = await getMovieCast(FILM_ID);
        console.debug(CAST[0]);
        console.debug(await getFilmData(FILM_ID, CAST));
        makeFilmDisplayHtml(await getFilmData(FILM_ID), CAST);
    }
}

async function getFilmData(ID) {

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzAwODk3NTQ0ZTUwZTg5N2Y4ZGZhNzlkNzY4YjcxNyIsIm5iZiI6MTY1NjI3ODM4NC4xNTYsInN1YiI6IjYyYjhjZDcwMTdjNDQzMDA2MDRiMjEwOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZNZGW6-VnxqWAMDfqYZYtNRxbdZfLgqcMu3mysVMv-c'
        }
    };


    const RESPONSE = await fetch(`https://api.themoviedb.org/3/movie/${ID}?language=en-US`, options);
    const RESPONSE_JSON = await RESPONSE.json();
    return RESPONSE_JSON;
}

async function getMovieCast(ID) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzAwODk3NTQ0ZTUwZTg5N2Y4ZGZhNzlkNzY4YjcxNyIsIm5iZiI6MTY1NjI3ODM4NC4xNTYsInN1YiI6IjYyYjhjZDcwMTdjNDQzMDA2MDRiMjEwOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZNZGW6-VnxqWAMDfqYZYtNRxbdZfLgqcMu3mysVMv-c'
        }
    };

    const RESPONSE = await fetch(`https://api.themoviedb.org/3/movie/${ID}/credits?language=en-US`, options);
    const RESPONSE_JSON = await RESPONSE.json();
    return RESPONSE_JSON.cast;
}

function makeFilmDisplayHtml(DATA, CAST) {
    const YEAR = DATA.release_date.substring(0, 4);
    DATA_BACKDROP_IMAGE.style = `background-image: url('https://image.tmdb.org/t/p/original${DATA.backdrop_path}');`;
    DATA_IMAGE_POSTER.src = `https://image.tmdb.org/t/p/original${DATA.poster_path}`;
    DATA_FILM_TITLE.innerHTML = DATA.title;
    DATA_FILM_YEAR.innerHTML = YEAR;
    DATA_ORIGINAL_TITLE.innerHTML = DATA.original_title;
    DATA_FILM_TAGLINE.innerHTML = DATA.tagline;
    DATA_FILM_OVERVIEW.innerHTML = DATA.overview;
    let casthtml = ""
    for (let element of CAST.slice(0, 10)) {
        casthtml += `<div class="cast-item d-flex align-items-center mb-2">
                                <div class="cast-photo-wrapper me-3">
                                    <img src="https://image.tmdb.org/t/p/w45${element.profile_path}"
                                        alt="${element.name}" class="cast-img">
                                </div>
                                <div class="cast-info">
                                    <div class="cast-name fw-bold text-white mb-0">${element.name}</div>
                                    <div class="cast-role text-secondary small">${element.character}</div>
                                </div>
                            </div>`
    };
    CAST_LIST.innerHTML = casthtml;

}

/******************************************************************************/
/* INTERACTIONS DB                                                            */
/******************************************************************************/

function onLikeButtonClick() {
    const DB = "FullBoxdDB";
    const REQUEST = indexedDB.open(DB, 1);

    REQUEST.onerror = onDBError;

    if (is_movie_liked) {
        REQUEST.onsuccess = onDBSuccessLikeRemove;
    } else {
        REQUEST.onsuccess = onDBSuccessLikeAdd;

    }

}
function onReviewButtonClick() {
    console.debug("AHAHAHA");
}
function checkIfMovieLiked() {
    const DB = "FullBoxdDB";
    const REQUEST = indexedDB.open(DB, 1);

    REQUEST.onupgradeneeded = onDBUgradeNeeded;

    REQUEST.onerror = onDBError;
    REQUEST.onsuccess = onDBSuccessCheckLike;

}

function onDBError(event) {
    console.error("Erreur IndexedDB:", event.target.error);
}
function onDBUgradeNeeded(event) {
    const DB = event.target.result;
    //creation de likes si non existant
    if (!DB.objectStoreNames.contains("likes")) {
        DB.createObjectStore("likes", { keyPath: "filmId" });
    }
    //creation de reviews si non existant
    if (!DB.objectStoreNames.contains("reviews")) {
        DB.createObjectStore("reviews", { keyPath: "filmId" });
    }
}
function onDBSuccessLikeAdd(event) {
    const DB = event.target.result;

    const TRANSACTION = DB.transaction(["likes"], "readwrite");
    const OBJECTSTORE = TRANSACTION.objectStore("likes");

    // ajout du film aux likes
    const ENTRY = { filmId: FILM_ID, addedAt: new Date() };
    const REQUEST = OBJECTSTORE.add(ENTRY);

    REQUEST.onsuccess = successfullyLiked;
    REQUEST.onerror = dbTransactionError;
}
function onDBSuccessLikeRemove(event) {
    const DB = event.target.result;

    const TRANSACTION = DB.transaction(["likes"], "readwrite");
    const OBJECTSTORE = TRANSACTION.objectStore("likes");

    // retirer le film des likes
    const REQUEST = OBJECTSTORE.delete(FILM_ID);

    REQUEST.onsuccess = successfullyUnLiked;
    REQUEST.onerror = dbTransactionError;
}
function onDBSuccessCheckLike(event) {
    const DB = event.target.result;

    const TRANSACTION = DB.transaction(["likes"], "readonly");
    const OBJECTSTORE = TRANSACTION.objectStore("likes");

    const REQUEST = OBJECTSTORE.get(FILM_ID);

    REQUEST.onsuccess = onCheckLikedResult;
    REQUEST.onerror = dbTransactionError;

}
function dbTransactionError(event) {
    console.error("erreur de transaction db : ", event.target.error);
}
function successfullyLiked() {
    console.log(`Film ${FILM_ID} ajouté aux likes !`);
    LIKE_BUTTON_IMAGE.src = "../Misc/icon_heart_full.svg"
    is_movie_liked = true;
}
function successfullyUnLiked() {
    console.log(`Film ${FILM_ID} retiré des likes !`)
    LIKE_BUTTON_IMAGE.src = "../Misc/icon_heart.svg"
    is_movie_liked = false;
}
function onCheckLikedResult(event) {
    const RESULT = event.target.result;

    if (RESULT) {
        console.log("Le film est liké");
        LIKE_BUTTON_IMAGE.src = "../Misc/icon_heart_full.svg"
        is_movie_liked = true;
    } else {
        LIKE_BUTTON_IMAGE.src = "../Misc/icon_heart.svg"
    }
}