# CascadoEvent — Site vitrine

Site vitrine d'une seule page pour l'activité événementielle **CascadoEvent**.
Projet de test volontairement simple : **HTML, CSS et JavaScript purs**, sans
framework ni outil de build (pas de React, pas de npm).

## Structure du projet

```
cascadoevent/
├── index.html        Page unique (structure et contenu)
├── style.css         Feuille de style (mise en forme, responsive)
├── script.js         JavaScript (menu mobile, année, formulaire)
├── images/           Images du site (placeholders à remplacer)
│   ├── placeholder-1.svg
│   ├── placeholder-2.svg
│   ├── placeholder-3.svg
│   └── README.md
├── README.md         Ce fichier
└── .gitignore
```

## Ouvrir le site en local

Aucune installation n'est nécessaire.

### Méthode 1 — double-clic (la plus simple)

Ouvrez `index.html` dans votre navigateur (double-clic sur le fichier, ou
clic droit → « Ouvrir avec »).

### Méthode 2 — petit serveur local (recommandé)

Certaines fonctions se comportent mieux via un serveur local. Au choix :

- **VS Code** : installez l'extension « Live Server », puis clic droit sur
  `index.html` → « Open with Live Server ».
- **Python** (déjà installé sur beaucoup de machines) :
  ```bash
  python -m http.server 8000
  ```
  puis ouvrez <http://localhost:8000> dans le navigateur.

## Personnaliser le contenu

Cherchez les commentaires **« À REMPLIR »** dans `index.html`, `style.css` et
`script.js` : ils indiquent les endroits à adapter (textes, couleurs, images,
coordonnées, envoi du formulaire…).

Le formulaire de contact est pour l'instant **simulé** (aucun email n'est
réellement envoyé). Pour un envoi réel, branchez un service comme
Formspree, Netlify Forms ou EmailJS (voir le commentaire dans `script.js`).

## Publier le site

Le site étant 100 % statique, il peut être hébergé gratuitement.

### Netlify (glisser-déposer)

1. Créez un compte sur <https://www.netlify.com>.
2. Rubrique « Add new site » → « Deploy manually ».
3. Glissez-déposez le dossier du projet. Le site est en ligne en quelques secondes.

### GitHub Pages

1. Créez un dépôt GitHub et poussez le contenu du projet :
   ```bash
   git init
   git add .
   git commit -m "Première version du site CascadoEvent"
   git branch -M main
   git remote add origin https://github.com/VOTRE-COMPTE/cascadoevent.git
   git push -u origin main
   ```
2. Sur GitHub : `Settings` → `Pages` → Source : branche `main`, dossier `/root`.
3. Le site sera disponible à l'adresse
   `https://VOTRE-COMPTE.github.io/cascadoevent/`.

### Autres options

Vercel, Cloudflare Pages, GitLab Pages ou l'hébergement mutualisé classique
(dépôt des fichiers par FTP) fonctionnent tout aussi bien.
