/* ═══════════════════════════════════════════════════════════
   Portfolio — main.js
   Loaded with defer: DOM is fully parsed when this runs.
   ═══════════════════════════════════════════════════════════ */

// ── Constants ────────────────────────────────────────────────
const GITHUB_USER          = 'VectorSophie';
const SCROLL_TOP_THRESHOLD = 300;   // px: show scroll-to-top button (see README)
const NAV_SCROLL_THRESHOLD = 60;    // px: nav bg change (see README)
const OBSERVER_THRESHOLD   = 0.2;   // Intersection Observer (see README)

// ── DOM References ───────────────────────────────────────────
const header           = document.getElementById('site-header');
const navMenu          = document.getElementById('nav-menu');
const btnHamburger     = document.getElementById('btn-hamburger');
const menuIcon         = document.getElementById('menu-icon');
const btnTheme         = document.getElementById('btn-theme');
const themeIcon        = document.getElementById('theme-icon');
const btnScrollTop     = document.getElementById('btn-scroll-top');
const projectsContainer = document.getElementById('projects-container');
const filterButtons    = document.getElementById('filter-buttons');
const contactForm      = document.getElementById('contact-form');
const formSuccess      = document.getElementById('form-success');

// ── Centralized state ────────────────────────────────────────
const state = {
  theme: 'light',
  menuOpen: false,
  projects: {
    status: 'idle',   // 'idle' | 'loading' | 'success' | 'error' | 'empty'
    data: [],
    filter: 'all',
    languages: [],
    errorMsg: '',
  },
};

/* ════════════════════════════════════════════════════════════
   FEATURE 1: Dark Mode
   Event → state.theme change → applyTheme() updates DOM
   ════════════════════════════════════════════════════════════ */
function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  localStorage.setItem('theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Bonus: system dark-mode detection
    applyTheme('dark');
  }
}

btnTheme.addEventListener('click', () => {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
});

// Bonus: follow system preference changes (only if user hasn't manually set one)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});

/* ════════════════════════════════════════════════════════════
   FEATURE 2: Hamburger Menu
   Event → state.menuOpen change → renderMenu() updates DOM
   Uses classList.toggle('active') per spec
   ════════════════════════════════════════════════════════════ */
function renderMenu(open) {
  state.menuOpen = open;
  navMenu.classList.toggle('active', open);
  menuIcon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  btnHamburger.setAttribute('aria-expanded', String(open));
}

btnHamburger.addEventListener('click', () => {
  renderMenu(!state.menuOpen);
});

// Close menu on nav-link click
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => renderMenu(false));
});

/* ════════════════════════════════════════════════════════════
   FEATURE 3: Smooth Scroll — nav anchors
   ════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ════════════════════════════════════════════════════════════
   FEATURE 4 & 5: Scroll Handler
   — Nav background change at 60px
   — Scroll-to-top button visibility at 300px
   ════════════════════════════════════════════════════════════ */
function handleScroll() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > NAV_SCROLL_THRESHOLD);
  btnScrollTop.hidden = y <= SCROLL_TOP_THRESHOLD;
}

window.addEventListener('scroll', handleScroll, { passive: true });

btnScrollTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ════════════════════════════════════════════════════════════
   FEATURE 6: Scroll Animations — Intersection Observer
   threshold: 0.2 (documented in README)
   ════════════════════════════════════════════════════════════ */
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) {
      target.classList.add('visible');
      animObserver.unobserve(target);   // fire once
    }
  });
}, { threshold: OBSERVER_THRESHOLD });

document.querySelectorAll('.animate-on-scroll').forEach(el => animObserver.observe(el));

/* ════════════════════════════════════════════════════════════
   Live Clock (hero timestamp)
   ════════════════════════════════════════════════════════════ */
function updateClock() {
  const el = document.getElementById('hero-time');
  if (el) el.textContent = new Date().toTimeString().slice(0, 8);
}
setInterval(updateClock, 1000);
updateClock();

