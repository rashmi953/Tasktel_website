/* ==========================================================================
   TaskTel Technologies
   services.js
   PART 1 — Service data + full page render pipeline

   FIXES APPLIED (bugs in the original file that were blocking render):
   1. Duplicate renderWhyChoose / renderProcess / renderTechnologies /
      renderIndustries definitions removed — kept a single version of each,
      with data-aos preserved (the duplicates were silently overwriting the
      AOS-enabled versions and had inconsistent icon class prefixes).
   2. Benefit icons were missing the base "bi" class (only "bi-x" was
      applied) — Bootstrap Icons require both "bi" and "bi-x". Fixed in
      renderBenefits below and normalized in the data.
   3. unified-comms / digital-signage / smart-workplace / managed-support
      were missing whyChoose / process / faq (and some missing industries /
      gallery) — calling .map() on undefined would throw and blank the page.
      Filled in with content consistent with each service's existing bullets.
   4. The final serviceRoot.innerHTML assembly was commented out — nothing
      ever rendered. Restored at the bottom of this file, now also wiring
      up the sticky sub-nav active-state + scroll-spy behaviour and calling
      window.TT_initAnimations() (from animations.js) once markup is in
      the DOM.
   ========================================================================== */

"use strict";

/* ==========================================================================
   SERVICE DATA
   ========================================================================== */

