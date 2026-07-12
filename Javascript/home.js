
/* ==========================================================================
   TaskTel Technologies — Home Page (Header + Hero) JavaScript
   ========================================================================== */
 
document.addEventListener('DOMContentLoaded', function () {
 
    /* ----------------------------------------------------------------------
       1. Sticky Header — add shadow/background state once page is scrolled
       ---------------------------------------------------------------------- */
    var header = document.getElementById('mainHeader');
    var SCROLL_THRESHOLD = 12;
 
    function updateHeaderOnScroll() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }
 
    // Run once on load in case the page is already scrolled (e.g. reload mid-page)
    updateHeaderOnScroll();
    window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
 
    /* ----------------------------------------------------------------------
       2. Auto-close mobile nav when a link is clicked
       ---------------------------------------------------------------------- */
    var navLinks = document.querySelectorAll('.main-nav .nav-link, .btn-contact');
    var navbarCollapseEl = document.getElementById('mainNavbar');
 
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (navbarCollapseEl.classList.contains('show')) {
                var bsCollapse = bootstrap.Collapse.getInstance(navbarCollapseEl) ||
                    new bootstrap.Collapse(navbarCollapseEl, { toggle: false });
                bsCollapse.hide();
            }
        });
    });
 
    /* ----------------------------------------------------------------------
       3. Hero Section — staggered fade-in animation on page load
       ---------------------------------------------------------------------- */
    var fadeElements = document.querySelectorAll('.hero-fade');
 
    fadeElements.forEach(function (el) {
        var delay = parseInt(el.getAttribute('data-delay'), 10) || 0;
        setTimeout(function () {
            el.classList.add('is-visible');
        }, delay);
    });
 
});
 
 /* ----------------------------------------------------------------------
       4. Trusted Technology Partners — infinite logo marquee
       ---------------------------------------------------------------------- */
 
    // Partner list: { name, file } — filenames map to assets/images/partners/<file>
    // Replace these placeholder PNGs with real brand logos any time; no other
    // code changes are needed as long as the filenames stay the same.
var PARTNER_LOGOS = [
    { name: 'Absen', file: 'Absen.png' },
    { name: 'ATEN', file: 'ATEN.png' },
    { name: 'Aver', file: 'Aver.png' },
    { name: 'Barco', file: 'Barco.png' },
    { name: 'Biamp', file: 'biamp.png' },
    { name: 'Cisco', file: 'Cisco.png' },
    { name: 'ClearOne', file: 'clearone.png' },
    { name: 'Crestron', file: 'CRESTRON.png' },
    { name: 'Extron', file: 'Extron.png' },
    { name: 'Harman', file: 'HARMAN.png' },
    /* { name: 'HP', file: 'hp.png' },
    { name: 'Kramer', file: 'Kramer.png' },
    { name: 'LG', file: 'LG.png' },
    { name: 'Lightware', file: 'Lightware.png' },
    { name: 'Logitech', file: 'logitech.png' },
    { name: 'Lumens', file: 'Lumens.png' },
    { name: 'Maxhub', file: 'Maxhub.png' },
    { name: 'Mitel', file: 'Mitel.png' },
    { name: 'Neat', file: 'neat.png' },
    { name: 'Newline', file: 'Newline.png' },
    { name: 'Panasonic', file: 'Panasonic.png' },
    { name: 'QSC', file: 'QSC.png' },
    { name: 'Samsung', file: 'Samsung.png' },
    { name: 'Sennheiser', file: 'Sennheiser.png' },
    { name: 'Shure', file: 'Shure.png' },
    { name: 'Sony', file: 'Sony.png' },
    {name: 'Vaddio', file: 'Vaddio.png' }*/
];

  var LOGO_BASE_PATH = 'assests/images/Partners/';
    var marqueeTrack = document.getElementById('partnersMarquee');
 
    if (marqueeTrack && PARTNER_LOGOS.length) {
 
        /**
         * Builds one <div class="partner-logo-card"> per logo and appends it
         * to the marquee track. Called twice (see below) so the track holds
         * two identical, back-to-back copies of the full logo set.
         */
        function renderLogoSet() {
            PARTNER_LOGOS.forEach(function (partner) {
                var card = document.createElement('div');
                card.className = 'partner-logo-card';
 
                var img = document.createElement('img');
                img.src = LOGO_BASE_PATH + partner.file;
                img.alt = partner.name + ' logo';
                img.loading = 'lazy';
                // Decorative/duplicated content — hide the repeated copy from
                // assistive tech to avoid announcing the same list twice.
                img.setAttribute('aria-hidden', 'false');
 
                card.appendChild(img);
                marqueeTrack.appendChild(card);
            });
        }
 
        // First copy: the "real", accessible set of logos.
        renderLogoSet();
 
        // Second copy: purely decorative, used to create the seamless loop
        // (the CSS animation scrolls exactly -50%, i.e. one full set width).
        marqueeTrack.setAttribute('aria-hidden', 'false');
        var duplicateStart = marqueeTrack.children.length;
        renderLogoSet();
        for (var i = duplicateStart; i < marqueeTrack.children.length; i++) {
            marqueeTrack.children[i].setAttribute('aria-hidden', 'true');
        }
 
        // Fixed scroll speed: ~35s for one full pass (spec range: 30-40s).
        // Kept constant regardless of logo count so the pace always feels calm and premium.
        marqueeTrack.style.setProperty('--marquee-duration', '35s');
    }
 
/* =========================================================
   Tasktel Technologies — Statistics Section Interactions
   Vanilla JS: scroll-reveal + animated count-up
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
 
  const cards = document.querySelectorAll('.stat-card');
  const numbers = document.querySelectorAll('.stat-number');
 
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
 
    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }
 
    const duration = 1600; // ms
    const start = performance.now();
 
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
 
      el.textContent = current + suffix;
 
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    };
 
    requestAnimationFrame(step);
  };
 
  // Reveal cards + trigger count-up when the section enters view
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        card.classList.add('in-view');
 
        const numberEl = card.querySelector('.stat-number');
        if (numberEl && !numberEl.dataset.animated) {
          numberEl.dataset.animated = 'true';
          animateCount(numberEl);
        }
 
        obs.unobserve(card);
      }
    });
  }, {
    threshold: 0.3
  });
 
  cards.forEach((card) => observer.observe(card));
 
  // Fallback: if IntersectionObserver isn't supported, animate immediately
  if (!('IntersectionObserver' in window)) {
    cards.forEach((card) => card.classList.add('in-view'));
    numbers.forEach((el) => {
      if (!el.dataset.animated) {
        el.dataset.animated = 'true';
        animateCount(el);
      }
    });
  }
 
});
 