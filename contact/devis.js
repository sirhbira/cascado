/* Configurateur propre à la page Contact. Étapes conditionnelles et envoi AJAX vers FormSubmit. */
(() => {
  'use strict';
  const form = document.getElementById('configurateur-devis');
  if (!form) return;
  const $ = id => document.getElementById(id);
  const steps = [...form.querySelectorAll('.devis-etape')];
  const unavailable = new Set(form.querySelectorAll('input:disabled, input[data-disponible="false"]'));
  const progression = form.querySelector('.devis-progression');
  let route = [];
  let sent = false;
  const next = form.querySelector('.devis-suivant');
  const back = form.querySelector('.devis-precedent');
  const checked = name => [...form.querySelectorAll(`input[name="${name}"]:checked`)].filter(el => !el.matches(':disabled'));
  const selection = name => checked(name).map(el => el.value);
  const value = id => $(id).value.trim();
  let step = 0;
  let submitting = false;
  form.noValidate = true;
  form.querySelector('.devis-progression').hidden = false;
  form.querySelector('.devis-navigation').hidden = false;

  function today() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  $('date_evenement').min = today();

  const labels = { '0': 'Prestation', panneau: 'Panneau', photobooth: 'Photobooth', livre: 'Modèle', floral: 'Mur floral', avantage: 'Avantage', '1': 'Événement', '2': 'Coordonnées', '3': 'Confirmation' };
  function showStep(target, focus = true) {
    step = target;
    steps.forEach(el => { el.hidden = el !== route[step]; });
    progression.replaceChildren();
    route.forEach((el, i) => {
      const li = document.createElement('li'), number = document.createElement('span');
      number.textContent = String(i + 1).padStart(2, '0');
      li.append(number, labels[el.dataset.step]);
      li.classList.toggle('terminee', i < step);
      if (i === step) li.setAttribute('aria-current', 'step');
      progression.append(li);
      el.querySelector('.surtitre').textContent = `${String(i + 1).padStart(2, '0')} — ${labels[el.dataset.step]}`;
    });
    back.hidden = step === 0;
    next.hidden = step === route.length - 1;
    if (focus) route[step].querySelector('h2').focus();
    summary();
  }

  function error(name, message) {
    const zone = $(`erreur-${name}`);
    if (zone) zone.textContent = message;
    form.querySelectorAll(`[name="${name}"]`).forEach(el => {
      if (message) el.setAttribute('aria-invalid', 'true');
      else el.removeAttribute('aria-invalid');
    });
    return !message;
  }

  function configure() {
    const type = selection('formule')[0];
    const premium = $('option-premium');
    premium.hidden = type !== 'Pack Premium';
    premium.disabled = premium.hidden;
    if (premium.hidden) premium.querySelectorAll('input').forEach(el => { el.checked = false; el.disabled = false; });
    const count = selection('prestations_premium').length;
    premium.querySelectorAll('input').forEach(el => { el.disabled = count === 2 && !el.checked; });
    $('premium-compteur').textContent = `${count} / 2 prestations sélectionnées`;
    $('option-prestige').hidden = type !== 'Pack Prestige';
    const included = type === 'Pack Prestige' ? ['Panneau Fontaine', 'Photobooth', 'Livre d’or audio-vidéo'] : type === 'Pack Premium' ? selection('prestations_premium') : [type];
    const hasPanel = included.includes('Panneau Fontaine'), hasBooth = included.includes('Photobooth');
    const enabled = { panneau: hasPanel, photobooth: hasBooth, livre: included.includes('Livre d’or vidéo') || included.includes('Livre d’or audio-vidéo'), floral: hasBooth && type !== 'Pack Prestige', avantage: type === 'Pack Prestige' };
    steps.forEach(el => {
      if (!(el.dataset.step in enabled)) return;
      const available = enabled[el.dataset.step];
      el.querySelectorAll('input').forEach(input => {
        input.disabled = !available || unavailable.has(input);
        if (input.disabled) { input.checked = false; error(input.name, ''); }
      });
    });
    $('prestations_incluses').disabled = !type;
    $('prestations_incluses').value = included.filter(Boolean).join(' ; ');
    route = steps.filter(el => !(el.dataset.step in enabled) || enabled[el.dataset.step]);
    showStep(Math.min(step, route.length - 1), false);
  }

  function validate(index) {
    const key = route[index].dataset.step;
    let valid = true;
    const check = (name, message) => { if (!error(name, message)) valid = false; };
    if (key === '0') {
      const type = selection('formule')[0];
      check('formule', type ? '' : 'Choisissez la prestation qui vous intéresse.');
      if (type === 'Pack Premium') check('prestations_premium', selection('prestations_premium').length === 2 ? '' : 'Sélectionnez exactement 2 prestations.');
    }
    const groups = { panneau: ['modele_panneau', 'Choisissez un modèle de panneau.'], photobooth: ['modele_photobooth', 'Choisissez un modèle de photobooth.'], livre: ['modele_livre', 'Choisissez un modèle de livre d’or vidéo.'], floral: ['mur_floral', 'Choisissez Oui ou Non.'], avantage: ['avantage_offert', 'Choisissez votre avantage offert.'] };
    if (groups[key]) { const [name, message] = groups[key]; check(name, selection(name).length === 1 ? '' : message); }
    if (key === '1') {
      check('ville', value('ville').length >= 2 ? '' : 'Indiquez la ville de votre événement.');
      $('date_evenement').min = today();
      check('date_evenement', !value('date_evenement') ? 'Choisissez la date de votre événement.' : (!$('date_evenement').validity.valid || value('date_evenement') < today()) ? 'Choisissez une date à partir d’aujourd’hui.' : '');
      check('invites', value('invites') ? '' : 'Choisissez le nombre d’invités.');
    }
    if (key === '2') {
      check('prenom', value('prenom') ? '' : 'Indiquez votre prénom.');
      check('nom', value('nom') ? '' : 'Indiquez votre nom.');
      const phone = value('telephone').replace(/[\s.()\-]/g, '');
      check('telephone', /^(?:0[1-9]\d{8}|\+33[1-9]\d{8}|0033[1-9]\d{8}|\+(?!33)[1-9]\d{7,14})$/.test(phone) ? '' : 'Indiquez un numéro valide, par exemple 06 12 34 56 78 ou +33 6 12 34 56 78.');
      check('email', !value('email') || ($('email').validity.valid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email'))) ? '' : 'Indiquez une adresse e-mail valide ou laissez ce champ vide.');
    }
    return valid;
  }

  function summary() {
    const type = selection('formule')[0];
    const rows = [['Prestation', type || 'À sélectionner']];
    const services = type === 'Pack Prestige' ? ['Panneau Fontaine', 'Photobooth', 'Livre d’or audio-vidéo'] : type === 'Pack Premium' ? selection('prestations_premium') : type ? [type] : [];
    if (type === 'Pack Premium') rows.push(['Pack Premium', '2 prestations au choix parmi 3']);
    services.forEach(service => {
      let detail = `✓ ${service}`;
      const model = service === 'Panneau Fontaine' ? selection('modele_panneau')[0] : service === 'Photobooth' ? selection('modele_photobooth')[0] : service === 'Livre d’or vidéo' || service === 'Livre d’or audio-vidéo' ? selection('modele_livre')[0] : null;
      if (model) detail += `\n→ Modèle : ${model}`;
      if (service === 'Photobooth' && type !== 'Pack Prestige') detail += `\n→ Mur floral : ${selection('mur_floral')[0] || 'À préciser'}${selection('mur_floral')[0] === 'Oui' ? ' (en supplément)' : ''}`;
      rows.push(['Prestation choisie', detail]);
    });
    if (type === 'Pack Prestige') rows.push(['Avantage offert', selection('avantage_offert')[0] || 'À sélectionner']);
    rows.push(['Ville', value('ville') || 'À renseigner']);
    if (value('lieu')) rows.push(['Lieu de réception', value('lieu')]);
    rows.push(['Date', value('date_evenement') ? value('date_evenement').split('-').reverse().join('/') : 'À renseigner'], ['Invités', value('invites') ? `${value('invites')} invités` : 'À renseigner']);
    if (value('prenom') || value('nom')) rows.push(['Vos coordonnées', `${value('prenom')} ${value('nom')}\n${value('telephone')}${value('email') ? '\n' + value('email') : ''}`]);
    if (value('message')) rows.push(['Informations complémentaires', value('message')]);
    $('devis-resume').replaceChildren();
    rows.forEach(([label, text]) => {
      const dt = document.createElement('dt'), dd = document.createElement('dd');
      dt.textContent = label; dd.textContent = text;
      $('devis-resume').append(dt, dd);
    });
    $('recapitulatif').value = rows.map(([label, text]) => `${label} : ${text}`).join('\n');
  }

  function advance() {
    if (submitting || sent) return;
    if (validate(step)) showStep(Math.min(route.length - 1, step + 1));
    else route[step].querySelector('[aria-invalid="true"]:not(:disabled)')?.focus();
  }
  next.addEventListener('click', advance);
  back.addEventListener('click', () => { if (!submitting && !sent) showStep(Math.max(0, step - 1)); });
  form.addEventListener('change', e => {
    if (e.target.type === 'radio' || e.target.type === 'checkbox') configure();
    if ($(`erreur-${e.target.name}`)?.textContent) validate(step);
    summary();
  });
  form.addEventListener('input', e => {
    if ($(`erreur-${e.target.name}`)?.textContent) error(e.target.name, '');
    summary();
  });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (submitting || sent) return;
    if (step < route.length - 1) { advance(); return; }
    for (let i = 0; i < route.length - 1; i++) {
      if (!validate(i)) { showStep(i); route[i].querySelector('[aria-invalid="true"]:not(:disabled)')?.focus(); return; }
    }
    summary();
    const payload = {};
    for (const [name, text] of new FormData(form)) {
      payload[name] = name in payload ? `${payload[name]} ; ${text}` : text;
    }
    if (!payload.email) delete payload.email;
    payload._template = 'table';
    const controls = [...form.querySelectorAll('input, select, textarea, button')];
    const disabled = controls.map(el => el.disabled);
    const button = form.querySelector('[type="submit"]');
    const feedback = $('devis-retour');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    submitting = true;
    form.setAttribute('aria-busy', 'true');
    controls.forEach(el => { el.disabled = true; });
    button.textContent = 'Envoi en cours…';
    feedback.className = 'devis-retour';
    feedback.textContent = '';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload), signal: controller.signal
      });
      if (!response.ok) throw new Error('Envoi refusé');
      const result = await response.json();
      if (result.success !== true && result.success !== 'true') throw new Error('Envoi non confirmé');
      sent = true;
      feedback.classList.add('succes');
      feedback.textContent = '✓ Votre demande a bien été envoyée.\nNous revenons vers vous en moins de 24h.';
      button.textContent = 'DEMANDE ENVOYÉE ✓';
      form.querySelector('.devis-navigation').hidden = true;
      feedback.focus();
    } catch (err) {
      feedback.classList.add('erreur');
      feedback.textContent = err.name === 'AbortError'
        ? 'L’envoi n’a pas pu être confirmé à temps. Vos informations sont conservées. Réessayez ou contactez-nous au 07 56 94 48 52.'
        : 'Votre demande n’a pas pu être envoyée. Vos informations sont conservées : réessayez ou contactez-nous au 07 56 94 48 52.';
      button.textContent = 'DEMANDER MON DEVIS';
      feedback.focus();
    } finally {
      clearTimeout(timeout);
      submitting = false;
      form.removeAttribute('aria-busy');
      if (!sent) controls.forEach((el, i) => { el.disabled = disabled[i]; });
    }
  });
  configure();
  // Présélection unique à l'ouverture : les choix restent ensuite libres.
  const params = new URLSearchParams(window.location.search);
  const services = {
    'panneau-fontaine': ['Panneau Fontaine', 'modele_panneau'],
    photobooth: ['Photobooth', 'modele_photobooth'],
    'livre-or-video': ['Livre d’or vidéo', 'modele_livre']
  };
  const requested = services[params.get('prestation')];
  if (Array.isArray(requested)) {
    const [service, group] = requested;
    const radio = [...form.querySelectorAll('input[name="formule"]')].find(input => input.value === service && !input.matches(':disabled'));
    if (radio) {
      radio.checked = true;
      configure();
      const model = [...form.querySelectorAll(`input[name="${group}"]`)].find(input =>
        !input.matches(':disabled') &&
        (input.dataset.modele || window.CascadoModeles.slug(input.value)) === params.get('modele'));
      if (model) model.checked = true;
      summary();
    }
  }
})();
