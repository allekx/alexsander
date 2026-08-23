(function () {
  'use strict';

  var WHATSAPP_NUMBER = '5592992534622';
  var WHATSAPP_MESSAGE = document.body.getAttribute('data-wa-message') ||
    'Olá, quero criar minha estrutura digital com a Identidade Web';

  function buildWhatsAppUrl() {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(WHATSAPP_MESSAGE);
  }

  document.querySelectorAll('.wa-link').forEach(function (el) {
    el.setAttribute('href', buildWhatsAppUrl());
  });

  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('main-nav');
  var navOverlay = document.getElementById('nav-overlay');
  function closeMenu() {
    if (!navMenu || !navMenu.classList.contains('open')) return;
    navMenu.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('show');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Abrir menu');
    }
    document.body.style.overflow = '';
  }
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var open = navMenu.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('show', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    var navClose = document.getElementById('nav-close');
    if (navClose) navClose.addEventListener('click', closeMenu);
    if (navOverlay) navOverlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  var yearEl = document.getElementById('ano');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var header = document.getElementById('header');
  if (header) {
    function onScrollHeader() {
      header.classList.toggle('scrolled', window.scrollY > 24);
    }
    window.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader();
  }

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }
})();
