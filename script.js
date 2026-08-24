document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const toTopBtn = document.getElementById('toTop');
  const sections = document.querySelectorAll('main section[id]');

  /* ---------------------------------------------------------
     Header background on scroll + back-to-top visibility
  --------------------------------------------------------- */
  const handleScroll = () => {
    const scrollY = window.scrollY;

    header.classList.toggle('scrolled', scrollY > 60);
    toTopBtn.classList.toggle('visible', scrollY > 500);

    updateActiveNav();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------- */
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---------------------------------------------------------
     Smooth scroll for in-page nav links
     (CSS scroll-behavior handles the actual motion; here we
     just account for the fixed header height as an offset)
  --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = header.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------
     Active nav link highlighting based on scroll position
  --------------------------------------------------------- */
  function updateActiveNav() {
    const scrollPos = window.scrollY + header.offsetHeight + 40;
    let currentId = sections[0] ? sections[0].id : '';

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  /* ---------------------------------------------------------
     Scroll reveal animations
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------------------------------------------------------
     Subtle parallax on hero background
  --------------------------------------------------------- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener(
      'scroll',
      () => {
        const offset = window.scrollY * 0.35;
        heroBg.style.transform = `translateY(${offset}px) scale(1.08)`;
      },
      { passive: true }
    );
  }
});
