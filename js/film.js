const PARAMS = new URLSearchParams(document.location.search);
const FILM_ID = PARAMS.get("id");
const FILM_CONTAINER = document.getElementById("film-container");

main();

async function main() {

    if (FILM_ID) {
        console.debug(FILM_ID);
        console.debug(await getFilmData(FILM_ID));
        makeFilmDisplayHtml(await getFilmData(FILM_ID));
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

function makeFilmDisplayHtml(DATA) {
    const HTML = `<div class="banner-wrapper position-relative">
        <div class="backdrop-image" style="background-image: url('https://image.tmdb.org/t/p/original${DATA.backdrop_path}');"></div>
            <div class="backdrop-overlay"></div>
        </div>

        <div class="container content-overlay">
            <div class="row">
                <div class="col-md-3">
                    <div class="poster-container">
                        <img src="https://image.tmdb.org/t/p/w154${DATA.poster_path}" class="img-fluid rounded border border-secondary shadow-lg" alt="Poster">
                    </div>
                </div>
        
                <div class="col-md-6 text-white pt-4">
                    <h1 class="fw-bold display-5">${DATA.title}<span class="text-secondary fw-light">2025</span></h1>
                    <p class="text-secondary">Directed by <span class="text-white border-bottom">${DATA.title}</span></p>
                    <p class="mt-4 small-caps text-uppercase tracking-widest text-secondary">${DATA.original_title}</p>
                    <p class="lead">${DATA.overview}</p>
                </div>

                <div class="col-md-3 pt-4">
                </div>
            </div>
        </div>`;
    FILM_CONTAINER.innerHTML = HTML;

}