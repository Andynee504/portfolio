import { qs, qsa, getParam, loadJSON } from "./utils.js";

const FILTERS = new Set(["all", "3d", "web", "gamedev"]);

function normalizeFilter(v) {
  const f = (v || "all").toLowerCase();
  return FILTERS.has(f) ? f : "all";
}

function setActiveChip(filter) {
  qsa(".chip").forEach(ch => {
    ch.classList.toggle("is-active", ch.dataset.filter === filter);
  });
}

function renderCards(list, root) {
  const html = list.map(p => {
    const tags = (p.tags || []).map(t => `<span class="pill" role="listitem">${t}</span>`).join("");

    const thumb = p.thumb
      ? `
        <a class="card-media" href="./project.html?id=${encodeURIComponent(p.id)}" aria-label="Abrir ${p.title}">
          <img src="${p.thumb}" alt="" loading="lazy">
        </a>
      `
      : `<div class="card-media card-media--placeholder" aria-hidden="true"></div>`;

    return `
      <article class="card" data-category="${p.category}">
        ${thumb}
        <h3>${p.title}</h3>
        <p>${p.oneLiner}</p>
        <div class="pill-row" role="list">${tags}</div>

        <div class="card-actions">
          <a class="btn btn-ghost" href="./project.html?id=${encodeURIComponent(p.id)}">Detalhes</a>
          ${p.demo ? `<a class="btn btn-ghost" href="${p.demo}" target="_blank" rel="noopener">Demo</a>` : ""}
          ${p.repo ? `<a class="btn btn-ghost" href="${p.repo}" target="_blank" rel="noopener">Repo</a>` : ""}
        </div>
      </article>
    `;
  }).join("");

  root.innerHTML = html;
}

export async function initProjectsPage() {
  const grid = qs("#projects-grid");
  const count = qs("#projects-count");
  if (!grid || !count) return;

  const chips = qsa(".chip");
  const urlFilter = normalizeFilter(getParam("filter"));

  const data = await loadJSON("./assets/data/projects.json");
  let currentFilter = urlFilter;

  const apply = () => {
    const filtered = currentFilter === "all"
      ? data
      : data.filter(p => p.category === currentFilter);

    renderCards(filtered, grid);
    setActiveChip(currentFilter);
    count.textContent = `${filtered.length} projeto(s) — filtro: ${currentFilter.toUpperCase()}`;
  };

  chips.forEach(ch => {
    ch.addEventListener("click", () => {
      currentFilter = normalizeFilter(ch.dataset.filter);
      const u = new URL(location.href);
      u.searchParams.set("filter", currentFilter);
      history.replaceState({}, "", u);
      apply();
    });
  });

  apply();
}
