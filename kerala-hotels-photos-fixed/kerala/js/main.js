/**
 * KERALA — IMMERSIVE TOURISM EXPERIENCE
 * Scroll Animations, Parallax Engine & Interactive UI
 */

(function () {
  'use strict';

  const data = window.KERALA_DATA;
  const grid = document.getElementById('districtGrid');
  const search = document.getElementById('districtSearch');
  const searchClear = document.getElementById('searchClear');
  const count = document.getElementById('districtCount');
  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const progressBar = document.getElementById('scrollProgressBar');
  const heroBg = document.getElementById('heroBg');
  const heroContent = document.querySelector('.hero-content');
  const cultureBg = document.getElementById('cultureBg');

  /* -------------------------------------------------------------------------
   * 1. District Grid Rendering & Interactive Filtering
   * ------------------------------------------------------------------------- */
  function renderDistricts(query = '') {
    if (!grid || !data) return;

    const trimmed = query.trim().toLowerCase();
    const filtered = data.districts.filter(d => 
      d.name.toLowerCase().includes(trimmed) || 
      (d.tag && d.tag.toLowerCase().includes(trimmed)) ||
      (d.short && d.short.toLowerCase().includes(trimmed))
    );

    if (count) {
      count.textContent = filtered.length;
    }

    if (searchClear) {
      searchClear.style.display = trimmed.length > 0 ? 'inline-block' : 'none';
    }

    if (!filtered.length) {
      grid.innerHTML = '<div class="no-results">No district found matching your search. Try another name.</div>';
      return;
    }

    grid.innerHTML = filtered.map((d) => {
      const i = data.districts.indexOf(d);
      const heroImg = data.images.districts[d.slug]?.hero || '';
      const imgUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(heroImg)}?width=900`;

      return `
        <a class="district-card" href="districts/${d.slug}.html" data-district="${d.slug}">
          <img loading="lazy" src="${imgUrl}" alt="${d.name} district landscape">
          <div class="district-card-content">
            <span class="number">${String(i + 1).padStart(2, '0')} / 14 · ${d.tag}</span>
            <h3>${d.name}</h3>
            <p>${d.short}</p>
            <span class="arrow">↗</span>
          </div>
        </a>
      `;
    }).join('');

    attachCardTilt();
  }

  // Initial render
  renderDistricts();

  // Search input events
  if (search) {
    search.addEventListener('input', (e) => renderDistricts(e.target.value));
    
    // Global keyboard shortcut: press '/' to focus search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== search) {
        e.preventDefault();
        search.focus();
      } else if (e.key === 'Escape' && document.activeElement === search) {
        search.value = '';
        renderDistricts('');
        search.blur();
      }
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (search) {
        search.value = '';
        renderDistricts('');
        search.focus();
      }
    });
  }

  /* -------------------------------------------------------------------------
   * 2. 3D Subtle Tilt Effect on Desktop Cards
   * ------------------------------------------------------------------------- */
  function attachCardTilt() {
    // Only enable tilt on non-touch devices with fine pointers
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const cards = document.querySelectorAll('.district-card, .experience-card');
      cards.forEach(card => {
        card.addEventListener('mousemove', handleCardMouseMove);
        card.addEventListener('mouseleave', handleCardMouseLeave);
      });
    }
  }

  function handleCardMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5; // max 5deg tilt
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  }

  function handleCardMouseLeave(e) {
    const card = e.currentTarget;
    card.style.transform = '';
  }

  /* -------------------------------------------------------------------------
   * 3. Scroll Progress Indicator & Parallax Controller
   * ------------------------------------------------------------------------- */
  let ticking = false;

  function updateOnScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // 3a. Update scroll progress bar
    if (progressBar && docHeight > 0) {
      const progress = (scrollY / docHeight) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    // 3b. Header scrolled state
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // 3c. Hero Parallax & Fade
    if (heroBg && scrollY <= window.innerHeight * 1.2) {
      const heroOffset = scrollY * 0.35;
      heroBg.style.transform = `translate3d(0, ${heroOffset}px, 0) scale(${1 + scrollY * 0.0002})`;
      
      if (heroContent) {
        const opacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.8));
        const translateY = scrollY * 0.22;
        heroContent.style.opacity = opacity.toFixed(3);
        heroContent.style.transform = `translate3d(0, ${translateY}px, 0)`;
      }
    }

    // 3d. Culture Photo Parallax
    if (cultureBg) {
      const rect = cultureBg.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const diff = (window.innerHeight - rect.top) * 0.08;
        cultureBg.style.backgroundPositionY = `calc(50% + ${diff}px)`;
      }
    }

    // 3e. Active navigation anchor highlighting
    highlightActiveNavLink(scrollY);

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateOnScroll);
      ticking = true;
    }
  }, { passive: true });

  /* -------------------------------------------------------------------------
   * 4. Active Nav Highlighting
   * ------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

  function highlightActiveNavLink(scrollY) {
    let currentId = '';
    const scrollPosition = scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  }

  /* -------------------------------------------------------------------------
   * 5. Intersection Observer for Scroll-Triggered Reveals & Counter Animation
   * ------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');

          // Trigger number counter animation if inside stats
          if (entry.target.classList.contains('stats')) {
            animateStatsNumbers(entry.target);
          }

          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: make all visible immediately
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  /* -------------------------------------------------------------------------
   * 6. Animated Stats Counter
   * ------------------------------------------------------------------------- */
  function animateStatsNumbers(statsContainer) {
    const statElements = statsContainer.querySelectorAll('strong');
    
    statElements.forEach(stat => {
      const originalText = stat.textContent.trim();
      const match = originalText.match(/^(\d+)(\+)?$/);
      if (!match) return;

      const targetNum = parseInt(match[1], 10);
      const suffix = match[2] || '';
      const duration = 1600;
      const startTime = performance.now();

      function updateNumber(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(ease * targetNum);

        stat.textContent = `${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          stat.textContent = originalText;
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  /* -------------------------------------------------------------------------
   * 7. Mobile Navigation Toggle & Smooth Anchor Scroll
   * ------------------------------------------------------------------------- */
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.textContent = isOpen ? '✕' : '☰';
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile nav on anchor link click
    document.querySelectorAll('.main-nav a').forEach(a => {
      a.addEventListener('click', () => {
        if (mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.textContent = '☰';
          document.body.style.overflow = '';
        }
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && e.target !== menuToggle) {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
        document.body.style.overflow = '';
      }
    });
  }

  // Trigger initial scroll update
  updateOnScroll();
})();
