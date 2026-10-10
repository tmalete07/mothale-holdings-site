// Contact Us page (BRD Module E).
// 1. Fills in the contact details and social links from config.js
// 2. Validates the contact form (same behaviour as the Rent a Bike form)

// ===== 1. Contact details and social links =====

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

// ===== 2. Contact form =====

const contactForm = document.getElementById("contact-form");
const contactSubmitButton = document.getElementById("contact-submit");
const contactSubmitHint = document.getElementById("contact-submit-hint");
const contactSuccessMessage = document.getElementById("contact-success");

// One rule per field: returns an error message, or "" when the value is fine
const contactRules = {
    name: value =>
        Validation.isNotBlank(value) ? "" : "Please enter your name.",

    email: value => {
        if (!Validation.isNotBlank(value)) return "This field is required.";
        return Validation.isValidEmail(value) ? "" : "Please enter a valid email address.";
    },

    // Optional - only checked when something was typed
    phone: value =>
        !Validation.isNotBlank(value) || Validation.isValidSaCellNumber(value)
            ? ""
            : "Please enter a valid South African cell number, e.g. 082 123 4567 or +27 82 123 4567.",

    message: value =>
        Validation.isNotBlank(value) ? "" : "Please enter your message.",

    consent: isChecked =>
        isChecked ? "" : "Please agree to the Privacy Policy so we can respond to your message."
};

// Checkboxes give true/false, everything else gives text
function getContactValue(field) {
    return field.type === "checkbox" ? field.checked : field.value;
}

// Checks one field AND shows/clears its error message
function validateContactField(field) {
    const message = contactRules[field.name](getContactValue(field));
    const errorElement = document.getElementById(`${field.name}-error`);

    errorElement.textContent = message;
    field.classList.toggle("invalid", message !== "");
    field.setAttribute("aria-invalid", String(message !== ""));
    return message === "";
}

// Checks every field quietly (no messages) - used for the button
function isContactFormValid() {
    return Object.keys(contactRules).every(name => {
        const field = contactForm.elements[name];
        return contactRules[name](getContactValue(field)) === "";
    });
}

function updateContactSubmitButton() {
    const ready = isContactFormValid();
    contactSubmitButton.disabled = !ready;
    contactSubmitHint.hidden = ready;
}

// Connect each field to its rule
Object.keys(contactRules).forEach(name => {
    const field = contactForm.elements[name];

    field.addEventListener("blur", () => validateContactField(field));
    field.addEventListener("change", () => validateContactField(field));

    field.addEventListener("input", () => {
        if (field.classList.contains("invalid")) {
            validateContactField(field);
        }
    });
});

contactForm.addEventListener("input", updateContactSubmitButton);
contactForm.addEventListener("change", updateContactSubmitButton);

contactForm.addEventListener("submit", event => {
    event.preventDefault();

    // Final check - show every error, then jump to the first wrong field
    let firstInvalidField = null;
    Object.keys(contactRules).forEach(name => {
        const field = contactForm.elements[name];
        if (!validateContactField(field) && firstInvalidField === null) {
            firstInvalidField = field;
        }
    });

    if (firstInvalidField) {
        firstInvalidField.focus();
        return;
    }

    // Step 11: this data will be sent to the Java backend.
    const contactMessage = Object.fromEntries(new FormData(contactForm));
    console.log("Message ready to send:", contactMessage);

    contactForm.hidden = true;
    contactSuccessMessage.hidden = false;
    contactSuccessMessage.scrollIntoView({ behavior: "smooth", block: "center" });
});

// Set the correct button state when the page first loads
updateContactSubmitButton();