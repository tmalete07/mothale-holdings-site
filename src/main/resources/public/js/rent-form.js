// Rent a Bike form (BRD Module C).
// - Shows an error under a field when the visitor leaves it with a wrong value
// - Clears the error as soon as it is fixed
// - Keeps the Submit button disabled until every field is valid and the box is ticked
// - Sends the enquiry to the Java server (POST /api/enquiries) and shows the result

const rentForm = document.getElementById("rent-form");
const submitButton = document.getElementById("rent-submit");
const submitHint = document.getElementById("submit-hint");
const successMessage = document.getElementById("rent-success");

// Message box for problems sending the form (e.g. server offline).
// Created here so rent.html does not need to change.
const formError = document.createElement("p");
formError.className = "error";
formError.setAttribute("role", "alert");
formError.hidden = true;
submitButton.before(formError);

// Stop the date picker from offering past dates
document.getElementById("collectionDate").min = Validation.todayAsIsoDate();

// One rule per field: returns an error message, or "" when the value is fine.
// The messages come from the BRD (C-02 to C-05, I-03).
const rules = {
    fullName: value =>
        Validation.isNotBlank(value) ? "" : "Please enter your full name.",

    email: value => {
        if (!Validation.isNotBlank(value)) return "This field is required.";
        return Validation.isValidEmail(value) ? "" : "Please enter a valid email address.";
    },

    cellNumber: value => {
        if (!Validation.isNotBlank(value)) return "This field is required.";
        return Validation.isValidSaCellNumber(value)
            ? ""
            : "Please enter a valid South African cell number, e.g. 082 123 4567 or +27 82 123 4567.";
    },

    // Optional - only checked when a date was picked
    collectionDate: value =>
        value === "" || Validation.isTodayOrLater(value) ? "" : "Please select a current or future date.",

    streetAddress: value =>
        Validation.isNotBlank(value) ? "" : "Please enter the street address.",

    suburb: value =>
        Validation.isNotBlank(value) ? "" : "Please enter the suburb.",

    city: value =>
        Validation.isNotBlank(value) ? "" : "Please enter the city or town.",

    province: value =>
        value !== "" ? "" : "Please select a province.",

    postalCode: value => {
        if (!Validation.isNotBlank(value)) return "This field is required.";
        return Validation.isValidPostalCode(value) ? "" : "Please enter a valid 4-digit postal code.";
    },

    consent: isChecked =>
        isChecked ? "" : "Please agree to the Privacy Policy so we can process your enquiry."
};

// Checkboxes give true/false, everything else gives text
function getValue(field) {
    return field.type === "checkbox" ? field.checked : field.value;
}

// Shows (or clears, when message is "") the error under one field
function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`);
    errorElement.textContent = message;
    field.classList.toggle("invalid", message !== "");
    field.setAttribute("aria-invalid", String(message !== ""));
}

// Checks one field AND shows/clears its error message
function validateField(field) {
    const message = rules[field.name](getValue(field));
    showFieldError(field, message);
    return message === "";
}

// Checks every field quietly (no messages) - used for the button
function isWholeFormValid() {
    return Object.keys(rules).every(name => {
        const field = rentForm.elements[name];
        return rules[name](getValue(field)) === "";
    });
}

function updateSubmitButton() {
    const ready = isWholeFormValid();
    submitButton.disabled = !ready;
    submitHint.hidden = ready;
}

// Builds the JSON the server expects (consent as true/false, not "on")
function buildEnquiry() {
    const enquiry = {};
    Object.keys(rules).forEach(name => {
        enquiry[name] = getValue(rentForm.elements[name]);
    });
    return enquiry;
}

function showFormError(message) {
    formError.textContent = message;
    formError.hidden = false;
}

// Sends the enquiry to Java. Returns nothing - updates the page instead.
async function sendEnquiry() {
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    formError.hidden = true;

    try {
        const response = await fetch("/api/enquiries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(buildEnquiry())
        });

        if (response.status === 201) {
            rentForm.hidden = true;
            successMessage.hidden = false;
            successMessage.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        if (response.status === 400) {
            // The server found problems - show each one under its field
            const body = await response.json();
            const errors = body.errors || {};
            Object.keys(errors).forEach(name => {
                const field = rentForm.elements[name];
                if (field) {
                    showFieldError(field, errors[name]);
                }
            });
            showFormError(body.message || "Please fix the highlighted fields.");
            return;
        }

        showFormError("Sorry, something went wrong on our side. Please try again in a few minutes.");
    } catch (error) {
        // No response at all - server offline or no internet
        showFormError("We couldn't send your enquiry. Please check your internet connection and try again.");
    } finally {
        // The visitor's answers are kept, so they can just try again (BRD I-03)
        submitButton.textContent = "Submit Enquiry";
        if (!rentForm.hidden) {
            updateSubmitButton();
        }
    }
}

// Connect each field to its rule
Object.keys(rules).forEach(name => {
    const field = rentForm.elements[name];

    // Show the error when the visitor leaves the field (or picks an option / ticks the box)
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("change", () => validateField(field));

    // Clear the error as soon as it is fixed
    field.addEventListener("input", () => {
        if (field.classList.contains("invalid")) {
            validateField(field);
        }
    });
});

// Re-check the button whenever anything changes
rentForm.addEventListener("input", updateSubmitButton);
rentForm.addEventListener("change", updateSubmitButton);

rentForm.addEventListener("submit", event => {
    event.preventDefault();

    // Final check - show every error, then jump to the first wrong field
    let firstInvalidField = null;
    Object.keys(rules).forEach(name => {
        const field = rentForm.elements[name];
        if (!validateField(field) && firstInvalidField === null) {
            firstInvalidField = field;
        }
    });

    if (firstInvalidField) {
        firstInvalidField.focus();
        return;
    }

    sendEnquiry();
});

// Set the correct button state when the page first loads
updateSubmitButton();