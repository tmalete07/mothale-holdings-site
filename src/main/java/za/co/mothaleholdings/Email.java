package za.co.mothaleholdings;

/**
 * One email, ready to send: a subject line and an HTML body.
 */
public record Email(String subject, String htmlBody) {
}