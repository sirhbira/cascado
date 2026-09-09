/* Revalidate an older page on opening/focus without losing a quote in progress. */
(() => {
  const current = document.querySelector('meta[name="cascado-version"]')?.content;
  if (!current) return;
  let edited = false;
  let lastCheck = 0;
  document.addEventListener('input', event => {
    if (event.target.closest('form')) edited = true;
  });
  document.addEventListener('change', event => {
    if (event.target.closest('form')) edited = true;
  });
  async function checkVersion() {
    if (edited || document.hidden || Date.now() - lastCheck < 60000) return;
    lastCheck = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(`/site-version.json?check=${Date.now()}`, {
        cache: 'no-store', signal: controller.signal
      });
      if (!response.ok) return;
      const { version } = await response.json();
      if (edited || !/^[a-f0-9]{16}$/.test(version) || version === current) return;
      const url = new URL(location.href);
      // One reload per version, including if a CDN temporarily serves older HTML.
      if (url.searchParams.get('v') === version) return;
      url.searchParams.set('v', version);
      location.replace(url.href);
    } catch (_) {
      // Offline or deployment in progress: keep the current page usable.
    } finally {
      clearTimeout(timeout);
    }
  }
  checkVersion();
  document.addEventListener('visibilitychange', checkVersion);
  window.addEventListener('focus', checkVersion);
})();
