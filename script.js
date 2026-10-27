// 1. Target Element Selection (HTML -> JS)
const yearSpan = document.getElementById('year');
const themeBtn = document.getElementById('theme-btn');
const contactBtn = document.getElementById('contact-btn');
const contactDetails = document.getElementById('contact-details');
const menuBtn = document.getElementById('menu-btn');
const navList = document.getElementById('nav-links');
const navLinks = document.querySelectorAll('.nav-links a');
const rotator = document.getElementById('rotator');
const progress = document.getElementById('progress');
const photo = document.querySelector('.frame img');

// 2. Dynamic Content Injection (JS -> HTML)
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// 3. Dark mode: toggle, remember, and follow the device setting
if (themeBtn) {
  const setDark = (on) => {
    document.body.classList.toggle('dark-mode', on);   // .dark-mode is defined in style.css
    themeBtn.setAttribute('aria-pressed', String(on));
    themeBtn.textContent = on ? 'Light mode' : 'Dark mode';
  };
  let saved = null;
  try { saved = localStorage.getItem('dark'); } catch (e) {}
  setDark(saved !== null ? saved === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches);

  themeBtn.addEventListener('click', () => {
    const on = !document.body.classList.contains('dark-mode');
    setDark(on);
    try { localStorage.setItem('dark', on); } catch (e) {}
  });
}

// 4. Contact button: show or hide the contact details
if (contactBtn && contactDetails) {
  contactBtn.addEventListener('click', () => {
    const open = contactDetails.hidden;
    contactDetails.hidden = !open;
    contactBtn.setAttribute('aria-expanded', String(open));
    contactBtn.textContent = open ? 'Hide contact details' : 'Get in touch';
  });
}

// 5. Copy the phone number
const phoneItem = document.querySelector('a.detail[href^="tel:"]');
if (phoneItem && navigator.clipboard) {
  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'btn ghost copy-btn';
  copyBtn.textContent = 'Copy number';
  copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('0992 376 1854'); copyBtn.textContent = 'Copied!'; }
    catch (e) { copyBtn.textContent = 'Copy failed'; }
    setTimeout(() => (copyBtn.textContent = 'Copy number'), 1800);
  });
  phoneItem.insertAdjacentElement('afterend', copyBtn);
}

// 6. Mobile menu
if (menuBtn && navList) {
  const setMenu = (open) => {
    navList.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? '✕' : '☰';
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuBtn.addEventListener('click', () => setMenu(!navList.classList.contains('open')));
  navLinks.forEach((l) => l.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
}

// 7. Highlight the nav link for the section in view
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach((l) => {
    const s = document.querySelector(l.getAttribute('href'));
    if (s) observer.observe(s);
  });
}

// 8. Scroll progress bar
if (progress) {
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// 9. Rotating "currently learning" word
if (rotator && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const words = ['HTML', 'CSS', 'JavaScript', 'problem solving'];
  let i = 0;
  setInterval(() => {
    rotator.style.opacity = 0;
    setTimeout(() => { i = (i + 1) % words.length; rotator.textContent = words[i]; rotator.style.opacity = 1; }, 250);
  }, 2400);
}

// 10. Fallback if profile.png is missing
if (photo) {
  photo.addEventListener('error', () => {
    const f = document.createElement('div');
    f.className = 'fallback';
    f.textContent = 'EP';
    photo.replaceWith(f);
  });
}