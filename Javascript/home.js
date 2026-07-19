
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

/* ============================================================================
   HOME PAGE — SOLUTIONS SECTION ANIMATION UPGRADE (JS)
   ----------------------------------------------------------------------------
   HOW TO USE
   1. If Javascript/home.js already has a click handler that swaps
      #solutionImage / #solutionTitle / #solutionDescription on
      ".solution-item" clicks, DELETE that old handler first — this file
      replaces it with an animated version so you don't end up with two
      handlers fighting each other.
   2. Paste this entire block onto the end of Javascript/home.js.
   3. Add AOS's script + init before </body>, after home.js:
        <script src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"></script>
        <script>AOS.init({ duration: 700, once: true, offset: 80 });</script>
   ============================================================================ */

(function () {
  "use strict";

  function qs(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function qsa(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  function initAnimatedSolutionsSection() {
    const items = qsa(".solution-item");
    const image = qs("#solutionImage");
    const title = qs("#solutionTitle");
    const description = qs("#solutionDescription");
    const wrap = qs("#solutionsImageWrap");
    const featureList = qs(".solution-card ul");

    if (!items.length || !image) return;

    let isAnimating = false;

    function swapContent(item) {
      const newImage = item.getAttribute("data-image");
      const newTitle = item.getAttribute("data-title");
      const newDescription = item.getAttribute("data-description");

      image.src = newImage;
      image.alt = newTitle;
      title.textContent = newTitle;
      description.textContent = newDescription;

      // Re-trigger the CSS cascade animation on the feature list
      if (featureList) {
        featureList.classList.remove("is-refreshing");
        void featureList.offsetWidth; // force reflow
        qsa("li", featureList).forEach((li) => {
          li.style.animation = "none";
          void li.offsetWidth;
          li.style.animation = "";
        });
      }
    }

    function setActiveItem(activeItem) {
      items.forEach((item) => item.classList.remove("active"));
      activeItem.classList.add("active");
    }

    function selectSolution(item) {
      if (isAnimating || item.classList.contains("active")) return;
      isAnimating = true;

      setActiveItem(item);
      if (wrap) wrap.classList.add("is-glowing");

      // Fade the current image/title/description out, swap, fade back in.
      // Uses plain CSS transitions (no GSAP dependency needed for this
      // section), matching the .is-fading rules in the enhancement CSS.
      [image, title, description].forEach((el) => el && el.classList.add("is-fading"));

      window.setTimeout(() => {
        swapContent(item);
        [image, title, description].forEach((el) => el && el.classList.remove("is-fading"));

        window.setTimeout(() => {
          isAnimating = false;
          if (wrap) wrap.classList.remove("is-glowing");
        }, 400);
      }, 220);
    }

    items.forEach((item) => {
      item.addEventListener("click", () => selectSolution(item));
    });
  }

  document.addEventListener("DOMContentLoaded", initAnimatedSolutionsSection);
})();


/* ==========================================================================
   SERVICES SECTION — scroll reveal, tilt, and card navigation
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const serviceCards = document.querySelectorAll('.service-card[data-service]');
  const servicesHeading = document.querySelector('.services-heading');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Card click / keyboard → navigate to services.html?service=<id>
  serviceCards.forEach((card) => {
    const serviceId = card.getAttribute('data-service');
    const goToService = () => {
      window.location.href = `services.html?service=${encodeURIComponent(serviceId)}`;
    };
    card.addEventListener('click', goToService);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToService();
      }
    });
    card.classList.add('reveal-up');
  });

  // Reveal heading + cards as the section scrolls into view
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  if (servicesHeading) revealObserver.observe(servicesHeading);

  serviceCards.forEach((card, i) => {
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('is-visible'), i * 100);
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    cardObserver.observe(card);
  });

  // Subtle 3D tilt on hover (skipped for touch devices / reduced motion)
  if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
    const TILT_MAX = 6; // degrees

    serviceCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          `translateY(-10px) rotateX(${(-y * TILT_MAX).toFixed(2)}deg) rotateY(${(x * TILT_MAX).toFixed(2)}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
});