const SERVICES = {

  "meeting-rooms": {
    id: "meeting-rooms",
    tag: "Meeting Room Solutions",
    title: "Modern Meeting Room Solutions",
    description:
      "Design intelligent meeting spaces equipped with video conferencing, wireless presentation, automation and collaboration technology.",
    heroImage: "assets/services/meeting-room.png",
    overviewImage: "assets/services/meeting-room1.png",
    floatImage: "assets/services/meeting-room1.png",
    stats: [
      { value: 500, suffix: "+", label: "Projects" },
      { value: 99, suffix: "%", label: "Customer Satisfaction" },
      { value: 24, suffix: "/7", label: "Support" }
    ],
    benefits: [
      { icon: "bi-camera-video-fill", title: "Video Conferencing", description: "Crystal-clear communication across offices." },
      { icon: "bi-display", title: "Wireless Presentation", description: "Share content instantly without cables." },
      { icon: "bi-cpu", title: "Automation", description: "One-touch control for every meeting." }
    ],
    bullets: ["Microsoft Teams Rooms", "Zoom Rooms", "Wireless Presentation", "Interactive Displays", "Room Scheduling"],
    whyChoose: [
      { icon: "bi-award-fill", title: "Certified Engineers", description: "Experienced AV professionals." },
      { icon: "bi-headset", title: "24/7 Support", description: "Dedicated technical support." },
      { icon: "bi-gear-fill", title: "Custom Integration", description: "Solutions designed for your workplace." },
      { icon: "bi-graph-up-arrow", title: "Future Ready", description: "Scalable enterprise solutions." }
    ],
    process: [
      { title: "Consultation", description: "Understand business requirements." },
      { title: "Design", description: "Prepare customized solution." },
      { title: "Implementation", description: "Professional installation." },
      { title: "Testing", description: "Quality assurance." },
      { title: "Support", description: "Continuous maintenance." }
    ],
    technologies: ["Microsoft Teams", "Zoom Rooms", "Cisco", "Poly", "Logitech", "Crestron"],
    industries: [
      { icon: "bi bi-building", name: "Corporate" },
      { icon: "bi bi-bank", name: "Banking" },
      { icon: "bi bi-hospital", name: "Healthcare" },
      { icon: "bi bi-mortarboard", name: "Education" },
      { icon: "bi bi-shop", name: "Retail" },
      { icon: "bi bi-gear", name: "Manufacturing" }
    ],
    gallery: [
      { icon: "bi bi-camera-video", category: "Meeting Room", title: "Executive Boardroom Installation" },
      { icon: "bi bi-display", category: "Digital Signage", title: "Interactive Display Deployment" },
      { icon: "bi bi-broadcast", category: "Unified Communications", title: "Hybrid Collaboration Workspace" }
    ],
    faq: [
      { question: "How long does deployment take?", answer: "Most projects are completed within the agreed implementation schedule." },
      { question: "Do you provide support after installation?", answer: "Yes. We provide AMC, remote monitoring and on-site support." },
      { question: "Can solutions be customized?", answer: "Absolutely. Every solution is designed according to customer requirements." }
    ]
  },

  "av-integration": {
    id: "av-integration",
    tag: "AV Integration",
    title: "Professional AV Integration",
    description:
      "Complete Audio Visual integration services for boardrooms, auditoriums, training rooms and experience centres.",
    heroImage: "assets/services/av.jpg",
    overviewImage: "assets/services/av1.jpg",
    floatImage: "assets/services/av2.jpg",
    stats: [
      { value: 500, suffix: "+", label: "Projects" },
      { value: 98, suffix: "%", label: "Customer Satisfaction" },
      { value: 24, suffix: "/7", label: "Support" }
    ],
    benefits: [
      { icon: "bi-speaker", title: "Professional Audio", description: "Premium sound solutions." },
      { icon: "bi-projector", title: "Display Systems", description: "Large format displays." },
      { icon: "bi-diagram-3", title: "Central Control", description: "Simple AV management." }
    ],
    bullets: ["Projectors", "LED Walls", "DSP Audio", "Control Systems", "Cabling"],
    whyChoose: [
      { icon: "bi-award-fill", title: "Expert AV Engineers", description: "Certified AV integration professionals." },
      { icon: "bi-headset", title: "Reliable Support", description: "Remote & onsite assistance." },
      { icon: "bi-gear-fill", title: "Complete Integration", description: "Audio, video and control systems." },
      { icon: "bi-lightning-fill", title: "Latest Technology", description: "Modern AV solutions." }
    ],
    process: [
      { title: "Site Survey", description: "Inspect project location." },
      { title: "Planning", description: "Prepare AV design." },
      { title: "Installation", description: "Deploy AV equipment." },
      { title: "Calibration", description: "Optimize system performance." },
      { title: "Support", description: "Continuous maintenance." }
    ],
    technologies: ["Crestron", "Extron", "Bosch", "Biamp", "Barco", "LG"],
    industries: [
      { icon: "bi bi-building", name: "Corporate" },
      { icon: "bi bi-bank", name: "Banking" },
      { icon: "bi bi-hospital", name: "Healthcare" },
      { icon: "bi bi-mortarboard", name: "Education" },
      { icon: "bi bi-easel", name: "Auditoriums" },
      { icon: "bi bi-shop", name: "Retail" }
    ],
    gallery: [
      { icon: "bi bi-speaker", category: "Audio", title: "Auditorium Audio" },
      { icon: "bi bi-projector", category: "Display", title: "Projector Installation" },
      { icon: "bi bi-diagram-3", category: "Control", title: "AV Control Room" }
    ],
    faq: [
      { question: "Can you integrate existing AV systems?", answer: "Yes, we integrate new and existing equipment." },
      { question: "Do you provide training?", answer: "Yes, user training is included." },
      { question: "Is remote monitoring available?", answer: "Yes, for selected solutions." }
    ]
  },

  "unified-comms": {
    id: "unified-comms",
    tag: "Unified Communications",
    title: "Unified Communication Solutions",
    description: "Connect employees using voice, video, messaging and collaboration platforms.",
    heroImage: "assets/services/unified.jpg",
    overviewImage: "assets/services/unified1.jpg",
    floatImage: "assets/services/unified2.jpg",
    stats: [
      { value: 400, suffix: "+", label: "Deployments" },
      { value: 97, suffix: "%", label: "Customer Satisfaction" },
      { value: 24, suffix: "/7", label: "Support" }
    ],
    benefits: [
      { icon: "bi-chat-dots-fill", title: "Team Messaging", description: "Instant, secure workplace chat." },
      { icon: "bi-camera-video", title: "Video Meetings", description: "HD video across every device." },
      { icon: "bi-cloud-fill", title: "Cloud Calling", description: "Enterprise voice, hosted in the cloud." }
    ],
    bullets: ["Microsoft Teams", "Zoom", "Cisco Webex", "Cloud Calling", "Messaging"],
    whyChoose: [
      { icon: "bi-chat-dots-fill", title: "Better Collaboration", description: "Connect teams from anywhere." },
      { icon: "bi-cloud-fill", title: "Cloud Ready", description: "Secure cloud communication." },
      { icon: "bi-shield-check", title: "Enterprise Security", description: "Reliable business communication." },
      { icon: "bi-arrow-repeat", title: "Easy Integration", description: "Works with existing platforms." }
    ],
    process: [
      { title: "Assessment", description: "Review communication needs." },
      { title: "Planning", description: "Choose best UC platform." },
      { title: "Deployment", description: "Configure communication services." },
      { title: "Testing", description: "Verify connectivity." },
      { title: "Support", description: "Ongoing optimization." }
    ],
    technologies: ["Microsoft Teams", "Cisco Webex", "Zoom", "RingCentral", "3CX", "Yealink"],
    industries: [
      { icon: "bi bi-building", name: "Corporate" },
      { icon: "bi bi-bank", name: "Finance" },
      { icon: "bi bi-hospital", name: "Healthcare" },
      { icon: "bi bi-mortarboard", name: "Education" },
      { icon: "bi bi-shop", name: "Retail" },
      { icon: "bi bi-globe", name: "Global Offices" }
    ],
    gallery: [
      { icon: "bi bi-chat-video", category: "Video", title: "Hybrid Meeting" },
      { icon: "bi bi-telephone", category: "Voice", title: "Cloud Calling" },
      { icon: "bi bi-people", category: "Collaboration", title: "Unified Workspace" }
    ],
    faq: [
      { question: "Can remote employees connect?", answer: "Yes, securely from anywhere." },
      { question: "Is Microsoft Teams supported?", answer: "Yes, fully supported." },
      { question: "Can UC integrate with PBX?", answer: "Yes, we support hybrid PBX integration." }
    ]
  },

  "digital-signage": {
    id: "digital-signage",
    tag: "Digital Signage",
    title: "Digital Signage Solutions",
    description: "Interactive digital signage systems for retail, education and corporate environments.",
    heroImage: "assets/services/signage.jpg",
    overviewImage: "assets/services/signage1.jpg",
    floatImage: "assets/services/signage2.jpg",
    stats: [
      { value: 350, suffix: "+", label: "Screens Deployed" },
      { value: 96, suffix: "%", label: "Customer Satisfaction" },
      { value: 24, suffix: "/7", label: "Monitoring" }
    ],
    benefits: [
      { icon: "bi-easel-fill", title: "Dynamic Content", description: "Update messaging instantly, network-wide." },
      { icon: "bi-grid-1x2-fill", title: "Interactive Kiosks", description: "Touch-enabled wayfinding and self-service." },
      { icon: "bi-cloud-arrow-up-fill", title: "Cloud CMS", description: "Manage every screen from one dashboard." }
    ],
    bullets: ["Advertising", "Information Displays", "Interactive Kiosks", "Wayfinding", "Content Management"],
    whyChoose: [
      { icon: "bi-palette-fill", title: "Brand-Ready Displays", description: "Content templates tailored to your brand." },
      { icon: "bi-wifi", title: "Remote Management", description: "Push updates to every screen instantly." },
      { icon: "bi-shield-check", title: "Reliable Hardware", description: "Commercial-grade displays and players." },
      { icon: "bi-graph-up", title: "Analytics Included", description: "Track engagement and content performance." }
    ],
    process: [
      { title: "Consultation", description: "Understand locations and messaging goals." },
      { title: "Content Planning", description: "Design layouts and playlists." },
      { title: "Installation", description: "Mount and network every display." },
      { title: "Testing", description: "Verify content sync and uptime." },
      { title: "Support", description: "Ongoing content and hardware support." }
    ],
    technologies: ["Samsung", "LG", "Philips", "BrightSign", "Android", "Windows"],
    industries: [
      { icon: "bi bi-shop", name: "Retail" },
      { icon: "bi bi-building", name: "Corporate" },
      { icon: "bi bi-mortarboard", name: "Education" },
      { icon: "bi bi-hospital", name: "Healthcare" },
      { icon: "bi bi-airplane", name: "Transportation" },
      { icon: "bi bi-cup-hot", name: "Hospitality" }
    ],
    gallery: [
      { icon: "bi bi-display", category: "Retail", title: "Retail Display" },
      { icon: "bi bi-tv", category: "Corporate", title: "Lobby Display" },
      { icon: "bi bi-easel", category: "Education", title: "Campus Signage" }
    ],
    faq: [
      { question: "Can content be updated remotely?", answer: "Yes, through a cloud-based content management system." },
      { question: "Do you support interactive touch screens?", answer: "Yes, including kiosks and wayfinding displays." },
      { question: "Can signage integrate with existing networks?", answer: "Yes, we design around your existing IT infrastructure." }
    ]
  },

  "smart-workplace": {
    id: "smart-workplace",
    tag: "Smart Workplace",
    title: "Smart Workplace Technology",
    description: "Transform offices into intelligent, connected and productive workspaces.",
    heroImage: "assets/services/workplace.jpg",
    overviewImage: "assets/services/workplace1.jpg",
    floatImage: "assets/services/workplace2.jpg",
    stats: [
      { value: 300, suffix: "+", label: "Smart Offices" },
      { value: 97, suffix: "%", label: "Customer Satisfaction" },
      { value: 24, suffix: "/7", label: "Support" }
    ],
    benefits: [
      { icon: "bi-cpu-fill", title: "IoT Automation", description: "Sensors that adapt spaces to real usage." },
      { icon: "bi-calendar-check-fill", title: "Smart Booking", description: "Book rooms and desks in seconds." },
      { icon: "bi-bar-chart-fill", title: "Workspace Analytics", description: "Data-driven decisions on space usage." }
    ],
    bullets: ["IoT", "Occupancy Sensors", "Booking Systems", "Workspace Analytics", "Automation"],
    whyChoose: [
      { icon: "bi-cpu-fill", title: "Connected Infrastructure", description: "IoT sensors across every workspace." },
      { icon: "bi-graph-up-arrow", title: "Data-Driven Insights", description: "Real-time analytics on space utilization." },
      { icon: "bi-lightning-charge-fill", title: "Energy Efficiency", description: "Automated lighting and climate control." },
      { icon: "bi-shield-check", title: "Enterprise Grade", description: "Secure, scalable smart-building platform." }
    ],
    process: [
      { title: "Assessment", description: "Audit current workplace infrastructure." },
      { title: "Planning", description: "Design sensor and automation layout." },
      { title: "Implementation", description: "Install IoT devices and platforms." },
      { title: "Testing", description: "Validate automation and analytics." },
      { title: "Support", description: "Ongoing monitoring and optimization." }
    ],
    technologies: ["IoT", "Occupancy Sensors", "Room Booking", "Automation", "Microsoft 365", "Power BI"],
    industries: [
      { icon: "bi bi-building", name: "Corporate" },
      { icon: "bi bi-bank", name: "Finance" },
      { icon: "bi bi-mortarboard", name: "Education" },
      { icon: "bi bi-hospital", name: "Healthcare" },
      { icon: "bi bi-house-gear", name: "Real Estate" },
      { icon: "bi bi-gear", name: "Manufacturing" }
    ],
    gallery: [
      { icon: "bi bi-building", category: "Smart Office", title: "Connected Workspace" },
      { icon: "bi bi-cpu", category: "Automation", title: "Smart Office Control" },
      { icon: "bi bi-lightbulb", category: "Energy", title: "Energy Management" }
    ],
    faq: [
      { question: "What sensors are used for occupancy tracking?", answer: "We deploy IoT occupancy and environmental sensors tailored to your floor plan." },
      { question: "Can this integrate with our existing booking tools?", answer: "Yes, we integrate with Microsoft 365 and other common platforms." },
      { question: "Is workspace data secure?", answer: "Yes, all data is encrypted and access-controlled." }
    ]
  },

  "managed-support": {
    id: "managed-support",
    tag: "Managed Support",
    title: "Managed Support Services",
    description: "End-to-end monitoring, maintenance and technical support for workplace technology.",
    heroImage: "assets/services/support.jpg",
    overviewImage: "assets/services/support1.jpg",
    floatImage: "assets/services/support2.jpg",
    stats: [
      { value: 500, suffix: "+", label: "Sites Supported" },
      { value: 99, suffix: "%", label: "Uptime" },
      { value: 24, suffix: "/7", label: "Monitoring" }
    ],
    benefits: [
      { icon: "bi-headset", title: "24/7 Helpdesk", description: "Always-on technical assistance." },
      { icon: "bi-tools", title: "Preventive Maintenance", description: "Scheduled upkeep that avoids downtime." },
      { icon: "bi-cloud-check-fill", title: "Remote Monitoring", description: "Issues flagged before they escalate." }
    ],
    bullets: ["24×7 Monitoring", "AMC", "Remote Support", "Preventive Maintenance", "On-site Engineers"],
    whyChoose: [
      { icon: "bi-headset", title: "Always Available", description: "24/7 helpdesk and escalation support." },
      { icon: "bi-speedometer2", title: "Fast Response", description: "SLA-backed response and resolution times." },
      { icon: "bi-tools", title: "Preventive Care", description: "Scheduled maintenance reduces downtime." },
      { icon: "bi-person-badge", title: "Dedicated Engineers", description: "On-site specialists for critical sites." }
    ],
    process: [
      { title: "Onboarding", description: "Document infrastructure and support scope." },
      { title: "Planning", description: "Set up monitoring and SLAs." },
      { title: "Deployment", description: "Roll out monitoring agents and helpdesk access." },
      { title: "Testing", description: "Validate alerting and escalation paths." },
      { title: "Support", description: "Ongoing 24/7 monitoring and maintenance." }
    ],
    technologies: ["Remote Monitoring", "Help Desk", "ITSM", "Microsoft", "Cisco", "VMware"],
    industries: [
      { icon: "bi bi-building", name: "Corporate" },
      { icon: "bi bi-bank", name: "Banking" },
      { icon: "bi bi-hospital", name: "Healthcare" },
      { icon: "bi bi-mortarboard", name: "Education" },
      { icon: "bi bi-shop", name: "Retail" },
      { icon: "bi bi-gear", name: "Manufacturing" }
    ],
    gallery: [
      { icon: "bi bi-headset", category: "Support", title: "24/7 Helpdesk" },
      { icon: "bi bi-tools", category: "Maintenance", title: "Preventive Maintenance" },
      { icon: "bi bi-cloud-check", category: "Monitoring", title: "Remote Monitoring" }
    ],
    faq: [
      { question: "What are your support hours?", answer: "Our helpdesk and monitoring operate 24 hours a day, every day." },
      { question: "Do you offer on-site engineers?", answer: "Yes, for sites that require on-site coverage under an AMC." },
      { question: "How fast is issue response?", answer: "Response times are governed by SLA tiers agreed at onboarding." }
    ]
  }

};

