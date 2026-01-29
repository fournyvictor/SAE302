# FullBoxd 🎬

FullBoxd est une **Progressive Web App (PWA)** moderne dédiée aux passionnés de cinéma. Elle permet de rechercher des films, de gérer une bibliothèque personnelle et d'écrire des critiques enrichies par des capteurs matériels (photo, géolocalisation).

![Version](https://img.shields.io/badge/version-2.6-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-green)
![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB-orange)

## ✨ Fonctionnalités

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

## 🛠 Architecture Technique

### 🔑 APIs Externes

1.  **TMDB (The Movie Database)** :
    *   Utilisée pour la recherche, les détails des films (backdrop, poster, synopsis) et les castings.
    *   Authentification via Token Bearer pour sécuriser les appels.
2.  **OpenStreetMap (Nominatim)** :
    *   Utilisée pour le **Reverse Geocoding**. Transforme les coordonnées GPS brutes en une adresse lisible (ex: "Paris, France") pour les reviews.

### 💾 Systèmes de Stockage

*   **IndexedDB** : Base de données locale intégrée au navigateur.
    *   Stockage des films likés (`likes`).
    *   Stockage des critiques textuelles et métadonnées (`reviews`).
    *   Permet un accès ultra-rapide et un support offline complet.
*   **Cache API (Service Worker)** :
    *   Mise en cache des ressources statiques (HTML, CSS, JS, icônes).
    *   Mise en cache dynamique des affiches de films pour la consultation hors-ligne.
    *   Gestion fine des versions pour forcer la mise à jour de l'application.

### 📡 Capteurs & Matériel

*   **Geolocation API** : Récupération des coordonnées précises de l'utilisateur lors de la rédaction d'une critique.
*   **Media Capture / Camera** : Utilisation de l'attribut `capture="user"` sur les entrées de fichiers pour déclencher nativement la caméra selfie sur mobile, permettant la fonctionnalité "My Face When".

---

## 🚀 Fonctionnement PWA

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

## 🛠 Installation pour le Développement

1.  Cloner le dépôt.
2.  L'application ne nécessite pas de serveur backend complexe, un simple **Live Server** (VS Code) ou un serveur HTTP statique suffit.
3.  Assurez-vous d'utiliser une connexion `HTTPS` ou `localhost` pour que les fonctionnalités PWA et les capteurs (Caméra/GPS) soient activés par le navigateur.

## 👤 Auteur

**Victor Fourny**
*Email : victor.fourny@etu.univ-smb.fr*

---
*Projet réalisé dans le cadre de la SAE 302 - Développement d'applications Web Avancées.*