/* ════════════════════════════════════════════════════════════
   BONUS: Typing Effect — Hero role subtitle
   ════════════════════════════════════════════════════════════ */
const ROLES = ['Developer', 'Writer', 'Systems Researcher', 'AI Engineer'];
let roleIdx   = 0;
let charIdx   = 0;
let isDeleting = false;

function typeNext() {
  const current = ROLES[roleIdx];
  const el = document.getElementById('typing-text');
  if (!el) return;

  if (isDeleting) {
    charIdx--;
    el.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % ROLES.length;
      setTimeout(typeNext, 500);
      return;
    }
    setTimeout(typeNext, 45);
  } else {
    charIdx++;
    el.textContent = current.slice(0, charIdx);
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeNext, 1800);
      return;
    }
    setTimeout(typeNext, 75);
  }
}
setTimeout(typeNext, 400);

/* ════════════════════════════════════════════════════════════
   GitHub API — Projects
   Event (page load / retry click)
   → state.projects.status change
   → renderProjectsContainer() updates DOM
   ════════════════════════════════════════════════════════════ */

// Language dot colors (subset of GitHub's palette)
const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python:     '#3572A5',
  Rust:       '#dea584',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Go:         '#00ADD8',
  C:          '#555555',
  'C++':      '#f34b7d',
  Java:       '#b07219',
  Shell:      '#89e051',
  Vue:        '#41b883',
  Svelte:     '#ff3e00',
  Kotlin:     '#A97BFF',
  Ruby:       '#CC342D',
};

function setProjectsState(status, errorMsg = '') {
  state.projects.status = status;
  state.projects.errorMsg = errorMsg;
  renderProjectsContainer();
}

function renderRepoCard({ name, html_url, description, language, stargazers_count }) {
  const color = LANG_COLORS[language] ?? '#7A848E';
  const desc  = description ?? '설명 없음';
  const lang  = language    ?? '—';
  return `
    <article class="project-card lab-module">
      <span class="corner tl" aria-hidden="true"></span>
      <span class="corner tr" aria-hidden="true"></span>
      <span class="corner bl" aria-hidden="true"></span>
      <span class="corner br" aria-hidden="true"></span>
      <div class="card-header">
        <a href="${html_url}" target="_blank" rel="noopener noreferrer" class="card-name">${name}</a>
        <span class="card-stars" aria-label="${stargazers_count} stars">
          <i class="fa-solid fa-star" aria-hidden="true"></i>
          ${stargazers_count}
        </span>
      </div>
      <p class="card-desc">${desc}</p>
      <div class="card-footer">
        <span class="card-lang">
          <span class="lang-dot" style="background:${color}" aria-hidden="true"></span>
          ${lang}
        </span>
        <a href="${html_url}" target="_blank" rel="noopener noreferrer" class="label card-link accent">
          INSPECT →
        </a>
      </div>
    </article>
  `;
}

function renderProjectsContainer() {
  const { status, data, filter, errorMsg } = state.projects;

  if (status === 'loading') {
    projectsContainer.innerHTML = `
      <div class="projects-loading">
        <div class="spinner" role="status" aria-label="로딩 중"></div>
        <span class="label">LOADING REPOSITORIES...</span>
      </div>`;
    return;
  }

  if (status === 'error') {
    projectsContainer.innerHTML = `
      <div class="projects-error">
        <div class="label accent">SIGNAL LOST</div>
        <p>${errorMsg || '프로젝트를 불러올 수 없습니다.'}</p>
        <button class="btn btn-secondary" id="btn-retry">
          <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
          다시 시도
        </button>
      </div>`;
    document.getElementById('btn-retry')?.addEventListener('click', fetchProjects);
    return;
  }

  if (status === 'empty') {
    projectsContainer.innerHTML = `
      <div class="projects-empty">
        <div class="label">NO REPOSITORIES FOUND</div>
        <p>표시할 프로젝트가 없습니다.</p>
      </div>`;
    return;
  }

  if (status === 'success') {
    // Bonus: array.filter() for language filtering
    const visible = filter === 'all'
      ? data
      : data.filter(r => r.language === filter);

    if (visible.length === 0) {
      projectsContainer.innerHTML = `
        <div class="projects-empty">
          <div class="label">NO MATCHES</div>
          <p>해당 언어의 프로젝트가 없습니다.</p>
        </div>`;
      return;
    }

    // array.map() to convert repo objects → HTML cards (ES6+ spec requirement)
    projectsContainer.innerHTML = `
      <div class="projects-grid">
        ${visible.map(renderRepoCard).join('')}
      </div>`;
  }
}

