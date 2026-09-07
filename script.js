/* ============================================================
   CascadoEvent — JavaScript
   ------------------------------------------------------------
   Trois petites fonctionnalités :
     1. Ouvrir / fermer le menu de navigation sur mobile
     2. Mettre à jour l'année dans le pied de page
     3. Gérer l'envoi (simulé) du formulaire de contact
   ============================================================ */

// "DOMContentLoaded" : on attend que le HTML soit chargé avant d'agir
document.addEventListener("DOMContentLoaded", function () {

  /* --------------------------------------------------------
     1. MENU MOBILE
     -------------------------------------------------------- */

  // On récupère le bouton hamburger et le menu dans la page
  const boutonBurger = document.getElementById("menu-burger");
  const menuNav = document.getElementById("menu-nav");

  if (boutonBurger && menuNav) {

    // Au clic sur le hamburger : on ajoute/enlève la classe "ouvert"
    boutonBurger.addEventListener("click", function () {
      const estOuvert = menuNav.classList.toggle("ouvert");

      // On met à jour l'attribut d'accessibilité (lecteurs d'écran)
      boutonBurger.setAttribute("aria-expanded", estOuvert ? "true" : "false");
      boutonBurger.setAttribute(
        "aria-label",
        estOuvert ? "Fermer le menu" : "Ouvrir le menu"
      );
    });

    // Quand on clique sur un lien du menu, on referme le menu (utile sur mobile)
    const liensMenu = menuNav.querySelectorAll("a");
    liensMenu.forEach(function (lien) {
      lien.addEventListener("click", function () {
        menuNav.classList.remove("ouvert");
        boutonBurger.setAttribute("aria-expanded", "false");
        boutonBurger.setAttribute("aria-label", "Ouvrir le menu");
      });
    });
  }


  /* --------------------------------------------------------
     2. ANNÉE AUTOMATIQUE DANS LE PIED DE PAGE
     -------------------------------------------------------- */

  const spanAnnee = document.getElementById("annee");
  if (spanAnnee) {
    // new Date().getFullYear() donne l'année courante (ex : 2026)
    spanAnnee.textContent = new Date().getFullYear();
  }


  /* --------------------------------------------------------
     3. FORMULAIRE DE CONTACT (envoi simulé)
     --------------------------------------------------------
     ATTENTION : sans serveur, on ne peut pas vraiment envoyer
     d'email. Ici on se contente de vérifier les champs et
     d'afficher un message de confirmation.

     À REMPLIR plus tard : brancher un vrai service d'envoi
     (Formspree, Netlify Forms, EmailJS…) ou un lien mailto.
     -------------------------------------------------------- */

  const formulaire = document.getElementById("formulaire-contact");
  const zoneRetour = document.getElementById("formulaire-retour");

  if (formulaire && zoneRetour) {

    formulaire.addEventListener("submit", function (evenement) {
      // On empêche le rechargement de la page (comportement par défaut)
      evenement.preventDefault();

      // On lit les valeurs saisies, en retirant les espaces inutiles
      const nom = formulaire.nom.value.trim();
      const email = formulaire.email.value.trim();
      const message = formulaire.message.value.trim();

      // Vérification simple : tous les champs doivent être remplis
      if (nom === "" || email === "" || message === "") {
        afficherRetour("Merci de remplir tous les champs.", "erreur");
        return;
      }

      // Vérification très basique du format de l'email
      const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailValide) {
        afficherRetour("L'adresse email ne semble pas valide.", "erreur");
        return;
      }

      // Tout est bon : on simule l'envoi
      afficherRetour(
        "Merci " + nom + " ! Votre message a bien été pris en compte (démo).",
        "succes"
      );
      formulaire.reset(); // on vide le formulaire
    });
  }

  /**
   * Affiche un message sous le formulaire.
   * @param {string} texte  - le message à afficher
   * @param {string} type   - "succes" ou "erreur" (change la couleur)
   */
  function afficherRetour(texte, type) {
    zoneRetour.textContent = texte;
    zoneRetour.classList.remove("succes", "erreur");
    zoneRetour.classList.add(type);
  }

});
