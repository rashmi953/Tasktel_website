
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
 
 

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------------------------------------
     1. Staggered fade-in for hero content on page load
     ------------------------------------------------------------------------ */
  var fadeElements = document.querySelectorAll('.hero-fade');

  fadeElements.forEach(function (el) {
    var delay = parseInt(el.getAttribute('data-delay'), 10) || 0;
    setTimeout(function () {
      el.classList.add('is-visible');
    }, delay);
  });

  /* ------------------------------------------------------------------------
     2. Full-bleed background image slider
        - Slides are plain full-section <div>s with inline background-image
        - Cross-fade handled purely by toggling the .is-active class,
          the actual opacity transition lives in CSS (transition: opacity)
        - Auto-advances every 4 seconds; loops infinitely
        - Paused automatically for users who prefer reduced motion
     ------------------------------------------------------------------------ */
  var slides = document.querySelectorAll('.hero-bg-slide');
  var currentSlide = 0;
  var SLIDE_INTERVAL = 4000;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goToSlide(index) {
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === index);
    });
    currentSlide = index;
  }

  if (slides.length > 1 && !prefersReducedMotion) {
    setInterval(function () {
      var nextSlide = (currentSlide + 1) % slides.length;
      goToSlide(nextSlide);
    }, SLIDE_INTERVAL);
  }

});

