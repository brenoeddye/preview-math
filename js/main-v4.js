/* ==========================================================
   MAIN — INDEX4 (Conversivo)
   ========================================================== */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     NAVBAR SCROLL
     ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  function handleNavScroll() {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ----------------------------------------------------------
     MOBILE DRAWER
     ---------------------------------------------------------- */
  const navMobileBtn = document.getElementById('navMobileBtn');
  const navDrawer = document.getElementById('navDrawer');
  const navDrawerClose = document.getElementById('navDrawerClose');

  function openDrawer() {
    navDrawer?.classList.add('open');
    navMobileBtn?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-drawer-open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    navDrawer?.classList.remove('open');
    navMobileBtn?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-drawer-open');
    document.body.style.overflow = '';
  }

  navMobileBtn?.addEventListener('click', openDrawer);
  navDrawerClose?.addEventListener('click', closeDrawer);
  navDrawer?.addEventListener('click', (e) => { if (e.target === navDrawer) closeDrawer(); });
  navDrawer?.querySelectorAll('.nav-drawer-link, .nav-drawer-cta').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');

      if (href?.startsWith('#')) {
        event.preventDefault();
        closeDrawer();

        window.setTimeout(() => {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.pushState(null, '', href);
        }, 180);
        return;
      }

      closeDrawer();
    });
  });

  /* ----------------------------------------------------------
     STICKY BAR
     ---------------------------------------------------------- */
  const stickyBar = document.getElementById('stickyBar');
  const finalSection = document.getElementById('contato');
  function handleStickyBar() {
    if (!stickyBar) return;

    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    const finalRect = finalSection?.getBoundingClientRect();
    const finalIsVisible = finalRect ? finalRect.top < window.innerHeight * 0.85 : false;

    stickyBar.classList.toggle('visible', window.scrollY > 600 && !finalIsVisible && !isMobile);
  }
  window.addEventListener('scroll', handleStickyBar, { passive: true });
  window.addEventListener('resize', handleStickyBar);
  handleStickyBar();

  /* ----------------------------------------------------------
     URGENCY COUNTER
     ---------------------------------------------------------- */
  const vacancyLive = document.getElementById('vacancyLive');
  if (vacancyLive?.dataset.urgencyCounter === 'true') {
    setTimeout(() => {
      vacancyLive.textContent = 'Apenas 2 vagas';
      vacancyLive.style.color = '#ef4444';
    }, 45000);
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL
     ---------------------------------------------------------- */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  }
  initScrollReveal();

  /* ----------------------------------------------------------
     METHOD CARDS — scroll driven
     ---------------------------------------------------------- */
  function initMethodScrollCards() {
    const cards = document.querySelectorAll('[data-method-scroll-card]');
    if (!cards.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      cards.forEach((card) => {
        card.style.setProperty('--method-card-progress', '1');
        card.classList.add('is-filled');
      });
      return;
    }

    let ticking = false;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function update() {
      ticking = false;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const start = window.innerHeight * 1.08;
        const end = window.innerHeight * 0.82;
        const progress = clamp((start - rect.top) / Math.max(1, start - end), 0, 1);

        card.style.setProperty('--method-card-progress', progress.toFixed(3));
        card.classList.toggle('is-filled', progress > 0.92);
      });
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    update();
  }
  initMethodScrollCards();

  /* ----------------------------------------------------------
     ACCORDION (Fases)
     ---------------------------------------------------------- */
  function initAccordion(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const triggers = container.querySelectorAll('.accordion-trigger');
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion-item');
        const isActive = item.classList.contains('active');

        container.querySelectorAll('.accordion-item').forEach((sib) => {
          sib.classList.remove('active');
          sib.querySelector('.accordion-trigger')?.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
  initAccordion('fasesAccordion');

  /* ----------------------------------------------------------
     FAQ (Linha Editorial) — com ícone +/- 
     ---------------------------------------------------------- */
  function initFaq(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const questions = container.querySelectorAll('.faq-question');
    questions.forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isActive = item.classList.contains('active');

        container.querySelectorAll('.faq-item').forEach((i) => {
          i.classList.remove('active');
          i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
  initFaq('editorialFaq');

  /* ----------------------------------------------------------
     SMARTPHONE NOTIFICATIONS — scroll driven
     ---------------------------------------------------------- */
  function initNotifications() {
    const lists = document.querySelectorAll('.notifications-list');
    lists.forEach((list) => {
      const notifs = list.querySelectorAll('.notification');
      if (!notifs.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              notifs.forEach((n, i) => {
                setTimeout(() => n.classList.add('visible'), i * 200);
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(list);
    });
  }
  initNotifications();

  /* ----------------------------------------------------------
     HORIZONTAL TIMELINE — pinned scroll
     ---------------------------------------------------------- */
  function initHorizontalTimeline() {
    const section = document.querySelector('[data-horizontal-timeline]');
    if (!section) return;

    const viewport = section.querySelector('.timeline-horizontal');
    const track = section.querySelector('.timeline-track');
    if (!viewport || !track) return;

    let maxTranslate = 0;
    let start = 0;
    let end = 1;
    let scrollDistance = 0;
    let ticking = false;
    const desktopQuery = window.matchMedia('(min-width: 981px)');

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function measure() {
      if (!desktopQuery.matches) {
        section.style.removeProperty('--timeline-scroll-height');
        track.style.transform = '';
        viewport.style.setProperty('--timeline-progress', '1');
        return;
      }

      const viewportWidth = Math.max(
        viewport.getBoundingClientRect().width,
        viewport.clientWidth,
        1
      );

      if (viewportWidth <= 1) {
        window.requestAnimationFrame(measure);
        return;
      }

      maxTranslate = Math.max(0, track.scrollWidth - viewportWidth);
      scrollDistance = maxTranslate > 0 ? Math.ceil(maxTranslate) : 0;
      section.style.setProperty('--timeline-scroll-height', `${Math.ceil(window.innerHeight + scrollDistance)}px`);

      const sectionRect = section.getBoundingClientRect();
      const scrollY = window.pageYOffset;
      start = sectionRect.top + scrollY;
      end = start + scrollDistance;
      update();
    }

    function update() {
      ticking = false;

      if (!desktopQuery.matches) return;

      const progress = clamp((window.pageYOffset - start) / Math.max(1, end - start), 0, 1);
      const translate = clamp(maxTranslate * progress, 0, maxTranslate);
      track.style.transform = `translate3d(${-translate}px, 0, 0)`;
      viewport.style.setProperty('--timeline-progress', progress.toFixed(4));
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    document.fonts?.ready?.then(measure);
    window.requestAnimationFrame(measure);
    measure();
  }
  initHorizontalTimeline();

  /* ----------------------------------------------------------
     COUNT-UP STATS
     ---------------------------------------------------------- */
  function initCountUpStats() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const duration = 850;

    function animate(counter) {
      const target = Number(counter.dataset.count);
      if (!Number.isFinite(target)) return;

      const start = Math.max(1, Math.floor(target * 0.68));
      const startTime = performance.now();
      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = start + ((target - start) * eased);
        counter.textContent = Math.round(value).toLocaleString('pt-BR');

        if (progress < 1) {
          window.requestAnimationFrame(tick);
        } else {
          counter.textContent = target.toLocaleString('pt-BR');
        }
      }

      window.requestAnimationFrame(tick);
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    counters.forEach((counter) => {
      const target = Number(counter.dataset.count);
      if (Number.isFinite(target)) counter.textContent = target.toLocaleString('pt-BR');
    });

    if (reduceMotion || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }
  initCountUpStats();

  /* ----------------------------------------------------------
     RATINGS CAROUSEL
     ---------------------------------------------------------- */
  function initRatingsCarousel() {
    const carousel = document.querySelector('[data-ratings-carousel]');
    if (!carousel) return;

    const track = carousel.querySelector('[data-ratings-track]');
    const slides = carousel.querySelectorAll('[data-rating-slide]');
    const dots = carousel.querySelectorAll('[data-rating-dot]');
    const prevBtn = carousel.querySelector('[data-rating-prev]');
    const nextBtn = carousel.querySelector('[data-rating-next]');
    if (!track || slides.length < 2 || !dots.length || !prevBtn || !nextBtn) return;

    const realSlideCount = dots.length;
    const firstRealIndex = realSlideCount;
    const transitionDuration = 840;
    let currentIndex = firstRealIndex;

    function getActiveKey() {
      return Number(slides[currentIndex]?.dataset.ratingKey || 0);
    }

    function centerTrack(useTransition = true) {
      const activeSlide = slides[currentIndex];
      if (!activeSlide) return;

      track.classList.toggle('no-transition', !useTransition);
      const targetCenter = activeSlide.offsetLeft + (activeSlide.offsetWidth / 2);
      const viewportCenter = carousel.offsetWidth / 2;
      track.style.transform = `translate3d(${viewportCenter - targetCenter}px, 0, 0)`;
    }

    function updateState(useTransition = true) {
      const activeKey = getActiveKey();

      slides.forEach((slide, index) => {
        const distance = Math.abs(index - currentIndex);
        slide.classList.toggle('is-active', index === currentIndex);
        slide.classList.toggle('is-neighbor', distance === 1);
      });

      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeKey);
      });

      centerTrack(useTransition);
    }

    function normalizeLoopPosition() {
      const activeKey = getActiveKey();
      if (currentIndex < firstRealIndex || currentIndex >= firstRealIndex + realSlideCount) {
        currentIndex = firstRealIndex + activeKey;
        updateState(false);
      }
    }

    function showSlide(nextIndex, useTransition = true) {
      currentIndex = nextIndex;
      updateState(useTransition);
      window.setTimeout(normalizeLoopPosition, transitionDuration);
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function prevSlide() {
      showSlide(currentIndex - 1);
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(firstRealIndex + index);
      });
    });

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    window.addEventListener('resize', () => centerTrack(false));
    window.requestAnimationFrame(() => updateState(false));
  }
  initRatingsCarousel();

  /* ----------------------------------------------------------
     NAVBAR ACTIVE STATE
     ---------------------------------------------------------- */
  function initNavbarActive() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const drawerLinks = document.querySelectorAll('.nav-drawer-link');
    if (!navLinks.length) return;

    const targets = Array.from(navLinks)
      .map((link) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return null;
        const section = document.querySelector(href);
        return section ? { href, section } : null;
      })
      .filter(Boolean);

    if (!targets.length) return;

    function updateActiveLink() {
      const offset = (navbar?.offsetHeight || 72) + 12;
      const checkpoint = window.scrollY + offset;
      let activeHref = '';

      targets.forEach(({ href, section }) => {
        if (section.offsetTop <= checkpoint) {
          activeHref = href;
        }
      });

      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === activeHref);
      });

      drawerLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === activeHref);
      });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    window.addEventListener('resize', updateActiveLink);
    window.addEventListener('load', updateActiveLink);
    window.addEventListener('hashchange', updateActiveLink);
    window.requestAnimationFrame(updateActiveLink);
    updateActiveLink();
  }
  initNavbarActive();

  /* ----------------------------------------------------------
     SMOOTH SCROLL
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     CTA PARTICLES
     ---------------------------------------------------------- */
  function initParticles() {
    const container = document.getElementById('ctaParticles');
    if (!container) return;

    for (let i = 0; i < 15; i++) {
      const p = document.createElement('div');
      p.className = 'cta-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (6 + Math.random() * 6) + 's';
      p.style.animationDelay = (Math.random() * 6) + 's';
      p.style.width = (2 + Math.random() * 4) + 'px';
      p.style.height = p.style.width;
      container.appendChild(p);
    }
  }
  initParticles();
})();
