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

  // Ajuste fino
  const RANGE_PX = 260;
  const HEADER_MIN = 0;
  const NAV_MIN = 56;

  const HEADER_MAX_RATIO = 0.30;
  const NAV_MAX_RATIO = 0.10;

  // Fade - mantém header sumindo junto do colapso
  const FADE_END = 1;

  let headerMax = 240;
  let navMax = 160;

  function recomputeMax() {
    const vh = window.innerHeight || 800;

    headerMax = Math.round(vh * HEADER_MAX_RATIO);
    navMax = Math.round(vh * NAV_MAX_RATIO);

    headerMax = Math.max(headerMax, HEADER_MIN);
    navMax = Math.max(navMax, NAV_MIN);

    root.style.setProperty("--shell-max", `${headerMax + navMax}px`);
    root.style.setProperty("--nav-max", `${navMax}px`);
  }

  function apply() {
    const y = window.scrollY || 0;
    const scrollable = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    // página pequena: não anima para evitar bug visual
    if (scrollable < 80) {
      root.style.setProperty("--shell-t", "0");
      root.style.setProperty("--header-fade", "1");

      root.style.setProperty("--header-h", `${headerMax}px`);
      root.style.setProperty("--nav-h", `0px`);
      root.style.setProperty("--shell-now", `${headerMax}px`);
      return;
    }

    const range = Math.min(RANGE_PX, scrollable);
    const t = clamp(y / range, 0, 1);

    root.style.setProperty("--shell-t", String(t));

    // Header: encolhe e some
    const fade = clamp(1 - (t / FADE_END), 0, 1);
    root.style.setProperty("--header-fade", fade.toFixed(3));
    document.body.classList.toggle("header-off", fade <= 0.02);

    const headerH = Math.round(lerp(headerMax, HEADER_MIN, t));

    // Nav: 0 no topo -> navMax com scroll
    const navH = Math.round(lerp(0, navMax, t));

    root.style.setProperty("--header-h", `${headerH}px`);
    root.style.setProperty("--nav-h", `${navH}px`);

    root.style.setProperty("--shell-now", `${headerH + navH}px`);
  }

  let ticking = false;

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
