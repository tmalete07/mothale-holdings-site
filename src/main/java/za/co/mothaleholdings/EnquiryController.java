package za.co.mothaleholdings;

import io.javalin.http.Context;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Map;

/**
 * Handles POST /api/enquiries - the "Rent a Bike" form.
 */
public final class EnquiryController {

    // Use South African time, even if the server runs somewhere else
    private static final ZoneId SA_TIME = ZoneId.of("Africa/Johannesburg");

    private EnquiryController() {
        // Only static methods
    }

    public static void create(Context ctx) {
        Enquiry enquiry;
        try {
            enquiry = ctx.bodyAsClass(Enquiry.class);
        } catch (Exception e) {
            // Not valid JSON, or the wrong fields
            ctx.status(400).json(Map.of("message", "Invalid enquiry data."));
            return;
        }

        Map<String, String> errors = enquiry.validate(LocalDate.now(SA_TIME));
        if (!errors.isEmpty()) {
            ctx.status(400).json(Map.of(
                    "message", "Please fix the highlighted fields.",
                    "errors", errors));
            return;
        }

        // POPIA: only log the name, not all the personal details
        System.out.println("New enquiry received from " + enquiry.fullName());

        ctx.status(201).json(Map.of("message", "Thank you, your enquiry has been received."));
    }
}