/* ==========================================================================
   CURRENT SERVICE
   ========================================================================== */

const params = new URLSearchParams(window.location.search);
const serviceId = params.get("service") || "meeting-rooms";
const currentService = SERVICES[serviceId];

const serviceRoot = document.getElementById("serviceRoot");

if (!currentService) {
  serviceRoot.innerHTML = `
    <section class="service-not-found">
      <div class="container text-center">
        <h2>Service Not Found</h2>
        <p>The requested service does not exist.</p>
      </div>
    </section>
  `;
  throw new Error("Invalid service.");
}

/* ==========================================================================
   Hero Section
   ========================================================================== */

function renderHero(service) {
  return `
<section class="svc-hero" id="hero">

  <div class="svc-hero__grid"></div>
  <div class="svc-hero__orb svc-hero__orb--1"></div>
  <div class="svc-hero__orb svc-hero__orb--2"></div>

  <div class="container svc-hero__inner">
    <div class="row align-items-center gy-5">

      <div class="col-lg-6">

        <span class="eyebrow-tag loop-shimmer" data-hero-tag>
          ${service.tag}
        </span>

        <h1 class="svc-hero__title" data-hero-title>
          ${service.title}
        </h1>

        <p class="svc-hero__desc" data-hero-desc>
          ${service.description}
        </p>

        <div class="svc-hero__actions" data-hero-actions>
          <a href="home.html#contact" class="btn-hero-primary loop-cta-glow">
            Contact Us
          </a>
          <a href="#overview" class="btn-hero-ghost">
            Learn More
          </a>
        </div>

        <div class="hero-stats-row hero-stats-row--inline" data-hero-stats>
          ${service.stats.map(stat => `
          <div class="hero-stat">
            <span class="hero-stat__value" data-counter data-target="${stat.value}" data-suffix="${stat.suffix}">0${stat.suffix}</span>
            <span class="hero-stat__label">${stat.label}</span>
          </div>
          `).join("")}
        </div>

      </div>

      <div class="col-lg-6">
        <div class="svc-hero__visual" data-hero-visual>

          <div class="svc-hero__glass-card loop-float">
            <i class="bi bi-check-circle-fill"></i>
            <span>Certified Deployment</span>
          </div>

          <img
            src="${service.heroImage}"
            class="img-fluid rounded-4 shadow-lg"
            alt="${service.title}"
            data-hero-image
          >

          <span class="svc-hero__shape svc-hero__shape--a"></span>
          <span class="svc-hero__shape svc-hero__shape--b"></span>

        </div>
      </div>

    </div>
  </div>

</section>
`;
}

