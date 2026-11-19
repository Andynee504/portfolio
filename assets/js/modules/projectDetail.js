import {
  CATEGORY_LABELS, element, loadProjects, projectFacts, projectMedia, projectTags,
  renderError, safeURL, textValue,
} from "./projectComponents.js";

export async function initProjectDetailPage() {
  const root = document.getElementById("project-root");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("id");

  function backLink() {
    const back = element("a", "back-link", "Voltar aos projetos");
    back.href = "./projects.html";
    return back;
  }

  function notFound() {
    root.setAttribute("aria-busy", "false");
    document.title = "Projeto não encontrado - Andrei Kirazian";
    const section = element("section", "page-intro");
    section.append(element("h1", "page-title", "Projeto não encontrado"), element("p", "", "Este endereço não corresponde a um projeto disponível."), backLink());
    root.replaceChildren(section);
  }

  if (!id) {
    notFound();
    return;
  }

  const load = async () => {
    root.setAttribute("aria-busy", "true");
    try {
      const project = (await loadProjects()).find(item => item.id === id);
      if (!project) {
        notFound();
        return;
      }
      document.title = `${project.title} - Andrei Kirazian`;
      const article = element("article", "project-article");
      const hero = element("header", "project-hero");
      const title = element("h1", "page-title", project.title);
      title.id = "project-title";
      hero.append(backLink(), element("p", "eyebrow", CATEGORY_LABELS[project.category] || "Projeto"), title);
      if (textValue(project.oneLiner)) hero.append(element("p", "hero-description", project.oneLiner));
      const facts = projectFacts(project);
      if (facts) hero.append(facts);
      const tags = projectTags(project);
      if (tags) hero.append(tags);

      const links = element("div", "project-links");
      for (const [value, label, className] of [
        [project.demo, "Acessar projeto", "btn btn-primary"],
        [project.repo, "Ver código no GitHub", "btn btn-ghost"],
      ]) {
        const url = safeURL(value);
        if (!url) continue;
        const link = element("a", className, label);
        link.href = url;
        links.append(link);
      }
      if (links.childElementCount) hero.append(links);
      hero.append(projectMedia(project, null, true));
      article.append(hero);

      const cases = element("div", "case-sections");
      const sections = [["context", "Contexto"], ["challenge", "O desafio"], ["decision", "Processo e decisões"], ["result", "Resultado e aprendizados"]];
      for (const [field, heading] of sections) {
        const text = textValue(project.notes?.[field]);
        if (!text || /placeholder/i.test(text)) continue;
        const section = element("section", "case-section");
        section.append(element("h2", "", heading), element("p", "", text));
        cases.append(section);
      }
      if (cases.childElementCount) article.append(cases);

      if (Array.isArray(project.gallery)) {
        const gallery = element("section", "project-gallery");
        gallery.append(element("h2", "", "Imagens do projeto"));
        for (const image of project.gallery) {
          if (!image || !safeURL(image.src)) continue;
          const figure = element("figure");
          figure.append(projectMedia(project, image));
          if (textValue(image.caption)) figure.append(element("figcaption", "", image.caption));
          gallery.append(figure);
        }
        if (gallery.childElementCount > 1) article.append(gallery);
      }
      root.replaceChildren(article);
    } catch {
      document.title = "Projeto indisponível - Andrei Kirazian";
      root.replaceChildren(element("h1", "page-title", "Não foi possível carregar o projeto"));
      const error = element("div");
      root.append(error);
      renderError(error, "Verifique a conexão e tente novamente.", load);
      root.append(backLink());
    } finally {
      root.setAttribute("aria-busy", "false");
    }
  };
  await load();
}
