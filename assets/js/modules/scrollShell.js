function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function initScrollShell() {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".site-nav");
  if (!header || !nav) return;

  const root = document.documentElement;

  // Ajuste fino aqui
  const RANGE_PX = 260; // quanto scroll “leva” para colapsar totalmente
  const HEADER_MIN = 72; // px
  const NAV_MIN = 56; // px
  const HEADER_MAX_RATIO = 0.30; // 30% da altura da viewport
  const NAV_MAX_RATIO = 0.20; // 20% da altura da viewport

  let headerMax = 240;
  let navMax = 160;

  function recomputeMax() {
    const vh = window.innerHeight || 800;
    headerMax = Math.round(vh * HEADER_MAX_RATIO);
    navMax = Math.round(vh * NAV_MAX_RATIO);

    // segurança: max nunca pode ser menor que min
    headerMax = Math.max(headerMax, HEADER_MIN);
    navMax = Math.max(navMax, NAV_MIN);

    const shellMax = headerMax + navMax;
    root.style.setProperty("--shell-max", `${shellMax}px`);
  }

  let ticking = false;

  function apply() {
    const y = window.scrollY || 0;
    const t = clamp(y / RANGE_PX, 0, 1);

    const headerH = Math.round(lerp(headerMax, HEADER_MIN, t));
    const navH = Math.round(lerp(navMax, NAV_MIN, t));

    root.style.setProperty("--header-h", `${headerH}px`);
    root.style.setProperty("--nav-h", `${navH}px`);

    const shellMax = headerMax + navMax;
    const shellNow = headerH + navH;
    const gap = shellMax - shellNow;

    root.style.setProperty("--shell-gap", `${gap}px`);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      apply();
      ticking = false;
    });
  }

  function onResize() {
    recomputeMax();
    apply();
  }

  recomputeMax();
  apply();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
}
