// Validation rules shared by every form on the site.
// Each function answers one question and returns true or false.
const Validation = {
    // Not empty (spaces only counts as empty)
    isNotBlank(value) {
        return value.trim().length > 0;
    },

    // Something@something.something - e.g. name@domain.com
    isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
    },

    // Removes spaces, dashes and brackets: "082 123-4567" -> "0821234567"
    normaliseCellNumber(value) {
        return value.trim().replace(/[\s\-()]/g, "");
    },

    // SA mobile numbers: 06x, 07x or 08x (or +27 instead of the 0), 10 digits in total
    isValidSaCellNumber(value) {
        return /^(0|\+27)[6-8]\d{8}$/.test(this.normaliseCellNumber(value));
    },

    // SA postal codes are exactly 4 digits
    isValidPostalCode(value) {
        return /^\d{4}$/.test(value.trim());
    },

    // Today's date as "YYYY-MM-DD" in the visitor's own time zone
    todayAsIsoDate() {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 10);
    },

    // "YYYY-MM-DD" dates can be compared as text
    isTodayOrLater(isoDate) {
        return isoDate >= this.todayAsIsoDate();
    }
};