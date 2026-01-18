function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function initScrollShell() {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".site-nav");
  if (!header || !nav) {
    console.error("ScrollShell: header or nav not found");
    return;
  }

  const root = document.documentElement;

  // Ajuste fino
  const RANGE_PX = 260; // alcance de quanto scroll precisa para colapsar totalmente
  const HEADER_MIN = 0; // px
  const NAV_MIN = 56; // px
  const HEADER_MAX_RATIO = 0.30; // 30% da altura da viewport
  const NAV_MAX_RATIO = 0.20; // 20% da altura da viewport

  let headerMax = 240;
  let navMax = 160;

  function recomputeMax() {
    const vh = window.innerHeight || 800;
    headerMax = Math.round(vh * HEADER_MAX_RATIO);
    navMax = Math.round(vh * NAV_MAX_RATIO);

    // segurança: max nunca pode ser menor que min (bugs de viewport muito pequena)
    headerMax = Math.max(headerMax, HEADER_MIN);
    navMax = Math.max(navMax, NAV_MIN);

    const shellMax = headerMax + navMax;
    root.style.setProperty("--shell-max", `${shellMax}px`);
  }

  let ticking = false;

  function apply() {
    const y = window.scrollY || 0;
    const t = clamp(y / RANGE_PX, 0, 1);

    root.style.setProperty("--shell-t", String(t));

    // Fade do header: 1 -> 0 ao longo do colapso (ajuste FADE_END)
    const FADE_END = 1; // 1 = fade ao longo de todo o range; 0.25 = some rápido
    const fade = clamp(1 - (t / FADE_END), 0, 1);
    root.style.setProperty("--header-fade", fade.toFixed(3));
    const navFade = clamp(1 - fade, 0, 1);
    root.style.setProperty("--nav-fade", navFade.toFixed(3));

    // pequeno “slide” pra nav aparecer de baixo pra cima
    const shiftPx = Math.round(8 * (1 - navFade)); // 8px -> 0px
    root.style.setProperty("--nav-shift", `${shiftPx}px`);

    document.body.classList.toggle("header-off", fade <= 0.02);

    const headerH = Math.round(lerp(headerMax, HEADER_MIN, t));
    const navH = Math.round(lerp(navMax, NAV_MIN, t));

    root.style.setProperty("--header-h", `${headerH}px`);
    root.style.setProperty("--nav-h", `${navH}px`);

    const shellNow = headerH + navH;
    root.style.setProperty("--shell-now", `${shellNow}px`);
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
