/* ─── main.js ─── */

// ── Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Hero particles
(function spawnParticles() {
  const container = document.getElementById('hero-particles');
  const count = 35;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      width:  ${size}px;
      height: ${size}px;
      left:   ${Math.random() * 100}%;
      animation-duration:  ${Math.random() * 14 + 8}s;
      animation-delay:     ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    container.appendChild(p);
  }
})();

// ── Scroll reveal
const revealEls = document.querySelectorAll(
  '.skill-card, .service-card, .project-card, .testimonial-card, ' +
  '.highlight-item, .about-img-wrapper, .contact-channel, ' +
  '.section-header, .contact-info, .contact-form-wrap, ' +
  '.cta-content, .hero-stats, .stat-item'
);

revealEls.forEach((el, i) => {
  el.classList.add('reveal');
  // stagger siblings
  const parent = el.parentElement;
  const siblings = [...parent.children].filter(c => c.classList.contains('reveal'));
  const idx = siblings.indexOf(el);
  if (idx > 0 && idx < 4) el.classList.add(`reveal-delay-${idx}`);
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// ── Animate skill bars on reveal
const skillCards = document.querySelectorAll('.skill-card');
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar').forEach(bar => {
        bar.classList.add('animate');
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillCards.forEach(card => barObserver.observe(card));

// ── Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link:not(.nav-cta)');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(link => link.classList.remove('active-nav'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active-nav');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ── Smooth counter animation for hero stats
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const suffix = el.textContent.replace(/[0-9]/g, '');
  const update = now => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsSection = document.getElementById('hero-stats');
let statsAnimated = false;
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      document.querySelectorAll('.stat-number').forEach(el => {
        const raw = el.textContent;
        const num = parseInt(raw);
        const suf = raw.replace(num.toString(), '');
        el.textContent = '0' + suf;
        animateCounter(el, num);
      });
    }
  });
}, { threshold: 0.5 });
if (statsSection) statsObserver.observe(statsSection);

// ── Initialize Supabase
const supabaseUrl = 'https://qtqvxgoepzkecgnlfspp.supabase.co';
const supabaseKey = 'sb_publishable_XBuclrx6RHW4KWsOcepDoQ_8p7WNjUP';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// ── Contact form submit (Supabase)
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('form-submit-btn');
const btnLabel = document.getElementById('btn-label');
const formSuccess = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    btnLabel.textContent = 'Sending…';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      service: formData.get('service'),
      message: formData.get('message')
    };

    // Bazaga yozish
    const { error } = await supabaseClient.from('contacts').insert([data]);

    if (error) {
      console.error('Supabase Error:', error);
      btnLabel.textContent = 'Error! Try again';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      alert("Xatolik yuz berdi. Iltimos keyinroq qayta urunib ko'ring.");
    } else {
      form.reset();
      submitBtn.style.display = 'none';
      formSuccess.hidden = false;
    }
  });
}

// ── Typed cursor effect in hero title (subtle)
const heroTitle = document.querySelector('.hero-title-accent');
if (heroTitle) {
  heroTitle.style.opacity = '0';
  setTimeout(() => {
    heroTitle.style.transition = 'opacity 0.6s ease';
    heroTitle.style.opacity = '1';
  }, 800);
}

// ── Add hover tilt to project cards
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * 4;
    const ry = ((x - cx) / cx) * -4;
    card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Active nav link style injection
const style = document.createElement('style');
style.textContent = `
  .nav-link.active-nav {
    color: var(--text-primary) !important;
    background: var(--accent-dim) !important;
  }
`;
document.head.appendChild(style);
