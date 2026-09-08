/* Lecteur unique : les trois prestations défilent dans un ordre fixe. */
(function () {
  const lecteur = document.getElementById("films-lecteur");
  if (!lecteur) return;

  const films = [
    { src: "/videos/livre-dor.mp4", nom: "Livre d’or vidéo", description: "Des messages spontanés et émouvants à conserver pour toujours." },
    { src: "/videos/panneau.MP4", nom: "Panneau fontaine", description: "Une mise en scène spectaculaire pour sublimer votre événement." },
    { src: "/videos/photobooth.mp4", nom: "Photobooth", description: "Des souvenirs instantanés, élégants et personnalisés." }
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

  function suivant() {
    if (transition) return;
    transition = true;
    lecteur.classList.remove("pret");
    cadre.classList.add("en-transition");
    window.setTimeout(function () {
      index = (index + 1) % films.length;
      nom.textContent = films[index].nom;
      description.textContent = films[index].description;
      reperes.forEach(function (repere, position) {
        repere.classList.toggle("en-cours", position === index);
      });
      lecteur.src = films[index].src;
      transition = false;
      lecteur.load();
      lire();
    }, mouvementReduit.matches ? 0 : 200);
  }

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
  lire();
})();