/* ==========================================================================
   Sticky Navigation
   ========================================================================== */

function renderSubNav() {
  const links = [
    ["overview", "Overview"],
    ["benefits", "Benefits"],
    ["why", "Why Choose Us"],
    ["process", "Process"],
    ["technology", "Technology"],
    ["industries", "Industries"],
    ["gallery", "Gallery"],
    ["faq", "FAQ"],
    ["contact", "Contact"]
  ];

  return `
<nav class="svc-subnav" id="svcSubnav">
  <div class="container">
    <div class="svc-subnav__inner">
      ${links.map(([id, label], i) => `
      <a href="#${id === 'contact' ? 'contact' : id}" class="svc-subnav__link${i === 0 ? ' active' : ''}" data-subnav-link="${id}">
        ${label}
      </a>
      `).join("")}
      <span class="svc-subnav__indicator" data-subnav-indicator></span>
    </div>
  </div>
</nav>
`;
}

/* ==========================================================================
   Overview Section
   ========================================================================== */

function renderOverview(service) {
  return `
<section class="svc-section" id="overview">
  <div class="container">
    <div class="row align-items-center gy-5">

      <div class="col-lg-6">
        <div class="service-media" data-overview-media>
          <img src="${service.overviewImage}" class="service-media__main" alt="${service.title} overview" data-overview-main>
          <div class="service-media__float-wrap" data-overview-float>
            <img src="${service.floatImage}" class="service-media__float" alt="${service.title} detail">
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <span class="section-kicker">OVERVIEW</span>
        <h2 class="svc-section__title mb-3" data-overview-heading>${service.title}</h2>
        <p class="svc-overview__p">${service.description}</p>

        <ul class="service-info__bullets" data-overview-bullets>
          ${service.bullets.map(b => `
          <li><i class="bi bi-check-circle-fill"></i><span>${b}</span></li>
          `).join("")}
        </ul>
      </div>

    </div>
  </div>
</section>
`;
}

