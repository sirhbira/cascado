/* ============================================================
   CascadoEvent — JavaScript partagé (toutes les pages)
   ------------------------------------------------------------
   Fonctionnalités :
     1. Menu de navigation responsive (hamburger)
     2. Année automatique dans le pied de page
     3. Apparition douce des sections au défilement (une seule fois)
     4. Vignettes vidéo cliquables -> ouverture dans une fenêtre légère
     5. Formulaire de contact (validation + envoi par email)
   ------------------------------------------------------------
   Le script est chargé en fin de page (voir la balise <script>).
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* --------------------------------------------------------
     1. MENU RESPONSIVE
     -------------------------------------------------------- */
  const boutonBurger = document.getElementById("menu-burger");
  const menuNav = document.getElementById("menu-nav");

  if (boutonBurger && menuNav) {
    boutonBurger.addEventListener("click", function () {
      const ouvert = menuNav.classList.toggle("ouvert");
      boutonBurger.classList.toggle("actif", ouvert);
      boutonBurger.setAttribute("aria-expanded", ouvert ? "true" : "false");
      boutonBurger.setAttribute("aria-label", ouvert ? "Fermer le menu" : "Ouvrir le menu");
    });

    // On referme le menu après un clic sur un lien (utile sur mobile)
    menuNav.querySelectorAll("a").forEach(function (lien) {
      lien.addEventListener("click", function () {
        menuNav.classList.remove("ouvert");
        boutonBurger.classList.remove("actif");
        boutonBurger.setAttribute("aria-expanded", "false");
        boutonBurger.setAttribute("aria-label", "Ouvrir le menu");
      });
    });
  }


  /* --------------------------------------------------------
     2. ANNÉE AUTOMATIQUE (pied de page)
     -------------------------------------------------------- */
  const spanAnnee = document.getElementById("annee");
  if (spanAnnee) {
    spanAnnee.textContent = new Date().getFullYear();
  }


  /* --------------------------------------------------------
     3. APPARITION AU SCROLL
     --------------------------------------------------------
     On ajoute la classe "visible" aux éléments .reveal quand
     ils entrent dans l'écran. On respecte prefers-reduced-motion :
     dans ce cas, tout est affiché immédiatement.
     -------------------------------------------------------- */
  const elementsReveal = document.querySelectorAll(".reveal");
  const animationsReduites = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (animationsReduites || !("IntersectionObserver" in window)) {
    // Pas d'animation : on montre tout de suite
    elementsReveal.forEach(function (el) {
      el.classList.add("visible");
    });
  } else {
    const observateur = new IntersectionObserver(
      function (entrees) {
        entrees.forEach(function (entree) {
          if (entree.isIntersecting) {
            entree.target.classList.add("visible");
            // Une seule fois : on arrête d'observer cet élément
            observateur.unobserve(entree.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    elementsReveal.forEach(function (el) {
      observateur.observe(el);
    });

    // Filet de sécurité : au bout de 2 s, on affiche tout élément .reveal
    // resté caché (au cas où l'observateur ne se déclencherait pas).
    window.setTimeout(function () {
      elementsReveal.forEach(function (el) {
        el.classList.add("visible");
      });
    }, 2000);
  }


  /* --------------------------------------------------------
     4. VIGNETTES VIDÉO CLIQUABLES
     --------------------------------------------------------
     Chaque élément [data-video] ouvre une fenêtre légère
     (overlay) contenant la vidéo indiquée.
     À REMPLIR : renseigner l'attribut data-video="images/xxx.mp4"
     (ou une URL) sur les vignettes concernées dans le HTML.
     -------------------------------------------------------- */
  const declencheursVideo = document.querySelectorAll("[data-video]");

  if (declencheursVideo.length > 0) {
    declencheursVideo.forEach(function (el) {
      el.style.cursor = "pointer";
      el.addEventListener("click", function () {
        const source = el.getAttribute("data-video");
        if (source) {
          ouvrirVideo(source);
        }
      });
    });
  }

  /**
   * Ouvre une vidéo dans un overlay plein écran.
   * @param {string} source - chemin ou URL de la vidéo
   */
  function ouvrirVideo(source) {
    const overlay = document.createElement("div");
    overlay.className = "video-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Lecture vidéo");

    overlay.innerHTML =
      '<button class="video-fermer" aria-label="Fermer">&times;</button>' +
      '<video src="' + source + '" controls autoplay playsinline></video>';

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden"; // bloque le défilement en fond

    function fermer() {
      overlay.remove();
      document.body.style.overflow = "";
      document.removeEventListener("keydown", surTouche);
    }

    function surTouche(e) {
      if (e.key === "Escape") fermer();
    }

    overlay.addEventListener("click", function (e) {
      // Fermer si on clique en dehors de la vidéo ou sur la croix
      if (e.target === overlay || e.target.classList.contains("video-fermer")) {
        fermer();
      }
    });
    document.addEventListener("keydown", surTouche);
  }


  /* --------------------------------------------------------
     5. FORMULAIRE DE DEVIS (envoi par email via FormSubmit)
     --------------------------------------------------------
     Validation des champs, puis envoi natif vers FormSubmit.
     Le service affiche le CAPTCHA et la confirmation.
     -------------------------------------------------------- */
  const formulaire = document.getElementById("formulaire-devis");
  const zoneRetour = document.getElementById("formulaire-retour");

  if (formulaire && zoneRetour) {

    formulaire.addEventListener("submit", function (e) {
      e.preventDefault();

      // Lecture des champs
      const formule = formulaire.formule.value.trim();
      const nom = formulaire.nom.value.trim();
      const contact = formulaire.contact.value.trim();
      const dateEvenement = formulaire.date_evenement.value.trim();
      // message : facultatif, on ne le vérifie pas

      // --- Validation ---
      if (formule === "" || nom === "" || contact === "" || dateEvenement === "") {
        afficherRetour("Merci de remplir les champs obligatoires.", "erreur");
        return;
      }

      // Le moyen de contact doit ressembler à un email OU à un téléphone
      const ressembleEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
      const ressembleTelephone = (contact.replace(/\D/g, "").length >= 8);
      if (!ressembleEmail && !ressembleTelephone) {
        afficherRetour("Indiquez un email valide ou un numéro de téléphone.", "erreur");
        return;
      }

      // FormSubmit affiche le CAPTCHA et la confirmation.
      HTMLFormElement.prototype.submit.call(formulaire);
    });
  }

  /**
   * Affiche un message sous le formulaire.
   * @param {string} texte - message ("" pour effacer)
   * @param {string} type  - "succes", "erreur" ou "" (neutre)
   */
  function afficherRetour(texte, type) {
    if (!zoneRetour) return;
    zoneRetour.textContent = texte;
    zoneRetour.classList.remove("succes", "erreur");
    if (type) zoneRetour.classList.add(type);
  }

});
