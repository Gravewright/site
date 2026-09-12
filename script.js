// Progressive enhancement: content, language links and FAQ work without JavaScript.
document.documentElement.classList.replace('no-js', 'js');
const header = document.querySelector('[data-header]');
const toggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const mobile = matchMedia('(max-width: 1000px)');
const motion = matchMedia('(prefers-reduced-motion: reduce)');

function setMenu(open, restoreFocus = false) {
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
  nav.inert = mobile.matches && !open;
  header.classList.toggle('menu-visible', open);
  if (restoreFocus) toggle.focus();
}
setMenu(false);
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
mobile.addEventListener('change', () => setMenu(false));
nav.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setMenu(false, true);
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) setMenu(false);
});
header.addEventListener('focusout', () => {
  requestAnimationFrame(() => { if (!header.contains(document.activeElement)) setMenu(false); });
});
const updateHeader = () => header.classList.toggle('is-scrolled', scrollY > 18);
addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Keep the reader at the same section when changing language.
document.querySelector('[data-language]').addEventListener('click', event => {
  if (location.hash) event.currentTarget.hash = location.hash;
});

if (!motion.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('has-motion');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.04 });
  document.querySelectorAll('.section-heading, .focus-grid, .license-card').forEach(element => {
    element.classList.add('reveal-item');
    observer.observe(element);
  });
  motion.addEventListener('change', () => {
    if (motion.matches) {
      document.documentElement.classList.remove('has-motion');
      observer.disconnect();
    }
  });
}

let toastTimer;
const labels = document.body.dataset;
document.querySelectorAll('[data-copy]').forEach(button => {
  let resetTimer;
  button.addEventListener('click', async () => {
    const code = document.querySelector(`[data-code="${button.dataset.copy}"]`);
    let message;
    try {
      await navigator.clipboard.writeText(code.textContent.trim());
      button.textContent = labels.copiedLabel;
      message = labels.copiedMessage;
    } catch {
      const range = document.createRange();
      range.selectNodeContents(code);
      const selection = getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = labels.selectedLabel;
      message = labels.selectedMessage;
    }
    const toast = document.querySelector('[data-toast]');
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    clearTimeout(resetTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
    resetTimer = setTimeout(() => { button.textContent = labels.copyLabel; }, 2600);
  });
});
