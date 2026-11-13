(() => {
  'use strict';
  const slides = Array.from(document.querySelectorAll('.slide'));
  const previous = document.getElementById('previous-slide');
  const next = document.getElementById('next-slide');
  const select = document.getElementById('slide-select');
  const progress = document.getElementById('presentation-progress-fill');
  const announcement = document.getElementById('slide-announcement');
  const fullscreen = document.getElementById('fullscreen');
  const reading = document.getElementById('reading-view');
  const message = document.getElementById('viewer-message');
  const trip = window.TRIP || {};
  let current = 1;
  let isReading = false;
  let touchStart = null;

  // Keep the sent slide IDs and printed numbers; navigation uses DOM position.
  select.replaceChildren(...slides.map((slide, index) => {
    const option = document.createElement('option');
    option.value = String(index + 1);
    option.textContent = `${String(index + 1).padStart(2, '0')} / ${slides.length} · ${slide.dataset.title}`;
    return option;
  }));

  const number = (value, digits = 2) => Number(value).toLocaleString('en-HK', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const budget = trip.budget;
  if (budget) {
    const values = {
      roundedHKD: number(Math.round(Number(budget.totalHKD) / 100) * 100, 0),
      exactHKD: `HK$${number(budget.totalHKD)}`,
      subtotalEUR: number(budget.subtotalEUR),
      contingencyEUR: number(budget.contingencyEUR),
      totalEUR: number(budget.totalEUR),
      rate: `HK$${Number(budget.rate).toLocaleString('en-HK', { maximumFractionDigits: 2 })}/€`
    };
    document.querySelectorAll('[data-budget]').forEach(element => {
      const value = values[element.dataset.budget];
      if (value && !value.includes('NaN')) element.textContent = value;
    });
    if (budget.fgef) {
      document.querySelectorAll('[data-fgef="maximumHKD"]').forEach(element => { element.textContent = `HK$${number(budget.fgef.maximumHKD, 0)}`; });
      document.querySelectorAll('[data-fgef="advanceDays"]').forEach(element => { element.textContent = budget.fgef.advanceDays; });
      if (budget.fgef.url) document.querySelectorAll('[data-fgef-url]').forEach(link => { link.href = budget.fgef.url; });
    }
    if (Array.isArray(budget.items)) {
      const body = document.getElementById('presentation-budget');
      const mealItems = budget.items.filter(item => /^(Breakfasts|Lunches|Dinners)\b/.test(item.label));
      const presentationItems = budget.items.filter(item => !mealItems.includes(item));
      if (mealItems.length) presentationItems.splice(2, 0, {
        label: 'Meals allowance · paid individually',
        eur: mealItems.reduce((sum, item) => sum + Number(item.eur), 0)
      });
      for (const item of presentationItems) {
        const row = document.createElement('tr');
        const label = document.createElement('th');
        const amount = document.createElement('td');
        label.scope = 'row';
        label.textContent = item.label;
        amount.textContent = number(item.eur);
        row.append(label, amount);
        body.append(row);
      }
    }
  }
  if (Array.isArray(trip.assessment) && trip.assessment.length) {
    const body = document.getElementById('presentation-assessment');
    body.replaceChildren();
    for (const item of trip.assessment) {
      const row = document.createElement('tr');
      const label = document.createElement('th');
      const weight = document.createElement('td');
      const percent = document.createElement('span');
      label.scope = 'row';
      label.textContent = item.label;
      weight.textContent = item.weight;
      percent.textContent = '%';
      weight.append(percent);
      row.append(label, weight);
      body.append(row);
    }
  }
  if (trip.url) document.querySelectorAll('[data-site-url]').forEach(link => { link.href = trip.url; });
  const contactEmails = (Array.isArray(trip.contacts)
    ? trip.contacts.map(contact => typeof contact === 'string' ? contact : contact.email)
    : String(trip.contact || '').split(','))
    .filter(email => typeof email === 'string' && email.trim())
    .map(email => email.trim());
  if (contactEmails.length) document.querySelectorAll('[data-contact-list]').forEach(list => {
    list.replaceChildren();
    for (const email of new Set(contactEmails)) {
      const link = document.createElement('a');
      link.className = 'contact-email';
      link.textContent = email;
      link.href = `mailto:${email}`;
      list.append(link);
    }
  });
  if (typeof trip.datesLabel === 'string') document.querySelectorAll('[data-trip="dates"]').forEach(element => { element.textContent = trip.datesLabel; });
  if (trip.verifiedOn) document.querySelectorAll('[data-verified-on]').forEach(element => { element.textContent = trip.verifiedOn; });
  if (trip.languages) {
    if (trip.languages.main) document.querySelectorAll('[data-language="recommendation"]').forEach(element => { element.textContent = trip.languages.main; });
    if (trip.languages.note) document.querySelectorAll('[data-language="academicWork"]').forEach(element => { element.textContent = trip.languages.note; });
  }
  if (trip.accommodation && trip.accommodation.title) document.querySelectorAll('[data-accommodation-title]').forEach(element => { element.textContent = trip.accommodation.title; });

  const preview = document.getElementById('web-preview');
  const showPreviewFallback = () => {
    preview.hidden = true;
    preview.nextElementSibling.hidden = false;
  };
  preview.addEventListener('error', showPreviewFallback);
  if (preview.complete && preview.naturalWidth === 0) showPreviewFallback();

  function resize() {
    const cleanView = Boolean(document.fullscreenElement) || window.PresenterBridge?.mode === 'preview';
    const controlsHeight = cleanView ? 0 : document.getElementById('presentation-controls').getBoundingClientRect().height;
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const availableHeight = Math.max(180, window.innerHeight - controlsHeight);
    const scale = isReading ? Math.min((viewportWidth - 20) / 1600, 1) : Math.min(viewportWidth / 1600, availableHeight / 900);
    document.documentElement.style.setProperty('--slide-scale', String(scale));
    document.documentElement.style.setProperty('--scaled-width', `${1600 * scale}px`);
    document.documentElement.style.setProperty('--scaled-height', `${900 * scale}px`);
  }

  function show(numberToShow, updateHash = true) {
    current = Math.max(1, Math.min(slides.length, Number(numberToShow) || 1));
    slides.forEach((slide, index) => {
      const active = index === current - 1;
      slide.hidden = !active && !isReading;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active && !isReading));
      if (!isReading && !active) slide.setAttribute('inert', '');
      else slide.removeAttribute('inert');
    });
    select.value = String(current);
    previous.disabled = current === 1;
    next.disabled = current === slides.length;
    progress.style.width = `${current / slides.length * 100}%`;
    announcement.textContent = `Slide ${current} of ${slides.length}: ${slides[current - 1].dataset.title}`;
    document.title = `${slides[current - 1].dataset.title} · GLAS3112 Spain 2027`;
    const slideId = slides[current - 1].id;
    if (updateHash && location.hash !== `#${slideId}`) {
      try { history.replaceState(null, '', `#${slideId}`); }
      catch (_) { location.hash = slideId; }
    }
    if (isReading) {
      const top = slides[current - 1].getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, top - 12), behavior: 'auto' });
    }
    window.PresentationRoute?.onSlideChange(slideId, isReading);
    window.PresenterBridge?.slideChanged();
  }

  function readHash() {
    const requested = location.hash.slice(1);
    const index = slides.findIndex(slide => slide.id === requested);
    show(index >= 0 ? index + 1 : 1, false);
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else message.textContent = 'Fullscreen is unavailable in this browser. Use the browser fullscreen command.';
    } catch (_) {
      message.textContent = 'Fullscreen could not start. Use the browser fullscreen command.';
    }
  }
  function updateFullscreenButton() {
    const active = Boolean(document.fullscreenElement);
    fullscreen.setAttribute('aria-label', active ? 'Exit fullscreen' : 'Enter fullscreen');
    fullscreen.title = active ? 'Exit fullscreen (F or Escape)' : 'Fullscreen (F)';
    resize();
  }

  const viewerMode = window.PresenterBridge.init({
    slides,
    getCurrent: () => current - 1,
    show: id => show(slides.findIndex(slide => slide.id === id) + 1)
  });
  if (viewerMode === 'presenter') return;
  if (viewerMode === 'preview') {
    window.addEventListener('hashchange', readHash);
    window.addEventListener('resize', resize);
    readHash();
    resize();
    return;
  }

  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  select.addEventListener('change', () => show(Number(select.value)));
  fullscreen.addEventListener('click', toggleFullscreen);
  reading.addEventListener('click', () => {
    isReading = !isReading;
    document.body.classList.toggle('reading-mode', isReading);
    reading.setAttribute('aria-pressed', String(isReading));
    reading.textContent = isReading ? 'Slide view' : 'Reading view';
    if (!isReading) window.scrollTo(0, 0);
    resize();
    show(current);
  });
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable) return;
    if (event.target.tagName === 'BUTTON' && (event.key === ' ' || event.key === 'Enter')) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') { event.preventDefault(); show(current + 1); }
    else if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); show(current - 1); }
    else if (event.key === 'Home') { event.preventDefault(); show(1); }
    else if (event.key === 'End') { event.preventDefault(); show(slides.length); }
    else if (event.key.toLowerCase() === 'f') { event.preventDefault(); toggleFullscreen(); }
  });
  document.querySelector('.presentation').addEventListener('touchstart', event => {
    if (isReading || event.touches.length !== 1 || event.target.closest('a')) return;
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  document.querySelector('.presentation').addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches.length) return;
    const distanceX = event.changedTouches[0].clientX - touchStart.x;
    const distanceY = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(distanceX) > 50 && Math.abs(distanceX) > Math.abs(distanceY) * 1.5) show(current + (distanceX < 0 ? 1 : -1));
  }, { passive: true });
  window.addEventListener('hashchange', readHash);
  window.addEventListener('resize', resize);
  document.addEventListener('fullscreenchange', updateFullscreenButton);
  readHash();
  resize();
})();
