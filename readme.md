# Connect'In API — Backend Laravel

> Bienvenue sur le backend de **Connect'In**, un réseau social professionnel développé avec Laravel.  
> Cette API gère l'authentification, les publications, les commentaires et les interactions (likes).

---

## Table des matières

- [Installation et Configuration](#installation-et-configuration)
- [Architecture de la Base de Données](#architecture-de-la-base-de-données)
- [Tests API avec Postman](#tests-api-avec-postman)
  - [Authentification](#1-authentification)
  - [Gestion des Posts](#2-gestion-des-posts)
  - [Commentaires et Likes](#3-commentaires-et-likes)
  - [Utilisateurs (Profil)](#4-utilisateurs-profil)
  - [Codes de Réponse HTTP](#5-codes-de-réponse-http)
- [Stack Technique](#stack-technique)

---

## Installation et Configuration

### 1. Cloner le projet et installer les dépendances

```bash
git clone <url-du-depot>
cd connectin-api
composer install
```

### 2. Configuration de l'environnement

Copiez le fichier d'exemple et générez la clé d'application :

```bash
cp .env.example .env
php artisan key:generate
```

> ⚠️ **Important :** Modifiez le fichier `.env` pour configurer vos accès à la base de données :
> `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.

### 3. Nettoyage et Optimisation

En cas de problèmes de cache lors de l'installation :

```bash
php artisan optimize:clear
```

---

## Architecture de la Base de Données

Ce projet utilise les **migrations Laravel** pour garantir une structure uniforme.

### Tables principales

| Table | Description |
|---|---|
| `users` | Profils utilisateurs (nom, prénom, username, email, bio, photo de profil) |
| `posts` | Publications — gère l'auto-relation pour les commentaires via `post_id` |
| `likes` | Interactions entre utilisateurs et posts, avec contrainte d'unicité |
| `personal_access_tokens` | Table requise par Laravel Sanctum (authentification par token) |

### Mise en place de la base de données

```bash
php artisan migrate:fresh
```

> ⚠️ **Important :** Cette commande **supprime toutes les tables existantes** et recrée la structure propre, incluant les champs `username`, `bio` et `profile_photo`.

---

## Tests API avec Postman

📁 **Collection Postman :** [Télécharger](./docs/postman/My_Collection.postman_collection.json)

| Paramètre | Valeur |
|---|---|
| Base URL | `http://127.0.0.1:8000/api` |
| Format | JSON |
| Authentification | Bearer Token (via Laravel Sanctum) |

---

### 1. Authentification

> Toutes les routes (sauf `/register` et `/login`) nécessitent le header suivant :
> ```
> Authorization: Bearer {votre_token}
> ```

| Méthode | Route | Description | Body requis |
|---|---|---|---|
| `POST` | `/register` | Créer un compte | `first_name`, `last_name`, `username`, `email`, `password`, `password_confirmation` |
| `POST` | `/login` | Se connecter | `email`, `password` |
| `POST` | `/logout` | Se déconnecter | — |

**Exemple — Création d'un compte (`POST /register`) :**

```json
{
    "message": "Utilisateur créé avec succès !",
    "user": {
        "first_name": "Louis",
        "last_name": "toto",
        "email": "louis@test.com",
        "is_connected": false,
        "updated_at": "2026-03-03T09:19:30.000000Z",
        "created_at": "2026-03-03T09:19:30.000000Z",
        "id": 8,
        "full_name": "Louis toto",
        "profile_photo_url": "https://ui-avatars.com/api/?name=Louis+toto"
    },
    "access_token": "52|nB2ptGiASX08QRJeNsYO9dcCPPUXPNe3m2p2Kbt3637fc99c",
    "token_type": "Bearer"
}
```

---

### 2. Gestion des Posts

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/posts` | Récupère tous les posts (avec `user`, `comments_count`, `likes_count`) |
| `POST` | `/posts` | Crée un nouveau post |
| `GET` | `/posts/{id}` | Récupère un post et ses commentaires |
| `PUT` | `/posts/{id}` | Modifie un post *(auteur uniquement)* |
| `DELETE` | `/posts/{id}` | Supprime un post *(auteur uniquement)* |

**Body — Créer un post (`POST /posts`) :**

```json
{
    "content": "Mon message",
    "image_path": null
}
```

**Exemple — Réponse création (`201 Created`) :**

```json
{
    "message": "Post ajouté avec succès !",
    "post": {
        "id": 15,
        "content": "Mon sécond post sur ConnectIn !",
        "image_path": null,
        "user": {
            "id": 8,
            "name": "louis-jean toto",
            "avatar": "https://ui-avatars.com/api/?name=louis-jean+toto"
        },
        "created_at": "il y a 0 seconde"
    }
}
```

**Exemple — Réponse modification (`PUT /posts/{id}`) :**

```json
{
    "message": "Post mis à jour avec succès !",
    "data": {
        "id": 15,
        "content": "contenu mis à jour",
        "user_id": 8,
        "post_id": null,
        "image_path": null,
        "created_at": "2026-03-03T09:59:38.000000Z",
        "updated_at": "2026-03-03T10:03:18.000000Z"
    }
}
```

**Exemple — Réponse suppression (`DELETE /posts/{id}`) :**

```json
{
    "message": "Post supprimé avec succès !",
    "deleted_at": "03 mars 2026 10:05"
}
```

---

### 3. Commentaires et Likes

#### 💬 Commentaires

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/comments` | Ajouter un commentaire à un post |
| `DELETE` | `/comments/{id}` | Supprimer un commentaire *(auteur uniquement)* |

**Body — Ajouter un commentaire (`POST /comments`) :**

```json
{
    "post_id": 14,
    "content": "Super post !"
}
```

**Exemple — Réponse (`201 Created`) :**

```json
{
    "content": "Super post !",
    "post_id": 14,
    "user_id": 8,
    "updated_at": "2026-03-03T10:11:46.000000Z",
    "created_at": "2026-03-03T10:11:46.000000Z",
    "id": 13
}
```

**Exemple — Suppression (`DELETE /comments/{id}`) :**

```json
{
    "message": "Commentaire supprimé avec succès !"
}
```

#### ❤️ Likes

| Méthode | Route | Description |
|---|---|---|
| `POST` | `/likes` | Liker un post |
| `DELETE` | `/likes/{id}` | Retirer un like (Unlike) |

**Body — Liker un post (`POST /likes`) :**

```json
{
    "post_id": 14
}
```

**Exemple — Réponse (`200 OK`) :**

```json
{
    "message": "C'est Liké !"
}
```

---

### 4. Utilisateurs (Profil)

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/user` | Récupère les infos de l'utilisateur connecté (via le token) |
| `PUT` | `/users/{id}` | Met à jour le profil (`bio`, `username`, `profile_photo`) |

---

### 5. Codes de Réponse HTTP

| Code | Statut | Description |
|---|---|---|
| `200` | OK | Requête réussie |
| `201` | Created | Ressource créée avec succès (ex: Register, nouveau post) |
| `401` | Unauthorized | Token manquant ou invalide |
| `403` | Forbidden | Action non autorisée sur cette ressource |
| `422` | Unprocessable Entity | Erreur de validation (ex: email déjà pris, mot de passe trop court) |

---

## Stack Technique

| Composant | Technologie |
|---|---|
| Framework Backend | Laravel 11 |
| Authentification | Laravel Sanctum |
| Base de données | MySQL / MariaDB |

<!-- partie frontend -->
# Connect'In API — Frontend React

Interface utilisateur de Connect'In, le réseau social moderne.

Ce client communique avec l'API Laravel pour offrir une expérience fluide de
 partage et d'interaction en temps réel.

 ## Table des matières

 - [ Aperçu du projet](##-Aperçu-du-projet)

- [Configuration de l'API](##-Configuration-de-l'environnement)

- [Installation et Lancement](##-Installation-et-Lancement)

- [Stack Technique](##-Stack-Technique)

## Aperçu du projet

Connect'In permet aux utilisateurs de :

 Gérer leur profil (Bio, photo, informations personnelles).

 Envois des messages.

 Interagir via des commentaires et des likes.

 Naviguer de façon sécurisée grâce à l'authentification par Token.

## Configuration de l'environnement

Créez un fichier .env à la racine du projet pour lier le frontend au backend :

`VITE_API_BASE_URL=http://127.0.0.1:8000/api`

## Installation et Lancement

Après avoir clôné le projet et configuer le backend (API), se rendre dans le repertoire `connectin-api/` et tapper les commande suivantes :

- `npm install`: pour l'installation des dependances

- `php artisan serve` et `npm run dev` : pour le lancement du serveur de l'API et du Client front, on le fait dans dans deux terminaux différents


## Stack Technique

React 18 | Bibliothèque UI principale

Tailwind CSS | Framework CSS utilitaire pour le design

React Router | Gestion de la navigation (SPA)