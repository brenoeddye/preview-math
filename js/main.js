/* ============================================================
   MAIN JS - Interações leves e performáticas
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     ELEMENTOS
     ---------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  /* ----------------------------------------------------------
     NAVBAR SCROLL EFFECT
     Adiciona fundo blur ao scrollar
     ---------------------------------------------------------- */
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Executa uma vez no load

  /* ----------------------------------------------------------
     MOBILE MENU TOGGLE
     ---------------------------------------------------------- */
  function toggleMenu() {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  }

  mobileMenuBtn.addEventListener('click', toggleMenu);

  // Fecha menu ao clicar em um link
  navLinkItems.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navLinks.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  /* ----------------------------------------------------------
     SCROLL SUAVE PARA ANCORAS
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ----------------------------------------------------------
     INFINITE CAROUSEL - Duplica itens para loop perfeito
     ---------------------------------------------------------- */
  const carouselTrack = document.getElementById('carouselTrack');
  if (carouselTrack) {
    const items = carouselTrack.querySelectorAll('.module-card');
    // Clona todos os cards e append para criar o efeito infinito
    items.forEach(function (item) {
      const clone = item.cloneNode(true);
      carouselTrack.appendChild(clone);
    });
  }

  /* ----------------------------------------------------------
     TESTIMONIALS REVEAL EFFECT
     Bola branca cresce do fundo preenchendo a seção,
     depois o conteúdo faz fade in
     ---------------------------------------------------------- */
  const testimonialsSection = document.querySelector('.testimonials');
  const revealCircle = document.getElementById('revealCircle');
  const testimonialsContent = document.getElementById('testimonialsContent');

  if (testimonialsSection && revealCircle && testimonialsContent) {
    let testimonialsInView = false;

    function updateTestimonialsReveal() {
      if (!testimonialsInView) return;

      const rect = testimonialsSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;

      // Progresso de 0 a 1 baseado na posição da seção na viewport
      const rawProgress = (windowHeight - rect.top) / (windowHeight + sectionHeight);
      const progress = Math.max(0, Math.min(1, rawProgress));

      // Fase 1: Bola cresce suavemente — completa nos primeiros 25% do scroll
      const circleScale = Math.min(3.5, progress * 14);
      revealCircle.style.transform = 'translateX(-50%) scale(' + circleScale + ')';

      // Fase 2: Conteúdo faz fade in logo em seguida — completo aos 35%
      const contentProgress = Math.max(0, Math.min(1, (progress - 0.12) / 0.23));
      testimonialsContent.style.opacity = contentProgress;
      testimonialsContent.style.transform = 'translateY(' + (25 * (1 - contentProgress)) + 'px)';
    }

    const testimonialsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        testimonialsInView = entry.isIntersecting;
        if (testimonialsInView) {
          updateTestimonialsReveal();
        }
      });
    }, {
      threshold: 0,
      rootMargin: '100px 0px 100px 0px'
    });

    testimonialsObserver.observe(testimonialsSection);

    let testimonialsTicking = false;
    window.addEventListener('scroll', function () {
      if (!testimonialsTicking) {
        window.requestAnimationFrame(function () {
          updateTestimonialsReveal();
          testimonialsTicking = false;
        });
        testimonialsTicking = true;
      }
    }, { passive: true });

    updateTestimonialsReveal();
  }

  /* ----------------------------------------------------------
     ABOUT SCROLL REVEAL
     Foto desce de cima (top→bottom) e conteúdo sobe de baixo (bottom→top)
     ---------------------------------------------------------- */
  const aboutSection = document.querySelector('.about');
  const aboutVisual = document.getElementById('aboutVisual');
  const aboutContent = document.getElementById('aboutContent');

  if (aboutSection && aboutVisual && aboutContent) {
    let aboutInView = false;

    function updateAboutReveal() {
      if (!aboutInView) return;

      const rect = aboutSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;

      // Progresso de 0 a 1
      const rawProgress = (windowHeight - rect.top) / (windowHeight + sectionHeight);
      const progress = Math.max(0, Math.min(1, rawProgress));

      // Foto: desce de cima (começa em -60px, vai para 0)
      // Animação completa nos primeiros 40% do progresso
      const photoProgress = Math.min(1, progress * 2.5);
      aboutVisual.style.opacity = photoProgress;
      aboutVisual.style.transform = 'translateY(' + (-60 * (1 - photoProgress)) + 'px)';

      // Conteúdo: sobe de baixo (começa em +60px, vai para 0)
      // Começa um pouco depois da foto, completa aos 55%
      const contentProgress = Math.max(0, Math.min(1, (progress - 0.08) * 2));
      aboutContent.style.opacity = contentProgress;
      aboutContent.style.transform = 'translateY(' + (60 * (1 - contentProgress)) + 'px)';
    }

    const aboutObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        aboutInView = entry.isIntersecting;
        if (aboutInView) {
          updateAboutReveal();
        }
      });
    }, {
      threshold: 0,
      rootMargin: '80px 0px 80px 0px'
    });

    aboutObserver.observe(aboutSection);

    let aboutTicking = false;
    window.addEventListener('scroll', function () {
      if (!aboutTicking) {
        window.requestAnimationFrame(function () {
          updateAboutReveal();
          aboutTicking = false;
        });
        aboutTicking = true;
      }
    }, { passive: true });

    updateAboutReveal();
  }

  /* ----------------------------------------------------------
     NOTIFICATIONS SCROLL REVEAL
     As notificações aparecem conforme o usuário scrolla a seção
     ---------------------------------------------------------- */
  const targetSection = document.querySelector('.target-audience');
  const notifications = document.querySelectorAll('.notification');

  if (targetSection && notifications.length) {
    let isInView = false;

    function updateNotifications() {
      if (!isInView) return;

      const rect = targetSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calcula o progresso do scroll dentro da seção
      // 0 = topo da seção atingiu o fundo da tela
      // 1 = base da seção atingiu o topo da tela
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const scrollProgress = Math.max(0, Math.min(1,
        (windowHeight - sectionTop) / (windowHeight + sectionHeight)
      ));

      // Ativa cada notificação baseada no seu threshold
      notifications.forEach(function (notif, index) {
        // Distribui os thresholds de forma que todas apareçam
        // antes da seção chegar ao centro da tela
        const threshold = (index + 1) / (notifications.length + 1);

        if (scrollProgress >= threshold * 0.85) {
          notif.classList.add('visible');
        } else {
          notif.classList.remove('visible');
        }
      });
    }

    // Observer para saber quando a seção está visível
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        isInView = entry.isIntersecting;
        if (isInView) {
          updateNotifications();
        }
      });
    }, {
      threshold: 0,
      rootMargin: '50px 0px 50px 0px'
    });

    sectionObserver.observe(targetSection);

    // Atualiza no scroll com throttle leve via rAF
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateNotifications();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Executa uma vez no load
    updateNotifications();
  }

  /* ----------------------------------------------------------
     REVEAL ON SCROLL (Intersecion Observer)
     Anima elementos ao entrar na viewport
     ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.module-card, .modules-header');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function (el, index) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease ' + (index * 0.05) + 's, transform 0.6s ease ' + (index * 0.05) + 's';
      revealObserver.observe(el);
    });

    // CSS para estado revelado
    const style = document.createElement('style');
    style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
  }

  /* ----------------------------------------------------------
     FAQ GLOW SCROLL EFFECT
     Bola azul cresce conforme o usuário scrolla a seção FAQ
     ---------------------------------------------------------- */
  const faqSection = document.querySelector('.faq');
  const faqGlow = document.getElementById('faqGlow');

  if (faqSection && faqGlow) {
    let faqInView = false;

    function updateFaqGlow() {
      if (!faqInView) return;

      const rect = faqSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;

      // Progresso de 0 a 1 baseado na posição da seção na viewport
      const rawProgress = (windowHeight - rect.top) / (windowHeight + sectionHeight);
      const progress = Math.max(0, Math.min(1, rawProgress));

      // Bola cresce de 0.2 até 3.0 conforme o scroll
      const glowScale = 0.2 + (progress * 3.5);
      faqGlow.style.transform = 'translateX(-50%) scale(' + glowScale + ')';
    }

    const faqObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        faqInView = entry.isIntersecting;
        if (faqInView) {
          updateFaqGlow();
        }
      });
    }, {
      threshold: 0,
      rootMargin: '100px 0px 100px 0px'
    });

    faqObserver.observe(faqSection);

    let faqTicking = false;
    window.addEventListener('scroll', function () {
      if (!faqTicking) {
        window.requestAnimationFrame(function () {
          updateFaqGlow();
          faqTicking = false;
        });
        faqTicking = true;
      }
    }, { passive: true });

    updateFaqGlow();
  }

  /* ----------------------------------------------------------
     FAQ ACCORDION
     ---------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', function () {
      const isActive = item.classList.contains('active');

      // Fecha todos os itens abertos
      faqItems.forEach(function (otherItem) {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Abre o item clicado se não estava ativo
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

})();
