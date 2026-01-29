/******************************************************************************/
/* Constants                                                                  */
/******************************************************************************/

const INSTALL_BUTTON = document.getElementById("install_button");
const RELOAD_BUTTON = document.getElementById("reload_button");
const IGNORE_BUTTON = document.getElementById("ignore-button");
const INSTALL_MODAL = document.getElementById("install-modal");
const RELOAD_MODAL = document.getElementById("reload-modal");
const INSTALL_MODAL_OBJ = bootstrap.Modal.getOrCreateInstance(INSTALL_MODAL);
const RELOAD_MODAL_OBJ = bootstrap.Modal.getOrCreateInstance(RELOAD_MODAL);
const INSTALL_APP_BTN = document.getElementById("install-app-btn");
const UPDATE_APP_BTN = document.getElementById("update-app-btn");

/******************************************************************************/
/* Listeners                                                                  */
/******************************************************************************/

INSTALL_BUTTON.addEventListener("click", installPwa);
RELOAD_BUTTON.addEventListener("click", reloadPwa);
IGNORE_BUTTON.addEventListener("click", hideInstallModal);
INSTALL_APP_BTN.addEventListener("click", installPwa);
UPDATE_APP_BTN.addEventListener("click", reloadPwa);

/******************************************************************************/
/* Global Variable                                                            */
/******************************************************************************/

let beforeInstallPromptEvent;

/******************************************************************************/
/* Main                                                                       */
/******************************************************************************/

main();

function main() {
    RELOAD_MODAL_OBJ.hide();
    if (window.matchMedia("(display-mode: standalone)").matches) {
        console.log("Running as PWA");
        INSTALL_APP_BTN.classList.add("d-none");

        registerServiceWorker();
    }
    else {
        console.log("Running as Web page");
        INSTALL_APP_BTN.classList.remove("d-none");

        window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
        window.addEventListener("appinstalled", onAppInstalled);
    }
}

/******************************************************************************/
/* Install PWA                                                                */
/******************************************************************************/

function onBeforeInstallPrompt(event) {

    event.preventDefault();
    showInstallModal();
    beforeInstallPromptEvent = event;
}

/**************************************/

async function installPwa() {

    const RESULT = await beforeInstallPromptEvent.prompt();

    switch (RESULT.outcome) {
        case "accepted": console.log("PWA Install accepted"); break;
        case "dismissed": console.log("PWA Install dismissed"); break;
    }

    hideInstallModal();
    window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
}

/**************************************/

function onAppInstalled() {
    INSTALL_APP_BTN.classList.add("d-none");

    registerServiceWorker();
}

function showInstallModal() {
    INSTALL_MODAL_OBJ.show();
}

function hideInstallModal() {
    if (document.activeElement && INSTALL_MODAL.contains(document.activeElement)) {
        document.activeElement.blur();
    }
    INSTALL_MODAL_OBJ.hide();
}

/******************************************************************************/
/* Register Service Worker                                                    */
/******************************************************************************/

async function registerServiceWorker() {

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

    const REGISTRATION = event.target;
    const SERVICE_WORKER = REGISTRATION.installing;
    SERVICE_WORKER.addEventListener("statechange", onStateChange);
}

/**************************************/

function onStateChange(event) {
    const SERVICE_WORKER = event.target;


    if (SERVICE_WORKER.state == "installed" && navigator.serviceWorker.controller) {
        console.log("PWA Updated");
        RELOAD_BUTTON.disabled = false;
        RELOAD_MODAL_OBJ.show();
        UPDATE_APP_BTN.classList.remove("d-none");
    }
}

/**************************************/

function reloadPwa() {

    window.location.reload();
}

/******************************************************************************/
