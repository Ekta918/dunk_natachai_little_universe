/* ==========================================================================
   Dunk Natachai | A Little Universe
   Each feature is its own small function, started together at the bottom.
   ========================================================================== */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  /* Images: show the photo when it loads, keep the friendly fallback when it doesn't */
  function initMedia() {
    $$('[data-media]').forEach((media) => {
      const img = $('img', media);
      if (!img) return;

      const markLoaded = () => media.classList.add('is-loaded');
      const markMissing = () => media.classList.add('is-missing');

      img.addEventListener('load', markLoaded);
      img.addEventListener('error', markMissing);

      // The image may already be finished before this script runs
      if (img.complete) img.naturalWidth > 0 ? markLoaded() : markMissing();
    });
  }

  /* Scroll reveal: fade sections in once as they enter the screen */
  function initReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    items.forEach((el) => observer.observe(el));
  }

  /* Navigation: highlight the link for the section currently in view */
  function initActiveNav() {
    const links = $$('.nav nav a');
    const sections = links.map((link) => $(link.getAttribute('href'))).filter(Boolean);
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((section) => observer.observe(section));
  }

  /* Messages: cycle through a shuffled list so nothing repeats until all are seen */
  function createMessageBag(messages) {
    let bag = [];
    return () => {
      if (!bag.length) bag = [...messages].sort(() => Math.random() - 0.5);
      return bag.pop();
    };
  }

  function initSurprise() {
    const button = $('#surpriseButton');
    const output = $('#surpriseMessage');
    const nextMessage = createMessageBag([
      'A little sunshine, delivered just for today. ☀️',
      'May your next chapter be full of lovely surprises. 🌷',
      'Your work brings joy to many fans. 💌',
      'Wishing you kind days and beautiful new stories. 🍑',
    ]);

    button.addEventListener('click', () => { output.textContent = nextMessage(); });
  }

  /* Wish: a message plus a gentle shower of petals */
  function launchPetals(count = 22) {
    if (prefersReducedMotion) return;
    const layer = $('#petals');
    const symbols = ['✿', '❀', '❁', '☀'];

    for (let i = 0; i < count; i++) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.fontSize = `${14 + Math.random() * 18}px`;
      petal.style.animationDelay = `${Math.random() * 0.9}s`;
      petal.style.setProperty('--duration', `${4 + Math.random() * 3}s`);
      petal.style.setProperty('--sway', `${Math.random() * 160 - 80}px`);
      petal.style.setProperty('--spin', `${Math.random() * 360 - 180}deg`);
      layer.appendChild(petal);
      petal.addEventListener('animationend', () => petal.remove());
    }
  }

  function initWish() {
    const button = $('#wishButton');
    const output = $('#wishMessage');

    button.addEventListener('click', () => {
      output.textContent = 'Wish sent into the universe ✨ May good things find their way to you, Dunk!';
      launchPetals();
    });
  }

  /* Gallery: open a photo in a native <dialog> (Esc and backdrop click both close it) */
  function initLightbox() {
    const dialog = $('#lightbox');
    const dialogImg = $('img', dialog);

    $$('[data-lightbox]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const media = $('[data-media]', trigger);
        const img = $('img', trigger);
        if (!media.classList.contains('is-loaded')) return; // nothing to enlarge yet

        dialogImg.src = img.currentSrc || img.src;
        dialogImg.alt = img.alt;
        dialog.showModal();
      });
    });

    $('.lightbox__close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  }

  initMedia();
  initReveal();
  initActiveNav();
  initSurprise();
  initWish();
  initLightbox();
})();
