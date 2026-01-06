import { qs, getParam, loadJSON } from "./utils.js";

export async function initProjectDetailPage() {
  const id = getParam("id");
  const titleEl = qs("[data-project-title]");
  const oneLinerEl = qs("[data-project-oneLiner]");
  const tagsEl = qs("[data-project-tags]");
  const linksEl = qs("[data-project-links]");
  const notesEl = qs("[data-project-notes]");

  if (!titleEl || !oneLinerEl || !tagsEl || !linksEl || !notesEl) return;

  const data = await loadJSON("./assets/data/projects.json");
  const project = data.find(p => p.id === id) || data[0];

  titleEl.textContent = project?.title || "Projeto (Placeholder)";
  oneLinerEl.textContent = project?.oneLiner || "One-liner (Placeholder).";

  tagsEl.innerHTML = (project?.tags || []).map(t => `<span class="pill" role="listitem">${t}</span>`).join("");

  const links = [];
  if (project?.demo) links.push(`<a class="btn" href="${project.demo}">Demo</a>`);
  if (project?.repo) links.push(`<a class="btn btn-ghost" href="${project.repo}">Repo</a>`);
  links.push(`<a class="btn btn-ghost" href="./projects.html?filter=${encodeURIComponent(project?.category || "all")}">Ver mais dessa categoria</a>`);
  linksEl.innerHTML = links.join("");

  notesEl.innerHTML = `
    <p><strong>Contexto:</strong> ${project?.notes?.context || "Placeholder."}</p>
    <p><strong>Desafio:</strong> ${project?.notes?.challenge || "Placeholder."}</p>
    <p><strong>Decisão:</strong> ${project?.notes?.decision || "Placeholder."}</p>
    <p><strong>Resultado:</strong> ${project?.notes?.result || "Placeholder."}</p>
  `;
}
