/* ==========================================================================
   TaskTel Technologies
   smooth-scroll.js
   PART 3 — Lenis smooth scroll, synced with GSAP ScrollTrigger

   Load order matters: this file must load AFTER gsap.min.js,
   ScrollTrigger.min.js and lenis.min.js, and works fine loading either
   just before or just after services.js/animations.js since it only
   wires up scrolling behaviour, not section markup.
   ========================================================================== */

"use strict";

(function () {

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initLenis() {
    if (typeof Lenis === "undefined") return null;
    if (prefersReducedMotion()) return null; // respect OS-level reduced motion

    const lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.1
    });

    // Drive Lenis from GSAP's own ticker so both stay perfectly in sync —
    // avoids the classic "double rAF" jitter between Lenis and ScrollTrigger.
    if (typeof gsap !== "undefined") {
      gsap.ticker.add(time => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      if (typeof ScrollTrigger !== "undefined") {
        lenis.on("scroll", ScrollTrigger.update);
      }
    } else {
      // Fallback if GSAP hasn't loaded for some reason — run Lenis on its
      // own rAF loop so smooth scroll still works standalone.
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    return lenis;
  }

  function initAnchorLinks(lenis) {
    // Smooth-scroll every in-page anchor link (sticky sub-nav, hero CTAs,
    // footer links, etc.) instead of relying on default jump behaviour.
    document.addEventListener("click", e => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      if (lenis) {
        lenis.scrollTo(target, {
          offset: -90, // account for the sticky sub-nav height
          duration: 1.2
        });
      } else {
        target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      }

      // Keep the URL hash in sync without triggering a native jump.
      history.pushState(null, "", hash);
    });
  }

  const lenisInstance = initLenis();
  initAnchorLinks(lenisInstance);

  // Expose for other scripts (e.g. animations.js) that may want to pause/
  // resume smooth scroll around heavy scroll-triggered animations.
  window.TT_lenis = lenisInstance;

})();