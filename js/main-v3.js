/* ============================================================
   MAIN JS v3 - Retenção de atenção & Conversão
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     NAVBAR SCROLL
     ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ----------------------------------------------------------
     MOBILE MENU
     ---------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  function toggleMenu() {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  }
  mobileMenuBtn.addEventListener('click', toggleMenu);
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (navLinks.classList.contains('active')) toggleMenu();
    });
  });

  /* ----------------------------------------------------------
     SCROLL SUAVE
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     FAQ ACCORDION
     ---------------------------------------------------------- */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ----------------------------------------------------------
     STICKY CTA BAR
     Aparece após scrollar 600px
     ---------------------------------------------------------- */
  const stickyCta = document.getElementById('stickyCta');
  let stickyVisible = false;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 600 && !stickyVisible) {
      stickyCta.classList.add('visible');
      stickyVisible = true;
    } else if (window.scrollY <= 600 && stickyVisible) {
      stickyCta.classList.remove('visible');
      stickyVisible = false;
    }
  }, { passive: true });

  /* ----------------------------------------------------------
     SCROLL REVEAL (Intersection Observer)
     Anima elementos ao entrar na viewport
     ---------------------------------------------------------- */
  const revealSelectors = [
    '.pain-card',
    '.solution-card',
    '.testimonial-card',
    '.about-image',
    '.about-content',
    '.stat-card',
    '.include-card',
    '.faq-item',
    '.cta-final-content'
  ];

  const revealElements = document.querySelectorAll(revealSelectors.join(', '));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el, index) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.55s ease ' + (index % 3 * 0.1) + 's, transform 0.55s ease ' + (index % 3 * 0.1) + 's';
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }

  /* ----------------------------------------------------------
     CONTADOR DE VAGAS (efeito visual de urgência)
     ---------------------------------------------------------- */
  const spotsEl = document.getElementById('spotsLeft');
  if (spotsEl) {
    let spots = 3;
    // Após 45s na página, diminui 1 vaga
    setTimeout(function () {
      spots = 2;
      spotsEl.textContent = spots + ' restantes';
      spotsEl.style.color = '#ef4444';
      spotsEl.style.transition = 'color 0.5s ease';
    }, 45000);
  }

  /* ----------------------------------------------------------
     NOTIFICATIONS SCROLL REVEAL (Smartphone)
     ---------------------------------------------------------- */
  const phoneSection = document.querySelector('.phone-section');
  const notifications = document.querySelectorAll('.notification');

  if (phoneSection && notifications.length) {
    let phoneInView = false;

    function updateNotifications() {
      if (!phoneInView) return;
      const rect = phoneSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const scrollProgress = Math.max(0, Math.min(1,
        (windowHeight - sectionTop) / (windowHeight + sectionHeight)
      ));

      notifications.forEach(function (notif, index) {
        const threshold = (index + 1) / (notifications.length + 1);
        if (scrollProgress >= threshold * 0.85) {
          notif.classList.add('visible');
        } else {
          notif.classList.remove('visible');
        }
      });
    }

    const phoneObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        phoneInView = entry.isIntersecting;
        if (phoneInView) updateNotifications();
      });
    }, {
      threshold: 0,
      rootMargin: '50px 0px 50px 0px'
    });

    phoneObserver.observe(phoneSection);

    let phoneTicking = false;
    window.addEventListener('scroll', function () {
      if (!phoneTicking) {
        window.requestAnimationFrame(function () {
          updateNotifications();
          phoneTicking = false;
        });
        phoneTicking = true;
      }
    }, { passive: true });

    updateNotifications();
  }

  /* ----------------------------------------------------------
     PARALLAX SUTIL NO HERO
     ---------------------------------------------------------- */
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && !window.matchMedia('(pointer: coarse)').matches) {
    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroVisual.style.transform = 'translateY(' + (scrolled * 0.08) + 'px)';
      }
    }, { passive: true });
  }

})();
