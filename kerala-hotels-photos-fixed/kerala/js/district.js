/**
 * KERALA ODYSSEY — DISTRICT DOSSIER ENGINE
 * Next-Gen Interactive District Guide with Lightbox, Tabbed Layout & Bucket List Integration
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
        <article class="detail-card">
          <img class="detail-card-img" loading="lazy" src="${img}" alt="${esc(title)} — ${esc(alt)}" data-lightbox-src="${img}" data-lightbox-caption="${esc(title)}" title="Click to view full photo">
          <div class="detail-card-body">
            <span class="detail-card-num">${String(i + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}</span>
            <h3 class="detail-card-title">${esc(title)}</h3>
            <p class="detail-card-desc">${esc(desc)}</p>
          </div>
        </article>
      `;
    }).join("");
  }

  if (!d || !di) {
    if (root) {
      root.innerHTML = `
        <div style="padding: 100px 20px; text-align: center;">
          <h2>District Not Found</h2>
          <p style="margin-top: 10px;"><a href="../index.html#districts" style="color: var(--c-emerald);">Return to Kerala Odyssey Directory ↗</a></p>
        </div>
      `;
    }
  } else {
    document.title = `${d.name} — Kerala Odyssey Travel Dossier`;

    const hero = cimg(di.hero, 2000);
    const placeImgs = di.places.map(f => cimg(f));
    const tok = (t) => t === "l" ? cimg(di.lifestyle) : t === "c" ? cimg(di.culture) : t === "h" ? cimg(di.hero) : (typeof t === "string" && t.startsWith("f:")) ? cimg(data.images.food[t.slice(2)]) : placeImgs[t];
    
    const placeCards = cards(d.places, placeImgs, "Key Landmark");
    const foodCards = cards(d.foods, d.foods.map(f => cimg(foodImg(Array.isArray(f) ? f[0] : f))), "Gastronomy");
    const activityCards = cards(d.activities, di.activities.map(tok), "Curated Experience");
    const gallery = [hero, placeImgs[0], cimg(di.culture), placeImgs[2], cimg(di.lifestyle), placeImgs[4]];
    
    const prev = data.districts[(districtIndex + 13) % 14];
    const next = data.districts[(districtIndex + 1) % 14];

    root.innerHTML = `
      <!-- Hero Banner -->
      <section class="district-hero-modern">
        <img class="district-hero-bg" src="${hero}" alt="${d.name} scenic landscape">
        <div class="district-hero-gradient"></div>
        
        <div class="container district-hero-inner">
          <div class="district-breadcrumbs">
            <a href="../index.html">Home</a> &nbsp;/&nbsp; 
            <a href="../index.html#districts">Districts</a> &nbsp;/&nbsp; 
            <span style="color: #ffffff;">${d.name}</span>
          </div>

          <div class="district-hero-pills">
            <span class="hero-pill" style="background: rgba(203, 161, 77, 0.25); border-color: var(--c-gold); color: var(--c-gold-bright);">
              ${String(districtIndex + 1).padStart(2, "0")} / 14 Sovereign Districts
            </span>
            <span class="hero-pill">${d.tag}</span>
          </div>

          <h1 class="district-hero-title">${d.name}</h1>
          <p style="font-size: clamp(16px, 1.3vw, 19px); line-height: 1.8; max-width: 720px; color: var(--text-light-muted); margin-bottom: 28px;">
            ${d.short} ${d.intro}
          </p>

          <div style="display: flex; gap: 14px; flex-wrap: wrap;">
            <button class="nav-cta-btn" onclick="window.toggleWishlistItem('${d.name}', 'District', event)">
              ♥ Add to Kerala Bucket List
            </button>
            <a class="nav-cta-btn" style="background: rgba(255, 255, 255, 0.15); border-color: rgba(255, 255, 255, 0.3);" href="#attractions">
              Explore Dossier ↓
            </a>
          </div>
        </div>
      </section>

      <!-- Sticky Section Navigation -->
      <nav class="district-nav-tabs">
        <div class="container district-tabs-list">
          <a class="district-tab-btn active" href="#overview">Overview</a>
          <a class="district-tab-btn" href="#attractions">Landmarks</a>
          <a class="district-tab-btn" href="#gastronomy">Gastronomy</a>
          <a class="district-tab-btn" href="#experiences">Adventures</a>
          <a class="district-tab-btn" href="#culture">Heritage & Lore</a>
          <a class="district-tab-btn" href="#travel">Travel Intel</a>
          <a class="district-tab-btn" href="#gallery">Gallery</a>
        </div>
      </nav>

      <!-- Section: Overview & Landscape -->
      <section class="section" id="overview">
        <div class="container">
          <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 48px; align-items: start;">
            <div>
              <div class="section-kicker">Geographic Profile</div>
              <h2 class="section-title">A Land of<br><em>Distinctive Character.</em></h2>
              <div style="margin-top: 24px; padding: 20px; background: var(--bg-surface-alt); border-radius: var(--radius-md); border-left: 4px solid var(--c-emerald);">
                <p style="font-size: 13.5px; font-weight: 700; color: var(--c-emerald-dark); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">Topography & Terrain</p>
                <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.7;">${d.landscape}</p>
              </div>
            </div>
            <div>
              <p style="font-size: 16px; color: var(--text-secondary); line-height: 1.9; margin-bottom: 20px;">
                ${d.intro}
              </p>
              <p style="font-size: 15px; color: var(--text-secondary); line-height: 1.85;">
                Every district in Kerala maintains its own microclimate, culinary lineage, and communal festivals. As you journey through ${d.name}, observe how the transition from the Western Ghats down to the Arabian Sea coastline shapes everyday work, arts, and rituals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Attractions -->
      <section class="section alt" id="attractions">
        <div class="container">
          <div class="section-header">
            <div>
              <div class="section-kicker">Must-Visit Destinations</div>
              <h2 class="section-title">Iconic Landmarks &amp;<br><em>Sanctuaries.</em></h2>
            </div>
            <p class="section-desc">Key heritage sites, nature reserves, viewpoints and coastal shores that define ${d.name}.</p>
          </div>
          <div class="detail-cards-grid">${placeCards}</div>
        </div>
      </section>

      <!-- Section: Gastronomy -->
      <section class="section" id="gastronomy">
        <div class="container">
          <div class="section-header">
            <div>
              <div class="section-kicker">Culinary Lineage</div>
              <h2 class="section-title">Flavours of<br><em>The Soil &amp; Waters.</em></h2>
            </div>
            <p class="section-desc">Regional staples and celebratory delicacies passed down through generations of home cooks and spice merchants.</p>
          </div>
          <div class="detail-cards-grid">${foodCards}</div>
        </div>
      </section>

      <!-- Section: Activities -->
      <section class="section alt" id="experiences">
        <div class="container">
          <div class="section-header">
            <div>
              <div class="section-kicker">Field Expeditions</div>
              <h2 class="section-title">Experiences &amp;<br><em>Adventures.</em></h2>
            </div>
            <p class="section-desc">From tranquil backwater canoe explorations to high-range mountain treks and craft village walks.</p>
          </div>
          <div class="detail-cards-grid">${activityCards}</div>
        </div>
      </section>

      <!-- Section: Culture & Lore -->
      <section class="section dark" id="culture">
        <div class="container">
          <div class="section-header">
            <div>
              <div class="section-kicker">Living Heritage</div>
              <h2 class="section-title">Sacred Arts, Rituals &amp;<br><em>Community Identity.</em></h2>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: center;">
            <img style="width: 100%; height: 380px; object-fit: cover; border-radius: var(--radius-md); border: 1px solid var(--border-gold);" src="${cimg(di.culture)}" alt="${d.name} living culture" data-lightbox-src="${cimg(di.culture, 1600)}" data-lightbox-caption="${d.name} Culture">
            <div style="background: rgba(255, 255, 255, 0.05); padding: clamp(24px, 3.5vw, 40px); border-radius: var(--radius-md); border: 1px solid rgba(255, 255, 255, 0.1);">
              <h3 style="font-family: var(--font-serif); font-size: 26px; color: var(--c-gold-bright); margin-bottom: 14px;">Ritual Performance &amp; Traditions</h3>
              <p style="font-size: 14.5px; color: var(--text-light-muted); line-height: 1.85; margin-bottom: 20px;">${d.culture}</p>
              
              <h4 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--c-emerald); margin-bottom: 8px;">Economy &amp; Livelihoods</h4>
              <p style="font-size: 13.5px; color: var(--text-light-muted); line-height: 1.75;">${d.economy}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Travel Intel -->
      <section class="section" id="travel">
        <div class="container">
          <div class="section-header">
            <div>
              <div class="section-kicker">Practical Intelligence</div>
              <h2 class="section-title">Planning Your<br><em>Sojourn in ${d.name}.</em></h2>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px;">
            <div style="background: #ffffff; padding: 32px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm);">
              <h3 style="font-family: var(--font-serif); font-size: 22px; color: var(--text-primary); margin-bottom: 12px;">Optimal Seasons &amp; Climate</h3>
              <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.8;">${d.travel}</p>
            </div>
            <div style="background: #ffffff; padding: 32px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm);">
              <h3 style="font-family: var(--font-serif); font-size: 22px; color: var(--c-gold); margin-bottom: 12px;">Local Connoisseur Tip</h3>
              <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.8;">${d.tip}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Photographic Gallery -->
      <section class="section alt" id="gallery">
        <div class="container">
          <div class="section-header">
            <div>
              <div class="section-kicker">Visual Impressions</div>
              <h2 class="section-title">Photographic Gallery</h2>
            </div>
            <p class="section-desc">Click any frame to inspect in full-resolution cinematic preview.</p>
          </div>
          <div class="gallery-strip-grid">
            ${gallery.map((src, i) => `
              <div class="gallery-strip-item">
                <img src="${src}" alt="${d.name} visual impression ${i + 1}" data-lightbox-src="${src}" data-lightbox-caption="${d.name} — Frame ${i + 1}">
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- District Jump Bar (Next & Previous) -->
      <div class="container">
        <div class="district-jump-bar">
          <a class="district-jump-link" href="${prev.slug}.html">
            <span>← Previous Sovereign District</span>
            <strong>${prev.name}</strong>
          </a>
          <a class="nav-cta-btn" href="../index.html#districts">
            View All 14 Districts
          </a>
          <a class="district-jump-link" style="text-align: right;" href="${next.slug}.html">
            <span>Next Sovereign District →</span>
            <strong>${next.name}</strong>
          </a>
        </div>
      </div>
    `;

    setupLightboxEngine();
  }

  /* -------------------------------------------------------------------------
   * Fullscreen Lightbox Engine
   * ------------------------------------------------------------------------- */
  function setupLightboxEngine() {
    let modal = document.querySelector(".lightbox-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "lightbox-modal";
      modal.innerHTML = `
        <div class="lightbox-content">
          <button class="lightbox-close" aria-label="Close modal">✕</button>
          <img class="lightbox-img" src="" alt="Zoom preview">
          <div class="lightbox-caption"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const modalImg = modal.querySelector(".lightbox-img");
    const modalCap = modal.querySelector(".lightbox-caption");
    const closeBtn = modal.querySelector(".lightbox-close");

    function open(src, caption) {
      modalImg.src = src;
      modalCap.textContent = caption || "";
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function close() {
      modal.classList.remove("active");
      document.body.style.overflow = "";
      setTimeout(() => { modalImg.src = ""; }, 300);
    }

    document.querySelectorAll("[data-lightbox-src]").forEach(el => {
      el.addEventListener("click", () => {
        open(el.getAttribute("data-lightbox-src"), el.getAttribute("data-lightbox-caption"));
      });
    });

    closeBtn.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) close();
    });
  }

})();
