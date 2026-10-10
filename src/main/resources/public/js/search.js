// Search page (BRD Module B).
// 1. Reads the search words from the address bar, e.g. search.html?q=deposit
// 2. Gives every entry in SEARCH_INDEX a score - the better the match, the higher the score
// 3. Shows the results from most relevant to least relevant (B-01)
// 4. Shows a "No results found" message with suggestions when nothing matches (B-02)

// How many points a match is worth, depending on where the word is found
const POINTS = {
    wholePhraseInTitle: 20,     // e.g. "proof of payment" is exactly in the title
    wholePhraseInKeywords: 15,  // e.g. "how much" is exactly in the keywords
    wordInTitle: 10,
    wordInKeywords: 5,
    wordInText: 3
};

// Common words that would match almost everything, so we ignore them
const STOP_WORDS = ["a", "an", "and", "are", "can", "do", "for", "how", "i", "in", "is", "it",
    "me", "my", "of", "on", "or", "the", "to", "we", "what", "you", "your"];

// "How much is the R350 Deposit?!" -> ["much", "r350", "deposit"]
function toWords(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")                 // remove punctuation
        .split(/\s+/)
        .filter(word => word.length >= 2)              // ignore single letters
        .filter(word => !STOP_WORDS.includes(word));   // ignore common words
}

function scoreEntry(entry, searchTerm, searchWords) {
    const title = entry.title.toLowerCase();
    const keywords = entry.keywords.toLowerCase();
    const text = entry.text.toLowerCase();

    let score = 0;

    const phrase = searchTerm.toLowerCase();
    if (title.includes(phrase)) score += POINTS.wholePhraseInTitle;
    if (keywords.includes(phrase)) score += POINTS.wholePhraseInKeywords;

    searchWords.forEach(word => {
        if (title.includes(word)) score += POINTS.wordInTitle;
        if (keywords.includes(word)) score += POINTS.wordInKeywords;
        if (text.includes(word)) score += POINTS.wordInText;
    });

    return score;
}

function search(searchTerm) {
    const searchWords = toWords(searchTerm);
    if (searchWords.length === 0) {
        return [];
    }

    return SEARCH_INDEX
        .map(entry => ({ entry: entry, score: scoreEntry(entry, searchTerm, searchWords) }))
        .filter(result => result.score > 0)          // drop entries that don't match at all
        .sort((a, b) => b.score - a.score)           // highest score first
        .map(result => result.entry);
}

// Builds one result with createElement + textContent (safe - nothing typed is ever run as HTML)
function createResultItem(entry) {
    const item = document.createElement("li");
    item.className = "search-result";

    const link = document.createElement("a");
    link.href = entry.url;
    link.className = "search-result-title";
    link.textContent = entry.title;

    const snippet = document.createElement("p");
    snippet.textContent = entry.text;

    const page = document.createElement("span");
    page.className = "search-result-url";
    page.textContent = entry.url;

    item.append(link, snippet, page);
    return item;
}

function showNoResults(searchTerm) {
    const resultsList = document.getElementById("search-results");
    const box = document.createElement("li");
    box.className = "no-results";

    const heading = document.createElement("h2");
    heading.textContent = `No results found for "${searchTerm}"`;

    const tips = document.createElement("p");
    tips.textContent = "Try a different search term, such as deposit, quote, price or contact.";

    const contact = document.createElement("p");
    contact.append("Still can't find what you need? ");
    const contactLink = document.createElement("a");
    contactLink.href = "contact.html";
    contactLink.textContent = "Contact us";
    contact.append(contactLink, " and we'll help.");

    box.append(heading, tips, contact);
    resultsList.append(box);
}

function runSearchPage() {
    const params = new URLSearchParams(window.location.search);
    const searchTerm = (params.get("q") || "").trim();

    // Put the words back in the search box so the visitor can edit them
    document.getElementById("search-input").value = searchTerm;

    const summary = document.getElementById("search-summary");
    const resultsList = document.getElementById("search-results");

    if (searchTerm === "") {
        summary.textContent = "Type a word above, e.g. deposit, quote or contact.";
        return;
    }

    const results = search(searchTerm);

    if (results.length === 0) {
        summary.textContent = "";
        showNoResults(searchTerm);
        return;
    }

    const label = results.length === 1 ? "result" : "results";
    summary.textContent = `${results.length} ${label} for "${searchTerm}"`;
    results.forEach(entry => resultsList.append(createResultItem(entry)));
}

runSearchPage();