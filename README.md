# Plateforme de Gestion de Freelancers

Cette plateforme permet la gestion complète des freelancers, clients, offres, candidatures, messagerie, feedbacks et dashboard admin.  
Le backend est développé avec NestJS utilisant GraphQL et la base de données MySQL. Le frontend est développé avec React.

## 👨‍💻 Auteures / Contributrices

- Salma Daadoucha 
- Zeineb Ben Ayed  
- Sana Sboui

---

## 🚀 Installation

### Prérequis

- Node.js (version 16+ recommandée)  
- MySQL (version 8+ recommandée)  
- Yarn ou npm  

### Étapes

1. Cloner le dépôt :
```bash
git clone https://github.com/DaadouchaSalma/Plateforme_Freelance.git
```

2. Configurer la base MySQL :

* Créer une base freelancers_db
* Créer un utilisateur avec droits d'accès

3. Installer les dépendances :

```bash
cd backend
npm install

cd ../frontend
npm install
```

4. Lancer le backend :

```bash
cd backend
npm run start:dev
```

5. Lancer le frontend :

```bash
cd ../frontend
npm start
```

---

## 🧩 Fonctionnalités

* Authentification (freelancers / clients / admin)
* Gestion des offres (ajout, mise à jour, suppression, consultation)
* Gestion des candidatures avec statut
* Système de messagerie interne
* Feedback entre clients et freelancers
* Dashboard admin (statistiques offres, utilisateurs, candidatures)
* Gestion des compétences et catégories

---

## 🛠️ Technologies utilisées

* Backend : NestJS, TypeScript, GraphQL, TypeORM
* Base de données : MySQL
* Frontend : React.js, Apollo Client
* Authentification : JWT

---

## 📦 Exemple de requêtes GraphQL

🔍 Query : Liste des offres

```graphql
query {
  offers {
    id
    title
    description
    category {
      id
      name
    }
  }
}
```

🔐 Mutation : Connexion utilisateur

```graphql
mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
    user {
      id
      role
      email
    }
  }
}
```

---

## 🤝 Contribution

Les contributions sont les bienvenues.
Merci de créer une issue avant une pull request.

---