import { loadJSON } from "./data.js";
import { element, renderError, safeURL, textValue } from "./projectComponents.js";

function section(title, children) {
  const node = element("section", "cv-section");
  node.append(element("h2", "cv-section-title", title), ...children);
  return node;
}

function timeline(items, fields) {
  const list = element("div", "cv-timeline");
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const article = element("article", "cv-item");
    article.append(element("h3", "cv-item-title", item[fields.title]));
    const sub = [item[fields.organization], item.period].filter(Boolean).join(" / ");
    if (sub) article.append(element("p", "cv-item-sub", sub));
    if (textValue(item[fields.description])) article.append(element("p", "cv-item-desc", item[fields.description]));
    list.append(article);
  }
  return list;
}

export async function initCVPage() {
  const root = document.getElementById("cv-root");
  if (!root) return;
  const load = async () => {
    root.setAttribute("aria-busy", "true");
    try {
      const cv = await loadJSON("./assets/data/cv.json");
      if (!cv || typeof cv !== "object" || Array.isArray(cv)) throw new Error("Currículo inválido");
      const wrap = element("div", "cv-wrap");
      const header = element("div", "cv-head");
      const identity = element("div");
      identity.append(element("p", "cv-name", cv.name));
      if (textValue(cv.contact)) identity.append(element("p", "cv-contact", cv.contact));
      header.append(identity);
      const links = element("div", "cv-links");
      if (Array.isArray(cv.links)) {
        for (const item of cv.links) {
          if (!item || !textValue(item.label)) continue;
          const url = safeURL(item.url, ["http:", "https:", "mailto:", "tel:"]);
          if (!url) continue;
          const link = element("a", "cv-link", item.label);
          link.href = url;
          links.append(link);
        }
      }
      if (links.childElementCount) header.append(links);
      wrap.append(header);
      if (textValue(cv.profile)) wrap.append(section("Perfil profissional", [element("p", "cv-paragraph", cv.profile)]));
      if (Array.isArray(cv.experiences) && cv.experiences.length) wrap.append(section("Experiência profissional", [timeline(cv.experiences, { title: "role", organization: "company", description: "description" })]));
      if (Array.isArray(cv.education) && cv.education.length) wrap.append(section("Formação e cursos", [timeline(cv.education, { title: "course", organization: "institution", description: "modules" })]));
      if (Array.isArray(cv.skills) && cv.skills.length) {
        const skills = element("ul", "cv-list");
        for (const skill of cv.skills) {
          if (textValue(skill)) skills.append(element("li", "", skill));
        }
        wrap.append(section("Competências", [skills]));
      }
      if (Array.isArray(cv.languages) && cv.languages.length) {
        const languages = element("ul", "cv-list");
        for (const item of cv.languages) {
          if (item && textValue(item.language)) languages.append(element("li", "", [item.language, item.proficiency].filter(Boolean).join(" - ")));
        }
        wrap.append(section("Idiomas", [languages]));
      }
      if (Array.isArray(cv.voluntary) && cv.voluntary.length) wrap.append(section("Voluntariado", [timeline(cv.voluntary, { title: "role", organization: "organization", description: "description" })]));
      root.replaceChildren(wrap);
    } catch {
      renderError(root, "Não foi possível carregar o currículo. Verifique a conexão e tente novamente.", load);
    } finally {
      root.setAttribute("aria-busy", "false");
    }
  };
  await load();
}
