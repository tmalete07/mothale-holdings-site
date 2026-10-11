package za.co.mothaleholdings;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * A message from the Contact Us form (BRD Module E).
 * The field names match the form's input names, so the JSON maps straight onto this record.
 */
public record ContactMessage(
        String name,
        String email,
        String phone,      // optional
        String message,
        boolean consent) {

    /** Stops someone sending a huge message to the server. */
    public static final int MAX_MESSAGE_LENGTH = 2000;

    /**
     * Checks every field.
     * Returns field name -> error message. An empty map means the message is valid.
     * The messages are the same as the ones in contact.js.
     */
    public Map<String, String> validate() {
        Map<String, String> errors = new LinkedHashMap<>();

        if (!Validator.isNotBlank(name)) {
            errors.put("name", "Please enter your name.");
        }

        if (!Validator.isNotBlank(email)) {
            errors.put("email", "This field is required.");
        } else if (!Validator.isValidEmail(email)) {
            errors.put("email", "Please enter a valid email address.");
        }

        // Optional - only checked when something was typed
        if (Validator.isNotBlank(phone) && !Validator.isValidSaCellNumber(phone)) {
            errors.put("phone",
                    "Please enter a valid South African cell number, e.g. 082 123 4567 or +27 82 123 4567.");
        }

        if (!Validator.isNotBlank(message)) {
            errors.put("message", "Please enter your message.");
        } else if (message.length() > MAX_MESSAGE_LENGTH) {
            errors.put("message", "Please keep your message to " + MAX_MESSAGE_LENGTH + " characters or fewer.");
        }

        if (!consent) {
            errors.put("consent", "Please agree to the Privacy Policy so we can respond to your message.");
        }

        return errors;
    }
}