// Contact Us page (BRD Module E).
// Fills in the contact details and social links from config.js.

function renderContactDetails() {
    const phoneHtml = SITE_CONFIG.phone
        ? `<a href="tel:${SITE_CONFIG.phone.replace(/\s/g, "")}">${SITE_CONFIG.phone}</a>`
        : "Coming soon";

    const whatsappHtml = SITE_CONFIG.whatsapp
        ? `<a href="https://wa.me/${SITE_CONFIG.whatsapp}" target="_blank" rel="noopener">Chat on WhatsApp</a>`
        : "Coming soon";

    document.getElementById("contact-details").innerHTML = `
        <li><strong>Address:</strong> ${SITE_CONFIG.address}</li>
        <li><strong>Email:</strong> <a href="mailto:${SITE_CONFIG.email}">${SITE_CONFIG.email}</a></li>
        <li><strong>Phone:</strong> ${phoneHtml}</li>
        <li><strong>WhatsApp:</strong> ${whatsappHtml}</li>`;
}

function renderSocialLinks() {
    // target="_blank" opens the profile in a new tab (BRD E-02)
    document.getElementById("social-links").innerHTML = SITE_CONFIG.socials
        .map(social => `<li><a href="${social.url}" target="_blank" rel="noopener">${social.name}</a></li>`)
        .join("");
}

renderContactDetails();
renderSocialLinks();