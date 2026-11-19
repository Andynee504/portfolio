import { loadJSON } from "./data.js";

export const CATEGORY_LABELS = Object.freeze({
  all: "Todos", web: "Web", "3d": "3D", gamedev: "Game Design",
});

export function element(tag, className = "", text = "") {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== null && text !== undefined && text !== "") node.textContent = String(text);
  return node;
}

export function safeURL(value, protocols = ["http:", "https:"]) {
  if (typeof value !== "string" || !value.trim() || value.trim().startsWith("#")) return null;
  try {
    const url = new URL(value.trim(), document.baseURI);
    return protocols.includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function textValue(value) {
  if (Array.isArray(value)) return value.filter(item => typeof item === "string").join(", ");
  return typeof value === "string" ? value.trim() : "";
}

export function isRealProject(project) {
  return project && typeof project === "object" && textValue(project.id) && textValue(project.title)
    && !/^proj-/i.test(project.id) && !/placeholder/i.test(project.title);
}

let projectsRequest;
export async function loadProjects() {
  if (!projectsRequest) {
    projectsRequest = loadJSON("./assets/data/projects.json").then(data => {
      if (!Array.isArray(data)) throw new Error("Formato de projetos inválido");
      return data.filter(isRealProject);
    }).catch(error => {
      projectsRequest = null;
      throw error;
    });
  }
  return projectsRequest;
}

export function projectMedia(project, image = null, eager = false) {
  const container = element("div", "card-media");
  const source = safeURL(image?.src || project.thumb);
  const placeholder = () => {
    container.replaceChildren(element("span", "media-placeholder", "Imagem a adicionar"));
  };
  if (!source) {
    placeholder();
    return container;
  }
  const img = document.createElement("img");
  img.alt = textValue(image?.alt) || textValue(project.imageAlt) || `Imagem do projeto ${project.title}`;
  img.loading = eager ? "eager" : "lazy";
  img.decoding = "async";
  img.addEventListener("error", placeholder, { once: true });
  img.src = source;
  container.append(img);
  return container;
}

export function projectFacts(project, className = "project-facts") {
  const facts = element("dl", className);
  const fields = [["Minha participação", project.role], ["Equipe", project.team], ["Período", project.period], ["Duração", project.duration]];
  for (const [label, value] of fields) {
    const content = textValue(value);
    if (!content) continue;
    const row = element("div");
    row.append(element("dt", "", label), element("dd", "", content));
    facts.append(row);
  }
  return facts.childElementCount ? facts : null;
}

export function projectTags(project) {
  const values = Array.isArray(project.tags) ? project.tags.filter(tag => typeof tag === "string" && tag.trim()) : [];
  if (!values.length) return null;
  const tags = element("ul", "tags");
  tags.setAttribute("aria-label", "Ferramentas e tecnologias");
  for (const tag of values) tags.append(element("li", "tag", tag));
  return tags;
}

export function projectCard(project) {
  const card = element("article", "project-card");
  const body = element("div", "card-body");
  const title = element("h3", "project-title", project.title);
  body.append(element("p", "project-meta", CATEGORY_LABELS[project.category] || "Projeto"), title);
  if (textValue(project.oneLiner)) body.append(element("p", "project-summary", project.oneLiner));
  const facts = projectFacts({ period: project.period, duration: project.duration }, "project-specs");
  if (facts) body.append(facts);
  const tags = projectTags(project);
  if (tags) body.append(tags);
  const link = element("a", "project-link", "Conhecer o projeto");
  link.href = `./project.html?id=${encodeURIComponent(project.id)}`;
  link.setAttribute("aria-label", `Conhecer o projeto ${project.title}`);
  body.append(link);
  card.append(projectMedia(project), body);
  return card;
}

export function renderError(root, message, retry) {
  const box = element("div", "message");
  box.setAttribute("role", "alert");
  box.append(element("p", "", message));
  const button = element("button", "btn btn-ghost", "Tentar novamente");
  button.type = "button";
  button.addEventListener("click", async () => {
    await retry();
    if (!button.isConnected && document.activeElement === document.body) {
      document.getElementById("main")?.focus();
    }
  });
  box.append(button);
  root.replaceChildren(box);
}
