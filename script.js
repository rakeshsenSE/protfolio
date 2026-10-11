/* =========================================
   SCRIPT.JS — Portfolio Interactivity
   ========================================= */

// ===== NAVBAR SCROLL & HAMBURGER =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link highlighting
  let current = '';
  document.querySelectorAll('section[id]').forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scroll-top-btn');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

// ===== INTERSECTION OBSERVER — Fade In =====
const observerOptions = {
  threshold: 0.05,
  rootMargin: '0px 0px -40px 0px'
};

const fadeElements = document.querySelectorAll(
  '.timeline-item, .project-card, .about-grid, .info-card, .bar-item, .lib-card, .skill-category'
);
fadeElements.forEach(el => el.classList.add('fade-in-up'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80);
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeElements.forEach(el => fadeObserver.observe(el));

// ===== CIRCULAR SKILL PROGRESS =====
const circleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const percent = parseInt(el.dataset.percent);
      const circumference = 2 * Math.PI * 50; // r=50
      const fillEl = el.querySelector('.fill');
      const offset = circumference - (percent / 100) * circumference;
      setTimeout(() => {
        fillEl.style.strokeDashoffset = offset;
      }, 250);
      circleObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.circle-progress').forEach(el => circleObserver.observe(el));

// ===== BAR SKILLS ANIMATION =====
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        const width = bar.dataset.width;
        setTimeout(() => { bar.style.width = width + '%'; }, 200);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.bar-skills').forEach(el => barObserver.observe(el));

// ===== LIBRARY BAR ANIMATION =====
const libObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.lib-bar-fill').forEach(bar => {
        const width = bar.dataset.width;
        setTimeout(() => { bar.style.width = width + '%'; }, 300);
      });
      libObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.libs-grid').forEach(el => libObserver.observe(el));

// ===== COUNTER OBSERVER =====
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(counter => {
        animateCounter(counter, parseInt(counter.dataset.target));
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statObserver.observe(heroStats);

// ===== TESTIMONIALS SLIDER =====
const track = document.getElementById('testimonials-track');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const cards = document.querySelectorAll('.testimonial-card');
let currentSlide = 0;
let autoplay;

function goToSlide(index) {
  currentSlide = (index + cards.length) % cards.length;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach(d => d.classList.remove('active'));
  dots[currentSlide].classList.add('active');
}

function startAutoplay() {
  autoplay = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

function resetAutoplay() {
  clearInterval(autoplay);
  startAutoplay();
}

if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoplay(); });
if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoplay(); });

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.index));
    resetAutoplay();
  });
});

// Touch/swipe support
if (track) {
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
      resetAutoplay();
    }
  });
}

startAutoplay();

// ===== PROJECT FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card[data-category]');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeInUp 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal = document.getElementById('name').value.trim();
    const emailVal = document.getElementById('email').value.trim();
    const messageVal = document.getElementById('message').value.trim();

    let valid = true;
    [{ id: 'name', val: nameVal }, { id: 'email', val: emailVal }, { id: 'message', val: messageVal }].forEach(f => {
      if (!f.val) {
        valid = false;
        const input = document.getElementById(f.id);
        input.style.borderColor = '#ef4444';
        input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
      }
    });

    if (!valid) return;

    submitBtn.textContent = 'Sending... ✈️';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = 'Send Message 🚀';
      submitBtn.disabled = false;
      formSuccess.classList.add('show');
      contactForm.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1800);
  });
}

// ===== SMOOTH REVEAL ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 50);
});

// ===== TOOLS MARQUEE PAUSE ON HOVER =====
const toolsTrack = document.querySelector('.tools-track');
if (toolsTrack) {
  toolsTrack.addEventListener('mouseenter', () => { toolsTrack.style.animationPlayState = 'paused'; });
  toolsTrack.addEventListener('mouseleave', () => { toolsTrack.style.animationPlayState = 'running'; });
}

// ===== TYPED TEXT EFFECT — Data Analysis focused =====
const phrases = [
  'Data Scientist',
  'ML Engineer'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('hero-typed-title');
const staticPart = 'I\'m <span class="highlight">Rakesh Sen</span><br />';

function typeEffect() {
  if (!typedEl) return;
  const currentPhrase = phrases[phraseIndex];
  const displayText = isDeleting
    ? currentPhrase.substring(0, charIndex - 1)
    : currentPhrase.substring(0, charIndex + 1);

  typedEl.innerHTML = staticPart + displayText;

  if (!isDeleting && charIndex === currentPhrase.length) {
    setTimeout(() => { isDeleting = true; typeEffect(); }, 2500);
    return;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
  }

  charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
  const speed = isDeleting ? 55 : 85;
  setTimeout(typeEffect, speed);
}

// Start typing after initial hero animation
setTimeout(typeEffect, 1000);

// ===== DARK MODE TOGGLE =====
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIconSun = document.getElementById('theme-icon-sun');
const themeIconMoon = document.getElementById('theme-icon-moon');
const htmlEl = document.documentElement;

// Check localStorage for theme
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) {
  htmlEl.setAttribute('data-theme', savedTheme);
  if (savedTheme === 'dark') {
    themeIconSun.style.display = 'block';
    themeIconMoon.style.display = 'none';
  } else {
    themeIconSun.style.display = 'none';
    themeIconMoon.style.display = 'block';
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      htmlEl.setAttribute('data-theme', 'light');
      localStorage.setItem('portfolio-theme', 'light');
      themeIconSun.style.display = 'none';
      themeIconMoon.style.display = 'block';
    } else {
      htmlEl.setAttribute('data-theme', 'dark');
      localStorage.setItem('portfolio-theme', 'dark');
      themeIconSun.style.display = 'block';
      themeIconMoon.style.display = 'none';
    }
  });
}

// ===== TOOL ANIMATED RING PROGRESS =====
const ringObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const percent = parseInt(el.dataset.percent);
      const circumference = 2 * Math.PI * 42; // r=42
      const fillEl = el.querySelector('.ring-fill');
      if (fillEl) {
        const offset = circumference - (percent / 100) * circumference;
        setTimeout(() => {
          fillEl.style.strokeDashoffset = offset;
        }, 250);
      }
      ringObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.tool-anim-ring').forEach(el => ringObserver.observe(el));

