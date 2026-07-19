/* ==========================================================================
   TaskTel Technologies
   smooth-scroll.js

   Kept intentionally minimal: services.js's initScrollspy() already
   handles anchor-link clicks (with its own 130px offset for the sticky
   sub-nav) via window.scrollTo({ behavior: 'smooth' }). This file only
   adds Lenis's kinetic/inertia feel to normal wheel and touch scrolling,
   synced to GSAP's ticker so it never fights ScrollTrigger.
   ========================================================================== */

"use strict";

(function () {

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  if (typeof Lenis === "undefined" || prefersReducedMotion()) return;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.1
  });

  if (typeof gsap !== "undefined") {
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    if (typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);
    }
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  window.TT_lenis = lenis;

})();