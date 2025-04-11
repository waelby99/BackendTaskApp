# 📋 API de Gestion de Tâches

## ✨ Description

Cette API RESTful permet la gestion complète de tâches avec MongoDB et Express, incluant le support pour les pièces jointes.

## 🚀 Fonctionnalités

- ✅ Récupération de toutes les tâches
- 🔍 Récupération d'une tâche par ID
- ➕ Création de nouvelles tâches
- 🔄 Mise à jour de tâches existantes
- 🗑️ Suppression de tâches
- 📎 Support pour les pièces jointes

## 🛠️ Prérequis

- Node.js (v12+)
- MongoDB
- npm ou yarn

## 📥 Installation

1. Clonez ce dépôt
2. Installez les dépendances:
   ```
   npm install
   ```
3. Créez un fichier `.env` avec:
   ```
   MONGODB_URI=votre_uri_mongodb
   ```

## 🏁 Démarrage

```
node server.js
```
OU
```
npm run dev
```

Le serveur démarre sur le port 5000.

## 🔌 Points d'API

### 📋 Récupérer toutes les tâches
- **GET** `/tasks`

### 🔍 Récupérer une tâche spécifique
- **GET** `/tasks/:taskId`

### ➕ Créer une nouvelle tâche
- **POST** `/tasks`
- Corps (multipart/form-data):
  - `text`: Description
  - `due_date`: Date d'échéance
  - `priority`: Priorité
  - `status`: Statut
  - `files`: Pièces jointes (optionnel)

### 🔄 Mettre à jour une tâche
- **PUT** `/tasks/:taskId`
- Corps (multipart/form-data):
  - Mêmes champs que pour la création

### 🗑️ Supprimer une tâche
- **DELETE** `/tasks/:taskId`

## ⚠️ Limites

- 📦 Taille max des fichiers: 10MB
- 💾 Stockage des fichiers dans MongoDB
- 📊 Requêtes JSON limitées à 10MB

## 📝 Structure d'une tâche

```json
{
  "_id": "ObjectId",
  "text": "Description de la tâche",
  "due_date": "Date d'échéance",
  "priority": "Priorité",
  "status": "Statut",
  "files": [
    {
      "filename": "nom_du_fichier.ext",
      "contentType": "type/mime",
      "data": "Buffer"
    }
  ]
}
```
