/* Lecteur unique : les trois prestations défilent dans un ordre fixe.
   - Enchaînement automatique conservé (autoplay, muet, en boucle sur la liste).
   - Navigation manuelle ajoutée : glisser à la souris / au trackpad sur PC,
     swipe gauche-droite au doigt sur mobile. Après un geste, la lecture
     automatique reprend normalement. */
(function () {
  const lecteur = document.getElementById("films-lecteur");
  if (!lecteur) return;

  const films = [
    { src: "/videos/livre-dor.mp4", nom: "Livre d’or vidéo", description: "Des messages spontanés et émouvants à conserver pour toujours." },
    { src: "/videos/panneau.MP4", nom: "Panneau fontaine", description: "Une mise en scène spectaculaire pour sublimer votre événement." },
    { src: "/videos/photobooth.mp4", nom: "Photobooth", description: "Des souvenirs instantanés, élégants et personnalisés." },
    { src: "/videos/minicascado.mp4", nom: "Mini Cascado", description: "Un format compact et \u00e9l\u00e9gant pour sublimer votre \u00e9v\u00e9nement." },
    { src: "/videos/panneau2.mp4", nom: "Panneau fontaine", description: "Une mise en sc\u00e8ne spectaculaire pour sublimer votre \u00e9v\u00e9nement." }
  ];
  const nom = document.getElementById("films-nom");
  const description = document.getElementById("films-description");
  const cadre = lecteur.closest(".films-cadre");
  const reperes = document.querySelectorAll(".films-reperes span");
  const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;
  let erreurs = 0;
  let transition = false;

  function lire() {
    lecteur.muted = true;
    lecteur.defaultMuted = true;
    const lecture = lecteur.play();
    // Certains téléphones attendent une interaction ou la sortie du mode économie.
    if (lecture && typeof lecture.catch === "function") lecture.catch(function () {});
  }

  function nettoyerStyle() {
    lecteur.style.transition = "";
    lecteur.style.transform = "";
    lecteur.style.opacity = "";
  }

  // Charge le film demandé. `sens` (-1 / 1 / 0) donne la direction du léger
  // glissement d'entrée de la nouvelle vidéo (effet premium).
  function appliquer(cible, sens) {
    index = (cible + films.length) % films.length;
    nom.textContent = films[index].nom;
    description.textContent = films[index].description;
    reperes.forEach(function (repere, position) {
      repere.classList.toggle("en-cours", position === index);
    });
    lecteur.src = films[index].src;
    lecteur.load();
    lire();

    if (sens && !mouvementReduit.matches) {
      lecteur.style.transition = "none";
      lecteur.style.transform = "translateX(" + (sens * 24) + "%)";
      void lecteur.offsetWidth; // fige la position de départ avant l'animation
      lecteur.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease";
      lecteur.style.transform = "translateX(0)";
      window.setTimeout(nettoyerStyle, 520);
    } else {
      nettoyerStyle();
    }
  }

  // Film suivant (1) ou précédent (-1), avec le fondu premium.
  function aller(direction) {
    if (transition) return;
    transition = true;
    lecteur.classList.remove("pret");
    cadre.classList.add("en-transition");
    window.setTimeout(function () {
      transition = false;
      appliquer(index + direction, direction);
    }, mouvementReduit.matches ? 0 : 200);
  }

  function suivant() { aller(1); }

  lecteur.addEventListener("playing", function () {
    erreurs = 0;
    lecteur.classList.add("pret");
    cadre.classList.remove("en-transition");
  });
  lecteur.addEventListener("ended", suivant);
  lecteur.addEventListener("error", function () {
    // Éviter de rester bloqué sur un fichier indisponible, sans boucle de requêtes.
    erreurs += 1;
    if (erreurs < films.length) suivant();
  });
  lecteur.addEventListener("volumechange", function () {
    if (!lecteur.muted) lecteur.muted = true;
  });
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && lecteur.paused && erreurs < films.length) lire();
  });
  function reprendre() {
    if (lecteur.paused && !transition && erreurs < films.length) lire();
  }
  document.addEventListener("pointerdown", reprendre, { passive: true });
  document.addEventListener("keydown", reprendre);

  /* --- Navigation manuelle : glisser (souris / trackpad) ou swipe (doigt) --- */
  const SEUIL = 55; // distance minimale pour valider un changement de vidéo
  let geste = null;

  cadre.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (transition) return;
    geste = { x: e.clientX, y: e.clientY, dx: 0, actif: false, id: e.pointerId };
  });

  cadre.addEventListener("pointermove", function (e) {
    if (!geste || e.pointerId !== geste.id) return;
    const dx = e.clientX - geste.x;
    const dy = e.clientY - geste.y;

    if (!geste.actif) {
      // On n'attrape le geste que s'il est nettement horizontal
      // (sinon on laisse le défilement vertical de la page se faire).
      if (Math.abs(dx) < 10 || Math.abs(dx) <= Math.abs(dy)) return;
      geste.actif = true;
      cadre.classList.add("saisi");
      try { cadre.setPointerCapture(geste.id); } catch (err) {}
      lecteur.style.transition = "none";
    }

    e.preventDefault();
    geste.dx = dx;
    lecteur.style.transform = "translateX(" + (dx * 0.3).toFixed(1) + "px)";
    lecteur.style.opacity = String(Math.max(0.5, 1 - Math.abs(dx) / 800));
  }, { passive: false });

  function finGeste(e) {
    if (!geste || (e && e.pointerId !== geste.id)) return;
    const dx = geste.dx;
    const actif = geste.actif;
    geste = null;
    cadre.classList.remove("saisi");
    if (!actif) return;

    lecteur.style.transition = "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease";
    lecteur.style.transform = "translateX(0)";
    lecteur.style.opacity = "";

    if (Math.abs(dx) >= SEUIL) {
      aller(dx < 0 ? 1 : -1);
    } else {
      window.setTimeout(nettoyerStyle, 340); // simple retour élastique
    }
  }

  cadre.addEventListener("pointerup", finGeste);
  cadre.addEventListener("pointercancel", finGeste);

  lire();
})();
