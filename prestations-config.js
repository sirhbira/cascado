/* ============================================================
   Cascado Event — Configuration centrale des prestations
   ------------------------------------------------------------
   Source unique des règles utilisées par le formulaire de devis
   (contact/devis.js) et de l'affichage des tarifs.

   Ajouter une prestation :
     1. une entrée dans `prestations` ci-dessous ;
     2. sa carte dans le formulaire (contact.html), le carrousel de
        l'accueil, le menu « Nos prestations » et le pied de page ;
     3. si elle a des modèles : une étape data-step="<etape>" dans
        contact.html dont les radios portent name="<champModele>".

   Tarifs : `afficher: false` conserve « Sur devis » partout.
   Passer à `true` remplace automatiquement les éléments
   [data-prix="<clé>"] des pages par les montants ci-dessous.
   ============================================================ */
window.CascadoConfig = {
  prestations: [
    { id: 'panneau-fontaine', nom: 'Panneau Fontaine', url: '/panneaux', etape: 'panneau', champModele: 'modele_panneau', messageModele: 'Choisissez un modèle de panneau.' },
    { id: 'photobooth', nom: 'Photobooth', url: '/photobooth', etape: 'photobooth', champModele: 'modele_photobooth', messageModele: 'Choisissez un modèle de photobooth.' },
    { id: 'livre-or-video', nom: 'Livre d’or vidéo', url: '/livre-or-video', etape: 'livre', champModele: 'modele_livre', messageModele: 'Choisissez un modèle de livre d’or vidéo.' },
    // Pas de modèle : seulement une étape facultative de personnalisation.
    { id: 'magazine-box', nom: 'Magazine Box', url: '/magazine-box', etape: 'magazine', champPersonnalisation: 'personnalisation_magazine' }
  ],
  packs: {
    premium: {
      nom: 'Pack Premium',
      nombre: 2,
      choix: ['Panneau Fontaine', 'Photobooth', 'Livre d’or vidéo', 'Magazine Box']
    },
    prestige: {
      nom: 'Pack Prestige',
      inclus: ['Panneau Fontaine', 'Photobooth', 'Livre d’or vidéo'],
      // Option payante à tarif préférentiel, jamais incluse automatiquement.
      option: 'Magazine Box'
    }
  },
  tarifs: {
    afficher: false,
    devise: '€',
    premium: 650,
    prestige: 800,
    'magazine-box': 400,
    'option-magazine-prestige': 160
  }
};

/* Affichage des tarifs, uniquement si la configuration l'autorise. */
(() => {
  const { tarifs } = window.CascadoConfig;
  if (!tarifs.afficher) return;
  const montant = n => `${n.toLocaleString('fr-FR')} ${tarifs.devise}`;
  function appliquer() {
    document.querySelectorAll('[data-prix]').forEach(el => {
      const prix = tarifs[el.dataset.prix];
      if (typeof prix !== 'number') return;
      const reference = tarifs[el.dataset.prixReference];
      // Option : « +160 € au lieu de 400 € (−60 %) ».
      el.textContent = typeof reference === 'number'
        ? `+${montant(prix)} au lieu de ${montant(reference)} (−${Math.round((1 - prix / reference) * 100)} %)`
        : montant(prix);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', appliquer);
  else appliquer();
})();
