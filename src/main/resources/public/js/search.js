// Search page (BRD Module B).
// Reads the search words from the address bar, e.g. search.html?q=deposit

const params = new URLSearchParams(window.location.search);
const searchTerm = (params.get("q") || "").trim();

// Put the words back in the search box so the visitor can edit them
document.getElementById("search-input").value = searchTerm;

const summary = document.getElementById("search-summary");

if (searchTerm === "") {
    summary.textContent = "Type a word above, e.g. deposit, quote or contact.";
} else {
    // textContent (not innerHTML) so typed HTML/scripts are shown as plain text - never run
    summary.textContent = `You searched for "${searchTerm}".`;
}