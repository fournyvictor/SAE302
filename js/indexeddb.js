
/******************************************************************************/
/* INTERACTIONS DB                                                            */
/******************************************************************************/

// CONSTANTES 

const DB = "FullBoxdDB";


// FONCTIONS GENERALES

function onDBError(event) {
    console.error("Erreur IndexedDB:", event.target.error);
}
function onDBUgradeNeeded(event) {
    const BDD = event.target.result;
    //creation de likes si non existant
    if (!BDD.objectStoreNames.contains("likes")) {
        console.debug("Creation db likes");
        BDD.createObjectStore("likes", { keyPath: "filmId" });
    }
    //creation de reviews si non existant
    if (!BDD.objectStoreNames.contains("reviews")) {
        BDD.createObjectStore("reviews", { keyPath: "filmId" });
        console.debug("creation db reviews");
    }
}
function dbTransactionError(resolve, event) {

    console.error("erreur de transaction db : ", event.target.error);
}
function dbTransactionErrorResolve(resolve, event) {
    resolve(false);
    console.error("erreur de transaction db : ", event.target.error);

}


// FONCTIONS LIKE

function checkIfMovieLiked(MOVIE_ID) {
    return new Promise(function (resolve) { //promesse pour pouvoir attendre la fin
        const REQUEST = indexedDB.open(DB, 2);

        REQUEST.onupgradeneeded = onDBUgradeNeeded;
        REQUEST.onerror = onDBError;
        REQUEST.onsuccess = onDBSuccessCheckLike.bind(this, resolve, MOVIE_ID);


    });
}
function onDBSuccessCheckLike(resolve, MOVIE_ID, event) {
    console.debug("checklikesuccess");
    const BDD = event.target.result;

    const TRANSACTION = BDD.transaction(["likes"], "readonly");
    const OBJECTSTORE = TRANSACTION.objectStore("likes");

    const REQUEST = OBJECTSTORE.get(MOVIE_ID);

    REQUEST.onsuccess = onCheckLikedResult.bind(this, resolve);
    REQUEST.onerror = dbTransactionErrorResolve.bind(this, resolve);

}
function onCheckLikedResult(resolve, event) {
    const RESULT = event.target.result;

    if (RESULT) {
        resolve(true);
    } else {
        resolve(false);
    }
}

async function onLikeButtonClick(MOVIE_ID) {
    const LIKED = await checkIfMovieLiked(MOVIE_ID);
    const REQUEST = indexedDB.open(DB, 1);

    REQUEST.onerror = onDBError;

    if (LIKED) {
        REQUEST.onsuccess = onDBSuccessLikeRemove.bind(this, MOVIE_ID);
    } else {
        REQUEST.onsuccess = onDBSuccessLikeAdd.bind(this, MOVIE_ID);
    }
}
function onDBSuccessLikeAdd(MOVIE_ID, event) {
    const BDD = event.target.result;

    const TRANSACTION = BDD.transaction(["likes"], "readwrite");
    const OBJECTSTORE = TRANSACTION.objectStore("likes");

    // ajout du film aux likes
    const ENTRY = { filmId: MOVIE_ID, addedAt: new Date() };
    const REQUEST = OBJECTSTORE.add(ENTRY);

    REQUEST.onsuccess = updateLikePicto.bind(null, true, MOVIE_ID);
    REQUEST.onerror = dbTransactionError;
}
function onDBSuccessLikeRemove(MOVIE_ID, event) {
    const BDD = event.target.result;

    const TRANSACTION = BDD.transaction(["likes"], "readwrite");
    const OBJECTSTORE = TRANSACTION.objectStore("likes");

    // retirer le film des likes
    const REQUEST = OBJECTSTORE.delete(MOVIE_ID);

    REQUEST.onsuccess = updateLikePicto.bind(null, false, MOVIE_ID); //bind plutot que d'executer une fonction a la con vide
    REQUEST.onerror = dbTransactionError;
}
function updateLikePicto(LIKE, MOVIE_ID) {
    const ID = MOVIE_ID + "-like-picto";
    let chemin = "../Misc/icon_heart.svg";

    if (LIKE) {
        chemin = "../Misc/icon_heart_full.svg";
    }

    document.getElementById(ID).src = chemin;
}
function getAllLikedMovies() {
    return new Promise(function (resolve) {
        const REQUEST = indexedDB.open(DB, 1);

        REQUEST.onerror = onDBError;
        REQUEST.onsuccess = onDBSuccessGetAllLikedMovies.bind(this, resolve);
    }
    );

}
function onDBSuccessGetAllLikedMovies(resolve, event) {
    const BDD = event.target.result;

    const TRANSACTION = BDD.transaction(["likes"], "readonly");
    const OBJECTSTORE = TRANSACTION.objectStore("likes");

    const REQUEST = OBJECTSTORE.getAll();

    REQUEST.onsuccess = onGetAllLikedMoviesResult.bind(this, resolve);
    REQUEST.onerror = dbTransactionErrorResolve.bind(this, resolve);
}
function onGetAllLikedMoviesResult(resolve, event) {
    const RESULT = event.target.result;

    resolve(RESULT);
}


/////////// FONCTIONS REVIEW ///////////

function onReviewButtonClick() {

}