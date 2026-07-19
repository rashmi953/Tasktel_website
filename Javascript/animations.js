/* ==========================================================================
   TaskTel Technologies
   animations.js
   PART 2 — GSAP-driven animation layer for the Services page

   Exposes window.TT_initAnimations(service) which services.js calls once
   the section markup for the current service has been injected into the
   DOM. Keeping this in its own file/function means services.js never has
   to know animation internals, and this file can be safely reloaded or
   swapped without touching the data/render logic.
   ========================================================================== */

"use strict";

(function () {

  function hasGSAP() {
    return typeof gsap !== "undefined";
  }

  /* ------------------------------------------------------------------
     1. Hero entrance: heading line-by-line, description fade-up,
        buttons in sequence, stats counting up, image slide from right.
     ------------------------------------------------------------------ */
  function animateHero() {
    const tag = document.querySelector("[data-hero-tag]");
    const titleEl = document.querySelector("[data-hero-title]");
    const desc = document.querySelector("[data-hero-desc]");
    const actions = document.querySelector("[data-hero-actions]");
    const statsRow = document.querySelector("[data-hero-stats]");
    const visual = document.querySelector("[data-hero-visual]");

    if (!hasGSAP() || !titleEl) return;

    // Split the heading into lines using SplitType if available,
    // otherwise fall back to a single fade-up (still looks intentional).
    let lines = [titleEl];
    if (typeof SplitType !== "undefined") {
      const split = new SplitType(titleEl, { types: "lines" });
      lines = split.lines || [titleEl];
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(tag, { opacity: 0, y: -12, duration: 0.5 })
      .from(lines, {
        opacity: 0,
        y: 36,
        stagger: 0.12,
        duration: 0.7
      }, "-=0.2")
      .from(desc, { opacity: 0, y: 24, duration: 0.6 }, "-=0.35")
      .from(actions ? actions.children : [], {
        opacity: 0,
        y: 16,
        stagger: 0.12,
        duration: 0.5
      }, "-=0.3")
      .from(statsRow ? statsRow.children : [], {
        opacity: 0,
        y: 16,
        stagger: 0.1,
        duration: 0.5
      }, "-=0.25")
      .from(visual, {
        opacity: 0,
        x: 80,
        duration: 0.9,
        ease: "power4.out"
      }, "-=0.9");
  }

  /* ------------------------------------------------------------------
     2. Animated counters (0 -> target) for hero stats.
     ------------------------------------------------------------------ */
  function animateCounters() {
    const counters = document.querySelectorAll("[data-counter]");
    counters.forEach(el => {
      const target = parseFloat(el.getAttribute("data-target")) || 0;
      const suffix = el.getAttribute("data-suffix") || "";
      const counterObj = { val: 0 };

      const run = () => {
        gsap.to(counterObj, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${Math.round(counterObj.val)}${suffix}`;
          }
        });
      };

      if (hasGSAP() && typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: run
        });
      } else {
        run();
      }
    });
  }

  /* ------------------------------------------------------------------
     3. Mouse parallax on the hero visual (image + floating shapes).
     ------------------------------------------------------------------ */
  function initMouseParallax() {
    const hero = document.getElementById("hero");
    const image = document.querySelector("[data-hero-image]");
    const shapes = document.querySelectorAll(".svc-hero__shape, .svc-hero__orb");
    if (!hero || !hasGSAP()) return;

    // Skip on touch devices — parallax on hero images doesn't help there
    // and mousemove doesn't fire reliably anyway.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    hero.addEventListener("mousemove", e => {
      const rect = hero.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      if (image) {
        gsap.to(image, {
          x: relX * 18,
          y: relY * 14,
          duration: 0.6,
          ease: "power2.out"
        });
      }

      shapes.forEach((shape, i) => {
        const depth = (i + 1) * 10;
        gsap.to(shape, {
          x: relX * depth,
          y: relY * depth,
          duration: 0.8,
          ease: "power2.out"
        });
      });
    });

    hero.addEventListener("mouseleave", () => {
      if (image) gsap.to(image, { x: 0, y: 0, duration: 0.8, ease: "power3.out" });
      gsap.to(shapes, { x: 0, y: 0, duration: 0.8, ease: "power3.out" });
    });
  }

  /* ------------------------------------------------------------------
     4. Slow ambient drift on the hero background grid/orbs (parallax
        tied to scroll position, on top of the CSS loop animations).
     ------------------------------------------------------------------ */
  function initScrollParallax() {
    if (!hasGSAP() || typeof ScrollTrigger === "undefined") return;

    const grid = document.querySelector(".svc-hero__grid");
    const orbs = document.querySelectorAll(".svc-hero__orb");

    if (grid) {
      gsap.to(grid, {
        y: 60,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }

    orbs.forEach((orb, i) => {
      gsap.to(orb, {
        y: (i + 1) * 80,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    });
  }

  /* ------------------------------------------------------------------
     5. Overview: image slide from left, heading fade up, bullets one
        by one, floating decorative element on the inset image.
     ------------------------------------------------------------------ */
  function animateOverview() {
    if (!hasGSAP() || typeof ScrollTrigger === "undefined") return;

    const media = document.querySelector("[data-overview-media]");
    const mainImg = document.querySelector("[data-overview-main]");
    const floatWrap = document.querySelector("[data-overview-float]");
    const heading = document.querySelector("[data-overview-heading]");
    const bullets = document.querySelectorAll("[data-overview-bullets] li");

    if (mainImg) {
      gsap.from(mainImg, {
        opacity: 0,
        x: -70,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: media, start: "top 75%" }
      });
    }

    if (floatWrap) {
      gsap.from(floatWrap, {
        opacity: 0,
        x: 60,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: media, start: "top 75%" }
      });
      // continuous gentle float once it has entered
      gsap.to(floatWrap, {
        y: -14,
        duration: 2.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 1
      });
    }

    if (heading) {
      gsap.from(heading, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: heading, start: "top 85%" }
      });
    }

    if (bullets.length) {
      gsap.from(bullets, {
        opacity: 0,
        x: -20,
        stagger: 0.12,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: bullets[0], start: "top 90%" }
      });
    }
  }

  /* ------------------------------------------------------------------
     6. Generic scroll-reveal for repeating card grids (benefits, why-us,
        industries, gallery) — relies on AOS for the base fade/zoom, GSAP
        only adds the card hover-lift micro-interaction + border glow.
     ------------------------------------------------------------------ */
  function initCardHoverLift(selector) {
    document.querySelectorAll(selector).forEach(card => {
      card.addEventListener("mouseenter", () => {
        if (!hasGSAP()) return;
        gsap.to(card, { y: -8, duration: 0.35, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        if (!hasGSAP()) return;
        gsap.to(card, { y: 0, duration: 0.4, ease: "power2.out" });
      });
    });
  }

  /* ------------------------------------------------------------------
     7. Process timeline: animated connecting line that draws in as the
        section scrolls into view.
     ------------------------------------------------------------------ */
  function animateProcessLine() {
    if (!hasGSAP() || typeof ScrollTrigger === "undefined") return;
    const line = document.querySelector("[data-process-line]");
    const track = document.querySelector("[data-process-track]");
    if (!line || !track) return;

    gsap.fromTo(line,
      { scaleX: 0 },
      {
        scaleX: 1,
        transformOrigin: "left center",
        ease: "none",
        scrollTrigger: {
          trigger: track,
          start: "top 80%",
          end: "bottom 60%",
          scrub: true
        }
      }
    );
  }

  /* ------------------------------------------------------------------
     8. Technology marquee: infinite horizontal scroll of tech chips.
        Pure CSS animation handles the loop (see animations.css); this
        just pauses it on hover/focus for accessibility.
     ------------------------------------------------------------------ */
  function initTechMarquee() {
    const marquee = document.querySelector("[data-tech-marquee]");
    if (!marquee) return;
    const track = marquee.querySelector(".tech-marquee__track");
    marquee.addEventListener("mouseenter", () => track && track.classList.add("is-paused"));
    marquee.addEventListener("mouseleave", () => track && track.classList.remove("is-paused"));
  }

  /* ------------------------------------------------------------------
     9. CTA background particles — small floating dots inside the CTA
        band, generated once per page load.
     ------------------------------------------------------------------ */
  function initCTAParticles() {
    const container = document.querySelector("[data-cta-particles]");
    if (!container) return;

    const count = window.innerWidth < 768 ? 10 : 22;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const dot = document.createElement("span");
      dot.className = "svc-cta__particle";
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.animationDelay = `${Math.random() * 6}s`;
      dot.style.animationDuration = `${5 + Math.random() * 6}s`;
      frag.appendChild(dot);
    }
    container.appendChild(frag);
  }

  /* ------------------------------------------------------------------
     10. Generic AOS-style reveal fallback for any section without AOS
         attributes (keeps things consistent if a service is missing a
         data block and a section renders in a simpler shape).
     ------------------------------------------------------------------ */
  function refreshAOS() {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 700,
        easing: "ease-out-cubic",
        once: true,
        offset: 60
      });
      AOS.refreshHard();
    }
  }

  /* ------------------------------------------------------------------
     Public entry point
     ------------------------------------------------------------------ */
  window.TT_initAnimations = function initAnimations() {
    refreshAOS();
    animateHero();
    animateCounters();
    initMouseParallax();
    initScrollParallax();
    animateOverview();
    initCardHoverLift(".benefit-card, .why-card, .industry-card, .gallery-card");
    animateProcessLine();
    initTechMarquee();
    initCTAParticles();

    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  };

})();