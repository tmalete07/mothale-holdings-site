// Builds the header and footer for every page, so we only maintain them in one place.
// Also loads the Lucide icon library and the favicon for every page.

const NAV_LINKS = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About Us" },
    { href: "rent.html", label: "Rent a Bike" },
    { href: "contact.html", label: "Contact Us" }
];

// Lucide icons (https://lucide.dev) - a fixed version so the icons never change unexpectedly
const LUCIDE_URL = "https://unpkg.com/lucide@1.55.0/dist/umd/lucide.min.js";

/**
 * Turns every <i data-lucide="icon-name"></i> on the page into an SVG icon.
 * Safe to call any time - does nothing until the library has loaded.
 */
function refreshIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function loadIcons() {
    const script = document.createElement("script");
    script.src = LUCIDE_URL;
    script.onload = refreshIcons;
    document.head.append(script);
}

function addFavicon() {
    const icon = document.createElement("link");
    icon.rel = "icon";
    icon.type = "image/png";
    icon.href = "images/favicon.png";
    document.head.append(icon);
}

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
            <a href="index.html" class="logo">
                <img src="images/mothale-logo.png" alt="" width="48" height="48">
                <span>Mothale Holdings</span>
            </a>
            <nav class="main-nav" id="main-nav" aria-label="Main navigation">
                <ul>${buildNavLinks()}</ul>
            </nav>
            <div class="header-actions">
                <!-- Search box (desktop): sends the visitor to search.html?q=their+words -->
                <form class="header-search" action="search.html" method="get" role="search">
                    <label for="header-search-input" class="visually-hidden">Search the site</label>
                    <i data-lucide="search" aria-hidden="true"></i>
                    <input type="search" id="header-search-input" name="q" placeholder="Search..." required>
                </form>
                <!-- Search icon (mobile): opens the search page -->
                <a href="search.html" class="icon-btn search-link" aria-label="Search the site">
                    <i data-lucide="search" aria-hidden="true"></i>
                </a>
                <button type="button" class="icon-btn menu-toggle" id="menu-toggle"
                        aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">
                    <i data-lucide="menu" aria-hidden="true"></i>
                </button>
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
        menuButton.innerHTML = `<i data-lucide="${isOpen ? "x" : "menu"}" aria-hidden="true"></i>`;
        refreshIcons();
    });
}

function renderFooter() {
    const footer = document.getElementById("site-footer");
    const year = new Date().getFullYear();

    footer.innerHTML = `
        <div class="container">
            <div class="footer-grid">
                <div>
                    <img class="footer-logo" src="images/mothale-logo.png" alt="Mothale Holdings logo"
                         width="72" height="72" loading="lazy">
                    <p>Scooter rentals for delivery drivers in Springs, Gauteng.</p>
                </div>
                <div>
                    <h3>Quick links</h3>
                    <ul>${buildNavLinks()}</ul>
                </div>
                <div>
                    <h3>Contact</h3>
                    <p class="footer-line"><i data-lucide="map-pin" aria-hidden="true"></i>
                       1 Bokmakierie Road, Daggafontein, Springs, Gauteng, 1559</p>
                    <p class="footer-line"><i data-lucide="mail" aria-hidden="true"></i>
                       <a href="mailto:mothalestockvel@gmail.com">mothalestockvel@gmail.com</a></p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${year} Mothale Holdings (Pty) Ltd &middot; Enterprise No. 2026/503839/07
                   &middot; <a href="privacy.html">Privacy Policy</a></p>
            </div>
        </div>`;
}

addFavicon();
renderHeader();
renderFooter();
loadIcons();