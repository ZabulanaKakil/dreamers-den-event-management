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

  function renderServiceCard(s) {
    const imageClass = s.imageFit === "contain" ? " is-contain" : "";
    return `
      <article class="card service-card reveal" data-service-id="${s.id}">
        <div class="service-image${imageClass}">
          <img src="${s.image}" alt="${escapeHtml(s.name)}" width="400" height="250" loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
          <span class="service-icon-fallback" style="display:none" aria-hidden="true">${s.name.charAt(0)}</span>
        </div>
        <div class="service-body">
          <h3>${escapeHtml(s.name)}</h3>
          <p class="service-desc">${escapeHtml(s.description)}</p>
          <button type="button" class="read-more" aria-expanded="false">Read more</button>
        </div>
      </article>`;
  }

  function getServiceGroups() {
    if (config.serviceGroups?.length) return config.serviceGroups;
    if (config.services?.length) {
      return [{ id: "services", heading: "Our Services", services: config.services }];
    }
    return [];
  }

  function renderServices() {
    const container = document.getElementById("services-sections");
    if (!container || container.dataset.static === "true") return;

    const groups = getServiceGroups();
    if (!groups.length) return;

    container.innerHTML = groups
      .map(
        (group) => `
      <section class="service-group reveal" aria-labelledby="service-group-${group.id}">
        <h2 class="service-group-heading" id="service-group-${group.id}">${escapeHtml(group.heading)}</h2>
        <div class="services-grid">
          ${group.services.map(renderServiceCard).join("")}
        </div>
      </section>`
      )
      .join("");

    initServiceReadMore(container);
    initReveal();
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
          <img src="${escapeHtml(slide.src)}" alt="${escapeHtml(slide.alt)}" loading="${i === 0 ? "eager" : "lazy"}" width="960" height="540">
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
        (_, i) =>
          `<button type="button" class="journey-carousel-dot${i === 0 ? " is-active" : ""}" data-index="${i}" role="tab" aria-selected="${i === 0 ? "true" : "false"}" aria-label="Go to slide ${i + 1}"></button>`
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
      <div class="journey-carousel-dots" role="tablist" aria-label="Carousel slides">
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

    function goTo(nextIndex) {
      index = (nextIndex + count) % count;
      track.style.transform = `translateX(-${index * 100}%)`;
      slideEls.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === index);
        dot.setAttribute("aria-selected", i === index ? "true" : "false");
      });
    }

    function restartAutoplay() {
      if (timerId) clearInterval(timerId);
      timerId = setInterval(() => goTo(index + 1), 6000);
    }

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

    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        goTo(index - 1);
        restartAutoplay();
      }
      if (e.key === "ArrowRight") {
        goTo(index + 1);
        restartAutoplay();
      }
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

  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    initTheme();
    initNav();
    setActiveNav();
    renderServices();
    initServiceReadMore(document.getElementById("services-sections"));
    renderTimeline();
    renderJourneyCarousel();
    renderContact();
    initReveal();
  });
})();
