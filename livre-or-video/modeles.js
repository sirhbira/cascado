/* Modèles de livres d’or vidéo — carrousel 3D (coverflow) sur téléphone uniquement.
   PC / tablette : la grille reste inchangée. */
(function () {
  var grille = document.querySelector(".galerie-livre-or");
  if (!grille) return;
  var cartes = Array.prototype.slice.call(grille.querySelectorAll(".modele"));
  if (cartes.length < 2) return;

  var mq = window.matchMedia("(max-width: 600px)");
  var actif = 0;
  var points = document.createElement("div");
  points.className = "galerie-points";
  var puces = cartes.map(function (_, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Voir le modèle " + (i + 1));
    b.addEventListener("click", function () { actif = i; placer(); });
    points.appendChild(b);
    return b;
  });

  function placer() {
    var n = cartes.length;
    cartes.forEach(function (carte, i) {
      var d = (i - actif + n) % n;
      var pos = "pos-cachee";
      if (d === 0) pos = "pos-centre";
      else if (n === 2) pos = i > actif ? "pos-droite" : "pos-gauche";
      else if (d === 1) pos = "pos-droite";
      else if (d === n - 1) pos = "pos-gauche";
      carte.classList.remove("pos-centre", "pos-gauche", "pos-droite", "pos-cachee");
      carte.classList.add(pos);
      carte.setAttribute("aria-hidden", d === 0 ? "false" : "true");
      carte.inert = d !== 0;
    });
    puces.forEach(function (p, i) { p.classList.toggle("actif", i === actif); p.setAttribute("aria-pressed", String(i === actif)); });
    egaliserHauteurs();
  }

  function egaliserHauteurs() {
    cartes.forEach(function (carte) { carte.style.height = ""; });
    if (!mq.matches) return;
    var hauteur = Math.max.apply(null, cartes.map(function (carte) { return carte.offsetHeight; }));
    cartes.forEach(function (carte) { carte.style.height = hauteur + "px"; });
    grille.style.height = (hauteur + 14) + "px";
  }

  function aller(dir) {
    actif = (actif + dir + cartes.length) % cartes.length;
    placer();
  }

  var geste = null;
  grille.addEventListener("pointerdown", function (e) {
    if (!mq.matches || !e.isPrimary || e.button !== 0) return;
    geste = { x: e.clientX, y: e.clientY, id: e.pointerId, actif: false };
  });
  grille.addEventListener("pointermove", function (e) {
    if (!geste || e.pointerId !== geste.id) return;
    var dx = e.clientX - geste.x, dy = e.clientY - geste.y;
    if (!geste.actif && Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) {
      geste.actif = true;
      try { grille.setPointerCapture(geste.id); } catch (err) {}
    }
    if (geste.actif) e.preventDefault();
  }, { passive: false });
  function finGeste(e) {
    if (!geste || (e && e.pointerId !== geste.id)) return;
    var dx = e ? e.clientX - geste.x : 0;
    var etait = geste.actif;
    geste = null;
    if (etait && Math.abs(dx) > 40) aller(dx < 0 ? 1 : -1);
  }
  grille.addEventListener("pointerup", finGeste);
  grille.addEventListener("pointercancel", function () { geste = null; });
  grille.addEventListener("dragstart", function (e) { if (mq.matches) e.preventDefault(); });

  function activer() {
    grille.classList.add("est-carrousel");
    if (!points.parentNode) grille.insertAdjacentElement("afterend", points);
    actif = 0;
    placer();
  }
  function desactiver() {
    grille.classList.remove("est-carrousel");
    if (points.parentNode) points.parentNode.removeChild(points);
    cartes.forEach(function (c) {
      c.classList.remove("pos-centre", "pos-gauche", "pos-droite", "pos-cachee");
      c.removeAttribute("aria-hidden");
      c.inert = false;
      c.style.height = "";
    });
    grille.style.height = "";
  }
  function appliquer() { mq.matches ? activer() : desactiver(); }

  if (document.fonts) document.fonts.ready.then(function () { if (mq.matches) placer(); });
  appliquer();
  if (mq.addEventListener) {
    mq.addEventListener("change", function () { desactiver(); appliquer(); });
  } else if (mq.addListener) {
    mq.addListener(function () { desactiver(); appliquer(); });
  }
  window.addEventListener("resize", function () {
    egaliserHauteurs();
  });
})();
