const MOVIE_LIST_CONTAINER = document.getElementById("movie-list-container");


main();

function main() {
    createMovieListHtml();
}


async function createMovieListHtml() {
    const ARRAY = await getAllLikedMovies();
    console.debug(ARRAY);
    let html = "";
    //TEMPORAIRE
    //submitMovieReview(268, "BONJOUR CECI EST UNE REVIEW DE BATMAN");
    //TEMPORAIRE

    for (element of ARRAY.reverse()) {

        let reviewHtml = "";
        const DATA = element['filmData'];
        console.debug(DATA);
        const YEAR = DATA.release_date.substring(0, 4);
        const REVIEW = await getMovieReview(DATA.id);
        let review_text;
        if (REVIEW) {
            review_text = REVIEW.review;
        } else { review_text = false; }
        if (!review_text) {
            reviewHtml = `<p class="card-text d-none d-sm-block text-truncate">You did not write a review about ${DATA.title} yet. </p>
                    <a class="write-review-button" href="https://webdev.fourny.org/victor/SAE302/review/?id=${DATA.id}"><button class="btn btn-outline-light btn-sm mt-2" >Write a review</button></a>`
        } else {
            reviewHtml = `<p class="card-text d-none d-sm-block text-truncate">${review_text}</p>
                    <a class="write-review-button" href="https://webdev.fourny.org/victor/SAE302/review/?id=${DATA.id}"><button class="btn btn-outline-light btn-sm mt-2" >Edit your review</button></a>`
        }
        html += `<div class="card mb-3 w-100 border-0 bg-transparent text-white">
        <div class="row g-0 align-items-center">
            <div class="col-4 col-md-2">
                <img src="https://image.tmdb.org/t/p/original${DATA.poster_path}..." class="img-fluid rounded" alt="${DATA.title}">
            </div>

            <div class="col-8 col-md-10">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${DATA.title}</h5>
                    <p class="card-text text-secondary mb-1">${YEAR}</p>
                    <p class="card-text d-none d-sm-block card-text-truncate">${DATA.overview}</p>
                    <a href="https://webdev.fourny.org/victor/SAE302/film/?id=${DATA.id}">
                    <button class="btn btn-outline-light btn-sm mt-2" >See details</button></a>
                    <hr class="my-4">
                    <h5 class="card-title fw-bold">Your review on ${DATA.title}</h5>
                    ${reviewHtml}
                </div>
            </div>
        </div>
    </div>`
    }

    MOVIE_LIST_CONTAINER.innerHTML = html;
}
