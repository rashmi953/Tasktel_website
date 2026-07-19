/* ==========================================================================
   TASKTEL SOLUTIONS PAGE — ANIMATION ORCHESTRATION
   Lenis smooth scroll, GSAP + ScrollTrigger reveals, SplitType text
   animation, mouse parallax, counters, and the solution-stage transition
   used by solutions.js. Falls back gracefully if a library fails to load.
   ========================================================================== */

(function () {
  "use strict";

  const hasGSAP = typeof window.gsap !== "undefined";
  const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";
  const hasSplitType = typeof window.SplitType !== "undefined";
  const hasLenis = typeof window.Lenis !== "undefined";

  if (hasGSAP && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  function qs(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function qsa(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* ------------------------------------------------------------------
     1. LENIS SMOOTH SCROLL
  ------------------------------------------------------------------ */
  function initLenis() {
    if (!hasLenis) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (hasGSAP && hasScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    window.__pwLenis = lenis;
  }

  /* ------------------------------------------------------------------
     2. HERO HEADING — SplitType line-by-line reveal
  ------------------------------------------------------------------ */
  function initHeroSplitText() {
    const heading = qs("#pwHeroHeading");
    if (!heading) return;

    if (hasSplitType) {
      const split = new SplitType(heading, { types: "lines", lineClass: "split-line" });
      split.lines.forEach((line, i) => {
        line.style.transitionDelay = "";
        setTimeout(() => line.classList.add("is-revealed"), 150 + i * 140);
      });
    } else {
      heading.classList.add("is-revealed");
    }

    // Subtitle / CTA / counters fade up in sequence
    qsa("[data-split-fade]").forEach((el, i) => {
      const delay = parseInt(el.getAttribute("data-delay"), 10) || i * 150;
      setTimeout(() => el.classList.add("is-visible"), 500 + delay);
    });
  }

  /* ------------------------------------------------------------------
     3. GENERIC COUNTER ANIMATION
     Works for any element with data-count or data-stat, using GSAP if
     present, otherwise a plain requestAnimationFrame tween.
  ------------------------------------------------------------------ */
  function animateCounterEl(el, targetOverride) {
    const target = targetOverride != null
      ? targetOverride
      : parseFloat(el.getAttribute("data-count") || el.getAttribute("data-stat") || "0");

    if (isNaN(target)) return;
    el.classList.add("is-counting");

    if (hasGSAP) {
      const proxy = { val: 0 };
      gsap.to(proxy, {
        val: target,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(proxy.val);
        },
      });
    } else {
      const start = performance.now();
      const duration = 1600;
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * progress);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }

  function animateStatEls(els) {
    els.forEach((el) => animateCounterEl(el));
  }

  function initHeroCounters() {
    const counters = qsa(".pw-counter-num[data-count]");
    if (!counters.length) return;

    if (hasScrollTrigger) {
      ScrollTrigger.create({
        trigger: ".pw-hero-counters",
        start: "top 85%",
        once: true,
        onEnter: () => counters.forEach((c) => animateCounterEl(c)),
      });
    } else {
      counters.forEach((c) => animateCounterEl(c));
    }
  }

  function initWhyCounters() {
    const counters = qsa(".pw-why-num[data-count]");
    if (!counters.length) return;

    counters.forEach((counter) => {
      const card = counter.closest(".pw-why-card");
      if (hasScrollTrigger) {
        ScrollTrigger.create({
          trigger: card,
          start: "top 85%",
          once: true,
          onEnter: () => {
            card.classList.add("is-visible");
            animateCounterEl(counter);
          },
        });
      } else {
        card.classList.add("is-visible");
        animateCounterEl(counter);
      }
    });
  }

  /* ------------------------------------------------------------------
     4. HERO PARTICLES — generated once, floats upward on a loop
  ------------------------------------------------------------------ */
  function initHeroParticles() {
    const container = qs("#pwParticles");
    if (!container) return;

    const COUNT = 36;
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement("span");
      p.className = "pw-particle";
      const left = Math.random() * 100;
      const duration = 10 + Math.random() * 12;
      const delay = Math.random() * 12;
      p.style.left = left + "%";
      p.style.bottom = "-10px";
      p.style.animationDuration = duration + "s";
      p.style.animationDelay = delay + "s";
      container.appendChild(p);
    }
  }

  /* ------------------------------------------------------------------
     5. MOUSE PARALLAX — hero image composition tilts with cursor
  ------------------------------------------------------------------ */
  function initMouseParallax() {
    const comp = qs("#pwImageComp");
    if (!comp) return;

    const floatTop = qs(".pw-img-float-top", comp);
    const floatBottom = qs(".pw-img-float-bottom", comp);

    document.addEventListener("mousemove", (e) => {
      const rect = comp.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;

      if (hasGSAP) {
        gsap.to(comp, { rotateY: dx * 8, rotateX: -dy * 8, duration: 0.6, ease: "power2.out" });
        if (floatTop) gsap.to(floatTop, { x: dx * 18, y: dy * 12, duration: 0.7, ease: "power2.out" });
        if (floatBottom) gsap.to(floatBottom, { x: -dx * 16, y: -dy * 10, duration: 0.7, ease: "power2.out" });
      } else {
        comp.style.transform = "rotateY(" + dx * 8 + "deg) rotateX(" + -dy * 8 + "deg)";
      }
    });
  }

  /* ------------------------------------------------------------------
     6. HERO IMAGE COMPOSITION — entrance on load
  ------------------------------------------------------------------ */
  function initHeroImageEntrance() {
    const main = qs(".pw-img-main");
    const top = qs(".pw-img-float-top");
    const bottom = qs(".pw-img-float-bottom");
    setTimeout(() => {
      if (main) main.classList.add("is-visible");
      if (top) top.classList.add("is-visible");
      if (bottom) bottom.classList.add("is-visible");
    }, 300);
  }

  /* ------------------------------------------------------------------
     7. SCROLL INDICATOR — click scrolls to navigator section
  ------------------------------------------------------------------ */
  function initScrollIndicator() {
    const btn = qs("#pwScrollIndicator");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const target = qs("#solutions-nav");
      if (!target) return;
      if (window.__pwLenis) {
        window.__pwLenis.scrollTo(target, { offset: -60 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  /* ------------------------------------------------------------------
     8. SOLUTION STAGE TRANSITION — used by solutions.js when switching
     between navigator items. Returns a Promise so the caller can know
     when it's safe to mark the transition finished.
  ------------------------------------------------------------------ */
  function transitionStage(applyFn) {
    const stage = qs("#pwNavStage");
    if (!stage) {
      applyFn();
      return Promise.resolve();
    }

    if (hasGSAP) {
      return new Promise((resolve) => {
        const tl = gsap.timeline({
          onComplete: resolve,
        });
        tl.to(stage, { opacity: 0, y: 16, duration: 0.32, ease: "power1.in" })
          .add(() => applyFn())
          .to(stage, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
      });
    }

    // CSS fallback
    stage.style.transition = "opacity 0.3s ease";
    stage.style.opacity = "0";
    return new Promise((resolve) => {
      setTimeout(() => {
        applyFn();
        stage.style.opacity = "1";
        resolve();
      }, 300);
    });
  }

  /* ------------------------------------------------------------------
     9. GENERIC SCROLL REVEALS — glass cards, timeline steps, showcase
     rows, industry cards, testimonials, FAQ, all fade/slide in once
     when they enter the viewport.
  ------------------------------------------------------------------ */
  function initScrollReveals() {
    const targets = qsa(
      ".pw-timeline-step, .pw-showcase-row, .pw-glass-card:not(.pw-why-card), .pw-industry-card, .pw-accordion-item"
    );

    targets.forEach((el) => el.classList.add("pw-reveal-up"));

    if (hasScrollTrigger) {
      targets.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => {
            setTimeout(() => el.classList.add("is-visible"), (i % 4) * 90);
          },
        });
      });
    } else if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      targets.forEach((el) => io.observe(el));
    } else {
      targets.forEach((el) => el.classList.add("is-visible"));
    }
  }

  /* ------------------------------------------------------------------
     10. TIMELINE PROGRESS LINE — fills as the process section scrolls
  ------------------------------------------------------------------ */
  function initTimelineProgress() {
    const progress = qs("#pwTimelineProgress");
    const timeline = qs("#pwTimeline");
    if (!progress || !timeline) return;

    if (hasGSAP && hasScrollTrigger) {
      gsap.to(progress, {
        width: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: timeline,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.6,
        },
      });
    } else if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              progress.style.transition = "width 1.4s ease";
              progress.style.width = "100%";
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      io.observe(timeline);
    }
  }

  /* ------------------------------------------------------------------
     11. SHOWCASE MASK REVEAL — trigger the .is-visible class that
     animations.css uses to wipe back the mask and settle the image scale
  ------------------------------------------------------------------ */
  function initShowcaseReveal() {
    const rows = qsa(".pw-showcase-row");
    if (!rows.length) return;

    if (hasScrollTrigger) {
      rows.forEach((row) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 75%",
          once: true,
          onEnter: () => row.classList.add("is-visible"),
        });
      });
    } else {
      rows.forEach((row) => row.classList.add("is-visible"));
    }
  }

  /* ------------------------------------------------------------------
     12. NAVIGATOR STAGE ENTRANCE (first paint)
  ------------------------------------------------------------------ */
  function initStageEntrance() {
    const stage = qs("#pwNavStage");
    if (!stage) return;
    if (hasScrollTrigger) {
      ScrollTrigger.create({
        trigger: stage,
        start: "top 80%",
        once: true,
        onEnter: () => stage.classList.add("is-visible"),
      });
    }
  }

  /* ------------------------------------------------------------------
     INIT
  ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    initLenis();
    initHeroSplitText();
    initHeroParticles();
    initHeroImageEntrance();
    initMouseParallax();
    initScrollIndicator();
    initHeroCounters();
    initWhyCounters();
    initScrollReveals();
    initTimelineProgress();
    initShowcaseReveal();
    initStageEntrance();

    if (hasScrollTrigger) {
      // Recalculate trigger positions once images finish loading so
      // reveal thresholds stay accurate against final layout heights.
      window.addEventListener("load", () => ScrollTrigger.refresh());
    }
  });

  /* Expose helpers solutions.js relies on */
  window.PWAnimations = {
    animateStatEls: animateStatEls,
    transitionStage: transitionStage,
  };
})();