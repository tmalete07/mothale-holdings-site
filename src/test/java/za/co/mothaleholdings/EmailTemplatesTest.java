package za.co.mothaleholdings;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class EmailTemplatesTest {

    private Enquiry enquiry(String name, String collectionDate) {
        return new Enquiry(name, "thabo@gmail.com", "082 123 4567", collectionDate,
                "1 Main Road", "Daggafontein", "Springs", "Gauteng", "1559", true);
    }

    @Test
    void acknowledgementContainsAllQuoteAndDepositTerms() {
        String body = EmailTemplates.enquiryAcknowledgement(enquiry("Thabo", "")).htmlBody();

        assertTrue(body.contains("Dear Thabo"));
        assertTrue(body.contains("2 business days"));
        assertTrue(body.contains("7 days"));
        assertTrue(body.contains("R350"));
        assertTrue(body.contains("proof of payment (POP)"));
        assertTrue(body.contains("non-refundable"));
    }

    @Test
    void missingCollectionDateShowsNotSpecified() {
        String body = EmailTemplates.enquiryAcknowledgement(enquiry("Thabo", "")).htmlBody();
        assertTrue(body.contains("Not specified"));
    }

    @Test
    void notificationContainsFullAddress() {
        String body = EmailTemplates.enquiryNotification(enquiry("Thabo", "2026-11-01")).htmlBody();

        assertTrue(body.contains("1 Main Road, Daggafontein, Springs, Gauteng, 1559"));
        assertTrue(body.contains("2026-11-01"));
    }

    @Test
    void htmlTypedByVisitorIsEscaped() {
        String body = EmailTemplates.enquiryAcknowledgement(enquiry("<script>alert(1)</script>", "")).htmlBody();

        assertFalse(body.contains("<script>"));
        assertTrue(body.contains("&lt;script&gt;"));
    }

    @Test
    void lineBreaksAreRemovedFromSubject() {
        // Stops "email header injection", e.g. a name that tries to add a Bcc line
        String subject = EmailTemplates.enquiryNotification(enquiry("Thabo\r\nBcc: spam@example.com", "")).subject();

        assertFalse(subject.contains("\n"));
        assertFalse(subject.contains("\r"));
    }

    @Test
    void contactNotificationShowsNotGivenWhenPhoneIsEmpty() {
        ContactMessage contactMessage = new ContactMessage("Thabo", "thabo@gmail.com", "", "Hello", true);
        assertTrue(EmailTemplates.contactNotification(contactMessage).htmlBody().contains("Not given"));
    }

    @Test
    void contactMessageTextIsEscaped() {
        ContactMessage contactMessage = new ContactMessage("Thabo", "thabo@gmail.com", "", "<b>Hi</b>", true);
        String body = EmailTemplates.contactNotification(contactMessage).htmlBody();

        assertTrue(body.contains("&lt;b&gt;Hi&lt;/b&gt;"));
    }

    @Test
    void escapeHandlesNull() {
        assertEquals("", EmailTemplates.escape(null));
    }
}