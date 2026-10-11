package za.co.mothaleholdings;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.ZonedDateTime;
import java.time.ZoneId;

/**
 * Saves a submission to a file when the company email could not be sent,
 * so the enquiry is not lost (BRD H-02).
 *
 * Files go in the "data" folder, which is in .gitignore - personal information
 * must NEVER be committed to GitHub (POPIA).
 */
public final class BackupStore {

    private static final Path FOLDER = Path.of("data");

    private BackupStore() {
        // Only static methods
    }

    /** Adds one line to data/fileName: {"receivedAt": "...", "data": {...the JSON that was sent...}} */
    public static synchronized void save(String fileName, String json) {
        String receivedAt = ZonedDateTime.now(ZoneId.of("Africa/Johannesburg")).toString();
        String line = "{\"receivedAt\":\"" + receivedAt + "\",\"data\":" + json + "}" + System.lineSeparator();
        try {
            Files.createDirectories(FOLDER);
            Files.writeString(FOLDER.resolve(fileName), line,
                    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
            System.err.println("Saved to backup file data/" + fileName + " - please follow up manually.");
        } catch (IOException e) {
            System.err.println("COULD NOT SAVE BACKUP: " + e.getMessage());
        }
    }
}