import { initScrollShell } from "./modules/scrollShell.js";
import { initNav } from "./modules/nav.js";
import { initProjectsPage } from "./modules/projects.js";
import { initProjectDetailPage } from "./modules/projectDetail.js";

initScrollShell();
initNav();

const page = document.body.dataset.page;

if (page === "projects") initProjectsPage();
if (page === "project-detail") initProjectDetailPage();
