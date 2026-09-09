/* Configurateur propre à la page Contact. Envoi natif vers FormSubmit. */
(() => {
  'use strict';
  const form = document.getElementById('configurateur-devis');
  if (!form) return;
  const $ = id => document.getElementById(id);
  const steps = [...form.querySelectorAll('.devis-etape')];
  const progress = [...form.querySelectorAll('.devis-progression li')];
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

  function showStep(target, focus = true) {
    step = target;
    steps.forEach((el, i) => { el.hidden = i !== step; });
    progress.forEach((el, i) => {
      el.classList.toggle('terminee', i < step);
      if (i === step) el.setAttribute('aria-current', 'step');
      else el.removeAttribute('aria-current');
    });
    back.hidden = step === 0;
    next.hidden = step === 3;
    if (focus) steps[step].querySelector('h2').focus();
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
    const options = [['option-premium', type === 'Pack Premium'], ['option-prestige', type === 'Pack Prestige'], ['option-floral', /^Photobooth /.test(type || '')]];
    options.forEach(([id, enabled]) => {
      const box = $(id);
      box.hidden = !enabled;
      box.disabled = !enabled;
      if (!enabled) {
        box.querySelectorAll('input').forEach(el => { el.checked = false; el.disabled = false; error(el.name, ''); });
      }
    });
    const count = selection('prestations_premium').length;
    form.querySelectorAll('[name="prestations_premium"]').forEach(el => { el.disabled = count === 2 && !el.checked; });
    $('premium-compteur').textContent = `${count} / 2 prestations sélectionnées`;
    $('prestations_incluses').disabled = type !== 'Pack Prestige';
    $('prestations_incluses').value = type === 'Pack Prestige' ? 'Panneau Fontaine ; Photobooth avec photos illimitées ; Livre d’or audio-vidéo' : '';
    summary();
  }

  function validate(index) {
    let valid = true;
    const check = (name, message) => { if (!error(name, message)) valid = false; };
    if (index === 0) {
      const type = selection('formule')[0];
      check('formule', type ? '' : 'Choisissez la prestation qui vous intéresse.');
      if (type === 'Pack Premium') check('prestations_premium', selection('prestations_premium').length === 2 ? '' : 'Sélectionnez exactement 2 prestations.');
      if (type === 'Pack Prestige') check('avantage_offert', selection('avantage_offert').length ? '' : 'Choisissez votre avantage offert.');
      if (/^Photobooth /.test(type || '')) check('mur_floral', selection('mur_floral').length ? '' : 'Indiquez si vous souhaitez ajouter le mur floral en supplément.');
    }
    if (index === 1) {
      check('ville', value('ville').length >= 2 ? '' : 'Indiquez la ville de votre événement.');
      $('date_evenement').min = today();
      check('date_evenement', !value('date_evenement') ? 'Choisissez la date de votre événement.' : (!$('date_evenement').validity.valid || value('date_evenement') < today()) ? 'Choisissez une date à partir d’aujourd’hui.' : '');
      check('invites', value('invites') ? '' : 'Choisissez le nombre d’invités.');
    }
    if (index === 2) {
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
    if (type === 'Pack Premium') rows.push(['Prestations choisies', selection('prestations_premium').map(v => `✓ ${v}`).join('\n') || 'À sélectionner']);
    if (type === 'Pack Prestige') rows.push(['Toutes les prestations incluses', '✓ Panneau Fontaine\n✓ Photobooth avec photos illimitées\n✓ Livre d’or audio-vidéo'], ['Avantage offert', selection('avantage_offert')[0] || 'À sélectionner']);
    if (/^Photobooth /.test(type || '')) rows.push(['Mur floral', selection('mur_floral')[0]?.startsWith('Oui') ? 'Oui — disponible en supplément' : selection('mur_floral')[0] || 'À préciser']);
    rows.push(['Ville', [value('ville'), value('code_postal'), value('departement')].filter(Boolean).join(' · ') || 'À renseigner']);
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
    if (validate(step)) showStep(Math.min(3, step + 1));
    else steps[step].querySelector('[aria-invalid="true"]:not(:disabled)')?.focus();
  }
  next.addEventListener('click', advance);
  back.addEventListener('click', () => showStep(Math.max(0, step - 1)));
  form.addEventListener('change', e => {
    if (e.target.type === 'radio' || e.target.type === 'checkbox') configure();
    if ($(`erreur-${e.target.name}`)?.textContent) validate(step);
    summary();
  });
  form.addEventListener('input', e => {
    if ($(`erreur-${e.target.name}`)?.textContent) error(e.target.name, '');
    summary();
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (submitting) return;
    if (step < 3) { advance(); return; }
    for (let i = 0; i < 3; i++) {
      if (!validate(i)) { showStep(i); steps[i].querySelector('[aria-invalid="true"]:not(:disabled)')?.focus(); return; }
    }
    summary();
    submitting = true;
    form.querySelector('[type="submit"]').disabled = true;
    $('devis-retour').textContent = 'Redirection vers la vérification et l’envoi de votre demande…';
    HTMLFormElement.prototype.submit.call(form);
  });
  window.addEventListener('pageshow', () => {
    submitting = false;
    form.querySelector('[type="submit"]').disabled = false;
    $('devis-retour').textContent = '';
  });

  // API Découpage administratif : recherche de communes, sans clé ni adresse exacte.
  const city = $('ville'), list = $('villes-liste');
  let timer, controller, revision = 0, suggestions = [], active = -1;
  function closeList() {
    list.hidden = true; city.setAttribute('aria-expanded', 'false');
    city.removeAttribute('aria-activedescendant'); active = -1;
  }
  function choose(index) {
    const item = suggestions[index];
    if (!item) return;
    revision++; clearTimeout(timer); controller?.abort();
    city.value = item.nom; $('code_postal').value = item.postal;
    $('departement').value = item.departement?.nom ? `${item.departement.code} — ${item.departement.nom}` : item.codeDepartement || '';
    closeList(); error('ville', ''); summary();
    $('ville-aide').textContent = [item.nom, item.postal, $('departement').value].filter(Boolean).join(' · ');
  }
  city.addEventListener('input', () => {
    clearTimeout(timer); controller?.abort();
    const version = ++revision, query = city.value.trim();
    $('code_postal').value = ''; $('departement').value = ''; closeList(); summary();
    $('ville-aide').textContent = 'Saisissez au moins 3 lettres ou un code postal.';
    if (query.length < 3) return;
    timer = setTimeout(async () => {
      controller = new AbortController();
      const abort = controller;
      const timeout = setTimeout(() => abort.abort(), 7000);
      $('ville-aide').textContent = 'Recherche des villes…';
      try {
        const params = new URLSearchParams({ fields: 'nom,code,codesPostaux,departement,codeDepartement', boost: 'population', limit: '6' });
        params.set(/^\d{5}$/.test(query) ? 'codePostal' : 'nom', query);
        const response = await fetch(`https://geo.api.gouv.fr/communes?${params}`, { signal: abort.signal });
        if (!response.ok) throw new Error('Service indisponible');
        const results = await response.json();
        if (version !== revision) return;
        suggestions = results.flatMap(item => (item.codesPostaux?.length ? item.codesPostaux : ['']).filter(cp => !/^\d{5}$/.test(query) || cp === query).map(postal => ({ ...item, postal }))).slice(0, 10);
        list.replaceChildren();
        suggestions.forEach((item, i) => {
          const li = document.createElement('li');
          li.id = `ville-option-${i}`; li.setAttribute('role', 'option'); li.setAttribute('aria-selected', 'false');
          li.textContent = `${item.nom}${item.postal ? ' · ' + item.postal : ''}${item.departement?.nom ? ' · ' + item.departement.nom : ''}`;
          li.addEventListener('pointerdown', e => e.preventDefault());
          li.addEventListener('click', () => choose(i)); list.append(li);
        });
        list.hidden = !suggestions.length; city.setAttribute('aria-expanded', String(!!suggestions.length));
        $('ville-aide').textContent = suggestions.length ? 'Choisissez votre ville, ou conservez votre saisie.' : 'Aucune suggestion. Vous pouvez conserver votre ville saisie manuellement.';
      } catch (err) {
        if (version === revision) $('ville-aide').textContent = 'Recherche indisponible. Saisissez simplement le nom de votre ville.';
      } finally { clearTimeout(timeout); }
    }, 300);
  });
  city.addEventListener('keydown', e => {
    if (e.key === 'Escape') { revision++; controller?.abort(); closeList(); return; }
    if (list.hidden) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + suggestions.length) % suggestions.length;
      [...list.children].forEach((el, i) => el.setAttribute('aria-selected', String(i === active)));
      city.setAttribute('aria-activedescendant', list.children[active].id);
      list.children[active].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') { e.preventDefault(); if (active >= 0) choose(active); }
  });
  city.addEventListener('blur', () => { revision++; clearTimeout(timer); controller?.abort(); closeList(); });
  configure(); showStep(0, false);
})();
