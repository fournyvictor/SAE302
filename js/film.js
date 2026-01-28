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
const REVIEW_BUTTON_IMAGE = document.getElementById("review-button-image");
const SHARE_BUTTON = document.getElementById("share-button");


REVIEW_BUTTON.addEventListener("click", onReviewButtonClick);

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

    LIKE_BUTTON.addEventListener("click", onLikeButtonClick.bind(null, FILM));
    if (FILM) {
        REVIEW_BUTTON_IMAGE.id = `${FILM.id}-review-picto`;
        LIKE_BUTTON_IMAGE.id = `${FILM.id}-like-picto`;
        updateLikePicto(IS_LIKED, FILM.id);
        const CAST = await getMovieCast(FILM.id);
        makeFilmDisplayHtml(FILM, CAST);
    }
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
    const shareData = {
        title: `FullBoxd - ${DATA.title}`,
        text: `Write a review on FullBoxd about ${DATA.title}`,
        url: `https://webdev.fourny.org/victor/SAE302/film/?id=${DATA.id}`,
    };
    SHARE_BUTTON.addEventListener("click", shareMovie.bind(null, shareData));
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
async function shareMovie(shareData) {
    try {
        await navigator.share(shareData);
        console.debug("MDN shared successfully");
    } catch (err) {
        console.debug(`Error: ${err}`);
    }
}