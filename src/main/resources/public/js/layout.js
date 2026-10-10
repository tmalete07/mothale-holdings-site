// Builds the header and footer for every page, so we only maintain them in one place.

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

function renderFooter() {
    const footer = document.getElementById("site-footer");
    const year = new Date().getFullYear();

    footer.innerHTML = `
        <div class="container">
            <div class="footer-grid">
                <div>
                    <h3>Mothale Holdings</h3>
                    <p>Scooter rentals for delivery drivers in Springs, Gauteng.</p>
                </div>
                <div>
                    <h3>Quick links</h3>
                    <ul>${buildNavLinks()}</ul>
                </div>
                <div>
                    <h3>Contact</h3>
                    <p>1 Bokmakierie Road, Daggafontein, Springs, Gauteng, 1559</p>
                    <p><a href="mailto:mothalestockvel@gmail.com">mothalestockvel@gmail.com</a></p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${year} Mothale Holdings (Pty) Ltd &middot; Enterprise No. 2026/503839/07
                   &middot; <a href="privacy.html">Privacy Policy</a></p>
            </div>
        </div>`;
}

renderHeader();
renderFooter();