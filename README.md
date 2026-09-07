# CascadoEvent — Site vitrine

Site vitrine multi-pages pour **CascadoEvent** — animation événementielle :
location de **panneaux fontaine lumineux** et de **photobooths** pour mariages,
anniversaires et soirées d'entreprise.

Site 100 % statique : **HTML, CSS et JavaScript purs**, sans framework ni build
(pas de React, pas de npm). Hébergé sur **GitHub Pages**.

Direction artistique : luxe & doré, noir profond, épuré.

## Structure du projet

```
cascadoevent/
├── index.html          Accueil : hero vidéo, présentation, les 2 univers, aperçu des packs
├── panneaux.html       Galerie des modèles de panneaux fontaine
├── photobooth.html     Galerie des modèles de photobooth
├── packs.html          Formules Premium & Prestige (grille tarifaire)
├── contact.html        Formulaire + coordonnées
├── style.css           Feuille de style partagée (toutes les pages)
├── script.js           JS partagé (menu, animations, vidéos, formulaire)
├── images/             Images et vidéos (placeholders SVG à remplacer)
├── README.md           Ce fichier
└── .gitignore
```

L'en-tête et le pied de page sont **recopiés à l'identique** dans chaque page
HTML (pas de build, donc pas d'inclusion automatique). Si vous modifiez la
navigation, répercutez le changement dans les 5 fichiers `.html`.

## Ouvrir le site en local

### Méthode 1 — double-clic

Ouvrez `index.html` dans votre navigateur.

### Méthode 2 — petit serveur local (recommandé, pour la vidéo de fond)

- **VS Code** : extension « Live Server » → clic droit sur `index.html` →
  « Open with Live Server ».
- **Python** :
  ```bash
  python -m http.server 8000
  ```
  puis <http://localhost:8000>.

## Personnaliser le contenu

Cherchez les commentaires **« À REMPLIR »** et **« À REMPLACER »** dans les
fichiers : ils marquent tout ce qui doit être adapté.

| À faire | Où |
|---|---|
| Textes, accroches, coordonnées | dans chaque `.html` |
| Couleurs, polices, mesures | `style.css`, section `1. VARIABLES` (`:root`) |
| Vidéo de fond du hero | `index.html` → `<video class="hero-video">`, fichier `images/hero.mp4` |
| Photos des modèles | `images/panneau-*.svg` et `images/photobooth-*.svg` → vos `.jpg` |
| Vignettes vidéo dans les galeries | attribut `data-video="images/xxx.mp4"` + classe `video` sur `.modele-media` |
| Prix et prestations des packs | `packs.html` (listes `À REMPLIR`) |
| Adresse de réception des devis | action du formulaire dans contact.html : cascadoevent@gmail.com |
| Numéro WhatsApp (bouton flottant) | les 5 `.html` → `VOTRE_NUMERO_WHATSAPP` |

### Formulaire de devis (FormSubmit)

Le formulaire envoie les demandes à **cascadoevent@gmail.com** via
[FormSubmit](https://formsubmit.co/). Le JavaScript valide les champs puis
le service affiche le CAPTCHA et la confirmation.

Pour activer la réception, envoyez une première demande depuis le site servi
en HTTP(S), puis cliquez sur le lien reçu à cette adresse (vérifiez les spams).
Faites ensuite un nouvel essai pour vérifier la réception du devis.

Champs envoyés : formule, nom, contact (email ou téléphone),
date_evenement, message (optionnel) et sujet du devis.

### Bouton WhatsApp flottant

Un bouton fixe en bas à droite, présent sur **toutes les pages**, ouvre WhatsApp
avec un message pré-rempli.

- Dans les 5 fichiers `.html`, remplacez `VOTRE_NUMERO_WHATSAPP` par votre
  numéro au **format international, sans `+` ni espaces** (ex. `33612345678`).
- Le message par défaut (« Bonjour CascadoEvent, je souhaite réserver / avoir un
  devis. ») est déjà encodé dans l'URL ; modifiez-le en gardant l'encodage.
- Sur mobile, le bouton devient une pastille ronde (icône seule) pour ne pas
  gêner la lecture.

### Autres options d'envoi du formulaire

- **Lien mailto** : remplacer le `<form>` par un lien `mailto:` simple.
- **Netlify Forms** si vous hébergez sur Netlify plutôt que GitHub Pages.

### Vidéos

- **Hero** : `images/hero.mp4` (H.264, 1080p, muette, ~10-20 s en boucle,
  compressée — visez < 5 Mo, GitHub Pages sert des fichiers statiques).
- **Galeries** : mettez la classe `video` et `data-video="images/xxx.mp4"` sur
  une vignette `.modele-media` pour la rendre cliquable (lecture en plein écran).

## Publier sur GitHub Pages

1. Poussez le projet sur un dépôt GitHub :
   ```bash
   git init
   git add .
   git commit -m "Refonte design CascadoEvent"
   git branch -M main
   git remote add origin https://github.com/VOTRE-COMPTE/cascadoevent.git
   git push -u origin main
   ```
2. Sur GitHub : `Settings` → `Pages` → Source : branche `main`, dossier `/ (root)`.
3. Le site sera en ligne sur `https://VOTRE-COMPTE.github.io/cascadoevent/`.

> Toutes les URL internes sont **relatives** (`panneaux.html`, `images/…`), le
> site fonctionne donc aussi bien à la racine d'un domaine que dans un
> sous-dossier GitHub Pages.

### Alternatives

Netlify (glisser-déposer du dossier), Vercel, Cloudflare Pages — tous compatibles
avec ce site statique.

## Performances

- Polices chargées depuis Google Fonts avec `preconnect` et `display=swap`.
- Aucune librairie JS externe, un seul `style.css` et un seul `script.js`.
- Images de démonstration en SVG légers.
- Pensez à compresser vos vraies photos (< 300 Ko) et vidéos avant publication.
- Animations désactivées automatiquement si `prefers-reduced-motion` est actif.
