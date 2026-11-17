/**
 * KERALA — DISTRICT GUIDE PAGE ENGINE
 * High-end editorial presentation, parallax, scroll animations and lightbox
 */

(function () {
  'use strict';

  const data = window.KERALA_DATA;
  const slug = location.pathname.split("/").pop().replace(".html", "");
  const d = data ? data.districts.find(x => x.slug === slug) : null;
  const root = document.getElementById("districtContent");
  const districtIndex = data ? data.districts.findIndex(x => x.slug === slug) : -1;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));
  }

  const COMMONS = "https://commons.wikimedia.org/wiki/Special:FilePath/";
  const cimg = (f, w) => COMMONS + encodeURIComponent(f) + "?width=" + (w || 900);
  const di = (data && data.images && data.images.districts) ? data.images.districts[slug] || null : null;

  const foodImg = (name) => {
    const n = String(name).toLowerCase();
    for (const [re, key] of data.images.foodRules) {
      if (new RegExp(re).test(n)) return data.images.food[key];
    }
    return data.images.food.sadya;
  };

  function cards(items, imgs, alt) {
    return items.map((item, i) => {
      const title = Array.isArray(item) ? item[0] : item;
      const desc = Array.isArray(item) ? item[1] : "";
      const img = imgs[i];
      return `
        <article class="info-card" data-reveal>
          <img loading="lazy" src="${img}" alt="${esc(title)} — ${esc(alt)}" data-lightbox-src="${img}" data-lightbox-caption="${esc(title)}">
          <div class="info-card-body">
            <span class="item-number">${String(i + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}</span>
            <h3>${esc(title)}</h3>
            <p>${esc(desc)}</p>
          </div>
        </article>
      `;
    }).join("");
  }

  // Ensure scroll progress bar exists
  if (!document.getElementById("scrollProgressBar")) {
    const pb = document.createElement("div");
    pb.id = "scrollProgressBar";
    pb.className = "scroll-progress-bar";
    pb.setAttribute("aria-hidden", "true");
    document.body.prepend(pb);
  }

  if (!d || !di) {
    if (root) {
      root.innerHTML = '<div class="loading">District not found. <a href="../index.html#districts">Return to all districts</a>.</div>';
    }
  } else {
    document.title = `${d.name} District Guide | KERALA`;

    const hero = cimg(di.hero, 1800);
    const placeImgs = di.places.map(f => cimg(f));
    const tok = (t) => t === "l" ? cimg(di.lifestyle) : t === "c" ? cimg(di.culture) : t === "h" ? cimg(di.hero) : (typeof t === "string" && t.startsWith("f:")) ? cimg(data.images.food[t.slice(2)]) : placeImgs[t];
    
    const placeCards = cards(d.places, placeImgs, "tourist attraction in " + d.name);
    const foodCards = cards(d.foods, d.foods.map(f => cimg(foodImg(Array.isArray(f) ? f[0] : f))), "Kerala food and cuisine");
    const activityCards = cards(d.activities, di.activities.map(tok), "activity in " + d.name);
    const gallery = [hero, placeImgs[0], cimg(di.culture), placeImgs[2], cimg(di.lifestyle), placeImgs[4]];
    const prev = data.districts[(districtIndex + 13) % 14];
    const next = data.districts[(districtIndex + 1) % 14];

    root.innerHTML = `
      <section class="district-hero">
        <img id="districtHeroImg" src="${hero}" alt="${d.name} district landscape">
        <div class="district-hero-content">
          <div class="breadcrumb">
            <a href="../index.html">HOME</a> &nbsp; / &nbsp; 
            <a href="../index.html#districts">DISTRICTS</a> &nbsp; / &nbsp; 
            ${d.name.toUpperCase()}
          </div>
          <div class="eyebrow">${d.tag.toUpperCase()}</div>
          <h1>${d.name}</h1>
          <div class="district-tag">DISCOVER THE CHARACTER OF KERALA</div>
          <p>${d.short} Explore its remarkable places, flavours, people and living traditions.</p>
        </div>
      </section>

      <section class="district-intro section-wrap" data-reveal>
        <div>
          <div class="section-kicker">GET TO KNOW THE DISTRICT</div>
          <h2>A place with<br><em>its own story.</em></h2>
          <div class="district-facts">
            <span>KERALA · INDIA</span>
            <span>${String(districtIndex + 1).padStart(2, "0")} OF 14 DISTRICTS</span>
          </div>
        </div>
        <div>
          <p>${d.intro}</p>
          <p>${d.landscape}</p>
        </div>
      </section>

      <section class="content-section alt">
        <div class="section-wrap">
          <div class="section-headline" data-reveal>
            <div>
              <div class="section-kicker">SEE THE DISTRICT</div>
              <h2>Places to discover</h2>
            </div>
            <p>From well-known landmarks to quieter natural and heritage locations, start with these highlights. Always check local access, opening times and conditions before travelling.</p>
          </div>
          <div class="item-grid">${placeCards}</div>
        </div>
      </section>

      <section class="content-section">
        <div class="section-wrap">
          <div class="section-headline" data-reveal>
            <div>
              <div class="section-kicker">A TASTE OF THE REGION</div>
              <h2>Food to remember</h2>
            </div>
            <p>Food is part of the story of a place. Explore dishes, ingredients and preparations connected with this district and the wider regional cuisine.</p>
          </div>
          <div class="item-grid">${foodCards}</div>
        </div>
      </section>

      <section class="content-section alt">
        <div class="section-wrap">
          <div class="section-headline" data-reveal>
            <div>
              <div class="section-kicker">GET OUT AND EXPERIENCE</div>
              <h2>Things to do</h2>
            </div>
            <p>Choose experiences that connect you with the landscape and local character. Availability can change with season, weather and operator permissions.</p>
          </div>
          <div class="item-grid">${activityCards}</div>
        </div>
      </section>

      <section class="content-section dark">
        <div class="section-wrap">
          <div class="section-headline" data-reveal>
            <div>
              <div class="section-kicker light">IDENTITY & BELONGING</div>
              <h2>Culture &amp; heritage</h2>
            </div>
            <p>Traditions are living practices. Their form and meaning can differ between communities and localities.</p>
          </div>
          <div class="culture-feature" data-reveal>
            <img loading="lazy" src="${cimg(di.culture)}" alt="${d.name} cultural life and traditions" data-lightbox-src="${cimg(di.culture, 1600)}" data-lightbox-caption="Cultural traditions of ${d.name}">
            <div class="text-panel">
              <h3>Traditions that shape the district</h3>
              <p>${d.culture}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="content-section">
        <div class="section-wrap">
          <div class="section-headline" data-reveal>
            <div>
              <div class="section-kicker">EVERYDAY KERALA</div>
              <h2>People &amp; lifestyle</h2>
            </div>
            <p>Go beyond sightseeing to understand the work, food habits, settlements and community life that shape the district.</p>
          </div>
          <div class="culture-feature" data-reveal>
            <img loading="lazy" src="${cimg(di.lifestyle)}" alt="${d.name} landscape and local lifestyle" data-lightbox-src="${cimg(di.lifestyle, 1600)}" data-lightbox-caption="Lifestyle and landscapes of ${d.name}">
            <div class="text-panel">
              <h3>How life is lived here</h3>
              <p>${d.lifestyle}</p>
              <br>
              <h3>Livelihoods &amp; local economy</h3>
              <p>${d.economy}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="content-section alt">
        <div class="section-wrap">
          <div class="section-headline" data-reveal>
            <div>
              <div class="section-kicker">PLAN YOUR VISIT</div>
              <h2>Travel guide</h2>
            </div>
            <p>A few practical pointers to help plan a thoughtful visit. Conditions, opening hours and transport schedules can change.</p>
          </div>
          <div class="text-panel-grid" data-reveal>
            <div class="text-panel">
              <h3>Best time &amp; seasons</h3>
              <p>${d.travel}</p>
            </div>
            <div class="text-panel">
              <h3>Local travel tip</h3>
              <p>${d.tip}</p>
            </div>
          </div>
          <p class="notice">Travel information is a general guide, not a live service update. Verify current timings, permits, prices, weather warnings and transport details with official local sources before departure.</p>
        </div>
      </section>

      <section class="content-section">
        <div class="section-wrap">
          <div class="section-headline" data-reveal>
            <div>
              <div class="section-kicker">A FEW FRAMES OF ${d.name.toUpperCase()}</div>
              <h2>Photo impressions</h2>
            </div>
            <p>Use the gallery as a visual introduction to the landscapes and experiences associated with the district.</p>
          </div>
          <div class="gallery-grid" data-reveal>
            ${gallery.map((src, i) => `
              <img loading="lazy" src="${src}" alt="${d.name} travel gallery image ${i + 1}" data-lightbox-src="${src}" data-lightbox-caption="${d.name} — Impression ${i + 1}">
            `).join("")}
          </div>
          <p class="notice">Photographs are sourced from Wikimedia Commons and are shown under their respective Creative Commons / public-domain licences; see each file’s Commons page for the author credit. Food and activity images are representative of Kerala cuisine and experiences.</p>
        </div>
      </section>

      <div class="section-wrap">
        <div class="district-nav" data-reveal>
          <a href="${prev.slug}.html">
            <span>← PREVIOUS DISTRICT</span>${prev.name}
          </a>
          <a href="../index.html#districts" style="text-align:center">
            <span>BACK TO</span>All 14 districts
          </a>
          <a href="${next.slug}.html" style="text-align:right">
            <span>NEXT DISTRICT →</span>${next.name}
          </a>
        </div>
      </div>
    `;

    // Initialize Lightbox Modal
    setupLightbox();

    // Initialize Scroll Reveals
    setupScrollReveals();

    // Parallax on district hero
    setupHeroParallax();

    // Keyboard shortcuts for district navigation
    window.addEventListener("keydown", (e) => {
      if (document.querySelector(".lightbox-modal.active")) return;
      if (e.key === "ArrowLeft") {
        location.href = `${prev.slug}.html`;
      } else if (e.key === "ArrowRight") {
        location.href = `${next.slug}.html`;
      }
    });
  }

  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });
  }

  /* -------------------------------------------------------------------------
   * Lightbox Modal Implementation
   * ------------------------------------------------------------------------- */
  function setupLightbox() {
    let modal = document.querySelector(".lightbox-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "lightbox-modal";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.innerHTML = `
        <div class="lightbox-content">
          <button class="lightbox-close" aria-label="Close image preview">✕</button>
          <img class="lightbox-img" src="" alt="Fullscreen preview">
          <div class="lightbox-caption"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const modalImg = modal.querySelector(".lightbox-img");
    const modalCaption = modal.querySelector(".lightbox-caption");
    const closeBtn = modal.querySelector(".lightbox-close");

    function openLightbox(src, caption) {
      modalImg.src = src;
      modalCaption.textContent = caption || "";
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      modal.classList.remove("active");
      document.body.style.overflow = "";
      setTimeout(() => { modalImg.src = ""; }, 300);
    }

    document.querySelectorAll("[data-lightbox-src]").forEach(img => {
      img.addEventListener("click", () => {
        openLightbox(img.getAttribute("data-lightbox-src"), img.getAttribute("data-lightbox-caption"));
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeLightbox();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        closeLightbox();
      }
    });
  }

  /* -------------------------------------------------------------------------
   * Scroll Reveals & Parallax
   * ------------------------------------------------------------------------- */
  function setupScrollReveals() {
    const revealElements = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });

      revealElements.forEach(el => observer.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add("is-visible"));
    }
  }

  function setupHeroParallax() {
    const heroImg = document.getElementById("districtHeroImg");
    const pb = document.getElementById("scrollProgressBar");

    window.addEventListener("scroll", () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (pb && docHeight > 0) {
        const progress = (scrollY / docHeight) * 100;
        pb.style.width = `${Math.min(100, Math.max(0, progress))}%`;
      }

      if (heroImg && scrollY < window.innerHeight) {
        heroImg.style.transform = `scale(1.02) translate3d(0, ${scrollY * 0.3}px, 0)`;
      }
    }, { passive: true });
  }

})();
