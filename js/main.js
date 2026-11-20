/* ================================================
   MAIN.JS — Letícia Freitas Psicóloga
   Tab switching + i18n language toggle
   ================================================ */

/* ---------- TAB SWITCHER ---------- */
function switchTab(id, btn) {
  document.querySelectorAll('.abordagem-panel').forEach(function(p) {
    p.classList.remove('active');
  });
  document.querySelectorAll('.abordagem-tab').forEach(function(t) {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  document.getElementById('panel-' + id).classList.add('active');
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
}

/* ---------- LANGUAGE TOGGLE ---------- */
function setLanguage(lang) {
  if (!TRANSLATIONS || !TRANSLATIONS[lang]) return;

  var t = TRANSLATIONS[lang];

  // Update all plain-text elements
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });

  // Update all innerHTML elements (those with embedded HTML like <em>, <strong>, <br>)
  document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  // Update <html lang> attribute
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en-US';

  // Update <title>
  if (t['meta.title']) {
    document.title = t['meta.title'];
  }

  // Update meta description
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && t['meta.description']) {
    metaDesc.setAttribute('content', t['meta.description']);
  }

  // Update active button state
  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.remove('active');
  });
  var activeBtn = document.getElementById('lang-' + lang);
  if (activeBtn) activeBtn.classList.add('active');

  // Persist in localStorage
  try {
    localStorage.setItem('lang', lang);
  } catch(e) {}
}

/* ---------- INIT: restore saved language ---------- */
(function() {
  var savedLang = 'pt';
  try {
    var stored = localStorage.getItem('lang');
    if (stored === 'en' || stored === 'pt') savedLang = stored;
  } catch(e) {}

  // Also check URL param ?lang=en
  try {
    var urlParams = new URLSearchParams(window.location.search);
    var urlLang = urlParams.get('lang');
    if (urlLang === 'en' || urlLang === 'pt') savedLang = urlLang;
  } catch(e) {}

  if (savedLang !== 'pt') {
    setLanguage(savedLang);
  }
})();

/* FAQ: smooth open/close for .fq-item details */
(function () {
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ease = 'cubic-bezier(.16,1,.3,1)';
  document.addEventListener('click', function (e) {
    var sum = e.target.closest('.fq-item > summary');
    if (!sum || still) return;
    var d = sum.parentElement, a = d.querySelector('.fq-a');
    if (!a || d.__busy) return;
    e.preventDefault();
    d.__busy = true;
    if (d.open) {
      a.animate([{ height: a.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: ease })
        .onfinish = function () { d.open = false; d.__busy = false; };
    } else {
      d.open = true;
      a.animate([{ height: '0px' }, { height: a.offsetHeight + 'px' }], { duration: 520, easing: ease })
        .onfinish = function () { d.__busy = false; };
    }
  });
})();

/* Footer: dot grid spotlight follows the cursor */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(hover: hover)').matches) return;
  var f = document.querySelector('footer.ft');
  if (!f) return;
  f.addEventListener('pointermove', function (e) {
    var r = f.getBoundingClientRect();
    f.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    f.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
})();
