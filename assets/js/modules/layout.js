import { qsa, qs } from "./utils.js";

async function loadPartial(el) {
    const url = el.getAttribute("data-include");
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Falha ao carregar partial: ${url}`);
    el.outerHTML = await res.text();
}

function applyHeaderConfig() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const title = document.body.dataset.headerTitle || "Nome Sobrenome";
    const subtitle = document.body.dataset.headerSubtitle || "Hero / Headline / Role";

    const titleEl = header.querySelector("[data-header-title]");
    const subtitleEl = header.querySelector("[data-header-subtitle]");

    if (titleEl) titleEl.textContent = title;
    if (subtitleEl) subtitleEl.textContent = subtitle;
}

function applyHeaderCTA() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const cta = header.querySelector("[data-header-cta]");
    if (!cta) return;

    const page = document.body.dataset.page || "home";

    const mkLink = (href, text, ghost = false) => {
        const a = document.createElement("a");
        a.href = href;
        a.className = ghost ? "btn btn-ghost" : "btn";
        a.textContent = text;
        return a;
    };

    cta.replaceChildren();

    if (page === "home") {
        cta.append(
            mkLink("./cv.html", "Ver Currículo"),
            mkLink("./projects.html", "Ver Projetos", true)
        );
        return;
    }

    if (page === "projects") {
        cta.append(
            mkLink("./cv.html", "Currículo"),
            mkLink("./index.html", "Voltar", true)
        );
        return;
    }

    // default
    cta.append(
        mkLink("./index.html", "Home"),
        mkLink("./projects.html", "Projetos", true)
    );
}

export async function initLayout() {
    const includes = qsa("[data-include]");
    for (const el of includes) {
        await loadPartial(el);
    }
    applyHeaderConfig();
    applyHeaderCTA();
}
