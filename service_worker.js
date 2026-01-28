/******************************************************************************/
/* Constants                                                                  */
/******************************************************************************/

const VERSION = "2.1";

const RESOURCES = [

    "./",
    "./index.html",
    "./service_worker.js",

    "./css/style.css",
    "./bootstrap-5.3.8-dist/css/bootstrap.min.css",
    "./bootstrap-5.3.8-dist/js/bootstrap.bundle.min.js",

    "./js/app.js",
    "./js/search.js",
    "./js/home.js",
    "./js/indexeddb.js",
    "./js/film.js",
    "./js/library.js",
    "./js/review.js",

    "./film/index.html",
    "./library/index.html",
    "./review/index.html",

    "./favicon/apple-touch-icon.png",
    "./favicon/favicon.ico",
    "./favicon/favicon.svg",
    "./favicon/favicon-96x96.png",
    "./favicon/site.webmanifest",
    "./favicon/web-app-manifest-192x192.png",
    "./favicon/web-app-manifest-512x512.png",

    "./Misc/logo_the_long_way.svg",
    "./Misc/icon_heart.svg",
    "./Misc/icon_heart_full.svg",
    "./Misc/icon_book.svg",
    "./Misc/icon_book_full.svg",
    "./Misc/icon_search.svg",
    "./Misc/icon_search_full.svg",
    "./Misc/icon_share.svg",
    "./Misc/icon_camera.svg"
];

/******************************************************************************/
/******************************************************************************/
/* Listeners                                                                  */
/******************************************************************************/

self.addEventListener("install", onInstall);
self.addEventListener("fetch", onFetch);

/******************************************************************************/

/******************************************************************************/
/* Install                                                                    */
/******************************************************************************/

function onInstall(event) {

    event.waitUntil(caching());
    self.skipWaiting();
}

/******************************************************************************/

async function caching() {

    const KEYS = await caches.keys();

    if (!KEYS.includes(VERSION)) {
        console.log("Caching version:", VERSION);
        const CACHE = await caches.open(VERSION);
        await CACHE.addAll(RESOURCES);

        for (const KEY of KEYS) {
            if (KEY !== VERSION) {
                console.log("Suppress old cache version:", KEY);
                await caches.delete(KEY);
            }
        }
    }
}

/******************************************************************************/
/******************************************************************************/
/* Fetch                                                                      */
/******************************************************************************/

function onFetch(event) {

    event.respondWith(getResponse(event.request));
}

/******************************************************************************/

async function getResponse(request) {

    const RESPONSE = await caches.match(request);

    if (RESPONSE) {
        console.log("Fetch from cache", request.url);
        return RESPONSE;
    }
    else {
        console.log("Fetch from server", request.url);
        return fetch(request);
    }
}

/******************************************************************************/
