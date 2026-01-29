
/******************************************************************************/
/* INTERACTIONS DB                                                            */
/******************************************************************************/

/******************************************************************************/
/* Constantes                                                                 */
/******************************************************************************/

const DB = "FullBoxdDB";
const DB_VERSION = 6;

/******************************************************************************/
/* Fonctions générales                                                        */
/******************************************************************************/

//Gestion des erreurs ouverture DB
function onDBError(event) {
    console.error("IndexedDB Error:", event.target.error);
}

//Mise à jour / création de la db
function onDBUgradeNeeded(event) {
    const BDD = event.target.result;
    //creation de likes si non existant
    if (!BDD.objectStoreNames.contains("likes")) {
        BDD.createObjectStore("likes", { keyPath: "filmId" });
    }
    //creation de reviews si non existant
    if (!BDD.objectStoreNames.contains("reviews")) {
        BDD.createObjectStore("reviews", { keyPath: "filmId" });
    }
}

//Gestion des erreurs transaction DB
function dbTransactionError(event) {

    console.error("DB transaction error: ", event.target.error);
}

//Gestion des erreurs transaction DB impliquant une promesse
function dbTransactionErrorResolve(resolve, event) {
    resolve(false);
    console.error("DB transaction error: ", event.target.error);

}


/******************************************************************************/
/* Fonctions like                                                             */
/******************************************************************************/

//Check si le film est dans la librairie
function checkIfMovieLiked(MOVIE_ID) {
    return new Promise(function (resolve) { //promesse pour pouvoir attendre la fin
        const REQUEST = indexedDB.open(DB, DB_VERSION); //ouverture db

        REQUEST.onupgradeneeded = onDBUgradeNeeded; //si pas la bonne version
        REQUEST.onerror = onDBError; //si echec
        REQUEST.onsuccess = onDBSuccessCheckLike.bind(this, resolve, MOVIE_ID); //si reussite (bind pour passer des arguments a un callback)
    });
}
// Si ouverture db réussie
function onDBSuccessCheckLike(resolve, MOVIE_ID, event) {
    const BDD = event.target.result;

    const TRANSACTION = BDD.transaction(["likes"], "readonly"); //creer la transaction sur la table en lecture seule
    const OBJECTSTORE = TRANSACTION.objectStore("likes");

    const REQUEST = OBJECTSTORE.get(MOVIE_ID);

    REQUEST.onsuccess = onCheckLikedResult.bind(this, resolve);
    REQUEST.onerror = dbTransactionErrorResolve.bind(this, resolve);

}
// Traitement du résultat du check de like
function onCheckLikedResult(resolve, event) {
    const RESULT = event.target.result;
    if (RESULT) {
        resolve(RESULT.filmData);
    } else {
        resolve(false);
    }
}


//Liker / déliker le film
async function onLikeButtonClick(MOVIE) {
    const LIKED = await checkIfMovieLiked(MOVIE.id);
    const REQUEST = indexedDB.open(DB, DB_VERSION);

    REQUEST.onerror = onDBError;

    if (LIKED) {
        REQUEST.onsuccess = onDBSuccessLikeRemove.bind(this, MOVIE);
    } else {
        REQUEST.onsuccess = onDBSuccessLikeAdd.bind(this, MOVIE);
    }
}
// Si ouverture db réussie pour ajout de like
async function onDBSuccessLikeAdd(MOVIE, event) {
    const BDD = event.target.result;
    const TRANSACTION = BDD.transaction(["likes"], "readwrite");
    const OBJECTSTORE = TRANSACTION.objectStore("likes");

    const ENTRY = { filmId: MOVIE.id, filmData: MOVIE, addedAt: new Date() };
    const REQUEST = OBJECTSTORE.add(ENTRY);

    REQUEST.onsuccess = successfullyAddedLike.bind(null, true, MOVIE);
    REQUEST.onerror = dbTransactionError;

}
// Suite à l'ajout réussi en db
async function successfullyAddedLike(LIKED, MOVIE) {
    updateLikePicto(LIKED, MOVIE.id);
    //ajout des images au cache
    const CACHE = await caches.open('images-cache');

    await CACHE.add(`https://rss.kakol.fr/https://image.tmdb.org/t/p/w342${MOVIE.poster_path}`);
    await CACHE.add(`https://rss.kakol.fr/https://image.tmdb.org/t/p/original${MOVIE.poster_path}`);
    await CACHE.add(`https://rss.kakol.fr/https://image.tmdb.org/t/p/original${MOVIE.backdrop_path}`);

}
// Si ouverture db réussie pour suppression de like
function onDBSuccessLikeRemove(MOVIE, event) {
    const BDD = event.target.result;

    const TRANSACTION = BDD.transaction(["likes"], "readwrite");
    const OBJECTSTORE = TRANSACTION.objectStore("likes");

    // retirer le film des likes
    const REQUEST = OBJECTSTORE.delete(MOVIE.id);

    REQUEST.onsuccess = successfullyRemovedLike.bind(null, false, MOVIE); //bind plutot que d'executer une fonction a la con vide
    REQUEST.onerror = dbTransactionError;
}
// Suite à la suppression réussie en db
async function successfullyRemovedLike(LIKED, MOVIE) {
    updateLikePicto(LIKED, MOVIE.id);
    //suppression du cache
    const CACHE = await caches.open('images-cache');

    await CACHE.delete(`https://image.tmdb.org/t/p/w342${MOVIE.poster_path}`);
    await CACHE.delete(`https://image.tmdb.org/t/p/original${MOVIE.poster_path}`);
    await CACHE.delete(`https://image.tmdb.org/t/p/original${MOVIE.backdrop_path}`);
}
// Mise à jour visuelle du coeur
function updateLikePicto(LIKE, MOVIE_ID) {
    const ID = MOVIE_ID + "-like-picto";
    let path = "../Misc/icon_heart.svg";

    if (LIKE) {
        path = "../Misc/icon_heart_full.svg";
    }
    const LIKE_PICTO = document.getElementById(ID);
    if (LIKE_PICTO) {
        LIKE_PICTO.src = path;

    }
}


