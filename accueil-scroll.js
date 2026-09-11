/* Apparitions propres à l'accueil ; aucun changement des moteurs de carrousel. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Remplace l'ancien reveal avant son initialisation dans script.js.
  document.querySelectorAll('main .reveal').forEach(el => el.classList.remove('reveal'));
  if (reduced.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;

  const mobile = matchMedia('(max-width: 1100px)');
  const pending = new Map();
  const running = new Map();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

  function reveal(el, immediate = false) {
    const effect = pending.get(el);
    if (!effect) return;
    pending.delete(el);
    observer.unobserve(el);
    el.classList.remove('accueil-scroll-attente');
    if (immediate || reduced.matches) return;
    const light = mobile.matches;
    const y = light ? Math.min(effect.y || 0, 8) : effect.y || 0;
    const finalOpacity = getComputedStyle(el).opacity;
    // Les propriétés individuelles translate/scale préservent les transform existants.
    const animation = el.animate([
      { opacity: 0, translate: `0 ${y}px`, scale: light ? 1 : effect.scale || 1 },
      { opacity: finalOpacity, translate: '0 0', scale: 1 }
    ], { duration: light ? Math.min(effect.duration, 650) : effect.duration,
      delay: light ? Math.min(effect.delay || 0, 100) : effect.delay || 0,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' });
    running.set(el, animation);
    animation.finished.then(() => running.delete(el)).catch(() => running.delete(el));
  }

  function add(selector, effect) {
    document.querySelectorAll(selector).forEach((el, index) => {
      if (pending.has(el)) return;
      pending.set(el, { ...effect, delay: (effect.delay || 0) + (effect.stagger ? (index % 3) * effect.stagger : 0) });
      el.classList.add('accueil-scroll-attente');
      observer.observe(el);
    });
  }

  try {
    add('.entete-section .section-titre, .equipe-titre', { y: 16, duration: 750 });
    add('.entete-section .surtitre, .equipe-contenu .surtitre', { duration: 600 });
    add('.entete-section .section-intro, .equipe-texte', { y: 10, duration: 700, delay: 70 });
    add('.entete-section .bouton', { y: 8, duration: 600, delay: 160 });
    if (mobile.matches) {
      // Apparition du groupe uniquement : le swipe et l'état des cartes restent intacts.
      add('.prestations-coverflow, .packs-grille', { y: 8, duration: 650 });
    } else {
      add('.univers-carte', { y: 18, scale: 0.985, duration: 800, stagger: 90 });
      add('.univers-media img', { scale: 1.025, duration: 850, stagger: 90 });
      add('.pack', { y: 14, scale: 0.98, duration: 850, stagger: 100 });
    }
    add('.avis-google-cadre', { y: 16, duration: 800 });
    add('.faq-item', { y: 8, duration: 600, stagger: 45 });
    add('.equipe-image', { scale: 1.025, duration: 900 });
    add('.site-footer', { duration: 800 });
  } catch (_) {
    pending.forEach((_, el) => reveal(el, true));
  }

  // Ne jamais masquer un lien atteint au clavier ou via une ancre.
  document.addEventListener('focusin', event => {
    pending.forEach((_, el) => { if (el.contains(event.target)) reveal(el, true); });
    running.forEach((animation, el) => { if (el.contains(event.target)) animation.cancel(); });
  });
  function finishAll() {
    pending.forEach((_, el) => reveal(el, true));
    running.forEach(animation => animation.cancel());
    observer.disconnect();
  }
  reduced.addEventListener('change', event => { if (event.matches) finishAll(); });
  // Une rotation / un changement de largeur ne doit jamais perturber un carrousel.
  mobile.addEventListener('change', finishAll);
  window.addEventListener('beforeprint', finishAll);
})();
