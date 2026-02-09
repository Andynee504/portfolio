import { loadJSON, escapeHTML } from "./data.js";

function el(tag, attrs = {}, html = "") {
  const a = Object.entries(attrs)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => ` ${k}="${escapeHTML(String(v))}"`)
    .join("");
  return `<${tag}${a}>${html}</${tag}>`;
}

function section(title, inner) {
  return `<section class="cv-section" aria-label="${escapeHTML(title)}"><h3 class="cv-section-title">${escapeHTML(title)}</h3><div class="cv-section-body">${inner}</div></section>`;
}

function list(items = []) {
  if (!items.length) return "";
  return `<ul class="cv-list">${items.map(i => `<li>${escapeHTML(i)}</li>`).join("")}</ul>`;
}

function chips(items = []) {
  if (!items.length) return "";
  return `<div class="cv-chips">${items.map(i => `<span class="cv-chip">${escapeHTML(i)}</span>`).join("")}</div>`;
}

function timeline(items = [], renderItem) {
  if (!items.length) return "";
  return `<div class="cv-timeline">${items.map(renderItem).join("")}</div>`;
}

export async function initCVPage() {
  const root = document.querySelector("#cv-root");
  if (!root) return;

  const cv = await loadJSON("./assets/data/cv.json");

  // Header compacto (nome + contato + links)
  const name = cv.name || "Nome Sobrenome";
  const contact = cv.contact || "";
  const links = Array.isArray(cv.links) ? cv.links : []; // cv.json usa array:contentReference[oaicite:2]{index=2}

  const linksHTML = links
    .map(l => `<a class="cv-link" href="${escapeHTML(l.url)}" target="_blank" rel="noopener">${escapeHTML(l.label)}</a>`)
    .join("");

  const headerHTML = `
    <div class="cv-head">
      <div class="cv-head-left">
        <h2 class="cv-name">${escapeHTML(name)}</h2>
        ${contact ? `<p class="cv-contact muted">${escapeHTML(contact)}</p>` : ""}
      </div>
      <div class="cv-head-right">
        ${linksHTML ? `<div class="cv-links">${linksHTML}</div>` : ""}
      </div>
    </div>
  `;

  const blocks = [];
  blocks.push(headerHTML);

  // Resumo (profile):contentReference[oaicite:3]{index=3}
  if (cv.profile?.trim()) {
    blocks.push(section("Resumo", `<p class="cv-paragraph">${escapeHTML(cv.profile)}</p>`));
  }

  // Competências:contentReference[oaicite:4]{index=4}
  if (Array.isArray(cv.skills) && cv.skills.length) {
    blocks.push(section("Competências", chips(cv.skills)));
  }

  // Experiência:contentReference[oaicite:5]{index=5}
  if (Array.isArray(cv.experiences) && cv.experiences.length) {
    const expHTML = timeline(cv.experiences, (x) => `
      <article class="cv-item">
        <div class="cv-item-top">
          <div>
            <div class="cv-item-title">${escapeHTML(x.role)}</div>
            <div class="cv-item-sub muted">${escapeHTML(x.company)} • ${escapeHTML(x.period)}</div>
          </div>
        </div>
        ${x.description ? `<p class="cv-item-desc">${escapeHTML(x.description)}</p>` : ""}
      </article>
    `);
    blocks.push(section("Experiência", expHTML));
  }

  // Formação:contentReference[oaicite:6]{index=6}
  if (Array.isArray(cv.education) && cv.education.length) {
    const eduHTML = timeline(cv.education, (e) => `
      <article class="cv-item">
        <div class="cv-item-top">
          <div>
            <div class="cv-item-title">${escapeHTML(e.course)}</div>
            <div class="cv-item-sub muted">${escapeHTML(e.institution)} • ${escapeHTML(e.period)}</div>
          </div>
        </div>
        ${e.modules ? `<p class="cv-item-desc muted">${escapeHTML(e.modules)}</p>` : ""}
      </article>
    `);
    blocks.push(section("Formação", eduHTML));
  }

  // Idiomas:contentReference[oaicite:7]{index=7}
  if (Array.isArray(cv.languages) && cv.languages.length) {
    const items = cv.languages.map(l => `${l.language} — ${l.proficiency}`);
    blocks.push(section("Idiomas", list(items)));
  }

  // Voluntariado:contentReference[oaicite:8]{index=8}
  if (Array.isArray(cv.voluntary) && cv.voluntary.length) {
    const volHTML = timeline(cv.voluntary, (v) => `
      <article class="cv-item">
        <div class="cv-item-top">
          <div>
            <div class="cv-item-title">${escapeHTML(v.role)}</div>
            <div class="cv-item-sub muted">${escapeHTML(v.organization)} • ${escapeHTML(v.period)}</div>
          </div>
        </div>
        ${v.description ? `<p class="cv-item-desc">${escapeHTML(v.description)}</p>` : ""}
      </article>
    `);
    blocks.push(section("Voluntariado", volHTML));
  }

  root.innerHTML = `<div class="cv-wrap">${blocks.join("")}</div>`;
}
