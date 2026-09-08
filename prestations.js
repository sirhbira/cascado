(function () {
  const carrousel = document.getElementById("prestations-coverflow");
  if (!carrousel) return;
  const piste = carrousel.querySelector(".univers-grille");
  const cartes = Array.from(piste.querySelectorAll(".univers-carte"));
  const points = Array.from(carrousel.querySelectorAll("[data-carte]"));
  const statut = carrousel.querySelector(".prestations-statut");
  let active = 0;
  let depart = null;
  let glissement = false;

  function afficher(index) {
    active = (index + cartes.length) % cartes.length;
    cartes.forEach(function (carte, i) {
      const position = (i - active + cartes.length) % cartes.length;
      carte.classList.toggle("carte-centre", position === 0);
      carte.classList.toggle("carte-droite", position === 1);
      carte.classList.toggle("carte-gauche", position === 2);
      carte.tabIndex = position === 0 ? 0 : -1;
    });
    points.forEach(function (point, i) { point.setAttribute("aria-pressed", String(i === active)); });
    statut.textContent = cartes[active].querySelector("h3").textContent + " — " + (active + 1) + " sur " + cartes.length;
  }

  cartes.forEach(function (carte, i) {
    carte.draggable = false;
    carte.querySelector("img").draggable = false;
    carte.addEventListener("click", function (event) {
      if (glissement) { event.preventDefault(); return; }
      if (i !== active && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        event.preventDefault();
        afficher(i);
        carte.focus({ preventScroll: true });
      }
    });
  });
  carrousel.querySelectorAll("[data-direction]").forEach(function (bouton) {
    bouton.addEventListener("click", function () { afficher(active + Number(bouton.dataset.direction)); });
  });
  points.forEach(function (point) {
    point.addEventListener("click", function () { afficher(Number(point.dataset.carte)); });
  });
  carrousel.addEventListener("keydown", function (event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    afficher(active + (event.key === "ArrowRight" ? 1 : -1));
    cartes[active].focus({ preventScroll: true });
  });
  piste.addEventListener("pointerdown", function (event) {
    if (!event.isPrimary || event.button !== 0) return;
    depart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    glissement = false;
  });
  piste.addEventListener("pointermove", function (event) {
    if (!depart || event.pointerId !== depart.id) return;
    const dx = event.clientX - depart.x;
    const dy = event.clientY - depart.y;
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) {
      glissement = true;
      piste.setPointerCapture(event.pointerId);
    }
  });
  piste.addEventListener("pointerup", function (event) {
    if (!depart || event.pointerId !== depart.id) return;
    const dx = event.clientX - depart.x;
    if (glissement && Math.abs(dx) > 40) afficher(active + (dx < 0 ? 1 : -1));
    depart = null;
    // Le clic synthétique qui suit un swipe ne doit pas ouvrir la prestation.
    window.setTimeout(function () { glissement = false; }, 0);
  });
  piste.addEventListener("pointercancel", function () { depart = null; glissement = false; });
  carrousel.classList.add("est-actif");
  carrousel.querySelector(".prestations-navigation").hidden = false;
  afficher(0);
})();
