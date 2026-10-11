package za.co.mothaleholdings;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.util.Properties;

/**
 * Sends emails through Gmail.
 *
 * Settings come from environment variables or the .env file (see Config) - never from the code,
 * because the repo is public:
 *   MAIL_USERNAME  the Gmail address that sends the emails
 *   MAIL_PASSWORD  a Gmail App Password (not your normal password)
 *   MAIL_TO        the company inbox that receives enquiries (defaults to MAIL_USERNAME)
 */
public class EmailService {

    private static final String SENDER_NAME = "Mothale Holdings";

    private final String username;
    private final String password;
    private final String companyInbox;

    public EmailService(String username, String password, String companyInbox) {
        this.username = username;
        // App passwords are shown as "abcd efgh ijkl mnop" - the spaces are not part of it
        this.password = password == null ? null : password.replace(" ", "");
        this.companyInbox = companyInbox;
    }

    /** Reads the settings from environment variables, or from the .env file. */
    public static EmailService fromEnvironment() {
        String username = Config.get("MAIL_USERNAME");
        String password = Config.get("MAIL_PASSWORD");
        String inbox = Config.get("MAIL_TO");
        return new EmailService(username, password, Validator.isNotBlank(inbox) ? inbox : username);
    }

    public boolean isConfigured() {
        return Validator.isNotBlank(username) && Validator.isNotBlank(password);
    }

    public String companyInbox() {
        return companyInbox;
    }

    /**
     * Tries to send one email. Never throws - returns true if it was sent, false if not.
     * This way one failed email can't stop the other one (BRD H-02).
     */
    public boolean trySend(String to, Email email, String replyTo) {
        if (!isConfigured()) {
            System.out.println("Email not configured - skipped: " + email.subject());
            return false;
        }
        try {
            send(to, email, replyTo);
            System.out.println("Email sent: " + email.subject());
            return true;
        } catch (Exception e) {
            System.err.println("EMAIL FAILED: " + email.subject() + " - " + e.getMessage());
            return false;
        }
    }

    private void send(String to, Email email, String replyTo) throws Exception {
        MimeMessage message = new MimeMessage(createSession());
        message.setFrom(new InternetAddress(username, SENDER_NAME, "UTF-8"));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
        if (Validator.isNotBlank(replyTo)) {
            // When the receiver clicks "Reply", it goes to this address
            message.setReplyTo(InternetAddress.parse(replyTo));
        }
        message.setSubject(email.subject(), "UTF-8");
        message.setContent(email.htmlBody(), "text/html; charset=UTF-8");
        Transport.send(message);
    }

    private Session createSession() {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        // Give up after 10 seconds instead of making the visitor wait forever
        props.put("mail.smtp.connectiontimeout", "10000");
        props.put("mail.smtp.timeout", "10000");

        return Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });
    }
}