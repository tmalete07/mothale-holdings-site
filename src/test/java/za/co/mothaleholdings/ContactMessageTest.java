package za.co.mothaleholdings;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ContactMessageTest {

    @Test
    void validMessageHasNoErrors() {
        ContactMessage contactMessage = new ContactMessage("Thabo", "thabo@gmail.com", "", "Hello", true);
        assertTrue(contactMessage.validate().isEmpty());
    }

    @Test
    void phoneIsOptionalEvenWhenMissing() {
        ContactMessage contactMessage = new ContactMessage("Thabo", "thabo@gmail.com", null, "Hello", true);
        assertTrue(contactMessage.validate().isEmpty());
    }

    @Test
    void invalidPhoneIsRejectedWhenGiven() {
        ContactMessage contactMessage = new ContactMessage("Thabo", "thabo@gmail.com", "123", "Hello", true);
        assertTrue(contactMessage.validate().containsKey("phone"));
    }

    @Test
    void messageOfExactlyMaxLengthIsAccepted() {
        String longest = "x".repeat(ContactMessage.MAX_MESSAGE_LENGTH);
        ContactMessage contactMessage = new ContactMessage("Thabo", "thabo@gmail.com", "", longest, true);
        assertTrue(contactMessage.validate().isEmpty());
    }

    @Test
    void messageOverMaxLengthIsRejected() {
        String tooLong = "x".repeat(ContactMessage.MAX_MESSAGE_LENGTH + 1);
        ContactMessage contactMessage = new ContactMessage("Thabo", "thabo@gmail.com", "", tooLong, true);
        assertTrue(contactMessage.validate().containsKey("message"));
    }

    @Test
    void emptyMessageReportsEveryRequiredField() {
        ContactMessage empty = new ContactMessage(null, null, null, null, false);
        Map<String, String> errors = empty.validate();

        assertEquals(4, errors.size());   // name, email, message, consent - not the optional phone
        assertTrue(errors.keySet().containsAll(java.util.List.of("name", "email", "message", "consent")));
    }
}