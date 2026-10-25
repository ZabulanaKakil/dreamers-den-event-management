/**
 * Shared header, footer, breadcrumbs, WhatsApp FAB.
 * Place <div data-site-header></div> and <div data-site-footer></div> in each page.
 * Optional: <nav data-breadcrumbs data-crumb-current="Label"></nav>
 */
(function () {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const path = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function isActive(href) {
    const linkPath = (href || "").split("#")[0].split("/").pop().toLowerCase();
    if ((path === "" || path === "index.html") && linkPath === "index.html") return true;
    return linkPath === path;
  }

  function navLink(href, label) {
    const active = isActive(href) ? " is-active" : "";
    return `<li><a href="${href}" class="${active.trim()}">${label}</a></li>`;
  }

  function renderHeader() {
    const subtitle = config.siteSubtitle || "Event Management & Garments";
    return `
  <header class="site-header">
    <div class="container header-inner">
      <a href="index.html" class="logo-link">
        <img src="assets/images/logo.png" alt="Dreamers Den logo" class="logo-img" width="48" height="48">
        <span class="logo-text">
          <span class="logo-title">${escapeHtml(config.siteName || "Dreamers Den")}</span>
          <span class="logo-subtitle">${escapeHtml(subtitle)}</span>
        </span>
      </a>
      <div class="header-end">
        <nav id="site-nav" class="site-nav" aria-label="Main navigation">
          <ul>
            ${navLink("index.html", "Home")}
            ${navLink("about.html", "About Us")}
            ${navLink("journey.html", "Our Journey")}
            ${navLink("services.html", "Our Services")}
            ${navLink("contact.html", "Contact Us")}
          </ul>
          <div class="nav-drawer-divisions" aria-label="Service divisions">
            <span class="nav-drawer-label">Quick Jump — Divisions</span>
            <div class="nav-drawer-pills">
              <a href="services.html#event-management" class="nav-division-pill nav-division-pill--events">Event Management</a>
              <a href="services.html#garments-supply" class="nav-division-pill nav-division-pill--garments">Garments Supply</a>
            </div>
            <a href="contact.html" class="btn btn-primary nav-drawer-cta">Get a Quote</a>
          </div>
        </nav>
        <a href="contact.html" class="btn btn-primary header-cta">Get a Quote</a>
        <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Switch to light theme">
          <span class="theme-toggle-icon theme-toggle-icon--sun" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg></span>
          <span class="theme-toggle-icon theme-toggle-icon--moon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></span>
        </button>
        <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">&#9776;</button>
      </div>
    </div>
  </header>
  <div class="nav-backdrop" id="nav-backdrop" hidden></div>`;
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <strong>Dreamers Den — Event Management &amp; Garments</strong>
          <p data-tagline>${escapeHtml(config.tagline || "Quality in time")}</p>
          <p><a id="main-site-link" href="${escapeHtml(config.mainSiteUrl || "#")}">Back to Dreamers Den main site(Coming Soon)</a></p>
        </div>
        <div class="footer-links">
          <span class="footer-links-label">Explore</span>
          <a href="index.html">Home</a>
          <a href="about.html">About</a>
          <a href="journey.html">Journey</a>
          <a href="services.html#event-management">Event Management</a>
          <a href="services.html#garments-supply">Garments Supply</a>
          <a href="contact.html">Contact</a>
        </div>
        <div class="footer-links">
          <span class="footer-links-label">Policies</span>
          <a href="terms.html">Terms of Service</a>
          <a href="refund.html">Refund Policy</a>
          <a href="licenses.html">Licenses</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; <span id="year">${year}</span> Dreamers Den Event Management. All rights reserved.</p>
      </div>
    </div>
  </footer>`;
  }

  function renderBreadcrumbs() {
    const el = document.querySelector("[data-breadcrumbs]");
    if (!el) return;
    const current = el.getAttribute("data-crumb-current") || "Page";
    el.className = "breadcrumbs";
    el.setAttribute("aria-label", "Breadcrumb");
    el.innerHTML = `
      <ol class="breadcrumbs-list">
        <li><a href="index.html">Home</a></li>
        <li aria-current="page">${escapeHtml(current)}</li>
      </ol>`;
  }

  function renderWhatsAppFab() {
    const phone = config.contact?.phones?.[0]?.whatsapp;
    if (!phone) return;
    const existing = document.getElementById("whatsapp-fab");
    if (existing) return;
    const a = document.createElement("a");
    a.id = "whatsapp-fab";
    a.className = "whatsapp-fab";
    a.href = `https://wa.me/${phone}`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("aria-label", "Chat on WhatsApp");
    a.innerHTML = `<span aria-hidden="true">&#128172;</span><span class="whatsapp-fab-label">WhatsApp</span>`;
    document.body.appendChild(a);
  }

  function renderSkipLink() {
    if (document.querySelector(".skip-link")) return;
    const link = document.createElement("a");
    link.className = "skip-link";
    link.href = "#main-content";
    link.textContent = "Skip to main content";
    document.body.prepend(link);
    const main = document.querySelector("main");
    if (!main) return;
    if (!main.id) main.id = "main-content";
    if (!main.hasAttribute("tabindex")) main.tabIndex = -1;
  }

  function injectHeader() {
    document.querySelectorAll("[data-site-header]").forEach((slot) => {
      slot.outerHTML = renderHeader();
    });
  }

  function injectRest() {
    document.querySelectorAll("[data-site-footer]").forEach((slot) => {
      slot.outerHTML = renderFooter();
    });
    renderSkipLink();
    renderBreadcrumbs();
    renderWhatsAppFab();
  }

  injectHeader();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectRest);
  } else {
    injectRest();
  }
})();
