Anti-Fraude Téléphonique - MVP
Ce projet est un Minimum Viable Product (MVP) développé pour détecter les appels téléphoniques suspects en temps réel, conçu pour Djibouti Telecom. Il fournit un tableau de bord interactif avec un tableau des appels suspects, une carte géographique, un graphique de répartition, et des actions pour bloquer ou inspecter les numéros suspects.
Fonctionnalités

Détection intelligente : Identifie les appels suspects basés sur la fréquence (> 10 appels), avec des alertes critiques pour > 50 appels.
Tableau interactif :
Affiche les numéros suspects avec numéro, pays, fréquence, dernier appel, durée, et niveau de risque (modéré, élevé, critique).
Boutons d’action : "Bloquer" (avec modal de confirmation) et "Détails" (modal avec infos complètes).


Carte géographique : Visualisation des appels suspects sur une carte Leaflet avec marqueurs colorés (jaune/orange/rouge) et popups.
Graphique : Répartition des appels par pays avec Chart.js.
Alertes visuelles : Bannière rouge pour les numéros critiques (> 50 appels).
Responsive : Interface adaptée pour desktop et mobile.
Données simulées : Utilise data/cdr.json avec ~150 enregistrements, incluant un numéro critique (+1777888999000, 51 appels).

Technologies

Frontend : Next.js, React, TypeScript, TailwindCSS
Carte : Leaflet
Graphique : Chart.js
Données : Fichier statique data/cdr.json

Prérequis

Node.js (v16 ou supérieur)
npm (v8 ou supérieur)

Installation

Clonez le dépôt :git clone <URL-de-votre-dépôt>
cd anti-fraud-demo


Installez les dépendances :npm install


Lancez l’application en mode développement :npm run dev


Ouvrez http://localhost:3000 dans votre navigateur.

Structure du projet

app/page.tsx : Page principale avec le tableau de bord.
components/CallsTable.tsx : Tableau des appels suspects avec boutons "Bloquer" et "Détails".
components/CallsMap.tsx : Carte Leaflet pour visualiser les appels.
components/CallsChart.tsx : Graphique Chart.js pour la répartition par pays.
data/cdr.json : Données simulées des appels (150 enregistrements).

Utilisation

À l’ouverture, le tableau de bord affiche :
Un tableau des numéros suspects (fréquence > 10).
Une carte avec des marqueurs géographiques.
Un graphique de répartition par pays.
Une alerte rouge si un numéro dépasse 50 appels (ex. : +1777888999000).


Dans le tableau :
Cliquez sur "Bloquer" pour simuler le blocage d’un numéro (modal de confirmation).
Cliquez sur "Détails" pour voir les infos complètes (modal).


Testez sur mobile pour vérifier le design responsive.

Déploiement

Créez un dépôt GitHub :git init
git add .
git commit -m "Initial commit"
git remote add origin <URL-de-votre-dépôt>
git push -u origin main


Déployez sur Vercel :
Connectez-vous à Vercel.
Importez votre dépôt.
Configurez : Framework = Next.js, build command = next build, output = out.
Obtenez l’URL de la démo (ex. : https://anti-fraud-demo.vercel.app).



Démo

URL en ligne : [Insérez l’URL Vercel après déploiement]
Vidéo : [Insérez le lien YouTube/Google Drive après enregistrement]
Instructions :
Observez l’alerte critique pour +1777888999000 (51 appels).
Testez les boutons "Bloquer" (modal de confirmation) et "Détails" (modal d’infos).
Explorez la carte (zoom/marqueurs) et le graphique.



Proposition
Ce MVP démontre une solution anti-fraude avec détection intelligente et interface utilisateur intuitive. Nous proposons un test pilote avec les données réelles de Djibouti Telecom pour valider l’efficacité et intégrer des fonctionnalités avancées (ex. : analyse IA, blocage en temps réel).
Améliorations futures

Intégration d’une API dynamique (ex. : Flask, MockAPI) pour des données en temps réel.
Analyse IA avec Python (ex. : scikit-learn pour détection d’anomalies).
Sauvegarde des numéros bloqués dans une base de données.
Notifications push pour les alertes critiques.

Contact

Développeur : Mohamed Ali Youssouf
Email : wizzimed@gmail.com
LinkedIn : linkedin.com/in/mohamed-ali-youssouf
portfolio: mohamed-ali-youssouf.com

