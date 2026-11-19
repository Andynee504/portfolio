import { CATEGORY_LABELS, element, loadProjects, projectCard, renderError } from "./projectComponents.js";

function normalizeFilter(value) {
  return Object.hasOwn(CATEGORY_LABELS, value) ? value : "all";
}

export async function initFeaturedProjects() {
  const root = document.getElementById("featured-projects");
  const status = document.getElementById("featured-status");
  if (!root) return;
  const load = async () => {
    root.setAttribute("aria-busy", "true");
    if (status) status.textContent = "Carregando projetos em destaque.";
    try {
      const projects = (await loadProjects()).slice(0, 2);
      root.replaceChildren(...projects.map(projectCard));
      if (!projects.length) root.append(element("p", "empty-state", "Os projetos estarão disponíveis em breve."));
      if (status) status.textContent = `${projects.length} projetos em destaque.`;
    } catch {
      if (status) status.textContent = "";
      renderError(root, "Não foi possível carregar os projetos. Verifique a conexão e tente novamente.", load);
    } finally {
      root.setAttribute("aria-busy", "false");
    }
  };
  await load();
}

export async function initProjectsPage() {
  const grid = document.getElementById("projects-grid");
  const count = document.getElementById("projects-count");
  if (!grid || !count) return;
  const chips = [...document.querySelectorAll("button[data-filter]")];
  let projects = [];
  let loaded = false;
  let currentFilter = normalizeFilter(new URLSearchParams(location.search).get("filter"));

  function apply() {
    if (!loaded) return;
    const filtered = currentFilter === "all" ? projects : projects.filter(project => project.category === currentFilter);
    for (const chip of chips) {
      const active = chip.dataset.filter === currentFilter;
      chip.setAttribute("aria-pressed", String(active));
      chip.classList.toggle("is-active", active);
    }
    grid.replaceChildren(...filtered.map(projectCard));
    if (!filtered.length) grid.append(element("p", "empty-state", "Ainda não há projetos nesta categoria."));
    count.textContent = `${filtered.length} ${filtered.length === 1 ? "projeto" : "projetos"} - ${CATEGORY_LABELS[currentFilter]}.`;
  }

  for (const chip of chips) {
    chip.addEventListener("click", () => {
      if (!loaded) return;
      const next = normalizeFilter(chip.dataset.filter);
      if (next !== currentFilter) {
        currentFilter = next;
        const url = new URL(location.href);
        if (next === "all") url.searchParams.delete("filter");
        else url.searchParams.set("filter", next);
        history.pushState({}, "", url);
      }
      apply();
    });
  }
  window.addEventListener("popstate", () => {
    currentFilter = normalizeFilter(new URLSearchParams(location.search).get("filter"));
    if (loaded) apply();
  });

  const load = async () => {
    grid.setAttribute("aria-busy", "true");
    loaded = false;
    count.textContent = "Carregando projetos.";
    chips.forEach(chip => { chip.disabled = true; });
    try {
      projects = await loadProjects();
      loaded = true;
      apply();
    } catch {
      count.textContent = "Não foi possível carregar a lista de projetos.";
      renderError(grid, "Verifique a conexão e tente carregar os projetos novamente.", load);
    } finally {
      grid.setAttribute("aria-busy", "false");
      chips.forEach(chip => { chip.disabled = !loaded; });
    }
  };
  await load();
}