/* ==========================================================================
   Benefits
   ========================================================================== */

function renderBenefits(service) {
  if (!service.benefits || !service.benefits.length) return "";
  return `
<section class="svc-section svc-benefits" id="benefits">
  <div class="container">

    <div class="section-heading" data-aos="fade-up">
      <span class="section-kicker">KEY BENEFITS</span>
      <h2 class="svc-section__title">Why Organizations Choose This Service</h2>
    </div>

    <div class="row g-4">
      ${service.benefits.map((item, index) => `
      <div class="col-lg-4 col-md-6" data-aos="zoom-in" data-aos-delay="${index * 100}">
        <div class="benefit-card h-100">
          <div class="benefit-card__icon"><i class="bi ${item.icon}"></i></div>
          <h5 class="benefit-card__title">${item.title}</h5>
          <p class="benefit-card__desc">${item.description}</p>
        </div>
      </div>
      `).join("")}
    </div>

  </div>
</section>
`;
}

/* ==========================================================================
   Why Choose Us
   ========================================================================== */

function renderWhyChoose(service) {
  if (!service.whyChoose || !service.whyChoose.length) return "";
  return `
<section class="svc-section svc-why" id="why">
  <div class="container">

    <div class="section-heading section-heading--light" data-aos="fade-up">
      <span class="section-kicker section-kicker--light">WHY TASKTEL</span>
      <h2 class="svc-section__title svc-section__title--light">Why Partner With TaskTel Technologies</h2>
    </div>

    <div class="row g-4">
      ${service.whyChoose.map((item, index) => `
      <div class="col-lg-6 col-xl-3" data-aos="fade-up" data-aos-delay="${index * 120}">
        <div class="why-card h-100">
          <div class="why-card__icon"><i class="bi ${item.icon}"></i></div>
          <div>
            <h5 class="why-card__title">${item.title}</h5>
            <p class="why-card__desc">${item.description}</p>
          </div>
        </div>
      </div>
      `).join("")}
    </div>

  </div>
</section>
`;
}

