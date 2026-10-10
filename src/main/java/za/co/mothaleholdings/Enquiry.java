package za.co.mothaleholdings;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * A "Rent a Bike" enquiry, as sent by the form on rent.html (BRD Module C).
 * The field names match the form's input names, so the JSON maps straight onto this record.
 */
public record Enquiry(
        String fullName,
        String email,
        String cellNumber,
        String collectionDate,   // optional, "YYYY-MM-DD" or empty
        String streetAddress,
        String suburb,
        String city,
        String province,
        String postalCode,
        boolean consent) {

    /** The 9 South African provinces - the same list as the dropdown on the form. */
    public static final List<String> PROVINCES = List.of(
            "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo",
            "Mpumalanga", "North West", "Northern Cape", "Western Cape");

    /**
     * Checks every field.
     * Returns field name -> error message. An empty map means the enquiry is valid.
     * The messages are the same as the ones in rent-form.js.
     */
    public Map<String, String> validate(LocalDate today) {
        Map<String, String> errors = new LinkedHashMap<>();

        if (!Validator.isNotBlank(fullName)) {
            errors.put("fullName", "Please enter your full name.");
        }

        if (!Validator.isNotBlank(email)) {
            errors.put("email", "This field is required.");
        } else if (!Validator.isValidEmail(email)) {
            errors.put("email", "Please enter a valid email address.");
        }

        if (!Validator.isNotBlank(cellNumber)) {
            errors.put("cellNumber", "This field is required.");
        } else if (!Validator.isValidSaCellNumber(cellNumber)) {
            errors.put("cellNumber",
                    "Please enter a valid South African cell number, e.g. 082 123 4567 or +27 82 123 4567.");
        }

        // Optional - only checked when a date was given
        if (Validator.isNotBlank(collectionDate) && !Validator.isTodayOrLater(collectionDate, today)) {
            errors.put("collectionDate", "Please select a current or future date.");
        }

        if (!Validator.isNotBlank(streetAddress)) {
            errors.put("streetAddress", "Please enter the street address.");
        }

        if (!Validator.isNotBlank(suburb)) {
            errors.put("suburb", "Please enter the suburb.");
        }

        if (!Validator.isNotBlank(city)) {
            errors.put("city", "Please enter the city or town.");
        }

        // Check for null first - List.of(...).contains(null) throws a NullPointerException
        if (province == null || !PROVINCES.contains(province)) {
            errors.put("province", "Please select a province.");
        }

        if (!Validator.isNotBlank(postalCode)) {
            errors.put("postalCode", "This field is required.");
        } else if (!Validator.isValidPostalCode(postalCode)) {
            errors.put("postalCode", "Please enter a valid 4-digit postal code.");
        }

        if (!consent) {
            errors.put("consent", "Please agree to the Privacy Policy so we can process your enquiry.");
        }

        return errors;
    }
}