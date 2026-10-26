package za.co.mothaleholdings;

/**
 * Builds the emails the website sends (BRD Modules C, D and E).
 * Everything the visitor typed is HTML-escaped first, so nobody can inject HTML into an email.
 */
public final class EmailTemplates {

    private static final String COMPANY_EMAIL = "mothalestockvel@gmail.com";

    private EmailTemplates() {
        // Only static methods
    }

    /** Email to the company inbox when a Rent a Bike enquiry comes in (BRD C-01). */
    public static Email enquiryNotification(Enquiry enquiry) {
        String subject = "New scooter rental enquiry - " + oneLine(enquiry.fullName());

        String body = heading("New scooter rental enquiry")
                + "<p>A new enquiry was submitted on the website. Please send a formal quote "
                + "within <strong>2 business days</strong>.</p>"
                + "<table cellpadding=\"6\" style=\"border-collapse:collapse;\">"
                + row("Name", enquiry.fullName())
                + row("Email", enquiry.email())
                + row("Cell number", enquiry.cellNumber())
                + row("Preferred collection date", dateOrNotSpecified(enquiry.collectionDate()))
                + row("Quote address", formatAddress(enquiry))
                + "</table>";

        return new Email(subject, wrap(body));
    }

    /** Acknowledgement email to the customer, based on the sample in BRD section 7.4 (D-01, D-02). */
    public static Email enquiryAcknowledgement(Enquiry enquiry) {
        String subject = "We've received your scooter rental enquiry - Mothale Holdings";

        String body = heading("Thank you for your enquiry")
                + "<p>Dear " + escape(enquiry.fullName()) + ",</p>"
                + "<p>Thank you for your interest in renting a scooter with Mothale Holdings (Pty) Ltd. "
                + "We confirm that we have received your enquiry with the following details:</p>"
                + "<ul>"
                + "<li><strong>Name:</strong> " + escape(enquiry.fullName()) + "</li>"
                + "<li><strong>Contact number:</strong> " + escape(enquiry.cellNumber()) + "</li>"
                + "<li><strong>Email:</strong> " + escape(enquiry.email()) + "</li>"
                + "<li><strong>Preferred collection date:</strong> "
                + escape(dateOrNotSpecified(enquiry.collectionDate())) + "</li>"
                + "<li><strong>Quote to be addressed to:</strong> " + escape(formatAddress(enquiry)) + "</li>"
                + "</ul>"
                + "<h3>What happens next</h3>"
                + "<ol>"
                + "<li>Our team will prepare a formal rental quote and send it to you within "
                + "<strong>2 business days</strong>.</li>"
                + "<li>Once issued, your quote will remain valid for <strong>7 days</strong>.</li>"
                + "<li>To accept your quote and secure your scooter, a once-off deposit of <strong>R350</strong> "
                + "is payable via EFT to our business account (details will be included in your quote). "
                + "This deposit is retained for the duration of your rental and is refunded to you once "
                + "your rental agreement is terminated, provided that the scooter is returned with a "
                + "<strong>full fuel tank</strong> and is <strong>free from damage</strong>. If you accept the "
                + "quote but do not go ahead with the rental, the deposit is non-refundable.</li>"
                + "<li>To confirm your acceptance, please reply to your quote email and attach a valid "
                + "<strong>proof of payment (POP)</strong> for the R350 deposit. Your booking is only confirmed "
                + "once we have received and verified your POP.</li>"
                + "<li>Your rental will be governed by our standard Scooter Rental Agreement, a copy of which "
                + "will be provided for your review and signature before the rental begins. Please bring your "
                + "<strong>ID or passport</strong> and a <strong>valid driver's licence</strong> when you sign.</li>"
                + "</ol>"
                + "<p>If you have any questions in the meantime, please contact us at "
                + "<a href=\"mailto:" + COMPANY_EMAIL + "\">" + COMPANY_EMAIL + "</a>.</p>"
                + "<p>Kind regards,<br>The Mothale Holdings Team</p>";

        return new Email(subject, wrap(body));
    }

    /** Email to the company inbox when someone uses the Contact Us form (BRD E-01). */
    public static Email contactNotification(ContactMessage contactMessage) {
        String subject = "New website message - " + oneLine(contactMessage.name());

        String phone = Validator.isNotBlank(contactMessage.phone()) ? contactMessage.phone() : "Not given";

        String body = heading("New message from the website")
                + "<table cellpadding=\"6\" style=\"border-collapse:collapse;\">"
                + row("Name", contactMessage.name())
                + row("Email", contactMessage.email())
                + row("Phone", phone)
                + "</table>"
                + "<h3>Message</h3>"
                // white-space:pre-wrap keeps the visitor's line breaks
                + "<p style=\"white-space:pre-wrap;\">" + escape(contactMessage.message()) + "</p>";

        return new Email(subject, wrap(body));
    }

    // ===== Helpers =====

    /** Turns characters that mean something in HTML into safe text: "<b>" -> "&lt;b&gt;" */
    public static String escape(String text) {
        if (text == null) {
            return "";
        }
        return text.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    /** Subject lines must be one line - removes line breaks a visitor might have typed. */
    static String oneLine(String text) {
        return text == null ? "" : text.replaceAll("[\\r\\n]+", " ").trim();
    }

    static String formatAddress(Enquiry enquiry) {
        return String.join(", ",
                enquiry.streetAddress().trim(),
                enquiry.suburb().trim(),
                enquiry.city().trim(),
                enquiry.province().trim(),
                enquiry.postalCode().trim());
    }

    static String dateOrNotSpecified(String date) {
        return Validator.isNotBlank(date) ? date.trim() : "Not specified";
    }

    private static String heading(String text) {
        return "<h2 style=\"margin-top:0;\">" + escape(text) + "</h2>";
    }

    private static String row(String label, String value) {
        return "<tr><td style=\"border-bottom:1px solid #eee;\"><strong>" + escape(label) + "</strong></td>"
                + "<td style=\"border-bottom:1px solid #eee;\">" + escape(value) + "</td></tr>";
    }

    /** Shared email layout: yellow company header, white content box, small footer. */
    private static String wrap(String content) {
        return "<div style=\"font-family:Segoe UI,Arial,sans-serif;color:#1F1F1F;max-width:600px;margin:auto;\">"
                + "<div style=\"background:#F5A300;padding:16px 24px;font-size:20px;font-weight:bold;\">"
                + "Mothale Holdings</div>"
                + "<div style=\"padding:24px;border:1px solid #eee;\">" + content + "</div>"
                + "<p style=\"font-size:12px;color:#777;padding:0 24px;\">"
                + "Mothale Holdings (Pty) Ltd &middot; Enterprise No. 2026/503839/07 &middot; "
                + "1 Bokmakierie Road, Daggafontein, Springs, Gauteng, 1559</p>"
                + "</div>";
    }
}