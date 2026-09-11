/* ============================================================
   Avis Google — Cascado Event (accueil)
   ------------------------------------------------------------
   Pour ajouter un avis : copier-coller un objet dans le tableau
   avisGoogle ci-dessous, avec le texte et la note EXACTS affichés
   sur la fiche Google Cascado Event. Ne jamais inventer ni
   reformuler un avis.

   La note moyenne et la répartition par étoile sont recalculées
   automatiquement à partir de TOUS les avis de ce tableau. Le
   carrousel, lui, n'affiche que les 6 premiers (voir plus bas) :
   les avis suivants restent utilisés pour le calcul mais ne sont
   pas montrés sur la page.

   Le champ date affiche une date fixe (mois + année), jamais une
   valeur relative du type "il y a 3 jours" : ces formulations
   deviennent fausses avec le temps puisque les avis sont copiés
   à la main. Utiliser le mois et l'année de publication réels de
   l'avis sur Google (ex : "Septembre 2026").

   Exemple d'objet à copier :
   {
     nom: "Nom affiché sur Google",
     note: 5,
     date: "Septembre 2026",
     texte: "Texte exact de l'avis Google",
     avatar: "",
     lien: ""
   }
   ============================================================ */
(() => {
  'use strict';

  /* =================================================================
     RÉGLAGES — à modifier ici, sans toucher au reste du fichier.
     ================================================================= */

  /* Nombre total et réel d'avis sur la fiche Google Cascado Event
     (visible sur Google, pas seulement ceux copiés ci-dessous).
     Affiché tel quel dans le résumé ("X avis Google") : à mettre à
     jour à la main quand un nouvel avis arrive sur la fiche. */
  const TOTAL_AVIS_GOOGLE = 12;

  /* Lien vers la page d'avis de la fiche Google Cascado Event
     (lien "Voir tous les avis →" du résumé + état vide).
     Tant qu'il est vide, ces éléments restent masqués : mieux vaut
     ne rien afficher qu'un lien qui ne mène nulle part. */
  const LIEN_FICHE_GOOGLE = 'https://www.google.com/search?sca_esv=f9ef68dc8fb50d5d&rlz=1C1YTUH_frFR1179FR1179&sxsrf=APpeQnsVwaKih0MPcvEPEOO-YWe_LY30ww:1789129281550&q=cascado+event+&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_3_oyN4mLZLyj5nJtgnO7cGV3kj32NrxVBQdnYPr2CZ5Ezq_bwlR_1HTv-aMUxPw5WLVgL4%3D&uds=AJ5uw18ugXvqDbJNSvbGMdx0hJ418wXF5On2MAzdmk8ZtLXAYIl727ggRNibjnMV4gBq5OjJcEx6CT-185OYQeiMeG_qs3wVPn7b8pntNl7mYrGxvcWsWv0&sa=X&ved=2ahUKEwiQuKL6weaWAxWFK_sDHRTxEgIQ3PALegQILRAF&biw=1536&bih=826&dpr=1.25&sei=1fujaozeHsCpkdUPssq18QI#sv=CAESzQEKuQEStgEKd0FKaVQ0dElpdGljcTNjdmhJLU9qQU1WUDVWVGJsbEVONkpzUnowU01WWFIxUzcxTWVUTE9IejY2dHVaakdSNHZxNjEtUl9CV1pQckE1WUV4V2ZyWjVZX0V3Vl9XejFMQTFSWktaS0JTNFNHeEhGUkxVdWFCSkMwEhdRX0tqYXVMaEo4T2JrZFVQLXEzeW9BcxoiQURzcjlmU1RmUkVEM2ZpUzREZ0NwSjU3LTJ6TGxvdkhjURIEODA1MRoBMyoAMAA4AUAAGAAg6O-dzwY6AEoCEAE';

  /* Court texte de confiance affiché à côté du score. */
  const TEXTE_CONFIANCE = 'Nos clients nous font confiance pour rendre leurs événements inoubliables.';

  /* Nombre d'avis affichés dans le carrousel de la page d'accueil
     (le tableau avisGoogle peut en contenir davantage : la moyenne
     et la répartition ci-dessous utilisent, elles, tout le tableau). */
  const NB_AVIS_CARROUSEL = 6;

  /* ---------------------------------------------------------------
     AVIS GOOGLE — à modifier ici uniquement.
     --------------------------------------------------------------- */
  const avisGoogle = [
    {
      nom: "Abdesamad",
      note: 5,
      date: "Septembre 2026",
      texte: "Franchement très satisfait de la prestation, tout était nickel du début à la fin. L’installation était super et ça a vraiment fait son effet auprès des invités. Je recommande sans hésiter !",
      avatar: "",
      lien: ""
    },
    {
      nom: "Kar",
      note: 5,
      date: "Septembre 2026",
      texte: "On a pris le Pack Prestige pour notre mariage et franchement ça vaut vraiment le coup. Tout s’est super bien passé, l’équipe est sérieuse et le rendu était vraiment top. On a eu que des bons retours de nos invités, je recommande !",
      avatar: "",
      lien: ""
    },
    {
      nom: "Ali-Akbar Boudjemai",
      note: 5,
      date: "Septembre 2026",
      texte: "Prestataire très sérieux, arrangeant et ponctuel. Je recommande !",
      avatar: "",
      lien: ""
    },
    {
      nom: "Alaa-Eddine Boukebeche",
      note: 5,
      date: "Septembre 2026",
      texte: "Excellent service. J’ai appelé à la dernière minute pour un Photobooth et un panneau fontaine et ils ont été très réactifs. Merci !!",
      avatar: "",
      lien: ""
    },
    {
      nom: "chaimaa T",
      note: 5,
      date: "Septembre 2026",
      texte: "Très professionnel, à l’écoute de ses clients et de leurs demandes, prix accessible je recommande mille fois",
      avatar: "",
      lien: ""
    },
    {
      nom: "Souh",
      note: 5,
      date: "Septembre 2026",
      texte: "J’ai offert le panneau de bienvenue à un ami pour son mariage et franchement le rendu était magnifique! Il a adoré, tout comme ses invités. Merci à Cascado Event pour la prestation, je recommande 👌🏻",
      avatar: "",
      lien: ""
    }
  ];
  /* --------------------------------------------------------------- */

  const racine = document.querySelector('[data-avis-corps]');
  if (!racine) return;

  function creer(balise, options = {}) {
    const el = document.createElement(balise);
    if (options.classe) el.className = options.classe;
    if (options.texte !== undefined) el.textContent = options.texte;
    if (options.attrs) {
      for (const [cle, valeur] of Object.entries(options.attrs)) {
        if (valeur !== undefined && valeur !== null && valeur !== false && valeur !== '') {
          el.setAttribute(cle, valeur === true ? '' : valeur);
        }
      }
    }
    return el;
  }

  function rangeeEtoiles(pourcentage, { petite = false, label = '' } = {}) {
    const enveloppe = creer('span', {
      classe: 'avis-etoiles' + (petite ? ' avis-etoiles--petit' : ''),
      attrs: { role: 'img', 'aria-label': label },
    });
    enveloppe.style.setProperty('--pourcentage', Math.max(0, Math.min(100, pourcentage)) + '%');
    const fond = creer('span', { classe: 'avis-etoiles-fond', texte: '★★★★★', attrs: { 'aria-hidden': 'true' } });
    const plein = creer('span', { classe: 'avis-etoiles-plein', texte: '★★★★★', attrs: { 'aria-hidden': 'true' } });
    enveloppe.append(fond, plein);
    return enveloppe;
  }

  function iconeGoogle() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'avis-google-icone');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.innerHTML =
      '<path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.63h6.48a5.55 5.55 0 0 1-2.4 3.64v3h3.88c2.27-2.09 3.56-5.17 3.56-8.82Z"/>' +
      '<path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24Z"/>' +
      '<path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4-3.11Z"/>' +
      '<path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.11C6.22 6.88 8.87 4.77 12 4.77Z"/>';
    return svg;
  }

  function badgeVerifie() {
    const badge = creer('span', { classe: 'avis-badge-verifie' });
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('class', 'avis-badge-verifie-icone');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.innerHTML =
      '<circle cx="12" cy="12" r="12" fill="#1a73e8"/>' +
      '<path d="M9.5 12.8 7.4 10.7 6 12.1l3.5 3.5 7-7-1.4-1.4z" fill="#ffffff"/>';
    badge.append(svg);
    return badge;
  }

  function construireVide() {
    const bloc = creer('div', { classe: 'avis-vide' });
    bloc.append(creer('p', { texte: 'Découvrez les avis de nos clients sur Google' }));
    if (LIEN_FICHE_GOOGLE) {
      bloc.append(
        creer('a', {
          classe: 'bouton',
          texte: 'Voir la fiche Google',
          attrs: { href: LIEN_FICHE_GOOGLE, target: '_blank', rel: 'noopener noreferrer' },
        })
      );
    }
    return bloc;
  }

  function construireRepartition(avis, total) {
    const liste = creer('div', { classe: 'avis-repartition' });
    for (const etoile of [5, 4, 3]) {
      const nombre = avis.filter(a => Math.round(Number(a.note) || 0) === etoile).length;
      const pourcentage = total ? Math.round((nombre / total) * 100) : 0;

      const ligne = creer('div', { classe: 'avis-repartition-ligne' });
      ligne.append(creer('span', { classe: 'avis-repartition-etoile', texte: `${etoile} ★` }));

      const piste = creer('span', { classe: 'avis-repartition-piste' });
      const barre = creer('span', { classe: 'avis-repartition-barre' });
      barre.style.setProperty('--pourcentage', pourcentage + '%');
      piste.append(barre);
      ligne.append(piste);

      ligne.append(creer('span', { classe: 'avis-repartition-pourcentage', texte: `${pourcentage}%` }));
      liste.append(ligne);
    }
    return liste;
  }

  /* Résumé en deux colonnes : score + étoiles + total + lien à
     gauche, texte de confiance + répartition à droite. La moyenne
     et la répartition utilisent TOUT le tableau avisGoogle ; le
     nombre affiché vient uniquement de TOTAL_AVIS_GOOGLE. */
  function construireResume(avis) {
    const moyenne = avis.reduce((somme, a) => somme + (Number(a.note) || 0), 0) / avis.length;
    const moyenneTexte = moyenne.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

    const bloc = creer('div', { classe: 'avis-resume avis-anime' });

    const gauche = creer('div', { classe: 'avis-resume-gauche' });
    gauche.append(creer('p', { classe: 'avis-note-valeur', texte: moyenneTexte }));

    const details = creer('div', { classe: 'avis-resume-details' });
    details.append(rangeeEtoiles((moyenne / 5) * 100, { label: `Note moyenne ${moyenneTexte} sur 5` }));
    details.append(creer('p', { classe: 'avis-resume-total', texte: `+ ${TOTAL_AVIS_GOOGLE} avis Google vérifiés` }));
    if (LIEN_FICHE_GOOGLE) {
      details.append(
        creer('a', {
          classe: 'avis-lien-google',
          texte: 'Voir tous les avis →',
          attrs: { href: LIEN_FICHE_GOOGLE, target: '_blank', rel: 'noopener noreferrer' },
        })
      );
    }
    gauche.append(details);
    bloc.append(gauche);

    const droite = creer('div', { classe: 'avis-resume-droite' });
    droite.append(creer('p', { classe: 'avis-resume-confiance', texte: TEXTE_CONFIANCE }));
    droite.append(construireRepartition(avis, avis.length));
    bloc.append(droite);

    return bloc;
  }

  function construireCarte(avis) {
    const carte = creer('article', { classe: 'avis-carte', attrs: { role: 'listitem' } });

    const entete = creer('div', { classe: 'avis-carte-entete' });
    if (avis.avatar) {
      entete.append(
        creer('img', {
          classe: 'avis-avatar',
          attrs: { src: avis.avatar, alt: '', loading: 'lazy', decoding: 'async', width: '46', height: '46' },
        })
      );
    } else {
      const initiale = (avis.nom || '').trim().charAt(0).toUpperCase() || '?';
      entete.append(creer('span', { classe: 'avis-avatar-initiale', texte: initiale, attrs: { 'aria-hidden': 'true' } }));
    }
    const identite = creer('div', { classe: 'avis-identite' });
    identite.append(creer('p', { classe: 'avis-nom', texte: avis.nom || '' }));
    if (avis.date) identite.append(creer('p', { classe: 'avis-date', texte: avis.date }));
    entete.append(identite);

    const googleEntete = creer(avis.lien ? 'a' : 'span', {
      classe: 'avis-carte-google',
      attrs: avis.lien
        ? { href: avis.lien, target: '_blank', rel: 'noopener noreferrer', 'aria-label': 'Voir l’avis sur Google' }
        : { 'aria-hidden': 'true' },
    });
    googleEntete.append(iconeGoogle());
    entete.append(googleEntete);

    carte.append(entete);

    const note = Math.max(0, Math.min(5, Math.round(Number(avis.note) || 0)));
    const ligneNote = creer('div', { classe: 'avis-carte-note' });
    ligneNote.append(rangeeEtoiles((note / 5) * 100, { petite: true, label: `Note ${note} sur 5` }));
    ligneNote.append(badgeVerifie());
    carte.append(ligneNote);

    const texte = creer('p', { classe: 'avis-texte', texte: avis.texte || '' });
    carte.append(texte);

    const boutonPlus = creer('button', {
      classe: 'avis-lire-plus',
      texte: 'Lire la suite',
      attrs: { type: 'button', hidden: true },
    });
    boutonPlus.addEventListener('click', () => {
      const etendu = texte.classList.toggle('avis-texte--etendu');
      boutonPlus.textContent = etendu ? 'Réduire' : 'Lire la suite';
    });
    carte.append(boutonPlus);

    requestAnimationFrame(() => {
      if (texte.scrollHeight - texte.clientHeight > 2) boutonPlus.hidden = false;
    });

    return carte;
  }

  function construireCarrousel(avis) {
    const groupe = creer('div', { classe: 'avis-carrousel-groupe avis-anime' });
    const zone = creer('div', { classe: 'avis-carrousel' });

    const flecheGauche = creer('button', {
      classe: 'avis-fleche avis-fleche-gauche',
      attrs: { type: 'button', 'aria-label': 'Avis précédents' },
    });
    flecheGauche.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    const flecheDroite = creer('button', {
      classe: 'avis-fleche avis-fleche-droite',
      attrs: { type: 'button', 'aria-label': 'Avis suivants' },
    });
    flecheDroite.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    const fenetre = creer('div', { classe: 'avis-piste-fenetre' });
    const piste = creer('div', { classe: 'avis-piste', attrs: { role: 'list' } });
    avis.forEach(a => piste.append(construireCarte(a)));
    fenetre.append(piste);

    zone.append(flecheGauche, fenetre, flecheDroite);

    /* Barre de progression (mobile uniquement, voir CSS) : un curseur
       continu, pas de points, synchronisé avec le scroll réel. */
    const progression = creer('div', { classe: 'avis-progression', attrs: { 'aria-hidden': 'true' } });
    const progressionPiste = creer('div', { classe: 'avis-progression-piste' });
    const progressionBarre = creer('div', { classe: 'avis-progression-barre' });
    progressionPiste.append(progressionBarre);
    progression.append(progressionPiste);

    groupe.append(zone, progression);

    /* Défilement animé « à la main » (au lieu du scrollBy natif) pour
       garantir une seule carte à la fois, avec une durée et un easing
       précis — le scrollBy natif ne permet de contrôler ni l'un ni
       l'autre et pouvait laisser dériver de plusieurs cartes. */
    function easeVersLaCarte(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    let animationEnCours = null;
    function animerVersPosition(cible) {
      if (animationEnCours) cancelAnimationFrame(animationEnCours);
      const depart = fenetre.scrollLeft;

      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        fenetre.scrollLeft = cible;
        return;
      }

      const duree = 420;
      const debut = performance.now();
      const etape = maintenant => {
        const t = Math.min(1, (maintenant - debut) / duree);
        fenetre.scrollLeft = depart + (cible - depart) * easeVersLaCarte(t);
        animationEnCours = t < 1 ? requestAnimationFrame(etape) : null;
      };
      animationEnCours = requestAnimationFrame(etape);
    }

    function decaler(sens) {
      const premiereCarte = piste.querySelector('.avis-carte');
      if (!premiereCarte) return;
      const pas = premiereCarte.getBoundingClientRect().width + 24;
      const max = fenetre.scrollWidth - fenetre.clientWidth;
      animerVersPosition(Math.max(0, Math.min(max, fenetre.scrollLeft + sens * pas)));
    }

    flecheGauche.addEventListener('click', () => {
      decaler(-1);
      planifierAuto();
    });
    flecheDroite.addEventListener('click', () => {
      decaler(1);
      planifierAuto();
    });

    /* Défilement automatique : une carte toutes les 5s, boucle au
       dernier avis. En pause au survol/toucher, onglet masqué ou
       préférence "mouvement réduit" — jamais pendant que le
       visiteur lit ou interagit. */
    const DELAI_AUTO = 5000;
    let minuteurAuto = null;
    let autoEnPause = false;

    function arreterAuto() {
      if (minuteurAuto) {
        clearTimeout(minuteurAuto);
        minuteurAuto = null;
      }
    }

    function planifierAuto() {
      arreterAuto();
      if (autoEnPause || document.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      minuteurAuto = setTimeout(() => {
        const max = fenetre.scrollWidth - fenetre.clientWidth;
        if (fenetre.scrollLeft >= max - 2) {
          animerVersPosition(0);
        } else {
          decaler(1);
        }
        planifierAuto();
      }, DELAI_AUTO);
    }

    function suspendreAuto() {
      autoEnPause = true;
      arreterAuto();
    }
    function reprendreAuto() {
      autoEnPause = false;
      planifierAuto();
    }

    zone.addEventListener('mouseenter', suspendreAuto);
    zone.addEventListener('mouseleave', reprendreAuto);
    zone.addEventListener('focusin', suspendreAuto);
    zone.addEventListener('focusout', reprendreAuto);
    fenetre.addEventListener('pointerdown', suspendreAuto, { passive: true });
    fenetre.addEventListener('pointerup', reprendreAuto, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) arreterAuto();
      else planifierAuto();
    });

    function majFleches() {
      const max = fenetre.scrollWidth - fenetre.clientWidth - 2;
      flecheGauche.disabled = fenetre.scrollLeft <= 0;
      flecheDroite.disabled = max <= 0 || fenetre.scrollLeft >= max;
    }

    function majProgression() {
      const max = fenetre.scrollWidth - fenetre.clientWidth;
      const largeur = Math.min(100, Math.max(10, (fenetre.clientWidth / fenetre.scrollWidth) * 100));
      const ratio = max > 0 ? fenetre.scrollLeft / max : 0;
      progressionBarre.style.setProperty('--avis-progression-largeur', largeur + '%');
      progressionBarre.style.setProperty('--avis-progression-position', ratio * (100 - largeur) + '%');
    }

    let planifie = false;
    fenetre.addEventListener(
      'scroll',
      () => {
        if (planifie) return;
        planifie = true;
        requestAnimationFrame(() => {
          majFleches();
          majProgression();
          planifie = false;
        });
      },
      { passive: true }
    );
    window.addEventListener('resize', () => {
      majFleches();
      majProgression();
    });
    requestAnimationFrame(() => {
      majFleches();
      majProgression();
    });

    planifierAuto();

    return groupe;
  }

  function animerApparition(elements) {
    const reduitMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduitMotion || !('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('avis-anime--visible'));
      return;
    }
    const observateur = new IntersectionObserver(
      entrees => {
        entrees.forEach(entree => {
          if (!entree.isIntersecting) return;
          entree.target.classList.add('avis-anime--visible');
          observateur.unobserve(entree.target);
        });
      },
      { threshold: 0.12 }
    );
    elements.forEach(el => observateur.observe(el));
  }

  function construire() {
    racine.innerHTML = '';
    if (!avisGoogle.length) {
      racine.append(construireVide());
      return;
    }
    const avisAffiches = avisGoogle.slice(0, NB_AVIS_CARROUSEL);

    const resume = construireResume(avisGoogle);
    const carrousel = construireCarrousel(avisAffiches);

    racine.append(resume, carrousel);
    animerApparition([resume, carrousel]);
  }

  construire();
})();
