# FullBoxd 

FullBoxd est une **Progressive Web App (PWA)** moderne dédiée aux passionnés de cinéma. Elle permet de rechercher des films, de gérer une bibliothèque personnelle et d'écrire des critiques enrichies par des capteurs matériels (photo, géolocalisation).

![Version](https://img.shields.io/badge/version-2.6-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-green)
![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB-orange)

##  Fonctionnalités

- **Recherche Instantanée** : Intégration complète avec l'API TMDB pour des résultats en temps réel.
- **Top Tendances** : Affichage des films populaires du jour et de la semaine.
- **Bibliothèque Personnelle** : Système de "Like" pour sauvegarder vos films préférés.
- **Critiques Enrichies** :
  - Notation par étoiles.
  - Géolocalisation automatique du lieu de visionnage.
  - **MFW (My Face When)** : Capture d'un selfie "réaction" via la caméra pour illustrer votre critique.
- **Mode Hors-ligne (Offline)** : Consultation de la bibliothèque et des critiques même sans connexion internet.
- **Installation Native** : Installation sur écran d'accueil (Mobile/Desktop) avec gestion des mises à jour automatiques.

---

##  Composants Techniques

###  APIs Externes

1.  **TMDB (The Movie Database)** :
    *   Utilisée pour la recherche, les détails des films (backdrop, poster, synopsis) et les castings.
    *   Authentification via Token Bearer pour sécuriser les appels.
2.  **OpenStreetMap (Nominatim)** :
    *   Utilisée pour le **Reverse Geocoding**. Transforme les coordonnées GPS brutes en une adresse lisible (ex: "Paris, France") pour les reviews.

##  Architecture 

### Architecture Logicielle

*   **Routage Physique** : L'utilisation de dossiers par page (ex: `/film/index.html`) permet d'avoir des "Pretty URLs" (ex: `site.com/film/?id=...`) sans avoir besoin d'un serveur de routage complexe.
*   **Dossier JavaScript** : Tout le code javascript est centralisé dans le même dossier, et les liens sont relatifs pour garantir la portabilité.
*   **Clef d'API** : La clef TMDB est isolée dans `config.js` (ignoré par Git) pour sécuriser les credentials.
*   **Séparation des Responsabilités** :
    *   `app.js` : Point d'entrée, installation PWA et cycle de vie du Service Worker.
    *   `search.js` : Logique d'appel API et gestion globale de la barre de recherche.
    *   `indexeddb.js` : Couche d'abstraction pour les transactions de données locales.
*   **Cycle de Mise à jour** : Utilisation d'un système de versioning strict dans le Service Worker avec modal de rechargement forcé pour l'intégrité du cache.

### Flux de données

```mermaid
graph TD
    User((Utilisateur)) --> UI[Interface HTML/CSS]
    UI --> JS[Logiciels JS search.js, film.js...]
    JS --> SW{Service Worker}
    SW -- Cache First --> Cache[(Cache API)]
    SW -- Fallback --> API[API TMDB]
    JS <--> IDB[(IndexedDB)]
```

###  Systèmes de Stockage

*   **IndexedDB** : Base de données locale intégrée au navigateur.
    *   Stockage des films likés (`likes`).
    *   Stockage des critiques textuelles et métadonnées (`reviews`).
    *   Permet un accès ultra-rapide et un support offline complet.
*   **Cache API (Service Worker)** :
    *   Mise en cache des ressources statiques (HTML, CSS, JS, icônes).
    *   Mise en cache dynamique des affiches de films pour la consultation hors-ligne.
    *   Gestion fine des versions pour forcer la mise à jour de l'application.

###  Capteurs & Matériel

*   **Geolocation API** : Récupération des coordonnées précises de l'utilisateur lors de la rédaction d'une critique.
*   **Media Capture / Camera** : Utilisation de l'attribut `capture="user"` sur les entrées de fichiers pour déclencher nativement la caméra selfie sur mobile, permettant la fonctionnalité "My Face When".

---

##  Fonctionnement PWA

L'application est conçue pour se comporter comme un logiciel natif :

1.  **Service Worker (`service_worker.js`)** :
    *   Intercepte les requêtes réseau (`fetch`).
    *   Priorise la récupération depuis le cache pour la performance.
    *   Gère la suppression des anciens caches lors du changement de version (`VERSION = "2.6"`).
2.  **Cycle de Vie & Mises à jour** :
    *   Détection automatique des nouvelles versions via `onupdatefound`.
    *   Affichage d'un modal de rechargement bloquant pour garantir que l'utilisateur utilise toujours la dernière version stable.
3.  **Manifeste** : Définit les icônes, les couleurs de thème et le comportement plein écran (`standalone`).

---

## 👤 Auteur

**Victor Fourny**
*Email : victor.fourny@etu.univ-smb.fr*

---
*Projet réalisé dans le cadre de la SAE 302 - Développement d'applications Web Avancées.*
