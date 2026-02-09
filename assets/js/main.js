import { initLayout } from "./modules/layout.js";
import { initScrollShell } from "./modules/scrollShell.js";
import { initProjectsPage } from "./modules/projects.js";
import { initProjectDetailPage } from "./modules/projectDetail.js";
import { initCVPage } from "./modules/cv.js";

(async function boot() {
  await initLayout();
  initScrollShell();

  const page = document.body.dataset.page;
  if (page === "projects") initProjectsPage();
  if (page === "project-detail") initProjectDetailPage();
  if (page === "cv") initCVPage();
})();
