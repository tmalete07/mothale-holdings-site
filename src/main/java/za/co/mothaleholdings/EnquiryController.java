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

    private static final String COMPANY_EMAIL = "mothalestockvel@gmail.com";

    private EnquiryController() {
        // Only static methods
    }

    public static void create(Context ctx, EmailService emailService) {
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

        // 1. Tell the company. Reply-To = customer, so the company can just click "Reply".
        boolean companyNotified = emailService.trySend(
                emailService.companyInbox(),
                EmailTemplates.enquiryNotification(enquiry),
                enquiry.email().trim());

        if (!companyNotified) {
            // Keep the enquiry so it is not lost (BRD H-02)
            BackupStore.save("unsent-enquiries.jsonl", ctx.body());
        }

        // 2. Acknowledge the customer - sent even if step 1 failed (BRD H-02)
        emailService.trySend(
                enquiry.email().trim(),
                EmailTemplates.enquiryAcknowledgement(enquiry),
                COMPANY_EMAIL);

        ctx.status(201).json(Map.of("message", "Thank you, your enquiry has been received."));
    }
}