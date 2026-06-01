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

  function renderTimeline() {
    const list = document.getElementById("timeline");
    if (!list || !config.milestones?.length) return;

    list.innerHTML = config.milestones
      .map(
        (m) => `
      <li class="timeline-item reveal">
        <div class="timeline-year">${escapeHtml(m.year)}</div>
        <div class="timeline-content">
          <h3>${escapeHtml(m.title)}</h3>
          <p>${escapeHtml(m.text)}</p>
        </div>
      </li>`
      )
      .join("");
  }

  function renderContact() {
    const c = config.contact;
    if (!c) return;

    const emailEl = document.getElementById("contact-email");
    const phoneEl = document.getElementById("contact-phone");
    const addressEl = document.getElementById("contact-address");
    const hoursEl = document.getElementById("contact-hours");

    if (emailEl) {
      emailEl.href = `mailto:${c.email}`;
      emailEl.textContent = c.email;
    }
    if (phoneEl) {
      phoneEl.href = `tel:${c.phone.replace(/\s/g, "")}`;
      phoneEl.textContent = c.phone;
    }
    if (addressEl) addressEl.textContent = c.address;
    if (hoursEl) hoursEl.textContent = c.hours;

    const fb = document.getElementById("social-facebook");
    const ig = document.getElementById("social-instagram");
    if (fb && c.social?.facebook) fb.href = c.social.facebook;
    if (ig && c.social?.instagram) ig.href = c.social.instagram;
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
    initReveal();
    renderServices();
    initServiceReadMore(document.getElementById("services-grid"));
    renderPartners();
    renderTimeline();
    renderContact();
    initPartnerTeaser();
  });
})();
