// Rent a Bike form.
// The Submit button stays disabled until every required field has a value
// and the Privacy Policy box is ticked.

const rentForm = document.getElementById("rent-form");
const submitButton = document.getElementById("rent-submit");
const submitHint = document.getElementById("submit-hint");

// Every field with the "required" attribute in rent.html
const requiredFields = rentForm.querySelectorAll("[required]");

function isFilledIn(field) {
    if (field.type === "checkbox") {
        return field.checked;
    }
    return field.value.trim() !== "";
}

function updateSubmitButton() {
    const allFilledIn = Array.from(requiredFields).every(isFilledIn);
    submitButton.disabled = !allFilledIn;
    submitHint.hidden = allFilledIn;
}

// Re-check every time the visitor types, picks an option or ticks the box
rentForm.addEventListener("input", updateSubmitButton);
rentForm.addEventListener("change", updateSubmitButton);

// Temporary: stop the page reloading. Task 6.3 will validate and handle the submit.
rentForm.addEventListener("submit", event => {
    event.preventDefault();
});

// Set the correct state when the page first loads
updateSubmitButton();