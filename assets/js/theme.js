(() => {
  "use strict";
  const key = "portfolio-theme";
  const labels = { light: "Claro", dark: "Escuro", protanopia: "Protanopia", deuteranopia: "Deuteranopia", tritanopia: "Tritanopia" };
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  let preference = null;
  try {
    const saved = localStorage.getItem(key);
    if (Object.hasOwn(labels, saved)) preference = saved;
  } catch { /* Browser storage is optional. */ }

  function apply(announce = false) {
    const value = preference || (system.matches ? "dark" : "light");
    document.documentElement.dataset.theme = value;
    const select = document.getElementById("theme-select");
    if (select) select.value = value;
    const reset = document.getElementById("theme-system");
    if (reset) reset.setAttribute("aria-pressed", String(preference === null));
    const status = document.getElementById("theme-status");
    if (status && announce) status.textContent = `Tema ${labels[value].toLowerCase()}${preference === null ? ", seguindo o sistema" : " selecionado"}.`;
  }
  apply();
  system.addEventListener("change", () => { if (preference === null) apply(true); });
  window.addEventListener("storage", event => {
    if (event.key !== key && event.key !== null) return;
    preference = Object.hasOwn(labels, event.newValue) ? event.newValue : null;
    apply(true);
  });
  document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("theme-select");
    const reset = document.getElementById("theme-system");
    if (!select || !reset) return;
    select.disabled = false;
    reset.disabled = false;
    apply();
    select.addEventListener("change", () => {
      if (!Object.hasOwn(labels, select.value)) return;
      preference = select.value;
      try { localStorage.setItem(key, preference); } catch { /* Session-only choice. */ }
      apply(true);
    });
    reset.addEventListener("click", () => {
      preference = null;
      try { localStorage.removeItem(key); } catch { /* Session-only choice. */ }
      apply(true);
    });
  });
})();
