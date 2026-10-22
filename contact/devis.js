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
  const submitButton = form.querySelector('.devis-envoyer');
  const mobile = window.matchMedia('(max-width: 600px)');
  const back = form.querySelector('.devis-precedent');
  const checked = name => [...form.querySelectorAll(`input[name="${name}"]:checked`)].filter(el => !el.matches(':disabled'));
  const selection = name => checked(name).map(el => el.value);
  const value = id => $(id).value.trim();
  // Règles des prestations et des packs : prestations-config.js.
  const config = window.CascadoConfig;
  const PREMIUM = config.packs.premium, PRESTIGE = config.packs.prestige;
  const parNom = Object.fromEntries(config.prestations.map(p => [p.nom, p]));
  // Packs : choix unique. Prestations individuelles : cumulables (cases à cocher).
  const formule = () => { const choix = selection('formule'); return choix[0]?.startsWith('Pack ') ? choix[0] : choix.join(' + '); };
  const optionPrestige = () => selection('option_prestige')[0] === 'Oui';

  // Prestations réellement demandées, dans l'ordre d'affichage. `option` : ajoutée au Prestige.
  function services() {
    const type = selection('formule')[0];
    if (type === PRESTIGE.nom) {
      const list = PRESTIGE.inclus.map(nom => ({ nom }));
      if (optionPrestige()) list.push({ nom: PRESTIGE.option, option: true });
      return list;
    }
    return (type === PREMIUM.nom ? selection('prestations_premium') : selection('formule')).map(nom => ({ nom }));
  }

  // Titre et détails d'une prestation, communs au récapitulatif et à l'e-mail.
  const titre = service => `✓ ${service.nom}${service.option ? ' — en option, tarif préférentiel' : ''}`;
  function details(service, type) {
    const prestation = parNom[service.nom] || {};
    const lines = [];
    const model = prestation.champModele && selection(prestation.champModele)[0];
    if (model) lines.push(`Modèle : ${model}`);
    if (service.nom === 'Photobooth' && type !== PRESTIGE.nom) {
      const floral = selection('mur_floral')[0];
      lines.push(`Mur floral : ${floral || 'À préciser'}${floral === 'Oui' ? ' (en supplément)' : ''}`);
    }
    if (prestation.champPersonnalisation && value(prestation.champPersonnalisation)) lines.push(`Personnalisation : ${value(prestation.champPersonnalisation)}`);
    return lines;
  }
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

  const labels = { '0': 'Prestation', panneau: 'Panneau', photobooth: 'Photobooth', livre: 'Modèle', magazine: 'Magazine Box', floral: 'Mur floral', avantage: 'Avantage', '1': 'Événement', '2': 'Coordonnées', '3': 'Confirmation' };
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
    updateNextButton();
    if (focus) {
      const current = route[step];
      const heading = current.querySelector('h2');
      if (window.matchMedia('(max-width: 600px)').matches) {
        // Éviter le saut natif du focus avant le défilement fluide.
        heading.focus({ preventScroll: true });
        requestAnimationFrame(() => {
          if (current !== route[step] || current.hidden) return;
          const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
          window.scrollTo({
            top: Math.max(0, window.scrollY + current.getBoundingClientRect().top - headerHeight - 16),
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
          });
        });
      } else {
        heading.focus();
      }
    }
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

  function updateNextButton() {
    if (mobile.matches) {
      const locked = submitting || sent;
      const nextDisabled = locked || !validate(step, false);
      const submitDisabled = locked || !route.every((_, index) => validate(index, false));
      if (next.disabled !== nextDisabled) next.disabled = nextDisabled;
      if (submitButton.disabled !== submitDisabled) submitButton.disabled = submitDisabled;
      return;
    }
    const models = [...route[step].querySelectorAll('input[type="radio"][name^="modele_"]')];
    const selected = models.some(input => input.checked && !input.matches(':disabled'));
    next.disabled = submitting || sent || (models.length > 0 && !selected);
  }

  function configure() {
    const type = selection('formule')[0];
    const premium = $('option-premium');
    premium.hidden = type !== PREMIUM.nom;
    premium.disabled = premium.hidden;
    if (premium.hidden) premium.querySelectorAll('input').forEach(el => { el.checked = false; el.disabled = false; });
    const count = selection('prestations_premium').length;
    premium.querySelectorAll('input').forEach(el => { el.disabled = count === PREMIUM.nombre && !el.checked; });
    $('premium-compteur').textContent = `${count} / ${PREMIUM.nombre} prestations sélectionnées`;
    $('option-prestige').hidden = type !== PRESTIGE.nom;
    // L'option n'existe qu'avec le Prestige : réinitialisée dès qu'on change de formule.
    const option = $('option-prestige-choix');
    option.disabled = type !== PRESTIGE.nom;
    if (option.disabled) option.querySelectorAll('input').forEach(el => { el.checked = false; });
    const included = services().map(service => service.nom);
    const enabled = { floral: included.includes('Photobooth') && type !== PRESTIGE.nom, avantage: type === PRESTIGE.nom };
    config.prestations.forEach(prestation => { enabled[prestation.etape] = included.includes(prestation.nom); });
    steps.forEach(el => {
      if (!(el.dataset.step in enabled)) return;
      const available = enabled[el.dataset.step];
      // Une prestation retirée efface ses choix : ils ne sont jamais envoyés.
      el.querySelectorAll('input, textarea').forEach(input => {
        input.disabled = !available || unavailable.has(input);
        if (input.disabled) { input.checked = false; if (input.tagName === 'TEXTAREA') input.value = ''; error(input.name, ''); }
      });
    });
    $('prestations_incluses').disabled = !type;
    $('prestations_incluses').value = included.join(' ; ');
    route = steps.filter(el => !(el.dataset.step in enabled) || enabled[el.dataset.step]);
    showStep(Math.min(step, route.length - 1), false);
  }

  // Choix obligatoires par étape : modèles depuis la configuration, puis options.
  const groups = { floral: ['mur_floral', 'Choisissez Oui ou Non.'], avantage: ['avantage_offert', 'Choisissez votre avantage offert.'] };
  config.prestations.forEach(p => { if (p.champModele) groups[p.etape] = [p.champModele, p.messageModele]; });

  function validate(index, report = true) {
    const key = route[index].dataset.step;
    let valid = true;
    const check = (name, message) => {
      if (message) valid = false;
      if (report) error(name, message);
    };
    if (key === '0') {
      const type = selection('formule')[0];
      check('formule', type ? '' : 'Choisissez la prestation qui vous intéresse.');
      if (type === PREMIUM.nom) check('prestations_premium', selection('prestations_premium').length === PREMIUM.nombre ? '' : `Sélectionnez exactement ${PREMIUM.nombre} prestations.`);
    }
    if (groups[key]) { const [name, message] = groups[key]; check(name, selection(name).length === 1 ? '' : message); }
    if (key === '1') {
      check('ville', value('ville').length >= 2 ? '' : 'Indiquez la ville de votre événement.');
      if (report) $('date_evenement').min = today();
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
    const rows = [['Prestation', formule() || 'À sélectionner']];
    if (type === PREMIUM.nom) rows.push([PREMIUM.nom, `${PREMIUM.nombre} prestations au choix parmi ${PREMIUM.choix.length}`]);
    services().forEach(service => {
      rows.push(['Prestation choisie', [titre(service), ...details(service, type).map(line => `→ ${line}`)].join('\n')]);
    });
    if (type === PRESTIGE.nom) {
      rows.push(['Avantage offert', selection('avantage_offert')[0] || 'À sélectionner']);
      rows.push([`Option ${PRESTIGE.option}`, optionPrestige() ? 'Oui — ajouté à tarif préférentiel' : 'Non']);
    }
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

  function emailPayload() {
    const type = selection('formule')[0];
    const date = value('date_evenement').split('-').reverse().join('/');
    const client = `${value('prenom')} ${value('nom')}`.replace(/[\r\n]+/g, ' ');
    const requestId = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const prestations = services().map(service => [titre(service), ...details(service, type)].join('\n')).join('\n\n');

    // Lien WhatsApp : 06 12 34 56 78 → 33612345678, +33 / 0033 sans double 33.
    const whatsappNumber = value('telephone').replace(/[\s.()\-]/g, '').replace(/^\+/, '').replace(/^00/, '').replace(/^0/, '33');
    const [year, month, day] = value('date_evenement').split('-').map(Number);
    const whatsappDate = new Date(year, month - 1, day).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    // Pack : son nom (et l'option du Prestige si ajoutée). Prestations individuelles : « A, B et C ».
    const whatsappServices = type === PRESTIGE.nom && optionPrestige() ? `${type} avec l’option ${PRESTIGE.option}`
      : type.startsWith('Pack ') ? type : new Intl.ListFormat('fr', { type: 'conjunction' }).format(selection('formule'));
    const whatsappMessage = `Bonjour, j’espère que vous allez bien 😊\n\nJe viens vers vous suite à votre demande de devis pour votre événement du ${whatsappDate} à ${value('lieu') || value('ville')}.\n\nVous avez manifesté votre intérêt pour : ${whatsappServices}.`;
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    // Liste explicite : aucun champ brut ni récapitulatif en double.
    const payload = {
      _subject: `Nouvelle demande de devis — ${date} — ${client} — ${requestId}`,
      _template: 'basic',
      'NOUVELLE DEMANDE DE DEVIS — CASCADO EVENT': '',
      Client: [
        `Prénom : ${value('prenom')}`,
        `Nom : ${value('nom')}`,
        `Téléphone : ${value('telephone')}`,
        `E-mail : ${value('email') || 'Non renseigné'}`
      ].join('\n'),
      'Contacter le client sur WhatsApp': whatsappLink,
      'Événement': [
        `Date : ${date}`,
        `Ville : ${value('ville')}`,
        `Lieu : ${value('lieu') || 'Non renseigné'}`,
        `Nombre d’invités : ${value('invites')}`
      ].join('\n'),
      'Formule choisie': formule(),
      Prestations: prestations
    };
    if (type === PRESTIGE.nom) {
      payload['Avantage offert'] = selection('avantage_offert')[0];
      payload[`Option ${PRESTIGE.option}`] = optionPrestige() ? 'Oui — ajouté à tarif préférentiel' : 'Non';
    }
    payload['Message du client'] = value('message') || 'Aucun message';
    // Adresse de réponse uniquement, sans seconde ligne visible dans le mail.
    if (value('email')) payload._replyto = value('email');
    return payload;
  }

  function advance() {
    if (submitting || sent) return;
    if (validate(step)) showStep(Math.min(route.length - 1, step + 1));
    else route[step].querySelector('[aria-invalid="true"]:not(:disabled)')?.focus();
  }
  next.addEventListener('click', advance);
  back.addEventListener('click', () => { if (!submitting && !sent) showStep(Math.max(0, step - 1)); });
  form.addEventListener('change', e => {
    if (submitting || sent) return;
    const choice = e.target.type === 'radio' || e.target.type === 'checkbox';
    // Un pack désélectionne les prestations individuelles, et inversement.
    if (e.target.name === 'formule' && e.target.checked) {
      form.querySelectorAll('input[name="formule"]').forEach(input => {
        if (input !== e.target && (input.type === 'radio' || e.target.type === 'radio')) input.checked = false;
      });
    }
    // Sur téléphone, un choix de modèle ne reconstruit pas toutes les étapes.
    if (choice && (!mobile.matches || ['formule', 'prestations_premium', 'option_prestige'].includes(e.target.name))) configure();
    if ($(`erreur-${e.target.name}`)?.textContent) validate(step);
    summary();
    updateNextButton();
  });
  form.addEventListener('input', e => {
    if (submitting || sent) return;
    // Les radios/checkboxes sont traités sur change, la saisie sur input.
    if (mobile.matches && (e.target.type === 'radio' || e.target.type === 'checkbox')) return;
    if ($(`erreur-${e.target.name}`)?.textContent) error(e.target.name, '');
    summary();
    updateNextButton();
  });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (submitting || sent) return;
    if (step < route.length - 1) { advance(); return; }
    for (let i = 0; i < route.length - 1; i++) {
      if (!validate(i)) { showStep(i); route[i].querySelector('[aria-invalid="true"]:not(:disabled)')?.focus(); return; }
    }
    summary();
    const payload = emailPayload();
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
      // Suivi Google Ads / Analytics : uniquement ici, sur un envoi réellement confirmé.
      if (typeof window.gtag === 'function') window.gtag('event', 'quote_request');
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
      if (mobile.matches) updateNextButton();
    }
  });
  configure();
  mobile.addEventListener('change', () => {
    if (!mobile.matches) submitButton.disabled = submitting || sent;
    updateNextButton();
  });
  // Présélection unique à l'ouverture : les choix restent ensuite libres.
  // ?prestation=<id de prestations-config.js>[&modele=<slug>]
  const params = new URLSearchParams(window.location.search);
  const requested = config.prestations.find(prestation => prestation.id === params.get('prestation'));
  if (requested) {
    const choice = [...form.querySelectorAll('input[name="formule"]')].find(input => input.value === requested.nom && !input.matches(':disabled'));
    if (choice) {
      choice.checked = true;
      configure();
      const model = requested.champModele && [...form.querySelectorAll(`input[name="${requested.champModele}"]`)].find(input =>
        !input.matches(':disabled') &&
        (input.dataset.modele || window.CascadoModeles.slug(input.value)) === params.get('modele'));
      if (model) model.checked = true;
      summary();
      if (mobile.matches) updateNextButton();
    }
  }
})();
