// Contact Us page (BRD Module E).
// 1. Fills in the contact details and social links from config.js
// 2. Validates the contact form (same behaviour as the Rent a Bike form)
// 3. Sends the message to the Java server (POST /api/contact) and shows the result

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

const MAX_MESSAGE_LENGTH = 2000;   // same limit as ContactMessage.java

const contactForm = document.getElementById("contact-form");
const contactSubmitButton = document.getElementById("contact-submit");
const contactSubmitHint = document.getElementById("contact-submit-hint");
const contactSuccessMessage = document.getElementById("contact-success");

// Message box for problems sending the form (e.g. server offline).
// Created here so contact.html does not need to change.
const contactFormError = document.createElement("p");
contactFormError.className = "error";
contactFormError.setAttribute("role", "alert");
contactFormError.hidden = true;
contactSubmitButton.before(contactFormError);

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

    message: value => {
        if (!Validation.isNotBlank(value)) return "Please enter your message.";
        return value.length <= MAX_MESSAGE_LENGTH
            ? ""
            : `Please keep your message to ${MAX_MESSAGE_LENGTH} characters or fewer.`;
    },

    consent: isChecked =>
        isChecked ? "" : "Please agree to the Privacy Policy so we can respond to your message."
};

// Checkboxes give true/false, everything else gives text
function getContactValue(field) {
    return field.type === "checkbox" ? field.checked : field.value;
}

// Shows (or clears, when message is "") the error under one field
function showContactFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`);
    errorElement.textContent = message;
    field.classList.toggle("invalid", message !== "");
    field.setAttribute("aria-invalid", String(message !== ""));
}

// Checks one field AND shows/clears its error message
function validateContactField(field) {
    const message = contactRules[field.name](getContactValue(field));
    showContactFieldError(field, message);
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

// Builds the JSON the server expects (consent as true/false, not "on")
function buildContactMessage() {
    const contactMessage = {};
    Object.keys(contactRules).forEach(name => {
        contactMessage[name] = getContactValue(contactForm.elements[name]);
    });
    return contactMessage;
}

function showContactFormError(message) {
    contactFormError.textContent = message;
    contactFormError.hidden = false;
}

// Sends the message to Java. Returns nothing - updates the page instead.
async function sendContactMessage() {
    contactSubmitButton.disabled = true;
    contactSubmitButton.textContent = "Sending...";
    contactFormError.hidden = true;

    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(buildContactMessage())
        });

        if (response.status === 201) {
            contactForm.hidden = true;
            contactSuccessMessage.hidden = false;
            contactSuccessMessage.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        if (response.status === 400) {
            // The server found problems - show each one under its field
            const body = await response.json();
            const errors = body.errors || {};
            Object.keys(errors).forEach(name => {
                const field = contactForm.elements[name];
                if (field) {
                    showContactFieldError(field, errors[name]);
                }
            });
            showContactFormError(body.message || "Please fix the highlighted fields.");
            return;
        }

        showContactFormError("Sorry, something went wrong on our side. Please try again in a few minutes.");
    } catch (error) {
        // No response at all - server offline or no internet
        showContactFormError("We couldn't send your message. Please check your internet connection and try again.");
    } finally {
        // The visitor's answers are kept, so they can just try again (BRD I-03)
        contactSubmitButton.textContent = "Send Message";
        if (!contactForm.hidden) {
            updateContactSubmitButton();
        }
    }
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

    sendContactMessage();
});

// Set the correct button state when the page first loads
updateContactSubmitButton();