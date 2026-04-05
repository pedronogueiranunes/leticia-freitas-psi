/* ================================================
   ANIMATIONS.JS — Letícia Freitas Psicóloga
   GSAP + ScrollTrigger + Lenis + Microinteractions
   ================================================ */

(function () {
  'use strict';

  /* ── Register ScrollTrigger plugin ── */
  gsap.registerPlugin(ScrollTrigger);

  /* ────────────────────────────────────────────
     #10 — Lenis Smooth Scroll
  ──────────────────────────────────────────── */
  const lenis = new Lenis({
    duration: 1.15,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smoothWheel: true,
    smoothTouch: false,
  });

  // Connect Lenis with GSAP ticker (no separate rAF loop needed)
  gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  lenis.on('scroll', ScrollTrigger.update);

  // Make nav anchor links use Lenis
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = anchor.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.4 });
      }
    });
  });

  /* ────────────────────────────────────────────
     #9 — Reading Progress Bar
  ──────────────────────────────────────────── */
  var progressBar = document.createElement('div');
  progressBar.id = 'read-progress';
  document.body.prepend(progressBar);

  lenis.on('scroll', function (e) {
    var progress = Math.min(100, Math.max(0, (e.scroll / e.limit) * 100));
    progressBar.style.width = progress + '%';
  });

  /* ────────────────────────────────────────────
     #4 — Floating WhatsApp Button
  ──────────────────────────────────────────── */
  var floatBtn = document.createElement('a');
  floatBtn.id = 'float-wpp';
  floatBtn.href = 'https://wa.me/5577991105582';
  floatBtn.target = '_blank';
  floatBtn.rel = 'noopener noreferrer';
  floatBtn.setAttribute('aria-label', 'Agendar consulta pelo WhatsApp');
  floatBtn.innerHTML = [
    '<svg width="20" height="20" fill="white" viewBox="0 0 24 24">',
    '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>',
    '<path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.535 5.858L.057 23.5l5.77-1.507A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.85 0-3.587-.502-5.077-1.378l-.361-.215-3.425.895.916-3.32-.235-.374A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>',
    '</svg>',
    '<span>Agendar consulta</span>',
  ].join('');
  document.body.appendChild(floatBtn);

  // Set initial hidden state via GSAP
  gsap.set(floatBtn, { y: 80, opacity: 0 });

  // Hover effect
  floatBtn.addEventListener('mouseenter', function () {
    gsap.to(floatBtn, { y: -3, scale: 1.04, duration: 0.25, ease: 'power2.out',
      boxShadow: '0 8px 32px rgba(37,211,102,0.5)' });
  });
  floatBtn.addEventListener('mouseleave', function () {
    gsap.to(floatBtn, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out',
      boxShadow: '0 4px 20px rgba(37,211,102,0.38)' });
  });

  // Show after 400px scroll using ScrollTrigger
  ScrollTrigger.create({
    start: 400,
    onEnter: function () {
      gsap.to(floatBtn, { y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.5)' });
    },
    onLeaveBack: function () {
      gsap.to(floatBtn, { y: 80, opacity: 0, duration: 0.4, ease: 'power3.in' });
    },
  });

  /* ────────────────────────────────────────────
     #5 — Hero Headline Fade-in (GSAP)
  ──────────────────────────────────────────── */
  // Add class so CSS can hide elements before GSAP runs (avoids FOUC)
  document.documentElement.classList.add('gsap-init');

  // Animate on load — small delay to let i18n settle
  window.addEventListener('load', function () {
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo('.badge',
      { opacity: 0, y: -12, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6 },
      0.1
    )
    .fromTo('.hero-title',
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.9 },
      0.28
    )
    .fromTo('.hero-desc',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.7 },
      0.56
    )
    .fromTo('.hero-actions',
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.65 },
      0.72
    )
    .fromTo('.hero-tagline',
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      0.95
    );

    // Remove init class after animation starts
    setTimeout(function () {
      document.documentElement.classList.remove('gsap-init');
    }, 1600);
  });

  /* ────────────────────────────────────────────
     #7 — Parallax nas fotos (GSAP ScrollTrigger)
  ──────────────────────────────────────────── */
  // Hero photo — sobe levemente ao fazer scroll
  var heroImg = document.querySelector('.photo-img-wrap img');
  if (heroImg) {
    gsap.to(heroImg, {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.section-hero-wrap',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
  }

  // Foto da Letícia na seção Sobre
  var aboutImg = document.querySelector('.about-photo-card img');
  if (aboutImg) {
    gsap.to(aboutImg, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.section-about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  }

  // Foto da seção Como Funciona
  var processImg = document.querySelector('.process-photo img');
  if (processImg) {
    gsap.to(processImg, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.section-como-funciona',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
  }

  /* ────────────────────────────────────────────
     #6 — Cards 3D Hover (mouse tracking)
  ──────────────────────────────────────────── */
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var rotX = ((y - cy) / cy) * -7;  // max ±7°
      var rotY = ((x - cx) / cx) *  7;
      gsap.to(card, {
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 700,
        scale: 1.025,
        duration: 0.35,
        ease: 'power2.out',
        boxShadow: '0 16px 40px rgba(74,123,94,0.16)',
      });
    });

    card.addEventListener('mouseleave', function () {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.55,
        ease: 'power3.out',
        boxShadow: 'none',
      });
    });
  });

  /* ────────────────────────────────────────────
     #8 — Tab Crossfade Animado
  ──────────────────────────────────────────── */
  // Override the global switchTab with an animated version
  window.switchTab = function (id, btn) {
    var currentPanel = document.querySelector('.abordagem-panel.active');
    var nextPanel = document.getElementById('panel-' + id);
    if (!nextPanel || currentPanel === nextPanel) return;

    // Update tab button states
    document.querySelectorAll('.abordagem-tab').forEach(function (t) {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    var doSwitch = function () {
      if (currentPanel) currentPanel.classList.remove('active');
      nextPanel.classList.add('active');
      gsap.fromTo(nextPanel,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }
      );
    };

    if (currentPanel) {
      gsap.to(currentPanel, {
        opacity: 0,
        y: -10,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: function () {
          gsap.set(currentPanel, { clearProps: 'all' });
          doSwitch();
        },
      });
    } else {
      doSwitch();
    }
  };

  /* ────────────────────────────────────────────
     #2 — Pulse reforçado no botão hero (já feito em CSS)
         Aqui adicionamos hover scale suave
  ──────────────────────────────────────────── */
  var heroBtns = document.querySelectorAll('.btn-whatsapp, .btn-schedule, .btn-wpp-sm, .btn-banner-light');
  heroBtns.forEach(function (btn) {
    btn.addEventListener('mouseenter', function () {
      gsap.to(btn, { scale: 1.04, duration: 0.22, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', function () {
      gsap.to(btn, { scale: 1, duration: 0.28, ease: 'power2.out' });
    });
  });

  /* ────────────────────────────────────────────
     #11 — Ripple + Scale nos botões ao clicar
  ──────────────────────────────────────────── */
  var rippleBtns = document.querySelectorAll(
    '.btn-whatsapp, .btn-schedule, .btn-wpp-sm, .btn-banner-light, .btn-como'
  );

  rippleBtns.forEach(function (btn) {
    // Ensure relative + overflow for ripple
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.addEventListener('click', function (e) {
      // Ripple circle
      var circle = document.createElement('span');
      var diameter = Math.max(btn.clientWidth, btn.clientHeight);
      var radius = diameter / 2;
      var rect = btn.getBoundingClientRect();

      circle.classList.add('ripple-circle');
      circle.style.width  = diameter + 'px';
      circle.style.height = diameter + 'px';
      circle.style.left   = (e.clientX - rect.left - radius) + 'px';
      circle.style.top    = (e.clientY - rect.top  - radius) + 'px';

      var old = btn.querySelector('.ripple-circle');
      if (old) old.remove();
      btn.appendChild(circle);
      setTimeout(function () { if (circle.parentNode) circle.remove(); }, 600);

      // Scale feedback
      gsap.fromTo(btn,
        { scale: 0.96 },
        { scale: 1, duration: 0.35, ease: 'back.out(2)' }
      );
    });
  });

})();
