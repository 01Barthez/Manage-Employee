
# WorketYamo Employee Management System

📋 L'entreprise WORKETYAMO a remarqué une perte significative de productivité et une augmentation des coups liées qux heures d'abscences non justifiées de ses employés. Pour remedier à cette situation, la direction souhaite mettre en place un systeme automatisé pour suivre la présence des employés, calculé les heures d'abscences et ajusté les salaires.

🌟 **WorketYamo Employee Management System** est une solution complète de gestion des ressources humaines conçue pour moderniser et optimiser les processus RH des entreprises de toutes tailles. Ce systeme est conçu pour optimiser le *suivi des présences*, la *gestion des absences* et le *calcul des salaires* en fonctions des abscences. Ce système automatisé et sécurisé aideras donc à améliorer la productivité et à réduire les coûts liés aux absences non justifiées.

## 📚 Table de matière

- [WorketYamo Employee Management System](#worketyamo-employee-management-system)
  - [📚 Table de matière](#-table-de-matière)
  - [▶️ Scénario de fonctionnement](#️-scénario-de-fonctionnement)
  - [🚀 Fonctionnalités Principales](#-fonctionnalités-principales)
      - [👥 Gestion des employés](#-gestion-des-employés)
      - [🔐 Authentification \& Sécurité](#-authentification--sécurité)
      - [⏰ Gestion des Présences](#-gestion-des-présences)
      - [📊 Gestion des Absences](#-gestion-des-absences)
      - [💰 Gestion des Salaires](#-gestion-des-salaires)
      - [📧 Notifications](#-notifications)
  - [🛠 Technologies Utilisées](#-technologies-utilisées)
  - [⚙️ Configurations et Installation](#️-configurations-et-installation)
    - [Prérequis](#prérequis)
    - [🏁 Installation Rapide](#-installation-rapide)
    - [principale commande](#principale-commande)
  - [📡 Reference Documentation](#-reference-documentation)
  - [🧪 Tests](#-tests)
  - [🚢 Déploiement](#-déploiement)
  - [📚 Contribution](#-contribution)
  - [🗓 Feuille de route](#-feuille-de-route)
  - [📄 Licence](#-licence)
  - [📞 Support](#-support)
  - [🤝 Remerciements](#-remerciements)

## ▶️ Scénario de fonctionnement

Quotidiennement, les employés arrivent à leur heure de travail voulu, Ils, se connectent 🖥️  et ils signent numériquement leur arrivé. Au moment de quitter le lieu de travail, ils se connectent et signent leur heure de départ.

la signature de l'heure de retour ne peut etre effectué si la signature de l'heure d'arrivé n'a pas été fait.

si la signature de retour n'a pas été fais ou si aucune signature n'a été fais dans la journée par un quelconque employée, il reçois le nombre maximum d'heure d'abscence de la journée (ici 8H d'abscence)

A la fin du mois le salaire est calculé en fonction de la somme des heures d'abscences cumulés durant le mois.

## 🚀 Fonctionnalités Principales

#### 👥 Gestion des employés

- Inscription sécurisée avec validation OTP par email
- Système de role (*Admin/users*) avec permission différencié
- Mise a jours, modifications et suppresions des profiles
- Gestion sécurisé des profiles avec upload d'images (AWS S3/ MiniO)

#### 🔐 Authentification & Sécurité

- Authentification JWT (*system d'access token + Refresh token*)
- Blacklisting des tokens pour renforcer la Sécurité par les token
- Hashage et sauvegarde sécurisé des mots de passes
- Gestion des sessions avec déconnexion automatique
- Robuste protection contre les attaques courantes (*XSS*, *CSRF*, *Rate Limiting*, *Injections SQL*...)  

#### ⏰ Gestion des Présences

- Enregistrement automatique des heures d'arrivée
- Validation des heures de sortie
- Calcul intelligent des retards
- Système de grâce pour cas exceptionnels
- Historique complet des présences

#### 📊 Gestion des Absences

- Calcul automatique des heures d'absence
- Différenciation entre retards et absences
- Système de justification d'absences
- Rapports détaillés par employé

#### 💰 Gestion des Salaires

- Calcul automatique basé sur les heures travaillées
- Ajustement en fonction des absences
- Plancher salarial minimal garanti
- Notifications automatiques de salaire
- Historique des ajustements salariaux

#### 📧 Notifications

- Emails de bienvenue avec OTP
- Notifications de changement de salaire
- Alertes d'absences répétées
- Rappels importants

## 🛠 Technologies Utilisées

- **Backend**: Node.js, Express.js, TypeScript
- **Base de données**: MongoDB avec Prisma ORM
- **Authentification**: JWT, bcrypt
- **Stockage**: AWS S3/MinIO pour les fichiers
- **Emails**: Nodemailer avec templates EJS
- **Logging**: Winston avec rotation des logs
- **Documentation**: Swagger/OpenAPI
- **Sécurité**: Helmet, Express-rate-limit, XSS-clean
- **conténeurasisation**: docker

## ⚙️ Configurations et Installation

### Prérequis

- Node.js (>= 20.12.0)
- Yarn (>= 1.22.19)
- Une base de donnéeMongoDB
- MinIO ou stockage compatible AWS S3
- Un serveur SMTP pour l'envoi d'emails

### 🏁 Installation Rapide

```bash
    #cloner le repos
    git clone https://github.com/01Barthez/Manage-Employee.git

    #changer de repertoire pour le repertoire cloner
    cd Manage-Employee


    #Installer les dépendances
    yarn Installation

    # Generer le client prisma
    yarn generate

    # Faire pousser les models vers le depot distant
    yarn push

    #Lancer le serveur de developpement
    yarn dev
```

### principale commande

- **yarn dev** : Démarre le serveur de développement
- **yarn build** : Compile le projet pour la production
- **yarn start** : Démarre le serveur de production
- **yarn generate** : Génère le client Prisma
- **yarn push** : Applique les changements du schéma à la base de données

## 📡 Reference Documentation

La Documentation complète de l'API est disponible via Swagger UI à  l'addresse:

```bash
http://localhost:3000/api-docs # Swagger Docs

```

Endpoinds principaux:

- *'/employees'* : Gestion des employés (CRUD)
- *'/attendance'* : Enregistrement des présences
- *'/absence'* : Gestion des absences

## 🧪 Tests

(*Pas encore de tests pour le moment, mais c'est prévus...*)

## 🚢 Déploiement

L'application peut etre déployé par docker

## 📚 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

- Forkez le projet
- Créez votre branche de fonctionnalité (git checkout -b feature/AmazingFeature)
- Committez vos changements (git commit -m 'Add some AmazingFeature')
- Poussez vers la branche (git push origin feature/AmazingFeature)
- Ouvrez une Pull Request

pour plus de détails, voir le fichier CONTRIBUTING

## 🗓 Feuille de route

- stockage des données relatives au salaire dans un document externe xcv
- Integration de l'OAuth2.0
- Intégration avec des systèmes de pointage biométriques
- Gestion des pauses et heures supplémentaires
- Module de planification des congés
- Tableau de bord analytique avancé
- Application mobile pour les employés

## 📄 Licence

Ce projet est sous [**licence MIT**](https://choosealicense.com/licenses/mit/). Voir le fichier LICENSE pour plus de détails.

## 📞 Support

Pour toute question ou assistance :

- 📧 Email : [**kenwoubarthez@gmail.com**](https://mailto:kenwoubarthez@gmail.com)
- 💬 LinkedIn : [**Barthez Kenwou**](https://cm.linkedin.com/in/barthez-kenwou)
- 📱 Téléphone : **+237 655 646 688**

## 🤝 Remerciements

- La grande **Équipe WorkEtYamo** pour la formation le soutien et l'accompagnement
- Communauté open-source Express.js et Prisma
- Tous les contributeurs et utilisateurs du projet
