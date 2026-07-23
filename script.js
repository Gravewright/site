const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const toast = document.querySelector("[data-toast]");
const year = document.querySelector("[data-year]");

function setMenu(open) {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
  header?.classList.toggle("menu-visible", open);
  document.body.classList.toggle("menu-open", open);
}

menuToggle?.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) setMenu(false);
});

window.addEventListener(
  "scroll",
  () => header?.classList.toggle("is-scrolled", window.scrollY > 18),
  { passive: true },
);

let toastTimer;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

async function copyCode(key, button) {
  const code = document.querySelector(`[data-code="${key}"]`);
  if (!code) return;
  const text = code.textContent.trim();

  try {
    await navigator.clipboard.writeText(text);
    button.textContent = "Copied";
    showToast("Commands copied to the clipboard.");
  } catch {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(code);
    selection?.removeAllRanges();
    selection?.addRange(range);
    button.textContent = "Selected";
    showToast("Clipboard unavailable. The commands were selected.");
  }

  setTimeout(() => { button.textContent = "Copy"; }, 2200);
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => copyCode(button.dataset.copy, button));
});

document.querySelectorAll("[data-logo]").forEach((image) => {
  const handleError = () => image.parentElement?.classList.add("logo-error");
  image.addEventListener("error", handleError);
  if (image.complete && image.naturalWidth === 0) handleError();
});

if (year) year.textContent = String(new Date().getFullYear());
