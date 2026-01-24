const PARAMS = new URLSearchParams(document.location.search);
const FILM_ID = PARAMS.get("id");
const FILM_CONTAINER = document.getElementById("film-container");
const LIKE_BUTTON = document.getElementById("like-button");
const REVIEW_BUTTON = document.getElementById("review-button");


LIKE_BUTTON.addEventListener("click", onLikeButtonClick);
REVIEW_BUTTON.addEventListener("click", onReviewButtonClick);


main();

async function main() {

    if (FILM_ID) {
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
    console.debug('year : ', YEAR);

    let html = `<div class="banner-wrapper position-relative">
        <div class="backdrop-image" style="background-image: url('https://image.tmdb.org/t/p/original${DATA.backdrop_path}');"></div>
            <div class="backdrop-overlay"></div>
        </div>

        <div class="container content-overlay">
            <div class="row">
                <div class="col-md-3">
                    <div class="poster-container">
                        <img src="https://image.tmdb.org/t/p/original${DATA.poster_path}" class="img-fluid rounded border border-secondary shadow-lg" alt="Poster">
                    </div>
                </div>
        
                <div class="col-md-6 text-white pt-4">
                    <h1 class="fw-bold display-5 mb-2">${DATA.title}</h1>
                    
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <span class="text-secondary fw-light display-5">${YEAR}</span>
                        
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-secondary action-btn" id="like-button">
                                <img src="../Misc/icon_heart.svg" width="20" height="20">
                            </button>
                            <button class="btn btn-sm btn-outline-secondary action-btn" id="review-button">
                                <img src="../Misc/icon_book.svg" width="20" height="20">
                            </button>
                        </div>
                    </div>

                    <p class="text-secondary">${DATA.original_title}</p>
                    <p class="mt-4 small-caps tracking-widest text-secondary">${DATA.tagline}</p>
                    <p class="lead">${DATA.overview}</p>
                </div>

                <div class="col-md-3 pt-4">
                    <div class="cast-wrapper">
                        <h6 class="text-uppercase text-white border-bottom border-secondary pb-2 mb-3 tracking-widest small">Cast</h6>
        
                        <div class="cast-scroll-container">`

    for (let element of CAST.slice(0, 10)) {
        html += `<div class="cast-item d-flex align-items-center mb-2">
                    <div class="cast-photo-wrapper me-3">
                        <img src="https://image.tmdb.org/t/p/w45${element.profile_path}" alt="${element.name}" class="cast-img">
                    </div>
                    <div class="cast-info">
                        <div class="cast-name fw-bold text-white mb-0">${element.name}</div>
                        <div class="cast-role text-secondary small">${element.character}</div>
                    </div>
                </div>`
    };
    html += `</div>
                        </div>
                </div>
            </div>
        </div>`;
    FILM_CONTAINER.innerHTML = html;

}

function onLikeButtonClick() {
    let db;
    const request = indexedDB.open("MyTestDatabase");
    request.onerror = (event) => {
        console.error("Why didn't you allow my web app to use IndexedDB?!");
    };
    request.onsuccess = (event) => {
        db = event.target.result;
    };
}
function onReviewButtonClick() {

}