/* ==========================================================================
   Process Timeline
   ========================================================================== */

function renderProcess(service) {
  if (!service.process || !service.process.length) return "";
  return `
<section class="svc-section svc-process" id="process">
  <div class="container">

    <div class="section-heading" data-aos="fade-up">
      <span class="section-kicker">OUR PROCESS</span>
      <h2 class="svc-section__title">How We Deliver Success</h2>
    </div>

    <div class="process-track" data-process-track>
      <div class="process-track__line" data-process-line></div>
      ${service.process.map((step, index) => `
      <div class="process-step" data-aos="fade-up" data-aos-delay="${index * 100}">
        <div class="process-step__node">${index + 1}</div>
        <h5 class="process-step__title">${step.title}</h5>
        <p class="process-step__desc">${step.description}</p>
      </div>
      `).join("")}
    </div>

  </div>
</section>
`;
}

/* ==========================================================================
   Technologies (marquee)
   ========================================================================== */

function renderTechnologies(service) {
  if (!service.technologies || !service.technologies.length) return "";
  const chips = service.technologies.map(tech => `
    <div class="tech-chip"><i class="bi bi-cpu-fill"></i><span>${tech}</span></div>
  `).join("");

  return `
<section class="svc-section svc-tech" id="technology">
  <div class="container">

    <div class="section-heading" data-aos="fade-up">
      <span class="section-kicker">TECHNOLOGIES</span>
      <h2 class="svc-section__title">Platforms & Technologies</h2>
    </div>

    <div class="tech-marquee" data-tech-marquee>
      <div class="tech-marquee__track">
        ${chips}
        ${chips}
      </div>
    </div>

  </div>
</section>
`;
}

