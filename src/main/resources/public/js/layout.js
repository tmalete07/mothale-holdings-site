// Builds the header for every page, so we only maintain it in one place.

const NAV_LINKS = [
    { href: "index.html", label: "Home" },
    { href: "about.html", label: "About Us" },
    { href: "rent.html", label: "Rent a Bike" },
    { href: "contact.html", label: "Contact Us" }
];

function buildNavLinks() {
    return NAV_LINKS.map(link => `<li><a href="${link.href}">${link.label}</a></li>`).join("");
}

function renderHeader() {
    const header = document.getElementById("site-header");
    header.innerHTML = `
        <div class="container header-inner">
            <a href="index.html" class="logo">Mothale Holdings</a>
            <nav class="main-nav" aria-label="Main navigation">
                <ul>${buildNavLinks()}</ul>
            </nav>
        </div>`;
}

renderHeader();