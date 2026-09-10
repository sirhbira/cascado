/* ============================================================
   CascadoEvent — JavaScript partagé (toutes les pages)
   ------------------------------------------------------------
   Fonctionnalités :
     1. Menu de navigation responsive (hamburger)
     2. Année automatique dans le pied de page
     3. Apparition douce des sections au défilement (une seule fois)
     4. Vignettes vidéo cliquables -> ouverture dans une fenêtre légère
     5. Formulaire de contact (validation + envoi par email)
     6. Carrousel des packs (mobile)
     7. Suivi Google Ads / Analytics (clics devis, WhatsApp, téléphone,
        choix de modèle) — l'envoi réussi du devis est suivi séparément
        dans contact/devis.js, au moment réel de la confirmation.
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

  // Sous-navigation mobile : on s'assure que l'onglet actif est visible
  const sousNavActif = document.querySelector(".sous-nav-liste a.actif");
  if (sousNavActif) {
    sousNavActif.scrollIntoView({ block: "nearest", inline: "center" });
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
     À REMPLIR : renseigner l'attribut data-video="/images/xxx.mp4"
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


  /* --------------------------------------------------------
     6. CARROUSEL DES PACKS (mobile)
     --------------------------------------------------------
     Sur petit écran, la grille Premium / Prestige devient un
     carrousel horizontal : le Prestige est affiché en premier,
     la carte centrée est mise en avant, les autres sont en
     retrait. Sur écran large, on ne touche à rien (grille CSS).
     -------------------------------------------------------- */
  document.querySelectorAll(".packs-grille").forEach(function (grille) {
    const cartes = Array.prototype.slice.call(grille.querySelectorAll(".pack"));
    if (cartes.length < 2) return;

    const mq = window.matchMedia("(max-width: 720px)");

    // Indicateurs discrets sous le carrousel
    const indicateurs = document.createElement("div");
    indicateurs.className = "packs-dots";
    grille.insertAdjacentElement("afterend", indicateurs);

    // Chaque puce est liée à SA carte (pas à un index), et les puces sont
    // ordonnées comme les cartes à l'écran : aucune inversion possible.
    let puces = [];
    let ecouteActive = false;
    let planifie = false;

    function positionCentree(carte) {
      const decalage =
        grille.scrollLeft +
        carte.getBoundingClientRect().left -
        grille.getBoundingClientRect().left;
      return decalage - (grille.clientWidth - carte.clientWidth) / 2;
    }

    // Carte réellement affichée au centre = celle dont le centre est le plus
    // proche du centre de la zone visible. Fonction pure de la position de
    // défilement : impossible de se désynchroniser, même après plusieurs swipes.
    function carteCentrale() {
      const zone = grille.getBoundingClientRect();
      const centre = zone.left + zone.width / 2;
      let choisie = cartes[0];
      let meilleure = Infinity;
      cartes.forEach(function (c) {
        const r = c.getBoundingClientRect();
        const ecart = Math.abs(r.left + r.width / 2 - centre);
        if (ecart < meilleure) {
          meilleure = ecart;
          choisie = c;
        }
      });
      return choisie;
    }

    function activer(carte) {
      cartes.forEach(function (c) { c.classList.toggle("is-active", c === carte); });
      puces.forEach(function (p) {
        p.bouton.classList.toggle("is-active", p.carte === carte);
      });
    }

    function synchroniser() {
      activer(carteCentrale());
    }

    function surDefilement() {
      if (planifie) return;
      planifie = true;
      window.requestAnimationFrame(function () {
        planifie = false;
        synchroniser();
      });
    }

    function construireDots() {
      indicateurs.textContent = "";
      // Ordre visuel réel des cartes (tient compte du CSS `order` sur mobile).
      const ordreVisuel = cartes.slice().sort(function (a, b) {
        return a.getBoundingClientRect().left - b.getBoundingClientRect().left;
      });
      puces = ordreVisuel.map(function (carte, i) {
        const bouton = document.createElement("button");
        bouton.type = "button";
        bouton.className = "packs-dot";
        bouton.setAttribute("aria-label", "Voir le pack " + (i + 1));
        bouton.addEventListener("click", function () {
          grille.scrollTo({ left: positionCentree(carte), behavior: "smooth" });
        });
        indicateurs.appendChild(bouton);
        return { bouton: bouton, carte: carte };
      });
    }

    function demarrer() {
      const prestige = grille.querySelector(".pack.prestige") || cartes[0];
      grille.scrollLeft = Math.max(0, positionCentree(prestige));
      construireDots();
      synchroniser();
      grille.addEventListener("scroll", surDefilement, { passive: true });
      ecouteActive = true;
    }

    function arreter() {
      if (ecouteActive) {
        grille.removeEventListener("scroll", surDefilement);
        ecouteActive = false;
      }
      indicateurs.textContent = "";
      puces = [];
      cartes.forEach(function (c) { c.classList.remove("is-active"); });
    }

    function appliquer() {
      arreter();
      if (mq.matches) demarrer();
    }

    appliquer();
    if (mq.addEventListener) {
      mq.addEventListener("change", appliquer);
    } else if (mq.addListener) {
      mq.addListener(appliquer);
    }
  });


  /* --------------------------------------------------------
     7. SUIVI GOOGLE ADS / ANALYTICS (clics)
     --------------------------------------------------------
     Un seul écouteur délégué, déclenché uniquement par un clic
     réel (jamais au chargement de la page). Chaque branche fait
     un "return" : un même clic ne peut jamais déclencher deux
     événements. L'envoi réussi du devis est suivi séparément,
     dans contact/devis.js, au moment réel de la confirmation.
     -------------------------------------------------------- */
  document.addEventListener("click", function (e) {
    if (typeof window.gtag !== "function") return;

    const lien = e.target.closest("a");
    if (!lien) return;

    const href = lien.getAttribute("href") || "";

    if (lien.classList.contains("wa-flottant") || href.indexOf("wa.me") !== -1) {
      window.gtag("event", "click_whatsapp");
      return;
    }

    if (href.indexOf("tel:") === 0) {
      window.gtag("event", "click_phone");
      return;
    }

    const texte = (lien.textContent || "").trim().toLowerCase();

    if (texte.indexOf("devis") !== -1) {
      window.gtag("event", "generate_lead");
      return;
    }

    if (texte.indexOf("choisir") !== -1) {
      window.gtag("event", "click_choose_model");
    }
  });

});
