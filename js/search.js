const SEARCHBAR = document.getElementById("searchbar");
const SEARCHBAR_DROPDOWN = bootstrap.Dropdown.getOrCreateInstance(SEARCHBAR);
const SEARCHBAR_DROPDOWN_LIST = document.getElementById("searchbar-dropdown-menu-list");

SEARCHBAR.addEventListener("input", updateSearchBar);
SEARCHBAR.addEventListener("focus", selectSearchBar);
SEARCHBAR.addEventListener("blur", deselectSearchBar);


/******************************************************************************/
/* TEST TMDB                                                    */
/******************************************************************************/

function updateSearchBar() {
    const SEARCHBAR_STRING = SEARCHBAR.value;
    if (SEARCHBAR_STRING != '') {
        searchTmdb(SEARCHBAR_STRING);
        SEARCHBAR_DROPDOWN.show();

    } else {
        SEARCHBAR_DROPDOWN.hide();
    }
}
function selectSearchBar() {
    updateSearchBar();
    SEARCHBAR.style.width = "75vw";
    SEARCHBAR.placeholder = "Rechercher...";
}
function deselectSearchBar() {
    setTimeout(resetSearchBar, 200);

}
function resetSearchBar() {
    //SEARCHBAR_DROPDOWN.hide();
    SEARCHBAR.style.width = "36px";
    SEARCHBAR.placeholder = "⌕";
    SEARCHBAR.value = "";
}

async function searchTmdb(SEARCHSTRING) {
    console.log("recherche tmdb : ", SEARCHSTRING);
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YzAwODk3NTQ0ZTUwZTg5N2Y4ZGZhNzlkNzY4YjcxNyIsIm5iZiI6MTY1NjI3ODM4NC4xNTYsInN1YiI6IjYyYjhjZDcwMTdjNDQzMDA2MDRiMjEwOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZNZGW6-VnxqWAMDfqYZYtNRxbdZfLgqcMu3mysVMv-c'
        }
    };

    const RESPONSE = await fetch('https://api.themoviedb.org/3/search/movie?query=' + SEARCHSTRING + '&include_adult=false&language=en-US&page=1', options);
    const RESPONSE_JSON = await RESPONSE.json();
    //fetch('https://api.themoviedb.org/3/search/movie?query=' + SEARCHSTRING + '&include_adult=false&language=en-US&page=1', options)
    //    .then(res => res.json())
    //    .then(res => console.log(res.results))
    //    .catch(err => console.error(err));


    createSeachDropdownHtmlList(RESPONSE_JSON.results);
}

function createSeachDropdownHtmlList(array) {
    let html = '';
    for (let element of array) {
        html += `<li><a href="https://webdev.fourny.org/victor/SAE302/film/?id=${element.id}">
                <div class="card dropdown-search-card">
                    <div class="d-flex">
                        
                            <img src="https://image.tmdb.org/t/p/w154${element.poster_path}" class="rounded-start" alt="${element.title} poster">
                        
                        
                            <div class="card-body">
                                <h5 class="card-title">${element.title}</h5>
                                    <p class="card-text"><small class="anee-card">${element.release_date.substring(0, 4)}</small></p>
                                    <p class="card-text card-text-truncate">${element.overview}</p>
                            
                        </div>
                    </div>
                </div></a></li>`;
        // html += '<li><img href="https://image.tmdb.org/t/p/w92' + element.poster_path + '"><a class="dropdown-item" href="#">' + element.title + '</a></li>';
    }
    SEARCHBAR_DROPDOWN_LIST.innerHTML = html;
}