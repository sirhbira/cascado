/* Rotation discrète, suspendue pendant la lecture ou lorsque l'onglet est masqué. */
(() => {
  const bar = document.querySelector('.annonce-barre');
  if (!bar) return;
  const messages = [...bar.querySelectorAll('.annonce-message')];
  const toggle = bar.querySelector('.annonce-pause');
  let index = 0;
  let paused = false;
  let hovered = false;
  let timer;

  function schedule() {
    clearTimeout(timer);
    if (paused || hovered || document.hidden || (bar.contains(document.activeElement) && document.activeElement !== toggle)) return;
    timer = setTimeout(() => {
      messages[index].classList.remove('est-visible');
      messages[index].setAttribute('aria-hidden', 'true');
      messages[index].inert = true;
      index = (index + 1) % messages.length;
      messages[index].classList.add('est-visible');
      messages[index].removeAttribute('aria-hidden');
      messages[index].inert = false;
      schedule();
    }, 4000);
  }

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.textContent = paused ? '▶' : 'Ⅱ';
    toggle.setAttribute('aria-label', paused ? 'Reprendre les annonces' : 'Mettre les annonces en pause');
    schedule();
  });
  bar.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') { hovered = true; schedule(); }
  });
  bar.addEventListener('pointerleave', () => { hovered = false; schedule(); });
  bar.addEventListener('focusin', schedule);
  bar.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  schedule();
})();
