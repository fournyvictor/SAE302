const MOVIE_LIST_CONTAINER = document.getElementById("movie-list-container");


main();

function main() {
    createMovieListHtml();
}


async function createMovieListHtml() {
    const ARRAY = await getAllLikedMovies();
    console.debug(ARRAY);
    let html = "";
    for (element of ARRAY.reverse()) {
        const DATA = await getFilmData(element['filmId']);
        console.debug(DATA);
        const YEAR = DATA.release_date.substring(0, 4);
        html += `<div class="card mb-3 w-100 border-0 bg-transparent text-white">
        <div class="row g-0 align-items-center">
            <div class="col-4 col-md-2">
                <img src="https://image.tmdb.org/t/p/original${DATA.poster_path}..." class="img-fluid rounded" alt="${DATA.title}">
            </div>

            <div class="col-8 col-md-10">
                <div class="card-body">
                </div>
        <div class="row g-0 align-items-center">
        <h5 class="card-title fw-bold">${DATA.title}</h5>
                    <p class="card-text text-secondary mb-1">${YEAR}</p>
                    <p class="card-text d-none d-sm-block text-truncate">${DATA.overview}</p>
                    <a href="https://webdev.fourny.org/victor/SAE302/film/?id=${element['filmId']}">
                    <button class="btn btn-outline-light btn-sm mt-2" >Voir détails</button></a>
        </div>
        <div class="row g-0 align-items-center">
                    
                </div>
            </div>
        
        </div>
    </div>`
    }

    MOVIE_LIST_CONTAINER.innerHTML = html;
}
