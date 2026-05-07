/* ============================================
   TECH GUYS AI — script.js
   Smooth scroll, scroll animations, nav, form
   ============================================ */

'use strict';

// ─── NAV: Scrolled state ──────────────────────
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// ─── NAV: Mobile toggle ───────────────────────
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});

// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.textContent = '☰';
  });
});

// ─── SCROLL ANIMATIONS (Intersection Observer) ─
const fadeEls = document.querySelectorAll('.fade-up');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

fadeEls.forEach(el => observer.observe(el));

// ─── SMOOTH SCROLL ────────────────────────────
// Handles all internal anchor links with offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navHeight = nav.offsetHeight;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});

// ─── CONTACT FORM ─────────────────────────────
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function (e) {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    e.preventDefault();
    showFormError('Please fill in all fields.');
    return;
  }

  if (!isValidEmail(email)) {
    e.preventDefault();
    showFormError('Please enter a valid email address.');
    return;
  }

  // Let mailto: action proceed
  // Optionally show a success note after a delay
  setTimeout(() => {
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = '✅ Email client opened!';
    btn.style.background = '#10b981';
    btn.style.boxShadow = '0 0 24px rgba(16, 185, 129, 0.4)';
    btn.disabled = true;
  }, 300);
});

function showFormError(msg) {
  let err = document.getElementById('formError');
  if (!err) {
    err = document.createElement('p');
    err.id = 'formError';
    err.style.cssText = 'color:#f87171;font-size:0.85rem;margin-top:10px;text-align:center;';
    contactForm.appendChild(err);
  }
  err.textContent = msg;
  setTimeout(() => err.remove(), 4000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── HERO: Animate stats counter (optional flair) ─
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const isFloat = String(target).includes('.');

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(eased * target);
    el.textContent = isFloat
      ? (eased * target).toFixed(1) + 'k+'
      : current + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Observe hero stats to trigger counters
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const raw = num.textContent.trim();
        if (raw.includes('100+')) {
          num.dataset.suffix = '+';
          animateCounter(num, 100, 1000);
        } else if (raw.includes('50k+')) {
          // handled as plain text, skip
        } else if (raw.includes('48h')) {
          // static, skip
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);
