package za.co.mothaleholdings;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ValidatorTest {

    @Nested
    class NotBlank {

        @Test
        void textIsNotBlank() {
            assertTrue(Validator.isNotBlank("Thabo"));
        }

        @ParameterizedTest
        @NullAndEmptySource
        @ValueSource(strings = {"   ", "\t"})
        void nullEmptyOrSpacesIsBlank(String value) {
            assertFalse(Validator.isNotBlank(value));
        }
    }

    @Nested
    class Email {

        @ParameterizedTest
        @ValueSource(strings = {"thabo@gmail.com", "t@x.co", "name.surname@company.co.za", "  t@x.co  "})
        void validEmailsAreAccepted(String email) {
            assertTrue(Validator.isValidEmail(email));
        }

        @ParameterizedTest
        @NullAndEmptySource
        @ValueSource(strings = {"thabo", "thabo@gmail", "bad@", "@gmail.com", "thabo @gmail.com", "t@x.c"})
        void invalidEmailsAreRejected(String email) {
            assertFalse(Validator.isValidEmail(email));
        }
    }

    @Nested
    class SaCellNumber {

        @ParameterizedTest
        @ValueSource(strings = {"0821234567", "082 123 4567", "082-123-4567", "(082) 123 4567",
                "+27821234567", "+27 82 123 4567", "0612345678", "0731234567"})
        void validSaCellNumbersAreAccepted(String number) {
            assertTrue(Validator.isValidSaCellNumber(number));
        }

        @ParameterizedTest
        @NullAndEmptySource
        @ValueSource(strings = {"0113456789",      // landline (011)
                "08212345",        // too short
                "082123456789",    // too long
                "08212345ab",      // letters
                "27821234567",     // missing +
                "+27 11 345 6789"})// landline with +27
        void invalidSaCellNumbersAreRejected(String number) {
            assertFalse(Validator.isValidSaCellNumber(number));
        }

        @Test
        void spacesDashesAndBracketsAreRemoved() {
            assertEquals("0821234567", Validator.normaliseCellNumber(" (082) 123-4567 "));
        }
    }

    @Nested
    class PostalCode {

        @ParameterizedTest
        @ValueSource(strings = {"1559", "0001", " 2000 "})
        void fourDigitCodesAreAccepted(String code) {
            assertTrue(Validator.isValidPostalCode(code));
        }

        @ParameterizedTest
        @NullAndEmptySource
        @ValueSource(strings = {"155", "15590", "15a9", "15 59"})
        void otherCodesAreRejected(String code) {
            assertFalse(Validator.isValidPostalCode(code));
        }
    }

    @Nested
    class CollectionDate {

        private final LocalDate today = LocalDate.of(2026, 10, 10);

        @Test
        void todayIsAccepted() {
            assertTrue(Validator.isTodayOrLater("2026-10-10", today));
        }

        @Test
        void futureDateIsAccepted() {
            assertTrue(Validator.isTodayOrLater("2026-12-01", today));
        }

        @Test
        void yesterdayIsRejected() {
            assertFalse(Validator.isTodayOrLater("2026-10-09", today));
        }

        @ParameterizedTest
        @NullAndEmptySource
        @ValueSource(strings = {"10/10/2026", "not a date", "2026-13-01"})
        void wrongFormatIsRejected(String date) {
            assertFalse(Validator.isTodayOrLater(date, today));
        }
    }
}