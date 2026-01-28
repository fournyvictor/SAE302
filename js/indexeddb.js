
/******************************************************************************/
/* INTERACTIONS DB                                                            */
/******************************************************************************/

// CONSTANTES 

const DB = "FullBoxdDB";
const DB_VERSION = 6;

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
function dbTransactionError(event) {

    console.error("erreur de transaction db : ", event.target.error);
}
function dbTransactionErrorResolve(resolve, event) {
    resolve(false);
    console.error("erreur de transaction db : ", event.target.error);

}


// FONCTIONS LIKE

function checkIfMovieLiked(MOVIE_ID) {
    return new Promise(function (resolve) { //promesse pour pouvoir attendre la fin
        const REQUEST = indexedDB.open(DB, DB_VERSION);

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
    console.debug("RESULT : ", RESULT);
    if (RESULT) {
        console.debug("result vaut quelque chose");
        resolve(RESULT.filmData);
    } else {
        resolve(false);
        console.debug("result ne vaut rien");
    }
}

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
async function onDBSuccessLikeAdd(MOVIE, event) {
    const BDD = event.target.result;
    console.debug("Film ajouté aux likes : ", MOVIE.title);
    const TRANSACTION = BDD.transaction(["likes"], "readwrite");
    const OBJECTSTORE = TRANSACTION.objectStore("likes");

    const ENTRY = { filmId: MOVIE.id, filmData: MOVIE, addedAt: new Date() };
    const REQUEST = OBJECTSTORE.add(ENTRY);

    REQUEST.onsuccess = updateLikePicto.bind(null, true, MOVIE.id);
    REQUEST.onerror = dbTransactionError;
}
function onDBSuccessLikeRemove(MOVIE, event) {
    const BDD = event.target.result;

    const TRANSACTION = BDD.transaction(["likes"], "readwrite");
    const OBJECTSTORE = TRANSACTION.objectStore("likes");

    // retirer le film des likes
    const REQUEST = OBJECTSTORE.delete(MOVIE.id);

    REQUEST.onsuccess = updateLikePicto.bind(null, false, MOVIE.id); //bind plutot que d'executer une fonction a la con vide
    REQUEST.onerror = dbTransactionError;
}
function updateLikePicto(LIKE, MOVIE_ID) {
    const ID = MOVIE_ID + "-like-picto";
    let chemin = "../Misc/icon_heart.svg";

    if (LIKE) {
        chemin = "../Misc/icon_heart_full.svg";
    }
    const LIKEPICTO = document.getElementById(ID);
    if (LIKEPICTO) {
        LIKEPICTO.src = chemin;

    }
}
function getAllLikedMovies() {
    return new Promise(function (resolve) {
        const REQUEST = indexedDB.open(DB, DB_VERSION);

        REQUEST.onerror = onDBError;
        REQUEST.onupgradeneeded = onDBUgradeNeeded;
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
    RESULT.sort(trierParDate); //trier par date
    resolve(RESULT);
}
function trierParDate(a, b) {
    return new Date(a.addedAt) - new Date(b.addedAt); // delta de temps
}
/////////// FONCTIONS REVIEW ///////////

function getMovieReview(MOVIE_ID) {
    return new Promise(function (resolve) { //promesse pour pouvoir attendre la fin
        const REQUEST = indexedDB.open(DB, DB_VERSION);

        REQUEST.onupgradeneeded = onDBUgradeNeeded;
        REQUEST.onerror = onDBError;
        REQUEST.onsuccess = onDBSuccessGetReview.bind(this, resolve, MOVIE_ID);

    });
}
function onDBSuccessGetReview(resolve, MOVIE_ID, event) {
    console.debug("getMovieReview");
    const BDD = event.target.result;

    const TRANSACTION = BDD.transaction(["reviews"], "readonly");
    const OBJECTSTORE = TRANSACTION.objectStore("reviews");

    const REQUEST = OBJECTSTORE.get(parseInt(MOVIE_ID));

    REQUEST.onsuccess = onGetMovieReview.bind(this, resolve);
    REQUEST.onerror = dbTransactionErrorResolve.bind(this, resolve);
}
function onGetMovieReview(resolve, event) {
    console.debug(event.target.result);
    resolve(event.target.result);
}

// AJOUT D'UNE REVIEW

function submitMovieReview(MOVIE_ID, REVIEW) {
    console.debug("submitMovieReview");
    return new Promise(function (resolve) {
        const REQUEST = indexedDB.open(DB, DB_VERSION);

        REQUEST.onupgradeneeded = onDBUgradeNeeded;
        REQUEST.onerror = onDBError;
        REQUEST.onsuccess = onDBSuccessSubmitReview.bind(this, resolve, MOVIE_ID, REVIEW);

    })
}
function onDBSuccessSubmitReview(resolve, MOVIE_ID, REVIEW, event) {
    console.debug("onDBSuccessSubmitReview");

    const BDD = event.target.result;

    const TRANSACTION = BDD.transaction(["reviews"], "readwrite");
    const OBJECTSTORE = TRANSACTION.objectStore("reviews");

    const ENTRY = { filmId: parseInt(MOVIE_ID), addedAt: new Date(), review: REVIEW };
    const REQUEST = OBJECTSTORE.put(ENTRY); //écraser si déjà existante

    REQUEST.onsuccess = onSubmitReview.bind(this, resolve, MOVIE_ID);
    REQUEST.onerror = dbTransactionErrorResolve.bind(this, resolve);
}
function onSubmitReview(resolve, MOVIE_ID, event) {
    console.debug("onDBSuccessSubmitReview");
    console.debug("Succes : ", event.target.result, MOVIE_ID);
    resolve(event.target.result);
}
