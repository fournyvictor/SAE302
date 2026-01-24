const PARAMS = new URLSearchParams(document.location.search);
const FILM_ID = PARAMS.get("id");

main();

function main() {

    if (FILM_ID) {
        console.debug(FILM_ID);
    }
}