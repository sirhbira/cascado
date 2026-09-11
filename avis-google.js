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

   Exemple d'objet à copier :
   {
     nom: "Nom affiché sur Google",
     note: 5,
     date: "il y a 2 semaines",
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
     (lien "Voir tous les avis →" + bouton final + état vide).
     Tant qu'il est vide, ces éléments restent masqués : mieux vaut
     ne rien afficher qu'un lien qui ne mène nulle part. */
  const LIEN_FICHE_GOOGLE = '';

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
      date: "il y a une heure",
      texte: "Franchement très satisfait de la prestation, tout était nickel du début à la fin. L’installation était super et ça a vraiment fait son effet auprès des invités. Je recommande sans hésiter !",
      avatar: "",
      lien: ""
    },
    {
      nom: "Kar",
      note: 5,
      date: "il y a 2 heures",
      texte: "On a pris le Pack Prestige pour notre mariage et franchement ça vaut vraiment le coup. Tout s’est super bien passé, l’équipe est sérieuse et le rendu était vraiment top. On a eu que des bons retours de nos invités, je recommande !",
      avatar: "",
      lien: ""
    },
    {
      nom: "Ali-Akbar Boudjemai",
      note: 5,
      date: "il y a 16 heures",
      texte: "Prestataire très sérieux, arrangeant et ponctuel. Je recommande !",
      avatar: "",
      lien: ""
    },
    {
      nom: "Alaa-Eddine Boukebeche",
      note: 5,
      date: "il y a 16 heures",
      texte: "Excellent service. J’ai appelé à la dernière minute pour un Photobooth et un panneau fontaine et ils ont été très réactifs. Merci !!",
      avatar: "",
      lien: ""
    },
    {
      nom: "chaimaa T",
      note: 5,
      date: "il y a 18 heures",
      texte: "Très professionnel, à l’écoute de ses clients et de leurs demandes, prix accessible je recommande mille fois",
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
    svg.setAttribute('class', 'avis-source-icone');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.innerHTML =
      '<path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.63h6.48a5.55 5.55 0 0 1-2.4 3.64v3h3.88c2.27-2.09 3.56-5.17 3.56-8.82Z"/>' +
      '<path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A12 12 0 0 0 12 24Z"/>' +
      '<path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4-3.11Z"/>' +
      '<path fill="#EA4335" d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.11C6.22 6.88 8.87 4.77 12 4.77Z"/>';
    return svg;
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
    for (let etoile = 5; etoile >= 1; etoile -= 1) {
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
    gauche.append(rangeeEtoiles((moyenne / 5) * 100, { label: `Note moyenne ${moyenneTexte} sur 5` }));
    gauche.append(creer('p', { classe: 'avis-resume-total', texte: `${TOTAL_AVIS_GOOGLE} avis Google` }));
    if (LIEN_FICHE_GOOGLE) {
      gauche.append(
        creer('a', {
          classe: 'avis-lien-google',
          texte: 'Voir tous les avis →',
          attrs: { href: LIEN_FICHE_GOOGLE, target: '_blank', rel: 'noopener noreferrer' },
        })
      );
    }
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
    carte.append(entete);

    const note = Math.max(0, Math.min(5, Math.round(Number(avis.note) || 0)));
    carte.append(rangeeEtoiles((note / 5) * 100, { petite: true, label: `Note ${note} sur 5` }));

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

    const source = creer(avis.lien ? 'a' : 'span', {
      classe: 'avis-source',
      attrs: avis.lien ? { href: avis.lien, target: '_blank', rel: 'noopener noreferrer' } : {},
    });
    source.append(iconeGoogle());
    source.append(document.createTextNode('Publié sur Google'));
    carte.append(source);

    requestAnimationFrame(() => {
      if (texte.scrollHeight - texte.clientHeight > 2) boutonPlus.hidden = false;
    });

    return carte;
  }

  function construireCarrousel(avis) {
    const zone = creer('div', { classe: 'avis-carrousel avis-anime' });

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

    function decaler(sens) {
      const premiereCarte = piste.querySelector('.avis-carte');
      if (!premiereCarte) return;
      const pas = premiereCarte.getBoundingClientRect().width + 24;
      fenetre.scrollBy({ left: sens * pas, behavior: 'smooth' });
    }
    flecheGauche.addEventListener('click', () => decaler(-1));
    flecheDroite.addEventListener('click', () => decaler(1));

    function majFleches() {
      const max = fenetre.scrollWidth - fenetre.clientWidth - 2;
      flecheGauche.disabled = fenetre.scrollLeft <= 0;
      flecheDroite.disabled = max <= 0 || fenetre.scrollLeft >= max;
    }
    let planifie = false;
    fenetre.addEventListener(
      'scroll',
      () => {
        if (planifie) return;
        planifie = true;
        requestAnimationFrame(() => {
          majFleches();
          planifie = false;
        });
      },
      { passive: true }
    );
    window.addEventListener('resize', majFleches);
    requestAnimationFrame(majFleches);

    return zone;
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

  function construireBoutonFinal() {
    if (!LIEN_FICHE_GOOGLE) return null;
    const bloc = creer('div', { classe: 'avis-final avis-anime' });
    bloc.append(
      creer('a', {
        classe: 'bouton fantome',
        texte: 'Découvrir tous les avis Google',
        attrs: { href: LIEN_FICHE_GOOGLE, target: '_blank', rel: 'noopener noreferrer' },
      })
    );
    return bloc;
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
    const boutonFinal = construireBoutonFinal();

    const elements = [resume, carrousel];
    racine.append(resume, carrousel);
    if (boutonFinal) {
      racine.append(boutonFinal);
      elements.push(boutonFinal);
    }
    animerApparition(elements);
  }

  construire();
})();
