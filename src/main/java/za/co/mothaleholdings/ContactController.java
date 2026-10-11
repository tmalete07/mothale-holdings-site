package za.co.mothaleholdings;

import io.javalin.http.Context;

import java.util.Map;

/**
 * Handles POST /api/contact - the Contact Us form.
 */
public final class ContactController {

    private ContactController() {
        // Only static methods
    }

    public static void create(Context ctx) {
        ContactMessage contactMessage;
        try {
            contactMessage = ctx.bodyAsClass(ContactMessage.class);
        } catch (Exception e) {
            // Not valid JSON, or the wrong fields
            ctx.status(400).json(Map.of("message", "Invalid message data."));
            return;
        }

        Map<String, String> errors = contactMessage.validate();
        if (!errors.isEmpty()) {
            ctx.status(400).json(Map.of(
                    "message", "Please fix the highlighted fields.",
                    "errors", errors));
            return;
        }

        // POPIA: only log the name, not all the personal details
        System.out.println("New contact message received from " + contactMessage.name());

        ctx.status(201).json(Map.of("message", "Thank you for getting in touch. We'll get back to you soon."));
    }
}