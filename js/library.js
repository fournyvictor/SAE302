//conteneur de la liste des films
const MOVIE_LIST_CONTAINER = document.getElementById("movie-list-container");


main();

//fonction principale
function main() {
    createMovieListHtml();
}


//génère le html de la librairie
async function createMovieListHtml() {
    //récupération des films likés
    const ARRAY = await getAllLikedMovies();
    let html = "";


    //boucle sur chaque film (inversé pour le plus récent en premier)
    for (element of ARRAY.reverse()) {

        let reviewHtml = "";
        const DATA = element['filmData'];
        const YEAR = DATA.release_date.substring(0, 4);
        //récupération de la review
        const REVIEW = await getMovieReview(DATA.id);
        let reviewText;
        let starsHtml = "";
        if (REVIEW) {
            reviewText = REVIEW.review.text;
            for (let i = 1; i <= 5; i++) {
                //génération des étoiles
                if (i <= REVIEW.review.rating) {
                    starsHtml += "★";
                } else {
                    starsHtml += "☆";
                }
            }
        } else { reviewText = false; }
        //préparation du code html de la review
        if (!reviewText) {
            reviewHtml = `<p class="card-text card-text-truncate-3">You did not write a review about ${DATA.title} yet. </p>
                    <a class="write-review-button" href="../review/?id=${DATA.id}"><button class="btn btn-outline-light btn-sm mt-2" >Write a review</button></a>`
        } else {
            reviewHtml = `<p class="card-text card-text-truncate-3">${reviewText}</p>
                    <a class="write-review-button" href="../review/?id=${DATA.id}"><button class="btn btn-outline-light btn-sm mt-2" >Go to review</button></a>`
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

    //injection du html dans le conteneur
    MOVIE_LIST_CONTAINER.innerHTML = html;
}
