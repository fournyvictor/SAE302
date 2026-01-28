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
        let starsHtml = "";
        console.debug("REVIEW : ", DATA.id, REVIEW);
        if (REVIEW) {
            review_text = REVIEW.review.text;
            for (let i = 1; i <= 5; i++) {
                if (i <= REVIEW.review.rating) {
                    starsHtml += "★";
                } else {
                    starsHtml += "☆";
                }
            }
        } else { review_text = false; }
        if (!review_text) {
            reviewHtml = `<p class="card-text card-text-truncate-3">You did not write a review about ${DATA.title} yet. </p>
                    <a class="write-review-button" href="https://webdev.fourny.org/victor/SAE302/review/?id=${DATA.id}"><button class="btn btn-outline-light btn-sm mt-2" >Write a review</button></a>`
        } else {
            reviewHtml = `<p class="card-text card-text-truncate-3">${review_text}</p>
                    <a class="write-review-button" href="https://webdev.fourny.org/victor/SAE302/review/?id=${DATA.id}"><button class="btn btn-outline-light btn-sm mt-2" >Edit your review</button></a>`
        }
        html += `<div class="card mb-3 w-100 border-0 bg-transparent text-white">
        <div class="row g-0 align-items-center">
            
            <!-- Mobile Title (Visible only on mobile) -->
            <div class="col-12 d-md-none mb-2">
                <h5 class="fw-bold">${DATA.title}</h5>
            </div>

            <div class="col-4 col-md-2">
                <a href="../film/?id=${DATA.id}">
                    <img src="https://image.tmdb.org/t/p/original${DATA.poster_path}" class="img-fluid rounded" alt="${DATA.title}">
                </a>
            </div>

            <div class="col-8 col-md-10">
                <div class="card-body">
                    <!-- Desktop Title (Hidden on mobile) -->
                    <h5 class="card-title fw-bold d-none d-md-block">${DATA.title}</h5>
                    
                    <p class="card-text text-secondary mb-1 d-none d-md-block">${YEAR}</p>
                    <p class="card-text card-text-truncate-2 d-none d-md-block">${DATA.overview}</p>
                    
                    <hr class="my-4 d-none d-md-block"> <!-- Separator hidden on mobile if content above is hidden -->
                    
                    <h5 class="card-title fw-bold">Your review <span id="stars-${DATA.id}" class="text-warning ms-2 fs-6">${starsHtml}</span></h5>
                    ${reviewHtml}
                </div>
            </div>
        </div>
    </div>
    <hr class="my-4">`
    }

    MOVIE_LIST_CONTAINER.innerHTML = html;
}