/* ==========================================================================
   Industries
   ========================================================================== */

function renderIndustries(service) {
  if (!service.industries || !service.industries.length) return "";
  return `
<section class="svc-section svc-industries" id="industries">
  <div class="container">

    <div class="section-heading" data-aos="fade-up">
      <span class="section-kicker">INDUSTRIES</span>
      <h2 class="svc-section__title">Industries We Serve</h2>
    </div>

    <div class="row g-4">
      ${service.industries.map((industry, index) => `
      <div class="col-lg-2 col-md-4 col-6" data-aos="zoom-in" data-aos-delay="${index * 80}">
        <div class="industry-card">
          <i class="${industry.icon}"></i>
          <span>${industry.name}</span>
        </div>
      </div>
      `).join("")}
    </div>

  </div>
</section>
`;
}

/* ==========================================================================
   Gallery
   ========================================================================== */

function renderGallery(service) {
  if (!service.gallery || !service.gallery.length) return "";
  return `
<section class="svc-section svc-gallery" id="gallery">
  <div class="container">

    <div class="section-heading" data-aos="fade-up">
      <span class="section-kicker">PROJECTS</span>
      <h2 class="svc-section__title">Recent Installations</h2>
    </div>

    <div class="row g-4">
      ${service.gallery.map((project, index) => `
      <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${index * 120}">
        <div class="gallery-card">
          <div class="gallery-card__icon">
            <i class="${project.icon}"></i>
            <div class="gallery-card__overlay">
              <a href="home.html#contact" class="gallery-card__btn">View Details <i class="bi bi-arrow-right"></i></a>
            </div>
          </div>
          <div class="gallery-card__body">
            <span class="gallery-card__tag">${project.category}</span>
            <h5 class="gallery-card__title">${project.title}</h5>
          </div>
        </div>
      </div>
      `).join("")}
    </div>

  </div>
</section>
`;
}

