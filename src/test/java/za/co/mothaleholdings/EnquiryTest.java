package za.co.mothaleholdings;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class EnquiryTest {

    private final LocalDate today = LocalDate.of(2026, 10, 10);

    /** A fully valid enquiry - each test changes one thing. */
    private Enquiry validEnquiry() {
        return new Enquiry("Thabo Mokoena", "thabo@gmail.com", "082 123 4567", "",
                "1 Main Road", "Daggafontein", "Springs", "Gauteng", "1559", true);
    }

    @Test
    void validEnquiryHasNoErrors() {
        assertTrue(validEnquiry().validate(today).isEmpty());
    }

    @Test
    void futureCollectionDateIsAccepted() {
        Enquiry enquiry = new Enquiry("Thabo Mokoena", "thabo@gmail.com", "082 123 4567", "2026-11-01",
                "1 Main Road", "Daggafontein", "Springs", "Gauteng", "1559", true);
        assertTrue(enquiry.validate(today).isEmpty());
    }

    @Test
    void pastCollectionDateIsRejected() {
        Enquiry enquiry = new Enquiry("Thabo Mokoena", "thabo@gmail.com", "082 123 4567", "2026-10-01",
                "1 Main Road", "Daggafontein", "Springs", "Gauteng", "1559", true);
        assertEquals("Please select a current or future date.",
                enquiry.validate(today).get("collectionDate"));
    }

    @Test
    void unknownProvinceIsRejected() {
        Enquiry enquiry = new Enquiry("Thabo Mokoena", "thabo@gmail.com", "082 123 4567", "",
                "1 Main Road", "Daggafontein", "Springs", "Gautang", "1559", true);
        assertTrue(enquiry.validate(today).containsKey("province"));
    }

    @Test
    void enquiryWithoutConsentIsRejected() {
        Enquiry enquiry = new Enquiry("Thabo Mokoena", "thabo@gmail.com", "082 123 4567", "",
                "1 Main Road", "Daggafontein", "Springs", "Gauteng", "1559", false);
        assertTrue(enquiry.validate(today).containsKey("consent"));
    }

    @Test
    void emptyEnquiryReportsEveryRequiredField() {
        Enquiry empty = new Enquiry(null, null, null, null, null, null, null, null, null, false);
        Map<String, String> errors = empty.validate(today);

        assertEquals(9, errors.size());   // every field except the optional date
        assertFalse(errors.containsKey("collectionDate"));
    }
}