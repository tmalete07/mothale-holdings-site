package za.co.mothaleholdings;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.regex.Pattern;

/**
 * Server-side validation rules.
 * These match the JavaScript rules in validation.js - the browser checks first for a quick
 * response, but the server must check again because browser checks can be bypassed.
 */
public final class Validator {

    private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$");

    // 06x, 07x or 08x (or +27 instead of the 0), 10 digits in total
    private static final Pattern SA_CELL_NUMBER = Pattern.compile("^(0|\\+27)[6-8]\\d{8}$");

    private static final Pattern POSTAL_CODE = Pattern.compile("^\\d{4}$");

    private Validator() {
        // Utility class - no objects needed
    }

    /** Not null, and not only spaces. */
    public static boolean isNotBlank(String value) {
        return value != null && !value.isBlank();
    }

    /** Something@something.something - e.g. name@domain.com */
    public static boolean isValidEmail(String value) {
        return isNotBlank(value) && EMAIL.matcher(value.trim()).matches();
    }

    /** Removes spaces, dashes and brackets: "082 123-4567" -> "0821234567" */
    public static String normaliseCellNumber(String value) {
        return value == null ? "" : value.trim().replaceAll("[\\s\\-()]", "");
    }

    public static boolean isValidSaCellNumber(String value) {
        return SA_CELL_NUMBER.matcher(normaliseCellNumber(value)).matches();
    }

    /** SA postal codes are exactly 4 digits. */
    public static boolean isValidPostalCode(String value) {
        return isNotBlank(value) && POSTAL_CODE.matcher(value.trim()).matches();
    }

    /**
     * True when the date ("YYYY-MM-DD") is today or later.
     * "today" is passed in so tests can control it.
     */
    public static boolean isTodayOrLater(String isoDate, LocalDate today) {
        if (!isNotBlank(isoDate)) {
            return false;
        }
        try {
            return !LocalDate.parse(isoDate.trim()).isBefore(today);
        } catch (DateTimeParseException e) {
            return false;
        }
    }
}