# Mothale Holdings Website

A simple website for **Mothale Holdings (Pty) Ltd**, a scooter rental company in Springs, Gauteng,
that rents scooters to delivery drivers (Uber Eats, Mr D and more).

Built from the company's Business Requirements Document (BRD v0.2).

## Tech stack

| Part      | Technology                                   |
|-----------|----------------------------------------------|
| Front end | HTML, CSS, JavaScript (no frameworks)        |
| Back end  | Java 17+ with [Javalin](https://javalin.io)  |
| Email     | Jakarta Mail via Gmail SMTP                  |
| Testing   | JUnit 5                                      |
| Build     | Maven                                        |

## Features

- **Pages:** Home, About Us, Rent a Bike, Contact Us, Privacy Policy, Search, 404
- **Light/dark mode** that follows the device setting and remembers the visitor's choice
- **Responsive design** with a mobile menu
- **Rent a Bike enquiry form**
  - Live validation in the browser **and** on the server
  - South African cell numbers (`082 123 4567` or `+27 82 123 4567`), email, 4-digit postal code, no past dates
  - Structured address with city suggestions
  - Submit button stays disabled until the form is valid and POPIA consent is given
  - Emails the company and sends the customer an acknowledgement with the quote and deposit terms
- **Contact form** with the same validation, emailed to the company
- **Reliable email handling** - the two enquiry emails are sent independently, and if the company
  email fails the submission is saved to a backup file so it is not lost
- **Security** - visitor input is HTML-escaped in emails, and subject lines are protected against header injection
- **Site search** with ranked results and a "No results found" message
- **Configurable contact details and social links** in `js/config.js`
- **POPIA Privacy Policy**

## Requirements

- **Java 17 or newer** - check with `java -version`
- **Maven** - check with `mvn -version`
- A **Gmail account with an App Password** (only needed to send emails)

## How to run the website

1. Clone the repository:

```bash
   git clone https://github.com/<your-username>/mothale-holdings-site.git
   cd mothale-holdings-site
```

2. Start the server:

```bash
   mvn compile exec:java
```

3. Open your browser at **http://localhost:7070**

4. To stop the server, press **Ctrl + C** in the terminal.

The website works without email settings - forms are still validated and accepted,
but emails are skipped and submissions are saved to the `data/` folder instead.

## Email setup

Emails are sent through Gmail. The password is **never** stored in the code - it is read
from environment variables.

### 1. Create a Gmail App Password

1. Go to **myaccount.google.com** → **Security** and turn on **2-Step Verification**.
2. Go to **myaccount.google.com/apppasswords**, enter a name (e.g. `Mothale website`) and click **Create**.
3. Copy the 16-letter password.

### 2. Set the environment variables

| Variable        | What it is                                             |
|-----------------|--------------------------------------------------------|
| `MAIL_USERNAME` | The Gmail address that sends the emails                |
| `MAIL_PASSWORD` | The Gmail App Password                                 |
| `MAIL_TO`       | The inbox that receives enquiries (defaults to `MAIL_USERNAME`). In production: `mothalestockvel@gmail.com` |

**Windows PowerShell** (only lasts for this terminal window):

```powershell
$env:MAIL_USERNAME="your.address@gmail.com"
$env:MAIL_PASSWORD="your app password"
$env:MAIL_TO="your.address@gmail.com"
mvn compile exec:java
```

**macOS / Linux:**

```bash
export MAIL_USERNAME="your.address@gmail.com"
export MAIL_PASSWORD="your app password"
export MAIL_TO="your.address@gmail.com"
mvn compile exec:java
```

**IntelliJ IDEA:** Run → Edit Configurations → select `Main` → **Environment variables** →
`MAIL_USERNAME=...;MAIL_PASSWORD=...;MAIL_TO=...`

When the server starts it prints **"Email is ON"** or **"Email is OFF"**.

### Running from IntelliJ IDEA

1. Open the project folder and click **Load Maven Project** if asked.
2. Open `src/main/java/za/co/mothaleholdings/Main.java`.
3. Click the green ▶ button next to `public static void main`.
4. Open **http://localhost:7070**

### Using a different port

The server uses port `7070` by default. To use another port, set the `PORT` environment variable:

```bash
# Windows PowerShell
$env:PORT=8080; mvn compile exec:java

# macOS / Linux
PORT=8080 mvn compile exec:java
```

## Running the tests

```bash
mvn test
```

Unit tests cover the validation rules (email, SA cell numbers, postal codes, dates), the enquiry and
contact form validation, and the email templates (content, HTML escaping and header-injection protection).

## API

| Method | Endpoint          | Description                      | Responses                         |
|--------|-------------------|----------------------------------|-----------------------------------|
| POST   | `/api/enquiries`  | Submit a Rent a Bike enquiry     | `201` saved, `400` with field errors |
| POST   | `/api/contact`    | Submit a Contact Us message      | `201` saved, `400` with field errors |

## Project structure

```
mothale-holdings-site/
├── pom.xml                              Maven project file
├── README.md
├── data/                                Backups of unsent submissions (git-ignored)
└── src/
    ├── main/
    │   ├── java/za/co/mothaleholdings/
    │   │   ├── Main.java                Starts the web server
    │   │   ├── Validator.java           Shared validation rules
    │   │   ├── Enquiry.java             Rent a Bike enquiry + validation
    │   │   ├── EnquiryController.java   POST /api/enquiries
    │   │   ├── ContactMessage.java      Contact message + validation
    │   │   ├── ContactController.java   POST /api/contact
    │   │   ├── Email.java               An email (subject + body)
    │   │   ├── EmailTemplates.java      Builds the email content
    │   │   ├── EmailService.java        Sends emails through Gmail
    │   │   └── BackupStore.java         Saves submissions when email fails
    │   └── resources/public/            The website
    │       ├── index.html, about.html, rent.html, contact.html,
    │       ├── privacy.html, search.html, 404.html
    │       ├── css/style.css            All styles (light + dark mode)
    │       └── js/
    │           ├── layout.js            Shared header and footer
    │           ├── theme.js             Light/dark mode
    │           ├── validation.js        Shared form validation rules
    │           ├── rent-form.js         Rent a Bike form
    │           ├── config.js            Company contact details and social links
    │           ├── contact.js           Contact page and form
    │           ├── search-index.js      Searchable content
    │           └── search.js            Search ranking and results
    └── test/java/za/co/mothaleholdings/
        ├── ValidatorTest.java
        ├── EnquiryTest.java
        ├── ContactMessageTest.java
        └── EmailTemplatesTest.java
```

## Updating company details

Phone number, WhatsApp number and social media links are in
`src/main/resources/public/js/config.js`. Change them there; no HTML changes are needed.

## Still to come

- [ ] Deployment
- [ ] Company logo, director profiles and contact numbers
- [ ] Google reviews

## Author

**Tapiso Malete**

## Password

