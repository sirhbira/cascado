(() => {
  const viewport = document.querySelector('.galerie-fenetre');
  const track = document.querySelector('.galerie-ruban');
  const originals = [...track.children];
  const dialog = document.getElementById('galerie-lightbox');
  const image = document.getElementById('lightbox-image');
  const player = document.getElementById('lightbox-video');
  const caption = document.getElementById('lightbox-legende');
  const pauseButton = document.getElementById('galerie-pause');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let offset = 0, span = 0, stride = 0, last = 0, frame = 0;
  let visible = true, paused = reduced.matches, until = 0, gesture = null, dragged = false, active = 0;
  let oldOverflow = '', opener = null, restoringFocus = false, motion = null;
  function copy() {
    const fragment = document.createDocumentFragment();
    originals.forEach(el => {
      const clone = el.cloneNode(true);
      clone.tabIndex = -1; clone.setAttribute('aria-hidden', 'true');
      const thumbnail = clone.querySelector('img');
      if (thumbnail) thumbnail.loading = 'lazy';
      fragment.append(clone);
    });
    return fragment;
  }
  track.prepend(copy()); track.append(copy());
  const previews = [...track.querySelectorAll('video')];
  const visibleVideos = new Set();
  function syncVideos() {
    previews.forEach(video => {
      if (!document.hidden && !dialog.open && !paused && visibleVideos.has(video)) {
        if (!video.getAttribute('src')) video.src = video.dataset.src;
        video.muted = true;
        video.play().catch(() => {});
      } else video.pause();
    });
  }
  const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleVideos.add(entry.target);
      else visibleVideos.delete(entry.target);
    });
    syncVideos();
  }, { threshold: 0.05 });
  previews.forEach(video => videoObserver.observe(video));
  function draw() {
    if (!span) return;
    offset = span + ((offset - span) % span + span) % span;
    track.style.transform = `translate3d(${-offset}px,0,0)`;
  }
  function measure() {
    motion = null;
    const fraction = span ? (offset - span) / span : 0;
    stride = originals[1].offsetLeft - originals[0].offsetLeft;
    span = stride * originals.length;
    offset = span + fraction * span;
    draw();
  }
  function hold() { until = performance.now() + 4000; }
  function tick(now) {
    frame = 0;
    if (!visible || document.hidden) { last = 0; return; }
    if (motion) {
      const progress = Math.min((now - motion.start) / 450, 1);
      offset = motion.from + motion.distance * (1 - Math.pow(1 - progress, 3));
      draw();
      if (progress === 1) motion = null;
    } else if (last && !paused && !gesture && !dialog.open && now > until) {
      offset += Math.min(now - last, 50) * 0.024;
      draw();
    }
    last = now;
    frame = requestAnimationFrame(tick);
  }
  function start() { if (!frame && visible && !document.hidden) { last = 0; frame = requestAnimationFrame(tick); } }
  function pauseLabel() {
    pauseButton.textContent = paused ? 'Reprendre' : 'Pause';
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Reprendre le défilement' : 'Mettre le défilement en pause');
    syncVideos();
  }
  pauseButton.addEventListener('click', () => { paused = !paused; pauseLabel(); });
  reduced.addEventListener('change', e => { paused = e.matches; pauseLabel(); });
  viewport.addEventListener('pointerdown', e => {
    if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
    gesture = { id: e.pointerId, x: e.clientX, y: e.clientY, lastX: e.clientX };
    motion = null;
    dragged = false; hold();
  });
  viewport.addEventListener('pointermove', e => {
    if (!gesture || gesture.id !== e.pointerId) return;
    const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
    if (!dragged && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy)) {
      dragged = true; viewport.setPointerCapture(e.pointerId);
    }
    if (dragged) { offset -= e.clientX - gesture.lastX; draw(); e.preventDefault(); }
    gesture.lastX = e.clientX; hold();
  }, { passive: false });
  function finish(e) {
    if (!gesture || gesture.id !== e.pointerId) return;
    gesture = null; hold();
    if (viewport.hasPointerCapture(e.pointerId)) viewport.releasePointerCapture(e.pointerId);
  }
  viewport.addEventListener('pointerup', finish);
  viewport.addEventListener('pointercancel', finish);
  viewport.addEventListener('lostpointercapture', e => { if (gesture?.id === e.pointerId) { gesture = null; hold(); } });
  viewport.addEventListener('dragstart', e => e.preventDefault());
  viewport.addEventListener('wheel', e => {
    const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
    if (Math.abs(dx) <= Math.abs(e.shiftKey ? 0 : e.deltaY)) return;
    e.preventDefault(); motion = null; offset += dx * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? viewport.clientWidth : 1); hold(); draw();
  }, { passive: false });
  document.querySelectorAll('[data-move]').forEach(button => button.addEventListener('click', () => {
    const distance = Number(button.dataset.move) * stride;
    if (reduced.matches) { offset += distance; draw(); }
    else motion = { from: offset, distance, start: performance.now() };
    hold();
  }));
  track.addEventListener('focusin', e => {
    const index = originals.indexOf(e.target);
    if (index < 0 || restoringFocus || !e.target.matches(':focus-visible')) return;
    offset = span + index * stride; draw(); hold();
  });
  function show(index) {
    active = (index + originals.length) % originals.length;
    player.pause(); player.removeAttribute('src'); player.load();
    const source = originals[active].querySelector('img, video');
    const isVideo = source.tagName === 'VIDEO';
    image.hidden = isVideo; player.hidden = !isVideo;
    if (isVideo) {
      player.src = source.dataset.src;
      player.setAttribute('aria-label', source.getAttribute('aria-label'));
      player.play().catch(() => {});
    } else { image.src = source.src; image.alt = source.alt; }
    caption.textContent = `${active + 1} / ${originals.length}`;
  }
  viewport.addEventListener('click', e => {
    const photo = e.target.closest('.galerie-photo');
    if (!photo || dragged) return;
    motion = null; opener = photo; show(Number(photo.dataset.index));
    oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; dialog.showModal(); hold(); syncVideos();
  });
  dialog.querySelector('.lightbox-fermer').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-precedent').addEventListener('click', () => show(active - 1));
  dialog.querySelector('.lightbox-suivant').addEventListener('click', () => show(active + 1));
  dialog.addEventListener('keydown', e => {
    if (e.target === player) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); show(active + (e.key === 'ArrowRight' ? 1 : -1)); }
  });
  dialog.addEventListener('close', () => { player.pause(); player.removeAttribute('src'); player.load(); document.body.style.overflow = oldOverflow; hold(); restoringFocus = true; opener?.focus({ preventScroll: true }); restoringFocus = false; syncVideos(); });
  let swipe = null;
  image.addEventListener('pointerdown', e => { if (e.isPrimary) { swipe = { id: e.pointerId, x: e.clientX, y: e.clientY }; image.setPointerCapture(e.pointerId); } });
  image.addEventListener('pointerup', e => {
    if (!swipe || swipe.id !== e.pointerId) return;
    const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(active + (dx < 0 ? 1 : -1));
    swipe = null;
  });
  image.addEventListener('pointercancel', () => { swipe = null; });
  viewport.classList.add('est-active');
  document.querySelector('.galerie-page').classList.add('est-prete');
  measure(); pauseLabel(); start();
  new ResizeObserver(measure).observe(viewport);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; start(); }, { rootMargin: '100px' }).observe(viewport);
  document.addEventListener('visibilitychange', start);
  document.addEventListener('visibilitychange', () => { syncVideos(); if (document.hidden) player.pause(); });
})();
