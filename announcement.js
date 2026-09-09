/* Rotation discrète et continue des annonces. */
(() => {
  const bar = document.querySelector('.annonce-barre');
  if (!bar) return;

  const messages = [...bar.querySelectorAll('.annonce-message')];
  if (messages.length < 2) return;

  let index = 0;
  let timer;

  function schedule() {
    clearTimeout(timer);
    if (document.hidden) return;

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

  document.addEventListener('visibilitychange', schedule);
  schedule();
})();
