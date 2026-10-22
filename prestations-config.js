/* ============================================================
   Cascado Event — Configuration centrale des prestations
   ------------------------------------------------------------
   Source unique utilisée par le formulaire de devis
   (contact/devis.js) et par l'affichage des tarifs.

   Propriétés d'une prestation :
     unite         true  → proposée seule dans le devis
     premium       true  → au choix dans le Pack Premium
     prestige      'inclus'     → fait partie du Pack Prestige
                   'complement' → prestation complémentaire du Prestige,
                                  à des conditions privilégiées
     tarifs        { unite, complementPrestige } : montants prévus,
                   publiés seulement si affichageTarifs.actif est vrai
     configuration { etape, champ, message } : uniquement si le client
                   doit choisir un modèle (étape data-step="<etape>"
                   dans contact.html, radios name="<champ>")

   Ajouter une prestation sans modèle : une entrée ci-dessous suffit
   pour le formulaire (cases générées automatiquement). Penser aussi
   à sa carte sur l'accueil, au menu et au pied de page.
   ============================================================ */
window.CascadoConfig = {
  prestations: [
    {
      id: 'panneau-fontaine', nom: 'Panneau Fontaine', url: '/panneaux',
      unite: true, premium: true, prestige: 'inclus',
      configuration: { etape: 'panneau', champ: 'modele_panneau', message: 'Choisissez un modèle de panneau.' }
    },
    {
      id: 'photobooth', nom: 'Photobooth', url: '/photobooth',
      unite: true, premium: true, prestige: 'inclus',
      configuration: { etape: 'photobooth', champ: 'modele_photobooth', message: 'Choisissez un modèle de photobooth.' }
    },
    {
      id: 'livre-or-video', nom: 'Livre d’or vidéo', url: '/livre-or-video',
      unite: true, premium: true, prestige: 'inclus',
      configuration: { etape: 'livre', champ: 'modele_livre', message: 'Choisissez un modèle de livre d’or vidéo.' }
    },
    {
      // Aucune configuration : la personnalisation se discute après la réservation.
      id: 'magazine-box', nom: 'Magazine Box', url: '/magazine-box',
      description: 'Devenez les stars de votre propre couverture de magazine.',
      unite: true, premium: true, prestige: 'complement',
      tarifs: { unite: 400, complementPrestige: 160 }
    }
  ],
  packs: {
    premium: { id: 'premium', nom: 'Pack Premium', nombre: 2, tarif: 650 },
    prestige: { id: 'prestige', nom: 'Pack Prestige', tarif: 800 }
  },
  // false : « Sur devis » partout. true : les éléments [data-prix="<id>"]
  // affichent le tarif du pack ou de la prestation (tarif à l'unité).
  affichageTarifs: { actif: false, devise: '€' }
};

/* Affichage des tarifs, uniquement si la configuration l'autorise. */
(() => {
  const { prestations, packs, affichageTarifs } = window.CascadoConfig;
  if (!affichageTarifs.actif) return;
  const tarif = id => Object.values(packs).find(p => p.id === id)?.tarif ?? prestations.find(p => p.id === id)?.tarifs?.unite;
  function appliquer() {
    document.querySelectorAll('[data-prix]').forEach(el => {
      const montant = tarif(el.dataset.prix);
      if (typeof montant === 'number') el.textContent = `${montant.toLocaleString('fr-FR')} ${affichageTarifs.devise}`;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', appliquer);
  else appliquer();
})();
