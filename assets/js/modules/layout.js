export function initLayout() {
  // Navigation exists in each HTML document and does not depend on JavaScript.
  const page = document.body.dataset.page;
  const current = page === "project-detail" ? "projects" : page;
  document.querySelectorAll(".site-nav [data-nav]").forEach(link => {
    if (link.dataset.nav === current) {
      link.setAttribute("aria-current", page === "project-detail" ? "location" : "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}
