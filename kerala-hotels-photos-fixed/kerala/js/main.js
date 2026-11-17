/**
 * KERALA ODYSSEY — MASTER APPLICATION ENGINE
 * Ambient Soundscape Synth, Wishlist Engine, Interactive Planner & District Filtering
 */

(function () {
  'use strict';

  const data = window.KERALA_DATA;
  const districtGrid = document.getElementById('districtGrid');
  const districtSearch = document.getElementById('districtSearch');
  const heroSearchInput = document.getElementById('heroSearchInput');
  const heroSearchBtn = document.getElementById('heroSearchBtn');
  const districtCountEl = document.getElementById('districtCount');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const progressBar = document.getElementById('scrollProgressBar');
  const siteHeader = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  /* -------------------------------------------------------------------------
   * 1. Categorization Rules for 14 Districts
   * ------------------------------------------------------------------------- */
  const districtCategories = {
    'thiruvananthapuram': ['coastal', 'heritage'],
    'kollam': ['backwaters', 'coastal'],
    'pathanamthitta': ['heritage', 'wildlife'],
    'alappuzha': ['backwaters', 'coastal'],
    'kottayam': ['backwaters', 'highlands'],
    'idukki': ['highlands', 'wildlife'],
    'ernakulam': ['heritage', 'coastal'],
    'thrissur': ['heritage'],
    'palakkad': ['heritage', 'wildlife'],
    'malappuram': ['heritage', 'coastal'],
    'kozhikode': ['coastal', 'heritage'],
    'wayanad': ['highlands', 'wildlife'],
    'kannur': ['coastal', 'heritage'],
    'kasaragod': ['coastal', 'heritage']
  };

  let activeCategory = 'all';
  let activeQuery = '';

  /* -------------------------------------------------------------------------
   * 2. Render District Cards
   * ------------------------------------------------------------------------- */
  function renderDistrictCards() {
    if (!districtGrid || !data) return;

    const filtered = data.districts.filter(d => {
      const cats = districtCategories[d.slug] || [];
      const matchesCat = activeCategory === 'all' || cats.includes(activeCategory);
      const matchesQuery = !activeQuery || 
        d.name.toLowerCase().includes(activeQuery) ||
        (d.tag && d.tag.toLowerCase().includes(activeQuery)) ||
        (d.short && d.short.toLowerCase().includes(activeQuery));

      return matchesCat && matchesQuery;
    });

    if (districtCountEl) {
      districtCountEl.textContent = filtered.length;
    }

    if (filtered.length === 0) {
      districtGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 80px 20px; text-align: center; background: #ffffff; border-radius: var(--radius-md); border: 1px dashed var(--border-subtle); color: var(--text-muted);">
          <h3 style="font-family: var(--font-serif); font-size: 22px; color: var(--text-primary); margin-bottom: 8px;">No Sovereign Districts Found</h3>
          <p style="font-size: 14px;">Try searching for a different keyword or reset the category filter.</p>
        </div>
      `;
      return;
    }

    const savedList = getSavedBucketList();

    districtGrid.innerHTML = filtered.map((d, index) => {
      const heroImg = data.images.districts[d.slug]?.hero || '';
      const imgUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(heroImg)}?width=900`;
      const isSaved = savedList.some(item => item.title === d.name);

      return `
        <article class="district-card" data-slug="${d.slug}">
          <img class="district-card-img" src="${imgUrl}" alt="${d.name} landscape" loading="lazy">
          <div class="district-card-overlay"></div>
          
          <div class="district-card-top">
            <span class="district-badge">${String(index + 1).padStart(2, '0')} · ${d.name}</span>
            <button class="district-fav-btn ${isSaved ? 'saved' : ''}" title="Add to Bucket List" onclick="window.toggleWishlistItem('${d.name}', 'District', event)">
              ♥
            </button>
          </div>

          <div class="district-card-body">
            <span class="district-card-tag">${d.tag}</span>
            <h3 class="district-card-name">${d.name}</h3>
            <p class="district-card-snippet">${d.short}</p>
            
            <div class="district-card-footer">
              <button class="quick-preview-btn" onclick="openDistrictPreview('${d.slug}', event)">
                <span>Quick View</span> <span>👁</span>
              </button>
              <a class="district-open-link" href="districts/${d.slug}.html">
                Explore <span>↗</span>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Filter Tabs Event
  if (filterTabs) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeCategory = tab.dataset.category || 'all';
        renderDistrictCards();
      });
    });
  }

  // Live District Search
  if (districtSearch) {
    districtSearch.addEventListener('input', (e) => {
      activeQuery = e.target.value.trim().toLowerCase();
      renderDistrictCards();
    });
  }

  // Hero Search Quick Jump
  if (heroSearchBtn && heroSearchInput) {
    const handleHeroSearch = () => {
      const q = heroSearchInput.value.trim().toLowerCase();
      if (q) {
        activeQuery = q;
        if (districtSearch) districtSearch.value = q;
        renderDistrictCards();
        const distSec = document.getElementById('districts');
        if (distSec) distSec.scrollIntoView({ behavior: 'smooth' });
      }
    };
    heroSearchBtn.addEventListener('click', handleHeroSearch);
    heroSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleHeroSearch();
    });
  }

  /* -------------------------------------------------------------------------
   * 3. Quick-Preview Modal Engine
   * ------------------------------------------------------------------------- */
  window.openDistrictPreview = function (slug, event) {
    if (event) event.stopPropagation();
    const d = data.districts.find(x => x.slug === slug);
    if (!d) return;

    const modal = document.getElementById('previewModal');
    const heroImg = data.images.districts[d.slug]?.hero || '';
    const imgUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(heroImg)}?width=1200`;

    const topPlaces = d.places ? d.places.slice(0, 3).map(p => `<li><b>${p[0]}</b> — ${p[1]}</li>`).join('') : '';
    const topFoods = d.foods ? d.foods.slice(0, 3).map(f => `<li><b>${f[0]}</b> — ${f[1]}</li>`).join('') : '';

    const content = `
      <div class="modal-hero-banner">
        <img class="modal-hero-img" src="${imgUrl}" alt="${d.name}">
        <div class="modal-hero-grad"></div>
      </div>
      <div class="modal-content-body">
        <div style="font-size: 11px; font-weight: 700; color: var(--c-gold); letter-spacing: 2px; text-transform: uppercase;">
          ${d.tag}
        </div>
        <h2 style="font-family: var(--font-serif); font-size: 36px; margin: 6px 0 14px; color: var(--text-primary);">${d.name}</h2>
        <p style="font-size: 15px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 24px;">
          ${d.intro}
        </p>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px;">
          <div style="background: var(--bg-surface-alt); padding: 18px; border-radius: var(--radius-sm);">
            <h4 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--c-emerald-dark); margin-bottom: 10px;">Signature Landmarks</h4>
            <ul style="font-size: 12.5px; color: var(--text-secondary); padding-left: 18px; line-height: 1.7;">
              ${topPlaces}
            </ul>
          </div>
          <div style="background: var(--bg-surface-alt); padding: 18px; border-radius: var(--radius-sm);">
            <h4 style="font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--c-gold); margin-bottom: 10px;">Culinary Delights</h4>
            <ul style="font-size: 12.5px; color: var(--text-secondary); padding-left: 18px; line-height: 1.7;">
              ${topFoods}
            </ul>
          </div>
        </div>

        <div style="display: flex; gap: 14px; justify-content: flex-end;">
          <button class="nav-cta-btn" style="background: var(--bg-surface-alt); color: var(--text-primary); border-color: var(--border-subtle);" onclick="closePreviewModal()">
            Close
          </button>
          <a class="nav-cta-btn" href="districts/${d.slug}.html">
            View Complete Dossier ↗
          </a>
        </div>
      </div>
    `;

    const windowEl = modal.querySelector('.preview-modal-window');
    windowEl.innerHTML = `
      <button class="modal-close-btn" onclick="closePreviewModal()">✕</button>
      ${content}
    `;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closePreviewModal = function () {
    const modal = document.getElementById('previewModal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  const modalBackdrop = document.getElementById('previewModal');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closePreviewModal();
    });
  }

  /* -------------------------------------------------------------------------
   * 4. Wishlist / Bucket List Persistent Engine
   * ------------------------------------------------------------------------- */
  function getSavedBucketList() {
    try {
      const items = localStorage.getItem('kerala_odyssey_bucket_list');
      return items ? JSON.parse(items) : [];
    } catch (e) {
      return [];
    }
  }

  function saveBucketList(list) {
    try {
      localStorage.setItem('kerala_odyssey_bucket_list', JSON.stringify(list));
      updateBucketBadge();
      renderWishlistDrawer();
    } catch (e) {}
  }

  window.toggleWishlistItem = function (title, type, event) {
    if (event) event.stopPropagation();
    let list = getSavedBucketList();
    const existingIndex = list.findIndex(x => x.title === title);

    if (existingIndex > -1) {
      list.splice(existingIndex, 1);
    } else {
      list.push({ title, type, date: new Date().toLocaleDateString() });
    }

    saveBucketList(list);
    renderDistrictCards();
  };

  function updateBucketBadge() {
    const badges = document.querySelectorAll('.bucket-count-badge');
    const list = getSavedBucketList();
    badges.forEach(b => {
      b.textContent = list.length;
    });
  }

  function renderWishlistDrawer() {
    const body = document.getElementById('wishlistDrawerBody');
    if (!body) return;
    const list = getSavedBucketList();

    if (list.length === 0) {
      body.innerHTML = `
        <div style="padding: 40px 10px; text-align: center; color: var(--text-muted);">
          <p style="font-size: 28px; margin-bottom: 10px;">♥</p>
          <p style="font-weight: 600; color: var(--text-primary); font-size: 16px;">Your Bucket List is Empty</p>
          <p style="font-size: 13px; margin-top: 6px;">Tap the heart icon on any district or luxury resort to curate your bespoke trip!</p>
        </div>
      `;
      return;
    }

    body.innerHTML = list.map((item, idx) => `
      <div class="wishlist-item">
        <div>
          <div class="wishlist-item-title">${item.title}</div>
          <div class="wishlist-item-type">${item.type} · Added ${item.date}</div>
        </div>
        <button style="background: none; border: none; color: #e11d48; cursor: pointer; font-size: 16px; padding: 4px;" title="Remove" onclick="window.toggleWishlistItem('${item.title.replace(/'/g, "\\'")}', '${item.type}', event)">
          ✕
        </button>
      </div>
    `).join('');
  }

  window.toggleWishlistDrawer = function (open) {
    const drawer = document.getElementById('wishlistDrawer');
    if (drawer) {
      if (typeof open === 'boolean') {
        drawer.classList.toggle('open', open);
      } else {
        drawer.classList.toggle('open');
      }
      renderWishlistDrawer();
    }
  };

  window.clearWishlist = function () {
    if (confirm('Clear your entire Kerala travel bucket list?')) {
      saveBucketList([]);
      renderDistrictCards();
    }
  };

  window.printWishlist = function () {
    window.print();
  };

  /* -------------------------------------------------------------------------
   * 5. Interactive Kerala Trip Planner & Cost Estimator
   * ------------------------------------------------------------------------- */
  const plannerPillsDuration = document.querySelectorAll('[data-planner-days]');
  const plannerPillsStyle = document.querySelectorAll('[data-planner-style]');
  const plannerResultRoute = document.getElementById('plannerResultRoute');
  const plannerResultBudget = document.getElementById('plannerResultBudget');
  const plannerResultDesc = document.getElementById('plannerResultDesc');
  const plannerResultHighlights = document.getElementById('plannerResultHighlights');

  let selectedDays = 5;
  let selectedStyle = 'luxury';

  const itineraries = {
    3: {
      title: '3-Day Backwaters & Coastal Serenade',
      districts: ['Ernakulam (Kochi)', 'Alappuzha', 'Kottayam'],
      desc: 'Explore historic Fort Kochi colonial quarters, cruise the palm-fringed lagoons of Alappuzha on a luxury houseboat, and conclude with birdwatching in Kumarakom.',
      budgetPerPerson: { luxury: '₹34,000', heritage: '₹22,000', eco: '₹18,000', backpacker: '₹9,500' },
      highlights: ['Sunset at Chinese Fishing Nets', 'Houseboat Stay with Karimeen Pollichathu', 'Kumarakom Wetland Safari']
    },
    5: {
      title: '5-Day Classic Highlands & Backwaters Voyage',
      districts: ['Ernakulam', 'Idukki (Munnar)', 'Alappuzha', 'Kollam'],
      desc: 'The essential Kerala journey: mist-blanketed tea estates of Munnar, serene lake cruises in Alappuzha, and the historic red laterite cliffs of Kollam.',
      budgetPerPerson: { luxury: '₹58,000', heritage: '₹38,000', eco: '₹29,000', backpacker: '₹16,000' },
      highlights: ['Tea Tasting at Top Station', 'Periyar Wildlife Sanctuary', 'Ashtamudi Lake Mangrove Canoeing']
    },
    7: {
      title: '7-Day Grand Cultural & Wilderness Odyssey',
      districts: ['Thiruvananthapuram', 'Kollam', 'Alappuzha', 'Idukki', 'Ernakulam', 'Thrissur'],
      desc: 'A magnificent trans-Kerala tour from the southern royal temples of Travancore through spice hills, backwater networks, to Thrissur’s temple art schools.',
      budgetPerPerson: { luxury: '₹88,000', heritage: '₹54,000', eco: '₹42,000', backpacker: '₹23,000' },
      highlights: ['Padmanabhaswamy Temple', 'Athirappilly Niagara Waterfalls', 'Kathakali Live Performance']
    },
    10: {
      title: '10-Day Sovereign Complete Kerala Expedition',
      districts: ['Thiruvananthapuram', 'Alappuzha', 'Idukki', 'Thrissur', 'Kozhikode', 'Wayanad', 'Kannur', 'Bekal'],
      desc: 'The definitive expedition through all regions of God’s Own Country: royal south, highland cloud forests, spice coast of Malabar, Theyyam ritual shrines, and Bekal Fort.',
      budgetPerPerson: { luxury: '₹1,35,000', heritage: '₹84,000', eco: '₹65,000', backpacker: '₹35,000' },
      highlights: ['Sacred Theyyam Ritual Night', 'Edakkal Prehistoric Caves', 'Thalassery Biryani Feast', 'Bekal Sea Fort Ramparts']
    }
  };

  function updatePlannerDisplay() {
    if (!plannerResultRoute) return;
    const plan = itineraries[selectedDays] || itineraries[5];
    const budget = plan.budgetPerPerson[selectedStyle] || '₹45,000';

    plannerResultRoute.textContent = plan.title;
    if (plannerResultDesc) plannerResultDesc.textContent = plan.desc;
    if (plannerResultBudget) plannerResultBudget.textContent = budget;

    if (plannerResultHighlights) {
      plannerResultHighlights.innerHTML = `
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--c-gold-bright); margin-bottom: 8px;">Curated Route Stops:</div>
        <div class="itinerary-stop-chips">
          ${plan.districts.map(d => `<span class="itinerary-stop-chip">📍 ${d}</span>`).join('')}
        </div>
      `;
    }
  }

  if (plannerPillsDuration) {
    plannerPillsDuration.forEach(p => {
      p.addEventListener('click', () => {
        plannerPillsDuration.forEach(x => x.classList.remove('active'));
        p.classList.add('active');
        selectedDays = Number(p.dataset.plannerDays);
        updatePlannerDisplay();
      });
    });
  }

  if (plannerPillsStyle) {
    plannerPillsStyle.forEach(p => {
      p.addEventListener('click', () => {
        plannerPillsStyle.forEach(x => x.classList.remove('active'));
        p.classList.add('active');
        selectedStyle = p.dataset.plannerStyle;
        updatePlannerDisplay();
      });
    });
  }

  window.saveCurrentItineraryToBucket = function () {
    const plan = itineraries[selectedDays] || itineraries[5];
    window.toggleWishlistItem(`${plan.title} (${selectedDays} Days)`, 'Itinerary');
    alert(`Added "${plan.title}" to your Kerala Bucket List!`);
  };

  /* -------------------------------------------------------------------------
   * 6. Web Audio API Ambient Soundscape Synthesizer (Kerala Backwaters & Rain)
   * ------------------------------------------------------------------------- */
  let audioCtx = null;
  let isSoundPlaying = false;
  let soundNodes = [];

  window.toggleSoundscape = function () {
    const btn = document.getElementById('soundToggleBtn');

    if (isSoundPlaying) {
      // Stop sound
      soundNodes.forEach(node => {
        try { node.stop ? node.stop() : node.disconnect(); } catch (e) {}
      });
      soundNodes = [];
      isSoundPlaying = false;
      if (btn) {
        btn.classList.remove('playing');
        btn.querySelector('.sound-btn-text').textContent = 'Backwater Breeze ♫';
      }
      return;
    }

    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Generate Pink Noise (natural rain & gentle water sound)
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.04; // Gentle quiet volume
        b6 = white * 0.115926;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter to simulate soft river murmur
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, audioCtx.currentTime);

      // Gentle LFO filter modulation (water wave undulation)
      const lfo = audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.25, audioCtx.currentTime); // 4 second swell cycle
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(180, audioCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.08, audioCtx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(audioCtx.destination);

      whiteNoise.start();
      lfo.start();

      soundNodes = [whiteNoise, lfo, filter, masterGain, lfoGain];
      isSoundPlaying = true;

      if (btn) {
        btn.classList.add('playing');
        btn.querySelector('.sound-btn-text').textContent = 'Pause Sound ⏸';
      }
    } catch (err) {
      console.warn('Web Audio Ambient Synthesizer could not initialize:', err);
    }
  };

  /* -------------------------------------------------------------------------
   * 7. Header Scroll & Progress Bar
   * ------------------------------------------------------------------------- */
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (progressBar && docHeight > 0) {
      progressBar.style.width = `${Math.min(100, Math.max(0, (scrollY / docHeight) * 100))}%`;
    }

    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // Mobile menu toggle
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mainNav.classList.remove('open'));
    });
  }

  // Initial runs
  renderDistrictCards();
  updatePlannerDisplay();
  updateBucketBadge();
})();
