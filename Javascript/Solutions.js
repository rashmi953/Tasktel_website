/* ==========================================================================
   TASKTEL SOLUTIONS PAGE — CORE LOGIC
   Data-driven UI: solution navigator content swap, logo marquee build,
   counters, testimonials slider, FAQ accordion.
   GSAP/ScrollTrigger/Lenis/SplitType orchestration lives in animations.js.
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------
     1. SOLUTION NAVIGATOR DATA
     Edit this array to add/remove solutions — everything downstream
     (image, floats, title, description, features, stats, badge) is
     driven from here so there is a single source of truth.
  ------------------------------------------------------------------ */
  const SOLUTIONS = [
    {
      badge: "01 / Meeting Rooms",
      title: "Meeting Rooms That Just Work",
      description:
        "One-touch join, auto-framing cameras and adaptive audio — designed so teams spend their time in the meeting, not setting up for it.",
      image: "assets/solutions/meeting-rooms.jpg",
      floatTop: "assets/icons/icon-schedule.png",
      floatBottom: "assets/icons/icon-wireless.png",
      icons: ["bi-camera-video", "bi-mic", "bi-wifi"],
      features: [
        "Certified for Teams, Zoom & Google Meet",
        "Auto room scheduling & occupancy sync",
        "One-touch join across every room size",
      ],
      stats: [
        { value: 450, label: "Rooms Deployed" },
        { value: 30, label: "Faster Setup", suffix: "%" },
      ],
      bgTint: "rgba(27,76,219,0.25)",
    },
    {
      badge: "02 / AV Integration",
      title: "Audio & Visual, Engineered Precisely",
      description:
        "From beamforming microphone arrays to auto-tracking 4K cameras, every AV system is tuned to the acoustics and geometry of your room.",
      image: "assets/solutions/av-integration.jpg",
      floatTop: "assets/icons/icon-speaker.png",
      floatBottom: "assets/icons/icon-camera.png",
      icons: ["bi-soundwave", "bi-camera-reels", "bi-sliders"],
      features: [
        "Custom acoustic tuning & room modeling",
        "4K auto-tracking camera systems",
        "Centralized AV control panels",
      ],
      stats: [
        { value: 12, label: "Years AV Expertise" },
        { value: 98, label: "First-Time Fix Rate", suffix: "%" },
      ],
      bgTint: "rgba(23,217,196,0.22)",
    },
    {
      badge: "03 / Unified Communications",
      title: "Every Channel. One Platform.",
      description:
        "Voice, video and messaging unified into a single, enterprise-grade platform — so nothing gets lost between tools.",
      image: "assets/solutions/unified-comms.jpg",
      floatTop: "assets/icons/icon-chat.png",
      floatBottom: "assets/icons/icon-phone.png",
      icons: ["bi-telephone", "bi-chat-dots", "bi-broadcast"],
      features: [
        "Single sign-on across voice, video & chat",
        "Enterprise-grade call quality & routing",
        "Deep integration with existing directories",
      ],
      stats: [
        { value: 40, label: "Offices Rolled Out" },
        { value: 99, label: "Call Uptime", suffix: "%" },
      ],
      bgTint: "rgba(27,76,219,0.28)",
    },
    {
      badge: "04 / Digital Signage",
      title: "Displays That Manage Themselves",
      description:
        "Centrally managed digital signage keeps every location on-brand and up to date, without a single visit to the site.",
      image: "assets/solutions/digital-signage.jpg",
      floatTop: "assets/icons/icon-display.png",
      floatBottom: "assets/icons/icon-cloud.png",
      icons: ["bi-display", "bi-cloud-arrow-up", "bi-grid"],
      features: [
        "Cloud-based content scheduling",
        "Multi-site brand consistency controls",
        "Emergency broadcast override",
      ],
      stats: [
        { value: 1200, label: "Screens Managed" },
        { value: 15, label: "Faster Content Push", suffix: "x" },
      ],
      bgTint: "rgba(23,217,196,0.25)",
    },
    {
      badge: "05 / Smart Workplace",
      title: "Space That Adapts To Demand",
      description:
        "Occupancy sensors, desk booking and environmental controls work together to run the office for you.",
      image: "assets/solutions/smart-workplace.jpg",
      floatTop: "assets/icons/icon-sensor.png",
      floatBottom: "assets/icons/icon-analytics.png",
      icons: ["bi-cpu", "bi-thermometer-half", "bi-bar-chart"],
      features: [
        "Real-time occupancy & desk analytics",
        "Automated lighting & climate control",
        "Live utilization dashboards",
      ],
      stats: [
        { value: 35, label: "Space Efficiency Gain", suffix: "%" },
        { value: 200, label: "Sites Instrumented" },
      ],
      bgTint: "rgba(27,76,219,0.24)",
    },
    {
      badge: "06 / Managed Support",
      title: "A Team That Watches So You Don't Have To",
      description:
        "24/7 monitoring, proactive issue detection and a dedicated helpdesk keep every system running at its best.",
      image: "assets/solutions/managed-support.jpg",
      floatTop: "assets/icons/icon-support.png",
      floatBottom: "assets/icons/icon-shield.png",
      icons: ["bi-headset", "bi-shield-check", "bi-activity"],
      features: [
        "24/7 remote monitoring & alerting",
        "Dedicated enterprise helpdesk",
        "Scheduled preventive maintenance",
      ],
      stats: [
        { value: 24, label: "Hour Response Window" },
        { value: 97, label: "Client Retention", suffix: "%" },
      ],
      bgTint: "rgba(23,217,196,0.2)",
    },
  ];

  /* ------------------------------------------------------------------
     2. TECHNOLOGY PARTNER LOGOS (marquee)
  ------------------------------------------------------------------ */
  const PARTNER_LOGOS = [
    "logo-microsoft.png",
    "logo-zoom.png",
    "logo-cisco.png",
    "logo-poly.png",
    "logo-logitech.png",
    "logo-crestron.png",
    "logo-samsung.png",
    "logo-lg.png",
  ];

  /* ------------------------------------------------------------------
     UTILITIES
  ------------------------------------------------------------------ */
  function qs(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function qsa(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* ------------------------------------------------------------------
     SOLUTION NAVIGATOR — content swap (GSAP timeline used if available,
     otherwise falls back to a plain class-based crossfade so the
     navigator still works without the animation libraries loaded).
  ------------------------------------------------------------------ */
  function initSolutionNavigator() {
    const list = qs("#pwSolutionList");
    if (!list) return;

    const items = qsa(".pw-solution-item", list);
    const stageImage = qs("#pwStageImage");
    const stageFloatTop = qs("#pwStageFloatTop img");
    const stageFloatBottom = qs("#pwStageFloatBottom img");
    const stageBadge = qs("#pwStageBadge");
    const stageTitle = qs("#pwStageTitle");
    const stageDescription = qs("#pwStageDescription");
    const stageFeatures = qs("#pwStageFeatures");
    const stageStats = qs("#pwStageStats");
    const stageIcons = qs("#pwStageIcons");
    const navBg = qs("#pwNavBg");
    const stageGlow = qs("#pwStageGlow");

    let activeIndex = 0;
    let isAnimating = false;

    function renderStats(stats) {
      stageStats.innerHTML = stats
        .map(
          (s) =>
            '<div><span data-stat="' +
            s.value +
            '">0</span>' +
            (s.suffix ? '<small class="pw-stat-suffix">' + s.suffix + "</small>" : "") +
            "<small>" +
            s.label +
            "</small></div>"
        )
        .join("");
    }

    function renderFeatures(features) {
      stageFeatures.innerHTML = features
        .map((f) => '<li><i class="bi bi-check2-circle"></i> ' + f + "</li>")
        .join("");
    }

    function renderIcons(icons) {
      stageIcons.innerHTML = icons
        .map((icon) => '<span><i class="bi ' + icon + '"></i></span>')
        .join("");
    }

    function applySolution(index) {
      const data = SOLUTIONS[index];
      if (!data) return;

      stageBadge.textContent = data.badge;
      stageTitle.textContent = data.title;
      stageDescription.textContent = data.description;
      stageImage.src = data.image;
      stageImage.alt = data.title;
      stageFloatTop.src = data.floatTop;
      stageFloatBottom.src = data.floatBottom;
      renderFeatures(data.features);
      renderIcons(data.icons);

      // Animate stats counting up
      renderStats(data.stats);
      if (window.PWAnimations && window.PWAnimations.animateStatEls) {
        window.PWAnimations.animateStatEls(qsa("[data-stat]", stageStats));
      }

      if (navBg) navBg.style.background =
        "radial-gradient(circle at 20% 20%, " + data.bgTint + ", transparent 55%)";
      if (stageGlow) stageGlow.style.background =
        "radial-gradient(circle, " + data.bgTint + ", transparent 65%)";
    }

    function setActiveItem(index) {
      items.forEach((item, i) => item.classList.toggle("is-active", i === index));
    }

    function goToSolution(index) {
      if (isAnimating || index === activeIndex) return;
      isAnimating = true;
      setActiveItem(index);

      if (window.PWAnimations && window.PWAnimations.transitionStage) {
        window.PWAnimations.transitionStage(function () {
          applySolution(index);
        }).then(function () {
          isAnimating = false;
        });
      } else {
        applySolution(index);
        isAnimating = false;
      }
      activeIndex = index;
    }

    items.forEach((item) => {
      item.addEventListener("click", () => {
        const idx = parseInt(item.getAttribute("data-index"), 10);
        goToSolution(idx);
      });
    });

    // Initialize first stats animation on load
    if (window.PWAnimations && window.PWAnimations.animateStatEls) {
      window.PWAnimations.animateStatEls(qsa("[data-stat]", stageStats));
    }
  }

  /* ------------------------------------------------------------------
     TECHNOLOGY ECOSYSTEM MARQUEE — builds two duplicated rows so the
     CSS translateX(-50%) loop is seamless.
  ------------------------------------------------------------------ */
  function buildMarquee(trackId, reversedOrder) {
    const track = qs("#" + trackId);
    if (!track) return;

    const logos = reversedOrder ? [...PARTNER_LOGOS].reverse() : PARTNER_LOGOS;
    const doubled = logos.concat(logos); // duplicate for seamless loop

    track.innerHTML = doubled
      .map(
        (file) =>
          '<div class="pw-logo-card"><img src="assets/logos/' +
          file +
          '" alt="Technology partner logo" loading="lazy" /></div>'
      )
      .join("");
  }

  function initEcosystemMarquee() {
    buildMarquee("pwMarqueeTrackA", false);
    buildMarquee("pwMarqueeTrackB", true);
  }

  /* ------------------------------------------------------------------
     TESTIMONIAL SLIDER — autoplay with progress bar
  ------------------------------------------------------------------ */
  function initTestimonialSlider() {
    const slides = qsa(".pw-testimonial-slide");
    const progress = qs("#pwTestimonialProgress");
    if (!slides.length) return;

    let current = 0;
    const DURATION = 6000;
    let timer = null;
    let progressStart = null;

    function showSlide(index) {
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    }

    function runProgress() {
      if (!progress) return;
      progress.style.transition = "none";
      progress.style.width = "0%";
      // Force reflow so the transition below actually restarts
      void progress.offsetWidth;
      progress.style.transition = "width " + DURATION + "ms linear";
      progress.style.width = "100%";
    }

    function next() {
      current = (current + 1) % slides.length;
      showSlide(current);
      runProgress();
    }

    function start() {
      showSlide(current);
      runProgress();
      timer = setInterval(next, DURATION);
    }

    const slider = qs("#pwTestimonialSlider");
    if (slider) {
      slider.addEventListener("mouseenter", () => clearInterval(timer));
      slider.addEventListener("mouseleave", () => {
        timer = setInterval(next, DURATION);
      });
    }

    start();
  }

  /* ------------------------------------------------------------------
     FAQ ACCORDION
  ------------------------------------------------------------------ */
  function initAccordion() {
    const items = qsa(".pw-accordion-item");
    items.forEach((item) => {
      const trigger = qs(".pw-accordion-trigger", item);
      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        items.forEach((i) => i.classList.remove("is-open"));
        if (!isOpen) item.classList.add("is-open");
      });
    });
  }

  /* ------------------------------------------------------------------
     MAGNETIC CTA BUTTON — pulls toward the cursor within a radius,
     springs back on leave, and ripples on click.
  ------------------------------------------------------------------ */
  function initMagneticButton() {
    const btn = qs("#pwMagneticBtn");
    if (!btn) return;

    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = "translate(" + x * 0.35 + "px, " + y * 0.35 + "px)";
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });

    btn.addEventListener("click", () => {
      btn.classList.remove("is-rippling");
      void btn.offsetWidth;
      btn.classList.add("is-rippling");
    });
  }

  /* ------------------------------------------------------------------
     INDUSTRY CARD TILT (lightweight 3D tilt on mouse move)
  ------------------------------------------------------------------ */
  function initIndustryTilt() {
    const cards = qsa(".pw-industry-card");
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          "rotateY(" + px * 14 + "deg) rotateX(" + -py * 14 + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateY(0) rotateX(0) translateY(0)";
      });
    });
  }

  /* ------------------------------------------------------------------
     HEADER SCROLL STATE (subtle shrink/blur increase on scroll)
  ------------------------------------------------------------------ */
  function initHeaderScrollState() {
    const header = qs("#mainHeader");
    if (!header) return;
    window.addEventListener("scroll", () => {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    });
  }

  /* ------------------------------------------------------------------
     INIT — DOM ready
  ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    initSolutionNavigator();
    initEcosystemMarquee();
    initTestimonialSlider();
    initAccordion();
    initMagneticButton();
    initIndustryTilt();
    initHeaderScrollState();
  });

  // Expose solution data for animations.js (hero counters etc. reuse nothing here,
  // but keeping this hook makes future cross-file coordination straightforward).
  window.PWSolutions = { SOLUTIONS: SOLUTIONS };
})();