// Bonus: build language filter buttons using array.map()
function buildFilterButtons(repos) {
  const langs = [...new Set(repos.map(r => r.language).filter(Boolean))].sort();
  state.projects.languages = langs;

  filterButtons.innerHTML = [
    `<button class="filter-btn ${state.projects.filter === 'all' ? 'active' : ''}" data-lang="all">All</button>`,
    ...langs.map(lang =>
      `<button class="filter-btn ${state.projects.filter === lang ? 'active' : ''}" data-lang="${lang}">${lang}</button>`
    ),
  ].join('');

  filterButtons.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.projects.filter = btn.dataset.lang;
      // Update active class
      filterButtons.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjectsContainer();
    });
  });
}

async function fetchProjects() {
  setProjectsState('loading');

  
}

/* ════════════════════════════════════════════════════════════
   FEATURE 7: Form Validation
   Event (submit / input)
   → form error state change
   → error messages show/hide
   ════════════════════════════════════════════════════════════ */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showFieldError(inputId, errorId, msg) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errorId);
  if (input) input.classList.add('error');
  if (err) {
    err.textContent = msg;
    err.classList.add('visible');
  }
}

function clearFieldError(inputId, errorId) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errorId);
  if (input) input.classList.remove('error');
  if (err) {
    err.textContent = '';
    err.classList.remove('visible');
  }
}

function validateForm() {
  const { value: name }    = document.getElementById('name');
  const { value: email }   = document.getElementById('email');
  const { value: message } = document.getElementById('message');
  let valid = true;

  if (!name.trim()) {
    showFieldError('name', 'name-error', '이름을 입력해주세요.');
    valid = false;
  } else {
    clearFieldError('name', 'name-error');
  }

  if (!email.trim()) {
    showFieldError('email', 'email-error', '이메일을 입력해주세요.');
    valid = false;
  } else if (!EMAIL_RE.test(email.trim())) {
    showFieldError('email', 'email-error', '올바른 이메일 형식이 아닙니다.');
    valid = false;
  } else {
    clearFieldError('email', 'email-error');
  }

  if (!message.trim()) {
    showFieldError('message', 'message-error', '메시지를 입력해주세요.');
    valid = false;
  } else {
    clearFieldError('message', 'message-error');
  }

  return valid;
}

// Real-time validation: clear error as user types (input event)
['name', 'email', 'message'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => {
    clearFieldError(id, `${id}-error`);
  });
});

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();   // prevent default form submission

  if (!validateForm()) return;

  // Success state
  const fields = contactForm.querySelectorAll('.form-field');
  const submitBtn = contactForm.querySelector('.btn-submit');

  fields.forEach(f => { f.style.opacity = '0.4'; });
  submitBtn.disabled = true;
  formSuccess.hidden = false;
  formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Reset after 4 s
  setTimeout(() => {
    contactForm.reset();
    fields.forEach(f => { f.style.opacity = ''; });
    submitBtn.disabled = false;
    formSuccess.hidden = true;
  }, 4000);
});

/* ════════════════════════════════════════════════════════════
   Init
   ════════════════════════════════════════════════════════════ */
initTheme();
handleScroll();
fetchProjects();
