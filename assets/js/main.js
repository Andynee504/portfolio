import { initLayout } from "./modules/layout.js";
import { initProjectsPage, initFeaturedProjects } from "./modules/projects.js";
import { initProjectDetailPage } from "./modules/projectDetail.js";
import { initCVPage } from "./modules/cv.js";

(async function boot() {
  await initLayout();

  const page = document.body.dataset.page;
  if (page === "home") initFeaturedProjects();
  if (page === "projects") initProjectsPage();
  if (page === "project-detail") initProjectDetailPage();
  if (page === "cv") initCVPage();
})();
