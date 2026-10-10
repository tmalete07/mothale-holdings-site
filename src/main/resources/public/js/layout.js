// Builds the header for every page, so we only maintain it in one place.

const NAV_LINKS = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About Us" },
    { href: "rent.html", label: "Rent a Bike" },
    { href: "contact.html", label: "Contact Us" }
];

function getCurrentPage() {
    const page = window.location.pathname.split("/").pop();
    return page === "" ? "index.html" : page;
}

function buildNavLinks() {
    return NAV_LINKS.map(link => {
        const isActive = link.href === getCurrentPage();
        const activeAttrs = isActive ? ' class="active" aria-current="page"' : "";
        return `<li><a href="${link.href}"${activeAttrs}>${link.label}</a></li>`;
    }).join("");
}

function renderHeader() {
    const header = document.getElementById("site-header");
    header.innerHTML = `
        <div class="container header-inner">
            <a href="index.html" class="logo">Mothale Holdings</a>
            <nav class="main-nav" id="main-nav" aria-label="Main navigation">
                <ul>${buildNavLinks()}</ul>
            </nav>
            <div class="header-actions">
                <button type="button" class="icon-btn menu-toggle" id="menu-toggle"
                        aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">☰</button>
            </div>
        </div>`;

    setupMobileMenu();
}

function setupMobileMenu() {
    const menuButton = document.getElementById("menu-toggle");
    const nav = document.getElementById("main-nav");

    menuButton.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
        menuButton.textContent = isOpen ? "✕" : "☰";
    });
}

renderHeader();