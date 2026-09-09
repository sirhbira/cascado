/* Liens du catalogue et identifiants communs au formulaire existant. */
(() => {
  'use strict';
  const slug = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  window.CascadoModeles = { slug };
  document.querySelectorAll('.galerie[data-prestation]').forEach(gallery => {
    gallery.querySelectorAll('.modele').forEach(card => {
      const body = card.querySelector('.modele-corps');
      const title = body?.querySelector('h2, h3');
      if (!title) return;
      let button = body.querySelector('.bouton');
      const unavailable = card.dataset.disponible === 'false' || button?.disabled ||
        slug(card.querySelector('.modele-disponibilite')?.textContent || '').includes('bientot-disponible');
      if (unavailable) {
        if (!button || button.tagName !== 'BUTTON') {
          const disabled = document.createElement('button');
          disabled.className = 'bouton';
          if (button) button.replaceWith(disabled);
          else body.append(disabled);
          button = disabled;
        }
        button.type = 'button';
        button.disabled = true;
        button.textContent = 'BIENTÔT DISPONIBLE';
        return;
      }
      if (!button) {
        button = document.createElement('a');
        button.className = 'bouton';
        button.textContent = 'CHOISIR CE MODÈLE';
        body.append(button);
      }
      const params = new URLSearchParams({
        prestation: gallery.dataset.prestation,
        modele: card.dataset.modele || slug(title.textContent)
      });
      button.href = '/contact?' + params;
    });
  });
})();
