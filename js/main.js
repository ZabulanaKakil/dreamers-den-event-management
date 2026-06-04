(function () {
  "use strict";

  const config = window.SITE_CONFIG || {};

  function applyConfig() {
    document.querySelectorAll("[data-form-url]").forEach((el) => {
      if (config.googleFormUrl) el.setAttribute("href", config.googleFormUrl);
    });

    const iframe = document.getElementById("google-form-embed");
    if (iframe && config.googleFormEmbedUrl) {
      iframe.src = config.googleFormEmbedUrl;
    }

    const mainLink = document.getElementById("main-site-link");
    if (mainLink && config.mainSiteUrl) mainLink.setAttribute("href", config.mainSiteUrl);

    const taglineEl = document.querySelector("[data-tagline]");
    if (taglineEl && config.tagline) taglineEl.textContent = config.tagline;
  }

  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function setActiveNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".site-nav a").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const linkPath = href.split("/").pop();
      const isHome = (path === "" || path === "index.html") && linkPath === "index.html";
      const isMatch = linkPath === path;
      link.classList.toggle("is-active", isHome || isMatch);
    });
  }

  function initReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }

  function renderServices() {
    const grid = document.getElementById("services-grid");
    if (!grid || grid.dataset.static === "true" || !config.services?.length) return;

    grid.innerHTML = config.services
      .map(
        (s) => `
      <article class="card service-card reveal" data-service-id="${s.id}">
        <div class="service-image">
          <img src="${s.image}" alt="${escapeHtml(s.name)}" width="400" height="250" loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
          <span class="service-icon-fallback" style="display:none" aria-hidden="true">${s.name.charAt(0)}</span>
        </div>
        <div class="service-body">
          <h3>${escapeHtml(s.name)}</h3>
          <p class="service-desc">${escapeHtml(s.description)}</p>
          <button type="button" class="read-more" aria-expanded="false">Read more</button>
        </div>
      </article>`
      )
      .join("");

    initServiceReadMore(grid);
  }

  function initServiceReadMore(root) {
    if (!root) return;
    root.querySelectorAll(".read-more").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".service-card");
        const expanded = card.classList.toggle("is-expanded");
        btn.setAttribute("aria-expanded", expanded);
        btn.textContent = expanded ? "Read less" : "Read more";
      });
    });
  }

  function renderPartners() {
    const grid = document.getElementById("partners-grid");
    if (!grid || !config.partners?.length) return;

    grid.innerHTML = config.partners
      .map(
        (p, i) => `
      <article class="card partner-card reveal">
        <div class="partner-logo" role="img" aria-label="${escapeHtml(p.name)} logo placeholder">
          ${p.image ? `<img src="${p.image}" alt="${escapeHtml(p.name)}">` : escapeHtml(p.name.charAt(0))}
        </div>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.category)}</p>
      </article>`
      )
      .join("");
  }

  function isLogoMedia(image) {
    return typeof image === "string" && /logo\.png$/i.test(image);
  }

  function milestoneText(m) {
    return m.text || config.milestoneTextDefault || "";
  }

  function renderTimelineMedia(m) {
    if (m.textOnly) return "";
    if (m.images?.length) {
      const cells = m.images
        .map((img) => {
          const src = typeof img === "string" ? img : img.src;
          const alt = typeof img === "string" ? m.imageAlt || m.title || "" : img.alt || m.title || "";
          return `<div class="timeline-media-cell"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" width="640" height="360"></div>`;
        })
        .join("");
      return `<div class="timeline-media timeline-media-grid">${cells}</div>`;
    }
    if (m.image) {
      const alt = m.imageAlt || m.title || "";
      const logoClass = isLogoMedia(m.image) ? " timeline-media--logo" : "";
      return `<div class="timeline-media${logoClass}"><img src="${escapeHtml(m.image)}" alt="${escapeHtml(alt)}" loading="lazy" width="640" height="360"></div>`;
    }
    const hint = m.imageHint || `assets/images/journey/${m.year}.jpg`;
    return `<div class="timeline-media timeline-media-placeholder" aria-hidden="true">Add photo: ${escapeHtml(hint)}</div>`;
  }

  function renderTimelineMilestone(m) {
    const launchClass = m.launch ? " timeline-item--launch" : "";
    const textClass = m.textOnly ? " timeline-item--text" : "";
    const media = renderTimelineMedia(m);
    return `
      <li class="timeline-item reveal${launchClass}${textClass}">
        <div class="timeline-year">${escapeHtml(m.year)}</div>
        <div class="timeline-content">
          ${media}
          <div class="timeline-body">
            <h3>${escapeHtml(m.title)}</h3>
            <p>${escapeHtml(milestoneText(m))}</p>
          </div>
        </div>
      </li>`;
  }

  function renderTimelineGap(m) {
    return `
      <li class="timeline-gap reveal">
        <div class="timeline-year timeline-year--gap">${escapeHtml(m.year)}</div>
        <div class="timeline-gap-content">
          <span class="timeline-gap-marker" aria-hidden="true">···</span>
          <h3>${escapeHtml(m.title)}</h3>
          <p>${escapeHtml(m.text)}</p>
        </div>
      </li>`;
  }

  function renderTimeline() {
    const list = document.getElementById("timeline");
    if (!list || !config.milestones?.length) return;

    list.innerHTML = config.milestones
      .map((m) => (m.type === "gap" ? renderTimelineGap(m) : renderTimelineMilestone(m)))
      .join("");
  }

  function isContactStatic(el) {
    return el?.closest("[data-contact-static]") != null;
  }

  function renderContact() {
    const c = config.contact;
    if (!c) return;

    const emailEl = document.getElementById("contact-email");
    const emailCard = document.querySelector('a.contact-action[href^="mailto:"]');
    const addressEl = document.getElementById("contact-address");
    const locationCard = document.querySelector('a.contact-action[href*="maps"]');
    const hoursEl = document.getElementById("contact-hours");

    if (emailEl && !isContactStatic(emailEl)) {
      emailEl.textContent = c.email;
      if (emailCard) emailCard.setAttribute("href", `mailto:${c.email}`);
    }
    if (addressEl && !isContactStatic(addressEl)) addressEl.textContent = c.address;
    if (locationCard && !isContactStatic(locationCard) && c.mapsUrl) {
      locationCard.setAttribute("href", c.mapsUrl);
    }
    if (hoursEl && !isContactStatic(hoursEl)) hoursEl.textContent = c.hours;

    const fb = document.getElementById("social-facebook");
    const ig = document.getElementById("social-instagram");
    if (fb && !isContactStatic(fb) && c.social?.facebook) fb.href = c.social.facebook;
    if (ig && !isContactStatic(ig) && c.social?.instagram) ig.href = c.social.instagram;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function initPartnerTeaser() {
    const el = document.getElementById("partner-teaser");
    if (!el || el.dataset.static === "true" || !config.partners?.length) return;
    el.innerHTML = config.partners
      .slice(0, 4)
      .map((p) => `<span>${escapeHtml(p.name)}</span>`)
      .join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    initNav();
    setActiveNav();
    renderServices();
    initServiceReadMore(document.getElementById("services-grid"));
    renderPartners();
    renderTimeline();
    renderContact();
    initPartnerTeaser();
    initReveal();
  });
})();
