(function () {
  "use strict";

  const config = window.SITE_CONFIG || {};
  let journeyFilter = "all";
  let lightboxItems = [];
  let lightboxIndex = 0;
  let lightboxReturn = null;

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

    document.querySelectorAll("[data-tagline]").forEach((el) => {
      if (config.tagline) el.textContent = config.tagline;
    });
  }

  function initTheme() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    const STORAGE_KEY = "dd-theme";
    const systemQuery = window.matchMedia("(prefers-color-scheme: light)");

    function getStoredTheme() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === "light" || stored === "dark" ? stored : null;
      } catch (e) {
        return null;
      }
    }

    function getSystemTheme() {
      return systemQuery.matches ? "light" : "dark";
    }

    function resolveTheme() {
      return getStoredTheme() || getSystemTheme();
    }

    function applyTheme(theme, options = {}) {
      const { persist = false, animate = false } = options;

      const run = () => {
        if (theme === "light") {
          document.documentElement.setAttribute("data-theme", "light");
        } else {
          document.documentElement.removeAttribute("data-theme");
        }
        if (persist) {
          try {
            localStorage.setItem(STORAGE_KEY, theme);
          } catch (e) {
            /* ignore */
          }
        }
        btn.setAttribute("aria-label", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
      };

      if (animate) {
        document.documentElement.classList.add("theme-transition");
        run();
        window.setTimeout(() => {
          document.documentElement.classList.remove("theme-transition");
        }, 550);
      } else {
        run();
      }
    }

    applyTheme(resolveTheme());

    btn.addEventListener("click", () => {
      const next = resolveTheme() === "light" ? "dark" : "light";
      applyTheme(next, { persist: true, animate: true });
    });

    systemQuery.addEventListener("change", (event) => {
      if (getStoredTheme()) return;
      applyTheme(event.matches ? "light" : "dark", { animate: true });
    });
  }

  function initNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    const backdrop = document.getElementById("nav-backdrop");
    if (!toggle || !nav) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-drawer-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      toggle.innerHTML = open ? "&#10005;" : "&#9776;";
      if (backdrop) {
        if (open) backdrop.removeAttribute("hidden");
        else backdrop.setAttribute("hidden", "");
      }
    }

    toggle.addEventListener("click", () => {
      setOpen(!nav.classList.contains("is-open"));
    });

    backdrop?.addEventListener("click", () => setOpen(false));

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) setOpen(false);
    });
  }

  function setActiveNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".site-nav > ul a").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const linkPath = href.split("#")[0].split("/").pop();
      const isHome = (path === "" || path === "index.html") && linkPath === "index.html";
      const isMatch = linkPath === path;
      link.classList.toggle("is-active", isHome || isMatch);
    });
  }

  function initReveal(scope = document) {
    const els = scope.querySelectorAll(".reveal:not(.is-visible)");
    if (!els.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-visible"));
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
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    els.forEach((el) => observer.observe(el));
  }

  function getServiceGroups() {
    if (config.serviceGroups?.length) return config.serviceGroups;
    if (config.services?.length) {
      return [{ id: "event-management", heading: "Event Management", services: config.services }];
    }
    return [];
  }

  function renderServiceCard(s, groupTheme, index) {
    const imageClass = s.imageFit === "contain" ? " is-contain" : "";
    const themeClass = groupTheme === "garments" ? " service-card--garments" : " service-card--events";
    const categoryBadge = s.category
      ? `<span class="service-card-category">${escapeHtml(s.category)}</span>`
      : "";
    const specsHtml =
      Array.isArray(s.specs) && s.specs.length
        ? `<ul class="service-card-specs" aria-label="Product specifications">
            ${s.specs.map((spec) => `<li>${escapeHtml(spec)}</li>`).join("")}
          </ul>`
        : "";

    return `
      <article class="card service-card${themeClass} tilt-card reveal" data-service-id="${escapeHtml(s.id)}" style="--card-index: ${index};">
        <div class="service-image${imageClass}">
          ${categoryBadge}
          <img src="${escapeHtml(s.image)}" alt="${escapeHtml(s.name)}" width="400" height="260" loading="lazy" decoding="async"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
          <span class="service-icon-fallback" style="display:none" aria-hidden="true">${escapeHtml(s.name.charAt(0))}</span>
        </div>
        <div class="service-body">
          <h3>${escapeHtml(s.name)}</h3>
          <p class="service-desc">${escapeHtml(s.description)}</p>
          ${specsHtml}
          <button type="button" class="read-more" aria-expanded="false">Read more</button>
        </div>
      </article>`;
  }

  function renderDivisionPanel(group, isActive) {
    const theme = group.theme || (group.id === "garments-supply" ? "garments" : "events");
    const eyebrow = group.eyebrow || "Specialized Division";
    const tagline = group.tagline || group.heading;
    const description = group.description || "";
    const highlightsHtml =
      Array.isArray(group.highlights) && group.highlights.length
        ? `<ul class="division-banner-pills" aria-label="Division highlights">
            ${group.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}
          </ul>`
        : "";

    return `
      <section
        class="service-experience-panel service-experience-panel--${escapeHtml(theme)}${isActive ? " is-active" : ""}"
        id="${escapeHtml(group.id)}"
        data-division-panel="${escapeHtml(group.id)}"
        role="tabpanel"
        aria-labelledby="tab-${escapeHtml(group.id)}"
        ${isActive ? "" : "hidden"}>
        <div class="division-stage-banner tilt-card reveal">
          <div class="division-stage-banner-content">
            <span class="division-stage-eyebrow">${escapeHtml(eyebrow)}</span>
            <h2 class="division-stage-title">${escapeHtml(group.heading)}</h2>
            <p class="division-stage-tagline">${escapeHtml(tagline)}</p>
            ${description ? `<p class="division-stage-desc">${escapeHtml(description)}</p>` : ""}
            ${highlightsHtml}
          </div>
          <div class="division-stage-visual" aria-hidden="true">
            <div class="division-stage-orb"></div>
            <span class="division-stage-watermark">${theme === "garments" ? "APPAREL" : "STAGE"}</span>
          </div>
        </div>
        ${theme === "garments" ? renderGarmentsCatalogue() : `<div class="services-grid services-grid--${escapeHtml(theme)}">${group.services.map((s, idx) => renderServiceCard(s, theme, idx)).join("")}</div>`}
      </section>`;
  }

  function renderGarmentsCatalogue() {
    const data = window.GARMENTS_DATA;
    if (!data) {
      return `<p class="garments-missing">Catalogue data is still loading.</p>`;
    }
    return `
      <div class="garments-catalogue">
        <nav class="catalogue-jump" aria-label="Catalogue sections">
          <a href="#tracksuit-studio">Tracksuit</a>
          <a href="#gift-combos">Gift combos</a>
          <a href="#all-souvenirs">All souvenirs</a>
        </nav>
        <section class="tracksuit-studio" id="tracksuit-studio" data-tracksuit-studio aria-label="Tracksuit colourway studio">
          <figure class="tracksuit-flat">
            <img class="tracksuit-flat-img is-active" alt="">
            <img class="tracksuit-flat-img" alt="">
            <figcaption class="tracksuit-flat-caption"></figcaption>
          </figure>
          <div class="tracksuit-copy">
            <h3 class="tracksuit-name"></h3>
            <p class="tracksuit-note"></p>
            <div class="swatch-rail" role="listbox" aria-label="Tracksuit colourways"></div>
            <a class="own-brand" href="contact.html">+ Get your own brand</a>
          </div>
        </section>
        <section class="combo-studio" id="gift-combos" data-combo-studio aria-labelledby="combo-studio-title">
          <div class="garments-block-head">
            <h3 id="combo-studio-title">Gift combos</h3>
            <p>The large photo is the current set. The next sets wait in the queue beside it. Choose one to bring it forward.</p>
          </div>
          <div class="combo-filters" role="tablist" aria-label="Filter gift combos"></div>
          <div class="combo-layout">
            <div class="combo-stage">
              <div class="combo-frame" tabindex="0" role="group" aria-label="Gift combo photo. Left and right arrow keys change the combo.">
                <img class="combo-img is-active" alt="">
                <img class="combo-img" alt="">
                <button type="button" class="photo-stage-nav photo-stage-nav--prev combo-prev" aria-label="Previous combo">&#10094;</button>
                <button type="button" class="photo-stage-nav photo-stage-nav--next combo-next" aria-label="Next combo">&#10095;</button>
                <span class="photo-stage-count combo-count"></span>
              </div>
              <div class="combo-copy">
                <h3 class="combo-name"></h3>
                <ul class="combo-pills"></ul>
                <div class="combo-box"></div>
              </div>
              <div class="combo-queue" aria-label="Upcoming combos"></div>
              <button type="button" class="btn btn-outline combo-show-all">Show all combos</button>
            </div>
          </div>
        </section>
        <section class="souvenir-catalog" id="all-souvenirs" data-souvenir-catalog aria-labelledby="all-souvenirs-title">
          <div class="garments-block-head">
            <h3 id="all-souvenirs-title">All souvenirs</h3>
            <p>Catalogue pieces and the extra gift types, shown without a brand mark. Specs stay on each card, with the finishes we can apply. Arrow keys move through the grid. Enter opens the details.</p>
          </div>
          <div class="souvenir-filters" role="tablist" aria-label="Filter souvenirs"></div>
          <p class="souvenir-count" aria-live="polite"></p>
          <div class="souvenir-grid" role="list"></div>
        </section>
      </div>`;
  }

  function renderServices() {
    const container = document.getElementById("services-sections");
    if (!container || container.dataset.static === "true") return;

    const groups = getServiceGroups();
    if (!groups.length) return;

    const switcher = document.getElementById("services-switcher");
    const rootSection = document.getElementById("services-experience-root");

    function resolveInitialDivision() {
      const rawHash = (window.location.hash || "").replace(/^#/, "").toLowerCase();
      if (rawHash === "suvenier" || rawHash === "garments" || rawHash === "garments-supply" || rawHash === "gift-combos" || rawHash === "all-souvenirs" || rawHash === "tracksuit-studio" || rawHash.startsWith("souvenir-")) {
        return "garments-supply";
      }
      const matched = groups.find((g) => g.id.toLowerCase() === rawHash);
      return matched ? matched.id : groups[0].id;
    }

    let activeId = resolveInitialDivision();

    if (switcher) {
      switcher.innerHTML = groups
        .map((group, idx) => {
          const isSelected = group.id === activeId;
          const theme = group.theme || (group.id === "garments-supply" ? "garments" : "events");
          const badge = group.badge || `${group.services.length} Services`;
          return `
            <button
              type="button"
              id="tab-${escapeHtml(group.id)}"
              class="services-switch-tab services-switch-tab--${escapeHtml(theme)}${isSelected ? " is-active" : ""}"
              role="tab"
              tabindex="${isSelected ? "0" : "-1"}"
              aria-selected="${isSelected ? "true" : "false"}"
              aria-controls="${escapeHtml(group.id)}"
              data-division-target="${escapeHtml(group.id)}">
              <span class="services-switch-num">0${idx + 1}</span>
              <span class="services-switch-text">
                <strong class="services-switch-heading">${escapeHtml(group.heading)}</strong>
                <span class="services-switch-meta">${escapeHtml(badge)}</span>
              </span>
            </button>`;
        })
        .join("");
    }

    container.innerHTML = groups
      .map((group) => renderDivisionPanel(group, group.id === activeId))
      .join("");

    if (rootSection) rootSection.setAttribute("data-active-division", activeId);

    function activateDivision(targetId, { updateHash = false, scroll = false } = {}) {
      const valid = groups.find((g) => g.id === targetId);
      if (!valid) return;
      activeId = valid.id;

      if (rootSection) rootSection.setAttribute("data-active-division", activeId);

      if (switcher) {
        switcher.querySelectorAll(".services-switch-tab").forEach((btn) => {
          const match = btn.dataset.divisionTarget === activeId;
          btn.classList.toggle("is-active", match);
          btn.setAttribute("aria-selected", match ? "true" : "false");
          btn.tabIndex = match ? 0 : -1;
        });
      }

      container.querySelectorAll(".service-experience-panel").forEach((panel) => {
        const match = panel.dataset.divisionPanel === activeId;
        panel.classList.toggle("is-active", match);
        if (match) {
          panel.removeAttribute("hidden");
          initReveal(panel);
          init3DTilt(panel);
          if (scroll) panel.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          panel.setAttribute("hidden", "");
        }
      });

      if (updateHash && history.replaceState) {
        history.replaceState(null, "", `#${activeId}`);
      }
    }

    switcher?.querySelectorAll(".services-switch-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        activateDivision(btn.dataset.divisionTarget, { updateHash: true });
      });
    });

    switcher?.addEventListener("keydown", (e) => {
      const tabs = [...(switcher.querySelectorAll(".services-switch-tab") || [])];
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      let next = i;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      else return;
      e.preventDefault();
      tabs[next].focus();
      activateDivision(tabs[next].dataset.divisionTarget, { updateHash: true });
    });

    window.addEventListener("hashchange", () => {
      activateDivision(resolveInitialDivision(), { updateHash: false, scroll: true });
    });

    const pinHash = window.location.hash === "#gift-combos" || window.location.hash === "#all-souvenirs" || window.location.hash === "#tracksuit-studio" || window.location.hash.startsWith("#souvenir-");
    if (window.location.hash) {
      activateDivision(activeId, { scroll: !pinHash });
    }

    initServiceReadMore(container);
    initGarmentsStudio(container);
    initReveal(container);
    init3DTilt(container);
    if (pinHash) {
      const target = document.querySelector(window.location.hash);
      if (target) target.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }

  function bindRovingTabs(row, selector) {
    if (!row) return;
    row.addEventListener("keydown", (event) => {
      const tabs = [...row.querySelectorAll(selector)];
      const current = tabs.indexOf(document.activeElement);
      if (current < 0) return;
      let next = current;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % tabs.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    });
  }

  function initGarmentsStudio(container) {
    initCatalogueJump(container.querySelector(".catalogue-jump"));
    initTracksuitFlats(container.querySelector("[data-tracksuit-studio]"));
    initComboRotator(container.querySelector("[data-combo-studio]"));
    initSouvenirCatalog(container.querySelector("[data-souvenir-catalog]"));
  }

  function initCatalogueJump(nav) {
    if (!nav) return;
    const links = [...nav.querySelectorAll("a")];
    links.forEach((link, index) => {
      link.tabIndex = index === 0 ? 0 : -1;
    });

    function sectionFor(link) {
      return document.getElementById((link.getAttribute("href") || "").replace(/^#/, ""));
    }

    function sync() {
      const marker = 150;
      let current = links[0];
      links.forEach((link) => {
        const section = sectionFor(link);
        if (section && section.getBoundingClientRect().top <= marker) current = link;
      });
      links.forEach((link) => {
        const on = link === current;
        link.classList.toggle("is-active", on);
        if (on) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        const section = sectionFor(link);
        if (!section) return;
        event.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        section.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        if (history.replaceState) history.replaceState(null, "", link.getAttribute("href"));
        sync();
      });
    });

    nav.addEventListener("keydown", (event) => {
      const current = links.indexOf(document.activeElement);
      if (current < 0) return;
      let next = current;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % links.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + links.length) % links.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = links.length - 1;
      else return;
      event.preventDefault();
      links.forEach((link, index) => {
        link.tabIndex = index === next ? 0 : -1;
      });
      links[next].focus();
    });

    window.addEventListener("scroll", sync, { passive: true });
    sync();
  }

  function initTracksuitFlats(root) {
    const data = window.GARMENTS_DATA;
    if (!root || !data?.tracksuits?.length) return;
    const ways = data.tracksuits;
    const nameEl = root.querySelector(".tracksuit-name");
    const noteEl = root.querySelector(".tracksuit-note");
    const rail = root.querySelector(".swatch-rail");
    const caption = root.querySelector(".tracksuit-flat-caption");
    const brandLink = root.querySelector(".own-brand");
    if (brandLink && config.googleFormUrl) {
      brandLink.href = config.googleFormUrl;
      brandLink.target = "_blank";
      brandLink.rel = "noopener noreferrer";
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0;

    rail.innerHTML = ways
      .map(
        (way, i) => `
        <button type="button" class="swatch${i === 0 ? " is-active" : ""}" role="option" aria-selected="${i === 0 ? "true" : "false"}" tabindex="${i === 0 ? "0" : "-1"}" data-index="${i}">
          <span class="swatch-chip" style="--swatch-a:${way.colors.body};--swatch-b:${way.colors.chest};--swatch-c:${way.colors.stripe}"></span>
          <span class="swatch-label">${escapeHtml(way.name)}</span>
        </button>`
      )
      .join("");

    function crossfade(way) {
      const imgs = [...root.querySelectorAll(".tracksuit-flat-img")];
      const current = imgs.find((img) => img.classList.contains("is-active")) || imgs[0];
      const next = imgs.find((img) => img !== current) || imgs[0];
      const alt = `${way.name} tracksuit`;
      if (!current.getAttribute("src") || current.getAttribute("src") === way.flat) {
        current.src = way.flat;
        current.alt = alt;
        current.classList.add("is-active");
        next.classList.remove("is-active");
        if (caption) caption.textContent = way.name;
        return;
      }
      next.alt = alt;
      const reveal = () => {
        next.classList.add("is-active");
        current.classList.remove("is-active");
        if (caption) caption.textContent = way.name;
      };
      if (reduce) {
        next.src = way.flat;
        reveal();
        return;
      }
      next.onload = reveal;
      next.src = way.flat;
      if (next.complete) reveal();
    }

    function select(nextIndex) {
      index = (nextIndex + ways.length) % ways.length;
      const way = ways[index];
      if (nameEl) nameEl.textContent = way.name;
      if (noteEl) noteEl.textContent = way.note;
      rail.querySelectorAll(".swatch").forEach((btn, i) => {
        const on = i === index;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-selected", on ? "true" : "false");
        btn.tabIndex = on ? 0 : -1;
      });
      crossfade(way);
    }

    rail.querySelectorAll(".swatch").forEach((btn) => {
      btn.addEventListener("click", () => select(Number(btn.dataset.index) || 0));
    });
    rail.addEventListener("keydown", (event) => {
      const options = [...rail.querySelectorAll(".swatch")];
      const current = options.indexOf(document.activeElement);
      if (current < 0) return;
      let next = current;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % options.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current - 1 + options.length) % options.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = options.length - 1;
      else return;
      event.preventDefault();
      select(next);
      options[next].focus();
    });
    select(0);
  }

  function initComboRotator(root) {
    const data = window.GARMENTS_DATA;
    if (!root || !data?.combos?.length) return;
    const combos = data.combos.map((combo, i) => ({
      ...combo,
      image: `assets/images/garments/souvenirs/combo-${String(i + 1).padStart(2, "0")}.jpg`,
    }));
    const filters = [
      { id: "all", label: "All" },
      { id: "drinkware", label: "Drinkware" },
      { id: "tech", label: "Power and tech" },
      { id: "leather", label: "Leather" },
      { id: "hamper", label: "Full hamper" },
    ];
    const filterRow = root.querySelector(".combo-filters");
    const imgs = [...root.querySelectorAll(".combo-img")];
    const nameEl = root.querySelector(".combo-name");
    const pillsEl = root.querySelector(".combo-pills");
    const boxEl = root.querySelector(".combo-box");
    const countEl = root.querySelector(".combo-count");
    const queueEl = root.querySelector(".combo-queue");
    const showAllBtn = root.querySelector(".combo-show-all");
    const wideQueue = window.matchMedia("(min-width: 1200px)");
    const wideScreen = window.matchMedia("(min-width: 1100px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let filter = "all";
    let index = 0;
    let timer = null;
    let paused = false;
    let onScreen = false;

    filterRow.innerHTML = filters
      .map(
        (item, i) =>
          `<button type="button" class="combo-filter${i === 0 ? " is-active" : ""}" role="tab" tabindex="${i === 0 ? "0" : "-1"}" aria-selected="${i === 0 ? "true" : "false"}" data-filter="${item.id}">${item.label}</button>`
      )
      .join("");

    function visible() {
      return filter === "all" ? combos : combos.filter((combo) => combo.category === filter);
    }

    function ensure(img, src, alt) {
      if (img.getAttribute("src") !== src) img.src = src;
      img.alt = alt;
    }

    function paint(list) {
      const combo = list[index];
      if (!combo) return;
      const current = imgs.find((img) => img.classList.contains("is-active")) || imgs[0];
      const next = imgs.find((img) => img !== current) || imgs[0];
      const alt = `${combo.name} gift combo`;
      if (reduce || !current.getAttribute("src")) {
        ensure(current, combo.image, alt);
        current.classList.add("is-active");
        next.classList.remove("is-active");
      } else if (current.getAttribute("src") !== combo.image) {
        ensure(next, combo.image, alt);
        next.classList.add("is-active");
        current.classList.remove("is-active");
      }
      const upcoming = list[(index + 1) % list.length];
      if (upcoming && upcoming !== combo) {
        const idle = imgs.find((img) => !img.classList.contains("is-active"));
        if (idle && idle.getAttribute("src") !== upcoming.image) {
          const preload = new Image();
          preload.src = upcoming.image;
        }
      }
      if (nameEl) nameEl.textContent = combo.name;
      if (pillsEl) pillsEl.innerHTML = combo.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
      if (boxEl) {
        boxEl.textContent = `${combo.name} packs ${combo.items.join(", ")}.`;
      }
      if (countEl) countEl.textContent = `${index + 1} / ${list.length}`;
      paintQueue(list);
    }

    function paintQueue(list) {
      if (!queueEl) return;
      const count = Math.min(wideQueue.matches ? 5 : 3, Math.max(0, list.length - 1));
      queueEl.innerHTML = Array.from({ length: count }, (_, offset) => {
        const combo = list[(index + 1 + offset) % list.length];
        return `<button type="button" class="combo-queue-item" data-offset="${offset + 1}" tabindex="${offset === 0 ? "0" : "-1"}" aria-label="Show ${escapeHtml(combo.name)}">
          <img src="${escapeHtml(combo.image)}" alt="" width="240" height="240" decoding="async">
        </button>`;
      }).join("");
    }

    function show(nextIndex) {
      const list = visible();
      if (!list.length) return;
      index = (nextIndex + list.length) % list.length;
      paint(list);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      if (reduce || paused || !onScreen || timer || visible().length < 2) return;
      timer = setInterval(() => show(index + 1), 5000);
    }

    filterRow.querySelectorAll(".combo-filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        filter = btn.dataset.filter;
        filterRow.querySelectorAll(".combo-filter").forEach((el) => {
          const on = el === btn;
          el.classList.toggle("is-active", on);
          el.setAttribute("aria-selected", on ? "true" : "false");
          el.tabIndex = on ? 0 : -1;
        });
        index = 0;
        show(0);
      });
    });
    bindRovingTabs(filterRow, ".combo-filter");
    root.addEventListener("keydown", (event) => {
      if (event.target.closest(".combo-filters, .combo-queue, .combo-show-all")) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        show(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        show(index + 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        show(0);
      } else if (event.key === "End") {
        event.preventDefault();
        show(visible().length - 1);
      }
    });
    root.addEventListener("focusin", () => {
      paused = true;
      stop();
    });
    root.addEventListener("focusout", (event) => {
      if (root.contains(event.relatedTarget)) return;
      paused = false;
      start();
    });
    root.querySelector(".combo-prev")?.addEventListener("click", () => show(index - 1));
    root.querySelector(".combo-next")?.addEventListener("click", () => show(index + 1));
    queueEl?.addEventListener("click", (event) => {
      const btn = event.target.closest(".combo-queue-item");
      if (!btn) return;
      show(index + Number(btn.dataset.offset || 1));
      queueEl.querySelector(".combo-queue-item")?.focus();
    });
    queueEl?.addEventListener("keydown", (event) => {
      const buttons = [...queueEl.querySelectorAll(".combo-queue-item")];
      const current = buttons.indexOf(document.activeElement);
      if (current < 0) return;
      let next = current;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = Math.min(buttons.length - 1, current + 1);
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = Math.max(0, current - 1);
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = buttons.length - 1;
      else return;
      event.preventDefault();
      event.stopPropagation();
      buttons.forEach((btn, itemIndex) => {
        btn.tabIndex = itemIndex === next ? 0 : -1;
      });
      buttons[next].focus();
    });

    const flood = document.createElement("div");
    flood.className = "combo-flood";
    flood.hidden = true;
    flood.innerHTML = `
      <div class="combo-flood-backdrop" data-combo-flood-close></div>
      <div class="combo-flood-panel" role="dialog" aria-modal="true" aria-labelledby="combo-flood-title">
        <div class="combo-flood-bar">
          <h3 id="combo-flood-title">All gift combos</h3>
          <button type="button" class="combo-flood-close" data-combo-flood-close aria-label="Close all combos">&times;</button>
        </div>
        <div class="combo-flood-grid"></div>
      </div>`;
    document.body.appendChild(flood);
    const floodGrid = flood.querySelector(".combo-flood-grid");
    const floodPanel = flood.querySelector(".combo-flood-panel");
    let floodReturn = null;

    function setFloodInert(on) {
      document.querySelectorAll("header, main, footer, .whatsapp-fab, .skip-link").forEach((el) => {
        if (on) el.setAttribute("inert", "");
        else el.removeAttribute("inert");
      });
    }

    function closeFlood() {
      if (flood.hidden) return;
      flood.hidden = true;
      document.body.classList.remove("combo-flood-open");
      setFloodInert(false);
      if (floodReturn && document.contains(floodReturn)) floodReturn.focus();
      floodReturn = null;
      paused = false;
      start();
    }

    function openFlood() {
      if (!wideScreen.matches) return;
      const list = visible();
      floodGrid.innerHTML = list
        .map(
          (combo, itemIndex) => `
          <button type="button" class="combo-flood-item${itemIndex === index ? " is-current" : ""}" data-index="${itemIndex}">
            <img src="${escapeHtml(combo.image)}" alt="" width="320" height="320" decoding="async">
            <span>${escapeHtml(combo.name)}</span>
          </button>`
        )
        .join("");
      floodReturn = document.activeElement;
      flood.hidden = false;
      document.body.classList.add("combo-flood-open");
      setFloodInert(true);
      paused = true;
      stop();
      (floodGrid.querySelector(".is-current") || flood.querySelector(".combo-flood-close"))?.focus();
    }

    showAllBtn?.addEventListener("click", openFlood);
    flood.querySelectorAll("[data-combo-flood-close]").forEach((el) => {
      el.addEventListener("click", closeFlood);
    });
    floodGrid.addEventListener("click", (event) => {
      const btn = event.target.closest(".combo-flood-item");
      if (!btn) return;
      show(Number(btn.dataset.index) || 0);
      closeFlood();
    });
    flood.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeFlood();
        return;
      }
      const buttons = [...flood.querySelectorAll("button")];
      if (event.key === "Tab") {
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (!buttons.length) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }
      const items = [...floodGrid.querySelectorAll(".combo-flood-item")];
      const current = items.indexOf(document.activeElement);
      if (current < 0) return;
      const cols = (() => {
        if (items.length < 2) return 1;
        const top = items[0].getBoundingClientRect().top;
        let count = 1;
        for (let i = 1; i < items.length; i += 1) {
          if (Math.abs(items[i].getBoundingClientRect().top - top) > 8) break;
          count += 1;
        }
        return count;
      })();
      let next = current;
      if (event.key === "ArrowRight") next = Math.min(items.length - 1, current + 1);
      else if (event.key === "ArrowLeft") next = Math.max(0, current - 1);
      else if (event.key === "ArrowDown") next = Math.min(items.length - 1, current + cols);
      else if (event.key === "ArrowUp") next = Math.max(0, current - cols);
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = items.length - 1;
      else return;
      event.preventDefault();
      items[next].focus();
    });
    floodPanel.addEventListener("click", (event) => event.stopPropagation());
    wideQueue.addEventListener("change", () => show(index));

    let touchX = 0;
    const frame = root.querySelector(".combo-frame");
    frame?.addEventListener("touchstart", (event) => {
      touchX = event.changedTouches[0].clientX;
    }, { passive: true });
    frame?.addEventListener("touchend", (event) => {
      const dx = event.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) < 40) return;
      show(dx < 0 ? index + 1 : index - 1);
    }, { passive: true });
    root.addEventListener("mouseenter", () => {
      paused = true;
      stop();
    });
    root.addEventListener("mouseleave", () => {
      paused = false;
      start();
    });

    const observer = new IntersectionObserver((entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      if (onScreen) start();
      else stop();
    }, { threshold: 0.35 });
    observer.observe(root);
    show(0);
  }

  function initSouvenirCatalog(root) {
    const data = window.GARMENTS_DATA;
    if (!root || !data?.souvenirs?.length) return;
    const items = data.souvenirs;
    const filters = [
      { id: "all", label: "All" },
      { id: "drinkware", label: "Drinkware" },
      { id: "tech", label: "Power and tech" },
      { id: "leather", label: "Leather" },
      { id: "desk", label: "Desk" },
      { id: "apparel", label: "Apparel" },
      { id: "gift", label: "Gift sets" },
    ];
    const categoryLabels = Object.fromEntries(filters.map((item) => [item.id, item.label]));
    const filterRow = root.querySelector(".souvenir-filters");
    const grid = root.querySelector(".souvenir-grid");
    const countEl = root.querySelector(".souvenir-count");
    let filter = "all";
    let dialogReturn = null;

    function pills(list, className) {
      return `<ul class="${className}">${(list || []).map((label) => `<li>${escapeHtml(label)}</li>`).join("")}</ul>`;
    }

    filterRow.innerHTML = filters
      .map(
        (item, i) =>
          `<button type="button" class="souvenir-filter${i === 0 ? " is-active" : ""}" role="tab" tabindex="${i === 0 ? "0" : "-1"}" aria-selected="${i === 0 ? "true" : "false"}" data-filter="${item.id}">${item.label}</button>`
      )
      .join("");

    grid.innerHTML = items
      .map(
        (item, i) => `
        <button type="button" class="souvenir-card" id="souvenir-${escapeHtml(item.id)}" role="listitem" data-id="${escapeHtml(item.id)}" data-category="${escapeHtml(item.category)}" tabindex="${i === 0 ? "0" : "-1"}">
          <span class="souvenir-card-photo">
            <img src="${escapeHtml(item.image)}" alt="" width="800" height="800" decoding="async">
          </span>
          <span class="souvenir-card-body">
            <span class="souvenir-card-title">${escapeHtml(item.name)}</span>
            ${pills(item.specs, "feature-pills")}
            <span class="souvenir-card-summary">${escapeHtml(item.summary)}</span>
            ${pills(item.labels, "souvenir-labels")}
          </span>
        </button>`
      )
      .join("");

    const dialog = document.createElement("div");
    dialog.className = "souvenir-dialog";
    dialog.id = "souvenir-dialog";
    dialog.hidden = true;
    dialog.innerHTML = `
      <div class="souvenir-dialog-backdrop" data-souvenir-close></div>
      <div class="souvenir-dialog-panel" role="dialog" aria-modal="true" aria-labelledby="souvenir-dialog-title">
        <button type="button" class="souvenir-dialog-close" data-souvenir-close aria-label="Close souvenir details">&times;</button>
        <img class="souvenir-dialog-image" alt="">
        <div class="souvenir-dialog-copy">
          <p class="souvenir-dialog-kicker"></p>
          <h3 id="souvenir-dialog-title"></h3>
          <ul class="feature-pills souvenir-dialog-specs"></ul>
          <p class="souvenir-dialog-summary"></p>
          <ul class="souvenir-labels"></ul>
          <a class="btn btn-primary" href="contact.html">Ask about this souvenir</a>
        </div>
      </div>`;
    document.body.appendChild(dialog);
    const panel = dialog.querySelector(".souvenir-dialog-panel");

    function visibleCards() {
      return [...grid.querySelectorAll(".souvenir-card")].filter((card) => !card.hidden);
    }

    function columnCount() {
      const cards = visibleCards();
      if (cards.length < 2) return 1;
      const top = cards[0].getBoundingClientRect().top;
      let count = 1;
      for (let i = 1; i < cards.length; i += 1) {
        if (Math.abs(cards[i].getBoundingClientRect().top - top) > 8) break;
        count += 1;
      }
      return count;
    }

    function focusCard(card, { scroll = true } = {}) {
      if (!card) return;
      visibleCards().forEach((el) => {
        el.tabIndex = el === card ? 0 : -1;
      });
      card.focus({ preventScroll: true });
      if (scroll) card.scrollIntoView({ block: "nearest", inline: "nearest" });
    }

    function applyFilter(nextFilter) {
      filter = nextFilter;
      filterRow.querySelectorAll(".souvenir-filter").forEach((el) => {
        const on = el.dataset.filter === filter;
        el.classList.toggle("is-active", on);
        el.setAttribute("aria-selected", on ? "true" : "false");
        el.tabIndex = on ? 0 : -1;
      });
      grid.querySelectorAll(".souvenir-card").forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.category !== filter;
        card.tabIndex = -1;
      });
      const cards = visibleCards();
      if (cards[0]) cards[0].tabIndex = 0;
      if (countEl) countEl.textContent = `Showing ${cards.length} of ${items.length} souvenirs`;
      if (grid.contains(document.activeElement) && document.activeElement.hidden) {
        focusCard(cards[0]);
      }
    }

    function setPageInert(on) {
      document.querySelectorAll("header, main, footer, .whatsapp-fab, .skip-link").forEach((el) => {
        if (on) el.setAttribute("inert", "");
        else el.removeAttribute("inert");
      });
    }

    function closeDialog() {
      if (dialog.hidden) return;
      dialog.hidden = true;
      document.body.classList.remove("souvenir-dialog-open");
      setPageInert(false);
      if (dialogReturn && document.contains(dialogReturn)) dialogReturn.focus();
      dialogReturn = null;
    }

    function openDialog(id) {
      const item = items.find((entry) => entry.id === id);
      if (!item) return;
      dialogReturn = document.activeElement;
      dialog.querySelector(".souvenir-dialog-image").src = item.image;
      dialog.querySelector(".souvenir-dialog-image").alt = "";
      dialog.querySelector(".souvenir-dialog-kicker").textContent = categoryLabels[item.category] || "Souvenir";
      dialog.querySelector("#souvenir-dialog-title").textContent = item.name;
      dialog.querySelector(".souvenir-dialog-specs").innerHTML = (item.specs || [])
        .map((label) => `<li>${escapeHtml(label)}</li>`)
        .join("");
      dialog.querySelector(".souvenir-dialog-summary").textContent = item.summary;
      dialog.querySelector(".souvenir-dialog-copy .souvenir-labels").innerHTML = item.labels
        .map((label) => `<li>${escapeHtml(label)}</li>`)
        .join("");
      dialog.hidden = false;
      document.body.classList.add("souvenir-dialog-open");
      setPageInert(true);
      dialog.querySelector(".souvenir-dialog-close").focus();
    }

    filterRow.querySelectorAll(".souvenir-filter").forEach((btn) => {
      btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
    });
    bindRovingTabs(filterRow, ".souvenir-filter");
    grid.querySelectorAll(".souvenir-card").forEach((card) => {
      card.addEventListener("click", () => openDialog(card.dataset.id));
    });
    grid.addEventListener("keydown", (event) => {
      const cards = visibleCards();
      const current = cards.indexOf(document.activeElement);
      if (current < 0) return;
      const cols = columnCount();
      let next = current;
      if (event.key === "ArrowRight") next = Math.min(cards.length - 1, current + 1);
      else if (event.key === "ArrowLeft") next = Math.max(0, current - 1);
      else if (event.key === "ArrowDown") next = Math.min(cards.length - 1, current + cols);
      else if (event.key === "ArrowUp") next = Math.max(0, current - cols);
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = cards.length - 1;
      else return;
      if (next === current) return;
      event.preventDefault();
      focusCard(cards[next]);
    });
    dialog.querySelectorAll("[data-souvenir-close]").forEach((el) => {
      el.addEventListener("click", closeDialog);
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...panel.querySelectorAll("button, a[href]")].filter((el) => !el.disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    applyFilter("all");
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

  function isLogoMedia(image) {
    return typeof image === "string" && /logo\.png$/i.test(image);
  }

  function milestoneText(m) {
    return m.text || config.milestoneTextDefault || "";
  }

  function collectLightboxFromMilestone(m) {
    const items = [];
    if (m.images?.length) {
      m.images.forEach((img) => {
        const src = typeof img === "string" ? img : img.src;
        const alt = typeof img === "string" ? m.title || "" : img.alt || m.title || "";
        items.push({ src, alt, title: m.title, year: m.year });
      });
    } else if (m.image && !isLogoMedia(m.image)) {
      items.push({ src: m.image, alt: m.imageAlt || m.title || "", title: m.title, year: m.year });
    }
    return items;
  }

  function milestonePhotos(m) {
    if (m.images?.length) {
      return m.images.map((img) => {
        if (typeof img === "string") return { src: img, alt: m.imageAlt || m.title || "" };
        return { src: img.src, alt: img.alt || m.imageAlt || m.title || "" };
      });
    }
    if (m.image) return [{ src: m.image, alt: m.imageAlt || m.title || "" }];
    return [];
  }

  function renderPhotoStage(photos, lightboxOffset) {
    const total = photos.length;
    const slides = photos
      .map((img, i) => {
        const srcAttr = i < 2 ? `src="${escapeHtml(img.src)}"` : `data-src="${escapeHtml(img.src)}"`;
        return `<img class="photo-stage-img${i === 0 ? " is-active" : ""}" ${srcAttr} alt="${escapeHtml(img.alt)}" data-photo-index="${i}" decoding="async" width="960" height="540">`;
      })
      .join("");
    const dots = photos
      .map(
        (img, i) =>
          `<button type="button" class="photo-stage-dot${i === 0 ? " is-active" : ""}" data-index="${i}" role="tab" aria-selected="${i === 0 ? "true" : "false"}" aria-label="Photo ${i + 1} of ${total}: ${escapeHtml(img.alt)}"></button>`
      )
      .join("");

    return `
      <div class="photo-stage" tabindex="0" data-count="${total}" data-lightbox-offset="${lightboxOffset}">
        <div class="photo-stage-frame">${slides}</div>
        <button type="button" class="photo-stage-open lightbox-trigger" data-lightbox-index="${lightboxOffset}" aria-label="Open photo: ${escapeHtml(photos[0].alt)}"></button>
        <button type="button" class="photo-stage-nav photo-stage-nav--prev" aria-label="Previous photo">&#10094;</button>
        <button type="button" class="photo-stage-nav photo-stage-nav--next" aria-label="Next photo">&#10095;</button>
        <div class="photo-stage-ui">
          <div class="photo-stage-dots" role="tablist" aria-label="Event photos">${dots}</div>
          <span class="photo-stage-count">1 / ${total}</span>
        </div>
      </div>`;
  }

  function renderTimelineMedia(m, lightboxOffset) {
    if (m.textOnly) return "";
    const photos = milestonePhotos(m);
    if (photos.length > 1) return renderPhotoStage(photos, lightboxOffset);
    if (m.image || photos.length === 1) {
      const photo = photos[0];
      if (!photo) return "";
      const alt = photo.alt;
      const logoClass = isLogoMedia(photo.src) ? " timeline-media--logo" : "";
      if (isLogoMedia(photo.src)) {
        return `<div class="timeline-media${logoClass}"><img src="${escapeHtml(photo.src)}" alt="${escapeHtml(alt)}" loading="lazy" width="640" height="360"></div>`;
      }
      return `<button type="button" class="timeline-media lightbox-trigger" data-lightbox-index="${lightboxOffset}" aria-label="Open photo: ${escapeHtml(alt)}">
        <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" width="640" height="360">
      </button>`;
    }
    const hint = m.imageHint || `assets/images/journey/${m.year}.jpg`;
    return `<div class="timeline-media timeline-media-placeholder" aria-hidden="true">Add photo: ${escapeHtml(hint)}</div>`;
  }

  function renderChapterEvent(m, lightboxOffset) {
    const launchClass = m.launch ? " timeline-event--launch" : "";
    const textClass = m.textOnly ? " timeline-event--text" : " timeline-event--photo tilt-card";
    const media = renderTimelineMedia(m, lightboxOffset);
    const badgeLabel = m.launch ? "Inaugural Milestone" : m.textOnly ? "Completed Production" : "Featured Showcase";
    const cat = m.category ? `<span class="timeline-event-category">${escapeHtml(m.category)}</span>` : "";

    return `
      <article class="timeline-event reveal${launchClass}${textClass}" data-category="${escapeHtml(m.category || "other")}">
        <span class="timeline-event-node" aria-hidden="true"></span>
        <div class="timeline-content">
          ${media}
          <div class="timeline-body">
            <div class="timeline-event-meta">
              <span class="timeline-event-tag">${escapeHtml(badgeLabel)}</span>
              ${cat}
            </div>
            <h3>${escapeHtml(m.title)}</h3>
            ${m.client ? `<p class="timeline-client">${escapeHtml(m.client)}</p>` : ""}
            <p>${escapeHtml(milestoneText(m))}</p>
          </div>
        </div>
      </article>`;
  }

  function renderTimelineGapBlock(m) {
    return `
      <div class="timeline-gap-bridge reveal" role="note" aria-label="${escapeHtml(m.year)} — ${escapeHtml(m.title)}">
        <div class="timeline-gap-badge">${escapeHtml(m.year)}</div>
        <div class="timeline-gap-content">
          <span class="timeline-gap-marker" aria-hidden="true">···</span>
          <h3>${escapeHtml(m.title)}</h3>
          <p>${escapeHtml(m.text)}</p>
        </div>
      </div>`;
  }

  function groupMilestonesByChapter(milestones) {
    const blocks = [];
    let currentChapter = null;

    milestones.forEach((m) => {
      if (m.type === "gap") {
        currentChapter = null;
        blocks.push({ type: "gap", gap: m });
        return;
      }

      if (!currentChapter || currentChapter.year !== m.year) {
        currentChapter = {
          type: "chapter",
          year: m.year,
          id: `year-${String(m.year).replace(/[^a-zA-Z0-9_-]/g, "")}`,
          events: [],
        };
        blocks.push(currentChapter);
      }
      currentChapter.events.push(m);
    });

    return blocks;
  }

  function filteredMilestones() {
    const all = config.milestones || [];
    if (journeyFilter === "all") return all;
    return all.filter((m) => m.type === "gap" || m.category === journeyFilter);
  }

  function renderJourneyFilters(container) {
    const existing = document.getElementById("journey-filters");
    if (!existing) return;

    const cats = new Set();
    (config.milestones || []).forEach((m) => {
      if (m.type === "milestone" && m.category) cats.add(m.category);
    });
    const labels = {
      all: "All",
      inauguration: "Inaugurations",
      reunion: "Reunions",
      conference: "Conferences",
      concert: "Concerts",
      ceremony: "Ceremonies",
      exhibition: "Exhibitions",
    };
    const order = ["all", "inauguration", "reunion", "conference", "concert", "ceremony", "exhibition"];
    const buttons = order
      .filter((id) => id === "all" || cats.has(id))
      .map(
        (id) =>
          `<button type="button" class="journey-filter-btn${journeyFilter === id ? " is-active" : ""}" data-filter="${id}">${labels[id] || id}</button>`
      )
      .join("");

    existing.innerHTML = `<div class="journey-filters-inner" role="group" aria-label="Filter journey by event type">${buttons}</div>`;
    existing.querySelectorAll(".journey-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        journeyFilter = btn.dataset.filter;
        renderTimeline();
      });
    });
  }

  function renderTimeline() {
    const container = document.getElementById("timeline");
    if (!container || !config.milestones?.length) return;

    renderJourneyFilters();

    const source = filteredMilestones();
    const blocks = groupMilestonesByChapter(source);
    const chapters = blocks.filter((b) => b.type === "chapter");

    const scrubber = document.getElementById("timeline-year-scrubber");
    if (scrubber && chapters.length) {
      scrubber.innerHTML = `
        <div class="year-scrubber-inner">
          <span class="year-scrubber-label">Jump to Year</span>
          <div class="year-scrubber-track" role="list">
            ${chapters
              .map(
                (c, idx) => `
              <a href="#${escapeHtml(c.id)}" class="year-scrubber-pill${idx === 0 ? " is-active" : ""}" data-year-target="${escapeHtml(c.id)}" role="listitem">
                <span class="year-scrubber-year">${escapeHtml(c.year)}</span>
                <span class="year-scrubber-count">${c.events.length}</span>
              </a>`
              )
              .join("")}
          </div>
        </div>`;
    } else if (scrubber && !chapters.length) {
      scrubber.innerHTML = `<p class="journey-empty-note">No milestones match this filter.</p>`;
    }

    lightboxItems = [];
    container.innerHTML = blocks
      .map((block) => {
        if (block.type === "gap") {
          if (journeyFilter !== "all") return "";
          return renderTimelineGapBlock(block.gap);
        }
        const eventCountLabel =
          block.events.length === 1 ? "1 Major Production" : `${block.events.length} Major Productions`;
        const eventsHtml = block.events
          .map((ev) => {
            const offset = lightboxItems.length;
            lightboxItems.push(...collectLightboxFromMilestone(ev));
            return renderChapterEvent(ev, offset);
          })
          .join("");
        return `
          <section class="timeline-year-chapter reveal" id="${escapeHtml(block.id)}" data-year-chapter="${escapeHtml(block.id)}" aria-labelledby="heading-${escapeHtml(block.id)}">
            <span class="timeline-year-watermark" aria-hidden="true">${escapeHtml(block.year)}</span>
            <div class="timeline-year-rail">
              <div class="timeline-year-badge" id="heading-${escapeHtml(block.id)}">
                <span class="timeline-year-num">${escapeHtml(block.year)}</span>
                <span class="timeline-year-meta">${escapeHtml(eventCountLabel)}</span>
              </div>
            </div>
            <div class="timeline-year-events">
              ${eventsHtml}
            </div>
          </section>`;
      })
      .join("");

    initYearScrubberSpy(scrubber, container);
    initPhotoStages(container);
    bindLightboxTriggers(container);
    initReveal(container);
    init3DTilt(container);
  }

  function initPhotoStages(scope) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scope.querySelectorAll(".photo-stage").forEach((stage) => {
      const imgs = [...stage.querySelectorAll(".photo-stage-img")];
      const dots = [...stage.querySelectorAll(".photo-stage-dot")];
      const countEl = stage.querySelector(".photo-stage-count");
      const openBtn = stage.querySelector(".photo-stage-open");
      const total = imgs.length;
      if (total < 2) return;

      let index = 0;
      let timer = null;
      let paused = false;
      let onScreen = false;
      const offset = Number(stage.dataset.lightboxOffset) || 0;

      function ensureLoaded(i) {
        const img = imgs[(i + total) % total];
        if (img && !img.getAttribute("src") && img.dataset.src) img.src = img.dataset.src;
      }

      function show(next) {
        index = (next + total) % total;
        ensureLoaded(index);
        ensureLoaded(index + 1);
        imgs.forEach((img, i) => img.classList.toggle("is-active", i === index));
        dots.forEach((dot, i) => {
          const on = i === index;
          dot.classList.toggle("is-active", on);
          dot.setAttribute("aria-selected", on ? "true" : "false");
        });
        if (countEl) countEl.textContent = `${index + 1} / ${total}`;
        if (openBtn) {
          openBtn.dataset.lightboxIndex = String(offset + index);
          const alt = imgs[index].alt || "photo";
          openBtn.setAttribute("aria-label", `Open photo: ${alt}`);
        }
      }

      function stop() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      function start() {
        if (reduceMotion || paused || !onScreen || timer) return;
        timer = setInterval(() => show(index + 1), 5000);
      }

      stage.querySelector(".photo-stage-nav--prev")?.addEventListener("click", () => show(index - 1));
      stage.querySelector(".photo-stage-nav--next")?.addEventListener("click", () => show(index + 1));
      dots.forEach((dot) => {
        dot.addEventListener("click", () => show(Number(dot.dataset.index) || 0));
      });

      stage.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          show(index - 1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          show(index + 1);
        }
      });

      let touchX = 0;
      stage.addEventListener(
        "touchstart",
        (e) => {
          touchX = e.changedTouches[0].clientX;
        },
        { passive: true }
      );
      stage.addEventListener(
        "touchend",
        (e) => {
          const dx = e.changedTouches[0].clientX - touchX;
          if (Math.abs(dx) < 40) return;
          show(dx < 0 ? index + 1 : index - 1);
        },
        { passive: true }
      );

      stage.addEventListener("mouseenter", () => {
        paused = true;
        stop();
      });
      stage.addEventListener("mouseleave", () => {
        paused = false;
        start();
      });
      stage.addEventListener("focusin", () => {
        paused = true;
        stop();
      });
      stage.addEventListener("focusout", (e) => {
        if (stage.contains(e.relatedTarget)) return;
        paused = false;
        start();
      });

      const observer = new IntersectionObserver(
        (entries) => {
          onScreen = entries.some((entry) => entry.isIntersecting);
          if (onScreen) start();
          else stop();
        },
        { threshold: 0.35 }
      );
      observer.observe(stage);
    });
  }

  function initYearScrubberSpy(scrubber, container) {
    if (!scrubber || !container) return;

    const pills = [...scrubber.querySelectorAll(".year-scrubber-pill")];
    const chapters = [...container.querySelectorAll(".timeline-year-chapter")];
    if (!pills.length || !chapters.length) return;

    function setActiveYear(chapterId) {
      pills.forEach((pill) => {
        pill.classList.toggle("is-active", pill.dataset.yearTarget === chapterId);
      });
    }

    pills.forEach((pill) => {
      pill.addEventListener("click", (e) => {
        const targetId = pill.dataset.yearTarget;
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;
        e.preventDefault();
        setActiveYear(targetId);
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActiveYear(visible[0].target.dataset.yearChapter);
      },
      { rootMargin: "-18% 0px -60% 0px", threshold: 0.05 }
    );

    chapters.forEach((ch) => observer.observe(ch));
  }

  function ensureLightboxShell() {
    if (document.getElementById("lightbox")) return;
    const el = document.createElement("div");
    el.id = "lightbox";
    el.className = "lightbox";
    el.setAttribute("hidden", "");
    el.innerHTML = `
      <div class="lightbox-backdrop" data-lightbox-close></div>
      <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Photo viewer">
        <button type="button" class="lightbox-close" data-lightbox-close aria-label="Close">&times;</button>
        <button type="button" class="lightbox-nav lightbox-nav--prev" aria-label="Previous photo">&#10094;</button>
        <figure class="lightbox-figure">
          <img class="lightbox-image" alt="">
          <figcaption class="lightbox-caption"></figcaption>
        </figure>
        <button type="button" class="lightbox-nav lightbox-nav--next" aria-label="Next photo">&#10095;</button>
      </div>`;
    document.body.appendChild(el);

    el.querySelectorAll("[data-lightbox-close]").forEach((btn) => {
      btn.addEventListener("click", closeLightbox);
    });
    el.querySelector(".lightbox-nav--prev")?.addEventListener("click", () => showLightbox(lightboxIndex - 1));
    el.querySelector(".lightbox-nav--next")?.addEventListener("click", () => showLightbox(lightboxIndex + 1));
  }

  function showLightbox(index) {
    if (!lightboxItems.length) return;
    ensureLightboxShell();
    lightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
    const item = lightboxItems[lightboxIndex];
    const box = document.getElementById("lightbox");
    const img = box.querySelector(".lightbox-image");
    const cap = box.querySelector(".lightbox-caption");
    img.src = item.src;
    img.alt = item.alt || "";
    cap.textContent = `${item.year || ""} — ${item.title || ""}`.replace(/^ — /, "");
    const wasClosed = box.hasAttribute("hidden");
    box.removeAttribute("hidden");
    document.body.classList.add("lightbox-open");
    if (wasClosed) {
      lightboxReturn = document.activeElement;
      box.querySelector(".lightbox-close")?.focus();
    }
  }

  function closeLightbox() {
    const box = document.getElementById("lightbox");
    if (!box || box.hasAttribute("hidden")) return;
    box.setAttribute("hidden", "");
    document.body.classList.remove("lightbox-open");
    const back = lightboxReturn;
    lightboxReturn = null;
    if (back && document.contains(back) && typeof back.focus === "function") back.focus();
  }

  function bindLightboxTriggers(scope) {
    scope.querySelectorAll(".lightbox-trigger").forEach((btn) => {
      btn.addEventListener("click", () => {
        showLightbox(Number(btn.dataset.lightboxIndex) || 0);
      });
    });
  }

  function initLightboxKeys() {
    document.addEventListener("keydown", (e) => {
      const box = document.getElementById("lightbox");
      if (!box || box.hasAttribute("hidden")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        showLightbox(lightboxIndex - 1);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        showLightbox(lightboxIndex + 1);
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = [...box.querySelectorAll("button")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !box.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  function initJourneyChrome() {
    const progress = document.getElementById("journey-progress");
    const backTop = document.getElementById("back-to-top");
    if (!progress && !backTop) return;

    function onScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      if (progress) progress.style.width = `${pct}%`;
      if (backTop) backTop.classList.toggle("is-visible", doc.scrollTop > 480);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    backTop?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
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
    if (hoursEl) hoursEl.textContent = c.hours || hoursEl.textContent;

    const fb = document.getElementById("social-facebook");
    const ig = document.getElementById("social-instagram");
    if (fb && !isContactStatic(fb) && c.social?.facebook) fb.href = c.social.facebook;
    if (ig && !isContactStatic(ig) && c.social?.instagram) ig.href = c.social.instagram;
  }

  function renderTestimonials() {
    const root = document.getElementById("testimonials");
    if (!root || !config.testimonials?.length) return;
    root.innerHTML = config.testimonials
      .map(
        (t) => `
      <blockquote class="testimonial-card tilt-card reveal">
        <p class="testimonial-quote">“${escapeHtml(t.quote)}”</p>
        <footer class="testimonial-meta">
          <strong>${escapeHtml(t.name)}</strong>
          <span>${escapeHtml(t.role || "")}</span>
        </footer>
      </blockquote>`
      )
      .join("");
  }

  function renderFaqs() {
    const root = document.getElementById("faq-list");
    if (!root || !config.faqs?.length) return;
    root.innerHTML = config.faqs
      .map(
        (item, i) => `
      <details class="faq-item reveal"${i === 0 ? " open" : ""}>
        <summary>${escapeHtml(item.q)}</summary>
        <p>${escapeHtml(item.a)}</p>
      </details>`
      )
      .join("");
  }

  function updateAboutStats() {
    const el = document.querySelector("[data-stat-productions]");
    if (!el) return;
    const count = (config.milestones || []).filter((m) => m.type === "milestone").length;
    el.textContent = `${count}+`;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function milestoneImage(m) {
    if (m.image) {
      return { src: m.image, alt: m.imageAlt || m.title || "" };
    }
    if (m.images?.length) {
      const img = m.images[0];
      const src = typeof img === "string" ? img : img.src;
      const alt = typeof img === "string" ? m.title || "" : img.alt || m.title || "";
      return { src, alt };
    }
    return null;
  }

  function getJourneyCarouselSlides() {
    const byYear = new Map();

    (config.milestones || []).forEach((m) => {
      if (m.type !== "milestone") return;
      if (!byYear.has(m.year)) byYear.set(m.year, []);
      byYear.get(m.year).push(m);
    });

    return [...byYear.entries()]
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([year, items]) => {
        const milestone = items.find((item) => milestoneImage(item));
        if (!milestone) return null;
        const image = milestoneImage(milestone);
        return {
          year,
          title: milestone.title,
          src: image.src,
          alt: image.alt,
        };
      })
      .filter(Boolean);
  }

  function renderJourneyCarousel() {
    const root = document.getElementById("journey-carousel");
    if (!root) return;

    const slides = getJourneyCarouselSlides();
    if (!slides.length) return;

    const slideHtml = slides
      .map(
        (slide, i) => `
      <figure class="journey-carousel-slide${i === 0 ? " is-active" : ""}" data-index="${i}" role="group" aria-roledescription="slide" aria-label="${escapeHtml(slide.year)} — ${escapeHtml(slide.title)}">
        <div class="journey-carousel-media">
          <span class="journey-carousel-year-pill">${escapeHtml(slide.year)}</span>
          <img src="${escapeHtml(slide.src)}" alt="${escapeHtml(slide.alt)}" loading="${i === 0 ? "eager" : "lazy"}" decoding="async" width="960" height="540">
        </div>
        <figcaption class="journey-carousel-caption">
          <span class="journey-carousel-year">${escapeHtml(slide.year)}</span>
          <span class="journey-carousel-title">${escapeHtml(slide.title)}</span>
        </figcaption>
      </figure>`
      )
      .join("");

    const dotsHtml = slides
      .map(
        (slide, i) =>
          `<button type="button" class="journey-carousel-dot${i === 0 ? " is-active" : ""}" data-index="${i}" role="tab" aria-selected="${i === 0 ? "true" : "false"}" aria-label="${escapeHtml(slide.year)}: ${escapeHtml(slide.title)}">
            <span>${escapeHtml(slide.year)}</span>
          </button>`
      )
      .join("");

    root.innerHTML = `
      <div class="journey-carousel-inner">
        <button type="button" class="journey-carousel-btn journey-carousel-btn--prev" aria-label="Previous slide">&#10094;</button>
        <div class="journey-carousel-viewport">
          <div class="journey-carousel-track" style="--slide-count: ${slides.length};">
            ${slideHtml}
          </div>
        </div>
        <button type="button" class="journey-carousel-btn journey-carousel-btn--next" aria-label="Next slide">&#10095;</button>
      </div>
      <div class="journey-carousel-dots" role="tablist" aria-label="Carousel slides by year">
        ${dotsHtml}
      </div>`;

    initJourneyCarousel(root, slides.length);
  }

  function initJourneyCarousel(root, count) {
    if (count < 2) {
      root.querySelectorAll(".journey-carousel-btn").forEach((btn) => {
        btn.disabled = true;
        btn.setAttribute("aria-hidden", "true");
      });
      return;
    }

    const track = root.querySelector(".journey-carousel-track");
    const slideEls = [...root.querySelectorAll(".journey-carousel-slide")];
    const dots = [...root.querySelectorAll(".journey-carousel-dot")];
    const prevBtn = root.querySelector(".journey-carousel-btn--prev");
    const nextBtn = root.querySelector(".journey-carousel-btn--next");
    let index = 0;
    let timerId = null;
    let touchStartX = 0;

    function updateSlideClasses() {
      const prevIdx = (index - 1 + count) % count;
      const nextIdx = (index + 1) % count;
      slideEls.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === index);
        slide.classList.toggle("is-prev", i === prevIdx);
        slide.classList.toggle("is-next", i === nextIdx);
      });
    }

    function goTo(nextIndex) {
      index = (nextIndex + count) % count;
      track.style.transform = `translateX(-${index * 100}%)`;
      updateSlideClasses();
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
        dot.setAttribute("aria-selected", i === index ? "true" : "false");
      });
    }

    function restartAutoplay() {
      if (timerId) clearInterval(timerId);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timerId = setInterval(() => goTo(index + 1), 6000);
    }

    updateSlideClasses();

    prevBtn?.addEventListener("click", () => {
      goTo(index - 1);
      restartAutoplay();
    });
    nextBtn?.addEventListener("click", () => {
      goTo(index + 1);
      restartAutoplay();
    });
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        goTo(Number(dot.dataset.index));
        restartAutoplay();
      });
    });

    const viewport = root.querySelector(".journey-carousel-viewport");
    viewport?.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    viewport?.addEventListener(
      "touchend",
      (e) => {
        const delta = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(delta) < 40) return;
        goTo(delta > 0 ? index - 1 : index + 1);
        restartAutoplay();
      },
      { passive: true }
    );

    root.addEventListener("mouseenter", () => {
      if (timerId) clearInterval(timerId);
    });
    root.addEventListener("mouseleave", restartAutoplay);

    restartAutoplay();
  }

  function init3DTilt(scope = document) {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reducedMotion) return;

    scope.querySelectorAll(".tilt-card:not([data-tilt-bound])").forEach((card) => {
      card.setAttribute("data-tilt-bound", "true");

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = x / rect.width;
        const py = y / rect.height;

        const rotateY = (px - 0.5) * 9;
        const rotateX = (0.5 - py) * 7;

        card.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
        card.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
        card.style.setProperty("--glare-x", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--glare-y", `${(py * 100).toFixed(1)}%`);
        card.classList.add("is-tilting");
      });

      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
        card.classList.remove("is-tilting");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    initTheme();
    initNav();
    setActiveNav();
    renderServices();
    renderTimeline();
    renderJourneyCarousel();
    renderContact();
    renderTestimonials();
    renderFaqs();
    updateAboutStats();
    initJourneyChrome();
    initLightboxKeys();
    initReveal();
    init3DTilt();
  });
})();
