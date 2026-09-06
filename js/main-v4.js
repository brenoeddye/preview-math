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

  function openDrawer() { navDrawer?.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { navDrawer?.classList.remove('open'); document.body.style.overflow = ''; }

  navMobileBtn?.addEventListener('click', openDrawer);
  navDrawerClose?.addEventListener('click', closeDrawer);
  navDrawer?.addEventListener('click', (e) => { if (e.target === navDrawer) closeDrawer(); });
  navDrawer?.querySelectorAll('.nav-drawer-link').forEach((link) => {
    link.addEventListener('click', closeDrawer);
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
    let ticking = false;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function measure() {
      if (window.matchMedia('(max-width: 980px)').matches) {
        track.style.transform = '';
        viewport.style.setProperty('--timeline-progress', '1');
        return;
      }

      const sectionRect = section.getBoundingClientRect();
      const scrollY = window.pageYOffset;
      start = sectionRect.top + scrollY;
      end = start + section.offsetHeight - window.innerHeight;
      maxTranslate = Math.max(0, track.scrollWidth - viewport.clientWidth);
      update();
    }

    function update() {
      ticking = false;

      if (window.matchMedia('(max-width: 980px)').matches) return;

      const progress = clamp((window.pageYOffset - start) / Math.max(1, end - start), 0, 1);
      track.style.transform = `translate3d(${-maxTranslate * progress}px, 0, 0)`;
      viewport.style.setProperty('--timeline-progress', progress.toFixed(4));
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', measure);
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

      const startTime = performance.now();
      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased).toLocaleString('pt-BR');

        if (progress < 1) {
          window.requestAnimationFrame(tick);
        } else {
          counter.textContent = target.toLocaleString('pt-BR');
        }
      }

      window.requestAnimationFrame(tick);
    }

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
     NAVBAR ACTIVE STATE
     ---------------------------------------------------------- */
  function initNavbarActive() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      { threshold: 0.25, rootMargin: '-80px 0px -60% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
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
