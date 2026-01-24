const SEARCHBAR = document.getElementById("searchbar");
if (SEARCHBAR) {
    const SEARCHBAR_DROPDOWN = bootstrap.Dropdown.getOrCreateInstance(SEARCHBAR);
    const SEARCHBAR_DROPDOWN_LIST = document.getElementById("searchbar-dropdown-menu-list");

    SEARCHBAR.addEventListener("input", updateSearchBar);
    SEARCHBAR.addEventListener("focus", updateSearchBar);
    SEARCHBAR.addEventListener("blur", deselectSearchBar);

    function updateSearchBar() {
        const SEARCHBAR_STRING = SEARCHBAR.value;
        if (SEARCHBAR_STRING != '') {
            searchTmdb(SEARCHBAR_STRING);
            SEARCHBAR_DROPDOWN.show();

        } else {
            SEARCHBAR_DROPDOWN.hide();
        }
    }

    function deselectSearchBar() {

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

        try {
            const RESPONSE = await fetch('https://api.themoviedb.org/3/search/movie?query=' + SEARCHSTRING + '&include_adult=false&language=en-US&page=1', options);
            const RESPONSE_JSON = await RESPONSE.json();
            createSeachDropdownHtmlList(RESPONSE_JSON.results);
        } catch (error) {
            console.error("Error searching TMDB:", error);
        }
    }

    function createSeachDropdownHtmlList(array) {
        let html = '';
        if (array) {
            for (let element of array) {
                html += `<li><a href="https://webdev.fourny.org/victor/SAE302/film/?id=${element.id}">
                        <div class="card mb-3 dropdown-search-card" style="max-width: 800px;">
                            <div class="row g-0">
                                <div class="col-md-3">
                                    <img src="https://image.tmdb.org/t/p/w154${element.poster_path}" class="img-fluid rounded-start" alt="${element.title} poster">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <h5 class="card-title">${element.title}</h5>
                                            <p class="card-text"><small class="text-muted">${element.release_date}</small></p>
                                            <p class="card-text card-text-truncate">${element.overview}</p>
                                    </div>
                                </div>
                            </div>
                        </div></a></li>`;
            }
        }
        SEARCHBAR_DROPDOWN_LIST.innerHTML = html;
    }
}
