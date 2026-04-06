/* ================================================
   SCROLL-REVEAL.JS — Letícia Freitas Psicóloga
   Intersection Observer + CSS — fade-up suave
   800–900ms ease-out, orgânico para psicoterapia
   ================================================ */

(function () {
  'use strict';

  /* ── Helpers ── */
  function reveal(el, variant, delay) {
    el.classList.add('reveal');
    if (variant) el.classList.add(variant);
    el.style.setProperty('--reveal-delay', delay + 'ms');
  }

  function revealGroup(selectors, variant, baseDelay, stepDelay) {
    selectors.forEach(function (sel, i) {
      var els = document.querySelectorAll(sel);
      els.forEach(function (el) {
        reveal(el, variant, baseDelay + i * stepDelay);
      });
    });
  }

  /* ── Register all elements for reveal ── */

  // ① Seção "Você se identifica" — header
  revealGroup(['.section-identify .section-badge',
               '.section-identify .section-title',
               '.section-identify .section-desc'],
    null, 0, 110);

  // ② Cards — stagger individual
  document.querySelectorAll('.cards-grid .card').forEach(function (el, i) {
    reveal(el, null, i * 130);
  });

  // ③ Abordagens — header + tabs como grupo
  revealGroup(['.abordagens-header',
               '.abordagens-tabs'],
    null, 0, 140);

  // ④ Como funciona — colunas opostas
  reveal(document.querySelector('.process-left'),  'from-left',  0);
  reveal(document.querySelector('.process-right'), 'from-right', 120);

  // ⑤ Info cards dentro do process-right — stagger
  document.querySelectorAll('.info-card').forEach(function (el, i) {
    reveal(el, null, i * 120);
  });

  // ⑥ About — foto da esquerda, texto da direita
  var photoCol = document.querySelector('.about-photo-col');
  var textCol  = document.querySelector('.about-text-col');
  if (photoCol) reveal(photoCol, 'from-left',  0);
  if (textCol)  reveal(textCol,  'from-right', 160);

  // ⑦ Abordagens grid items (na seção sobre)
  document.querySelectorAll('.abordagem-item').forEach(function (el, i) {
    reveal(el, null, i * 110);
  });

  // ⑧ Seção Localização — banner overlay
  var bannerOverlay = document.querySelector('.banner-overlay');
  if (bannerOverlay) reveal(bannerOverlay, 'from-scale', 0);

  // ⑨ Footer colunas — stagger suave
  document.querySelectorAll('.footer-brand, .footer-col').forEach(function (el, i) {
    reveal(el, null, i * 100);
  });

  /* ── Intersection Observer ── */
  var observerOptions = {
    threshold: 0.12,       // dispara quando 12% do elemento está visível
    rootMargin: '0px 0px -40px 0px', // margem negativa = não dispara logo de cara
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // anima apenas uma vez
      }
    });
  }, observerOptions);

  // Observa todos os elementos marcados
  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });

  /* ── Garante que elementos já visíveis no load animem ── */
  // (ex: conteúdo acima do fold caso scroll já esteja embaixo)
  window.addEventListener('load', function () {
    document.querySelectorAll('.reveal').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        el.classList.add('is-visible');
        observer.unobserve(el);
      }
    });
  });

})();