/* ==========================================================================
   FAQ
   ========================================================================== */

function renderFAQ(service) {
  if (!service.faq || !service.faq.length) return "";
  return `
<section class="svc-section svc-faq" id="faq">
  <div class="container">

    <div class="section-heading" data-aos="fade-up">
      <span class="section-kicker">FAQ</span>
      <h2 class="svc-section__title">Frequently Asked Questions</h2>
    </div>

    <div class="faq-list">
      ${service.faq.map((item, index) => `
      <div class="faq-item" data-aos="fade-up" data-aos-delay="${index * 100}">
        <button class="faq-item__q" type="button" data-bs-toggle="collapse" data-bs-target="#faq${index}" aria-expanded="false">
          ${item.question}
          <i class="bi bi-plus-lg"></i>
        </button>
        <div id="faq${index}" class="collapse">
          <p class="faq-item__a">${item.answer}</p>
        </div>
      </div>
      `).join("")}
    </div>

  </div>
</section>
`;
}

/* ==========================================================================
   Contact CTA
   ========================================================================== */

function renderCTA() {
  return `
<section class="svc-cta" id="contact">
  <div class="container">
    <div class="svc-cta__box" data-aos="zoom-in">
      <div class="svc-cta__particles" data-cta-particles></div>
      <h2 class="svc-cta__title">Ready to Transform Your Workplace?</h2>
      <p class="svc-cta__desc">
        Let's discuss your collaboration, AV integration and workplace technology requirements.
      </p>
      <div class="svc-cta__actions">
        <a href="home.html#contact" class="btn-hero-primary">Talk to Our Experts</a>
        <a href="home.html#contact" class="btn-hero-ghost">Request Consultation</a>
      </div>
    </div>
  </div>
</section>
`;
}

/* ==========================================================================
   ASSEMBLE + RENDER PAGE
   ========================================================================== */

serviceRoot.innerHTML = [
  renderHero(currentService),
  renderSubNav(),
  renderOverview(currentService),
  renderBenefits(currentService),
  renderWhyChoose(currentService),
  renderProcess(currentService),
  renderTechnologies(currentService),
  renderIndustries(currentService),
  renderGallery(currentService),
  renderFAQ(currentService),
  renderCTA()
].join("");

/* Mark the active pill in the top quick-switch strip */
document.querySelectorAll("[data-service-link]").forEach(link => {
  if (link.getAttribute("data-service-link") === serviceId) {
    link.classList.add("active-service");
  }
});

/* ==========================================================================
   Sticky sub-nav: active link on scroll (scroll-spy) + sliding underline
   ========================================================================== */

function initSubNavScrollSpy() {
  const subnav = document.getElementById("svcSubnav");
  if (!subnav) return;

  const links = Array.from(subnav.querySelectorAll("[data-subnav-link]"));
  const indicator = subnav.querySelector("[data-subnav-indicator]");
  const sectionIds = links.map(l => l.getAttribute("data-subnav-link"));
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  function moveIndicatorTo(link) {
    if (!indicator || !link) return;
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
  }

  function setActive(id) {
    links.forEach(l => l.classList.toggle("active", l.getAttribute("data-subnav-link") === id));
    const activeLink = links.find(l => l.getAttribute("data-subnav-link") === id);
    moveIndicatorTo(activeLink);
  }

  // Initial underline position
  requestAnimationFrame(() => moveIndicatorTo(links[0]));
  window.addEventListener("resize", () => {
    const current = links.find(l => l.classList.contains("active"));
    moveIndicatorTo(current);
  });

  if (typeof ScrollTrigger !== "undefined") {
    sections.forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 35%",
        end: "bottom 35%",
        onEnter: () => setActive(section.id),
        onEnterBack: () => setActive(section.id)
      });
    });
  }

  links.forEach(link => {
    link.addEventListener("click", () => setActive(link.getAttribute("data-subnav-link")));
  });
}

initSubNavScrollSpy();

/* Kick off animations.js once the DOM for this service is in place */
if (typeof window.TT_initAnimations === "function") {
  window.TT_initAnimations(currentService);
}