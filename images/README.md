# Dossier images / vidéos

Placez ici tous les médias du site. Les fichiers `.svg` actuels sont des
**placeholders** à remplacer.

## Fichiers attendus (à remplacer)

| Fichier placeholder | Remplacer par | Utilisé sur |
|---|---|---|
| `poster-hero.svg` | `poster-hero.jpg` (image affichée avant la vidéo) | `index.html` (hero) |
| `hero.mp4` *(à ajouter)* | votre vidéo de fond du hero | `index.html` (hero) |
| `presentation.svg` | photo ou vidéo de présentation | `index.html` |
| `univers-panneaux.svg` | visuel « panneaux fontaine » | `index.html` |
| `univers-photobooth.svg` | visuel « photobooth » | `index.html` |
| `panneau-1.svg` … `panneau-5.svg` | photos de vos modèles de panneaux | `panneaux.html` |
| `photobooth-1.svg` … `photobooth-5.svg` | photos de vos modèles de photobooth | `photobooth.html` |

## Conseils

- **Photos** : `.jpg`, largeur ~1200 px, compressées (< 300 Ko).
- **Vidéos** : `.mp4` (H.264), 1080p, compressées. Le hero gagne à être muet
  et court (10-20 s) en boucle.
- Si vous changez les **noms de fichiers**, mettez à jour les `src="images/…"`
  et `data-video="images/…"` dans les pages HTML correspondantes.
- Vignettes vidéo dans les galeries : ajoutez la classe `video` et
  `data-video="images/mon-modele.mp4"` sur la `<div class="modele-media">`.
