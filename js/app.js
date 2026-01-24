/******************************************************************************/
/* Constants                                                                  */
/******************************************************************************/

const INSTALL_BUTTON = document.getElementById("install_button");
const RELOAD_BUTTON = document.getElementById("reload_button");
const SEARCHBAR = document.getElementById("searchbar");
const SEARCHBAR_DROPDOWN = bootstrap.Dropdown.getOrCreateInstance(SEARCHBAR);
const SEARCHBAR_DROPDOWN_LIST = document.getElementById("searchbar-dropdown-menu-list");

/******************************************************************************/
/* Listeners                                                                  */
/******************************************************************************/

INSTALL_BUTTON.addEventListener("click", installPwa);
RELOAD_BUTTON.addEventListener("click", reloadPwa);
SEARCHBAR.addEventListener("input", updateSearchBar);
SEARCHBAR.addEventListener("focus", updateSearchBar);
SEARCHBAR.addEventListener("blur", deselectSearchBar);

/******************************************************************************/
/* Global Variable                                                            */
/******************************************************************************/

let beforeInstallPromptEvent;

/******************************************************************************/
/* Main                                                                       */
/******************************************************************************/

main();

function main() {
    console.debug("main()");

    if (window.matchMedia("(display-mode: standalone)").matches) {
        console.log("Running as PWA");

        registerServiceWorker();
    }
    else {
        console.log("Running as Web page");

        window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
        window.addEventListener("appinstalled", onAppInstalled);
    }
}

/******************************************************************************/
/* Install PWA                                                                */
/******************************************************************************/

function onBeforeInstallPrompt(event) {
    console.debug("onBeforeInstallPrompt()");

    event.preventDefault();
    INSTALL_BUTTON.disabled = false;
    beforeInstallPromptEvent = event;
}

/**************************************/

async function installPwa() {
    console.debug("installPwa()");

    const RESULT = await beforeInstallPromptEvent.prompt();

    switch (RESULT.outcome) {
        case "accepted": console.log("PWA Install accepted"); break;
        case "dismissed": console.log("PWA Install dismissed"); break;
    }

    INSTALL_BUTTON.disabled = true;
    window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
}

/**************************************/

function onAppInstalled() {
    console.debug("onAppInstalled()");

    registerServiceWorker();
}

/******************************************************************************/
/* Register Service Worker                                                    */
/******************************************************************************/

async function registerServiceWorker() {
    console.debug("registerServiceWorker()");

    if ("serviceWorker" in navigator) {
        console.log("Register Service Worker…");

        try {
            const REGISTRATION = await navigator.serviceWorker.register("./service_worker.js");
            REGISTRATION.onupdatefound = onUpdateFound;

            console.log("Service Worker registration successful with scope:", REGISTRATION.scope);
        }
        catch (error) {
            console.error("Service Worker registration failed:", error);
        }
    }
    else {
        console.warn("Service Worker not supported…");
    }
}

/******************************************************************************/
/* Update Service Worker                                                    */
/******************************************************************************/

function onUpdateFound(event) {
    console.debug("onUpdateFound()");

    const REGISTRATION = event.target;
    const SERVICE_WORKER = REGISTRATION.installing;
    SERVICE_WORKER.addEventListener("statechange", onStateChange);
}

/**************************************/

function onStateChange(event) {
    const SERVICE_WORKER = event.target;

    console.debug("onStateChange", SERVICE_WORKER.state);

    if (SERVICE_WORKER.state == "installed" && navigator.serviceWorker.controller) {
        console.log("PWA Updated");
        RELOAD_BUTTON.disabled = false;
    }
}

/**************************************/

function reloadPwa() {
    console.debug("reloadPwa()");

    window.location.reload();
}

/******************************************************************************/

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

function deselectSearchBar() {
    SEARCHBAR_DROPDOWN.hide();
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

    console.debug(RESPONSE_JSON);

    createSeachDropdownHtmlList(RESPONSE_JSON.results);
}

function createSeachDropdownHtmlList(array) {
    let html = '';
    console.debug(array);
    for (let element of array) {
        html += '<li><img href="https://image.tmdb.org/t/p/w92' + element.poster_path + '"><a class="dropdown-item" href="#">' + element.title + '</a></li>';
    }
    console.debug(SEARCHBAR_DROPDOWN_LIST.innerHTML);
    SEARCHBAR_DROPDOWN_LIST.innerHTML = html;
}