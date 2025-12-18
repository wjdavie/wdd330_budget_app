export async function loadHeaderFooter() {
    const headerEl = document.querySelector("#main-header");
    const footerEl = document.querySelector("#main-footer");

    if (!headerEl || !footerEl) return;

    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const basePath = pathParts.length > 2 ? "../" : "./";

    try {
        const headerResponse = await fetch(`${basePath}public/partials/header.html`);
        if (!headerResponse.ok) throw new Error("Header not found");
        headerEl.innerHTML = await headerResponse.text();

        const footerResponse = await fetch(`${basePath}public/partials/footer.html`);
        if (!footerResponse.ok) throw new Error("Footer not found");
        footerEl.innerHTML = await footerResponse.text();
    } catch (err) {
        console.error("Error loading header/footer:", err);
    }
 }