//Récupérer la liste des films likés
function getAllLikedMovies() {
    return new Promise(function (resolve) {
        const REQUEST = indexedDB.open(DB, DB_VERSION);

        REQUEST.onerror = onDBError;
        REQUEST.onupgradeneeded = onDBUgradeNeeded;
        REQUEST.onsuccess = onDBSuccessGetAllLikedMovies.bind(this, resolve);
    }
    );
}
// Si ouverture db réussie pour récupération de tous les likes
function onDBSuccessGetAllLikedMovies(resolve, event) {
    const BDD = event.target.result;

    const TRANSACTION = BDD.transaction(["likes"], "readonly");
    const OBJECTSTORE = TRANSACTION.objectStore("likes");

    const REQUEST = OBJECTSTORE.getAll();

    REQUEST.onsuccess = onGetAllLikedMoviesResult.bind(this, resolve);
    REQUEST.onerror = dbTransactionErrorResolve.bind(this, resolve);
}
// Traitement du résultat de tous les likes
function onGetAllLikedMoviesResult(resolve, event) {
    const RESULT = event.target.result;
    RESULT.sort(trierParDate); //trier par date
    resolve(RESULT);
}
function trierParDate(a, b) { //Tri par date la plus récente en premier
    return new Date(a.addedAt) - new Date(b.addedAt); // delta de temps
}


/******************************************************************************/
/* Fonctions review                                                           */
/******************************************************************************/

//Récupérer la review par l'id film
function getMovieReview(MOVIE_ID) {
    return new Promise(function (resolve) { //promesse pour pouvoir attendre la fin
        const REQUEST = indexedDB.open(DB, DB_VERSION);

        REQUEST.onupgradeneeded = onDBUgradeNeeded;
        REQUEST.onerror = onDBError;
        REQUEST.onsuccess = onDBSuccessGetReview.bind(this, resolve, MOVIE_ID);

    });
}
// Si ouverture db réussie pour récupération de review
function onDBSuccessGetReview(resolve, MOVIE_ID, event) {
    const BDD = event.target.result;

    const TRANSACTION = BDD.transaction(["reviews"], "readonly");
    const OBJECTSTORE = TRANSACTION.objectStore("reviews");

    const REQUEST = OBJECTSTORE.get(parseInt(MOVIE_ID));

    REQUEST.onsuccess = onGetMovieReview.bind(this, resolve);
    REQUEST.onerror = dbTransactionErrorResolve.bind(this, resolve);
}
// Résolution de la review récupérée
function onGetMovieReview(resolve, event) {
    resolve(event.target.result);
}


//Ajout d'une review / écrasement pour update d'une review
function submitMovieReview(MOVIE_ID, REVIEW) {
    return new Promise(function (resolve) {
        const REQUEST = indexedDB.open(DB, DB_VERSION);

        REQUEST.onupgradeneeded = onDBUgradeNeeded;
        REQUEST.onerror = onDBError;
        REQUEST.onsuccess = onDBSuccessSubmitReview.bind(this, resolve, MOVIE_ID, REVIEW);

    })
}
// Si ouverture db réussie pour soumission de review
function onDBSuccessSubmitReview(resolve, MOVIE_ID, REVIEW, event) {

    const BDD = event.target.result;

    const TRANSACTION = BDD.transaction(["reviews"], "readwrite");
    const OBJECTSTORE = TRANSACTION.objectStore("reviews");

    const ENTRY = { filmId: parseInt(MOVIE_ID), addedAt: new Date(), review: REVIEW };
    const REQUEST = OBJECTSTORE.put(ENTRY); //écraser si déjà existante

    REQUEST.onsuccess = onSubmitReview.bind(this, resolve, MOVIE_ID);
    REQUEST.onerror = dbTransactionErrorResolve.bind(this, resolve);
}
// Résolution après soumission de review
function onSubmitReview(resolve, MOVIE_ID, event) {
    resolve(event.target.result);
}
