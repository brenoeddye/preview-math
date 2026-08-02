/* ==========================================================
   MAIN — MANUAL ESTRATÉGICO
   Scroll reveal, accordions, navbar active state
   ========================================================== */

(function () {
  'use strict';

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

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.06}s`;
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     ACCORDION
     ---------------------------------------------------------- */
  function initAccordion(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const triggers = container.querySelectorAll(
      '.manual-accordion-trigger, .manual-editorial-trigger'
    );

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest(
          '.manual-accordion-item, .manual-editorial-item'
        );
        const isActive = item.classList.contains('active');

        // Close siblings (single open behavior)
        const siblings = container.querySelectorAll(
          '.manual-accordion-item, .manual-editorial-item'
        );
        siblings.forEach((sib) => sib.classList.remove('active'));

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  /* ----------------------------------------------------------
     NAVBAR ACTIVE STATE ON SCROLL
     ---------------------------------------------------------- */
  function initNavbarActive() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.manual-nav-link');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === '#' + id
              );
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ----------------------------------------------------------
     SMOOTH SCROLL FOR NAV LINKS
     ---------------------------------------------------------- */
  function initSmoothScroll() {
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
  }

  /* ----------------------------------------------------------
     INIT
     ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initAccordion('.manual-accordion');
    initAccordion('.manual-editorial-list');
    initNavbarActive();
    initSmoothScroll();
  });
})();
