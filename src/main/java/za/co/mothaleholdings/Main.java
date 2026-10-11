package za.co.mothaleholdings;

import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/**
 * Starts the Mothale Holdings website.
 * Serves the HTML, CSS and JavaScript from src/main/resources/public
 * and shows 404.html for pages that don't exist.
 */
public class Main {

    private static final int DEFAULT_PORT = 7070;

    public static void main(String[] args) {
        EmailService emailService = EmailService.fromEnvironment();
        if (emailService.isConfigured()) {
            System.out.println("Email is ON - company inbox: " + emailService.companyInbox());
        } else {
            System.out.println("Email is OFF - set MAIL_USERNAME and MAIL_PASSWORD to send emails.");
        }

        int port = getPort();
        createApp(emailService).start(port);
        System.out.println("Website running at http://localhost:" + port);
    }

    /**
     * Builds the Javalin app. Kept separate from main() so tests can start it later.
     */
    public static Javalin createApp(EmailService emailService) {
        Javalin app = Javalin.create(config -> {
            // Everything in src/main/resources/public is served as the website
            config.staticFiles.add("/public", Location.CLASSPATH);
        });

        // API: Rent a Bike enquiries
        app.post("/api/enquiries", ctx -> EnquiryController.create(ctx, emailService));

        // API: Contact Us messages
        app.post("/api/contact", ctx -> ContactController.create(ctx, emailService));

        // Unknown page -> show our own 404 page (status stays 404)
        app.error(404, ctx -> ctx.html(loadPage("/public/404.html")));

        return app;
    }

    /**
     * Hosting services give the port in the PORT environment variable.
     * On your own computer we use 7070.
     */
    private static int getPort() {
        String port = System.getenv("PORT");
        return port != null ? Integer.parseInt(port) : DEFAULT_PORT;
    }

    /**
     * Reads an HTML file from the resources folder.
     */
    private static String loadPage(String path) {
        try (InputStream page = Main.class.getResourceAsStream(path)) {
            if (page == null) {
                return "<h1>Page not found</h1>";
            }
            return new String(page.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            return "<h1>Page not found</h1>";
        }
    }
}