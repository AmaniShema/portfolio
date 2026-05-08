/* ═══════════════════════════════════════════════════════════
   AMANI SHEMA — PORTFOLIO SCRIPTS
   - Sticky navbar with scroll detection
   - Reveal-on-scroll animations (IntersectionObserver)
   - Mobile hamburger toggle
   - Active nav link highlighting
   - Skill bar animation trigger
   - Smooth scroll for anchor links
   - Contact form UX
═══════════════════════════════════════════════════════════ */

/* ─── DOM Ready ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. Sticky Navbar ────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Run on load

  /* ── 2. Mobile Nav Toggle ────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  /* ── 3. Reveal on Scroll (IntersectionObserver) ──────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // Fire once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── 4. Active Nav Link on Scroll ────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-links a:not(.btn-resume)');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = 'var(--blue-bright)';
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => sectionObserver.observe(s));

  /* ── 5. Smooth Scroll for Internal Anchors ───────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 70; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── 6. Skill Bar Animation ──────────────────────────── */
  // Bars animate when the skill card becomes visible
  // CSS handles the transition via .skill-card.visible .skill-fill
  // The reveal observer fires the .visible class — re-use that mechanism
  // (handled by the reveal observer above since skill-cards have .reveal)

  /* ── 7. Contact Form ─────────────────────────────────── */
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;

      // Show sending state
      btn.textContent = 'Sending...';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      // Simulate async (replace with real API call later)
      setTimeout(() => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = '#22c55e';
        btn.style.opacity = '1';
        form.reset();

        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      }, 1400);
    });
  }

  /* ── 8. Cursor Glow (subtle, desktop only) ───────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      background: radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: left 0.2s ease, top 0.2s ease;
      will-change: left, top;
    `;
    document.body.appendChild(glow);

    window.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

  /* ── 9. Staggered reveal for skill cards ─────────────── */
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.06}s`;
  });

  /* ── 10. Staggered reveal for project cards ──────────── */
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
  });

});
