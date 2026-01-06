import { qs } from "./utils.js";

export function initNav() {
  const btn = qs(".nav-toggle");
  const links = qs("#nav-links");
  if (!btn || !links) return;

  btn.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
  });
}
