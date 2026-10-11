package za.co.mothaleholdings;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Reads settings such as MAIL_PASSWORD.
 *
 * 1. A real environment variable wins (this is what the hosting server uses).
 * 2. Otherwise the value comes from the .env file in the project folder (handy on your own computer).
 *
 * The .env file is in .gitignore, so it never goes to GitHub.
 */
public final class Config {

    private static final Map<String, String> DOT_ENV = loadDotEnv(Path.of(".env"));

    private Config() {
        // Only static methods
    }

    /** Returns the setting, or null if it is not set anywhere. */
    public static String get(String name) {
        String value = System.getenv(name);
        if (Validator.isNotBlank(value)) {
            return value;
        }
        return DOT_ENV.get(name);
    }

    /**
     * Reads lines like  MAIL_USERNAME=someone@gmail.com
     * Empty lines and lines starting with # are ignored. Quotes around values are removed.
     */
    static Map<String, String> loadDotEnv(Path file) {
        Map<String, String> values = new HashMap<>();
        if (!Files.exists(file)) {
            return values;
        }
        try {
            List<String> lines = Files.readAllLines(file, StandardCharsets.UTF_8);
            for (String line : lines) {
                String trimmed = line.trim();
                int equals = trimmed.indexOf('=');
                if (trimmed.isEmpty() || trimmed.startsWith("#") || equals < 1) {
                    continue;
                }
                String key = trimmed.substring(0, equals).trim();
                String value = trimmed.substring(equals + 1).trim();
                if (value.length() >= 2 && value.startsWith("\"") && value.endsWith("\"")) {
                    value = value.substring(1, value.length() - 1);
                }
                values.put(key, value);
            }
        } catch (IOException e) {
            System.err.println("Could not read .env file: " + e.getMessage());
        }
        return values;
    }
}