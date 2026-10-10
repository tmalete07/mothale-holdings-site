# Mothale Holdings Website

A simple website for **Mothale Holdings (Pty) Ltd**, a scooter rental company in Springs, Gauteng,
that rents scooters to delivery drivers (Uber Eats, Mr D and more).

Built from the company's Business Requirements Document (BRD v0.2).

## Tech stack

| Part      | Technology                        |
|-----------|-----------------------------------|
| Front end | HTML, CSS, JavaScript (no frameworks) |
| Back end  | Java 17+ with [Javalin](https://javalin.io) |
| Build     | Maven                             |

## Features

- **Pages:** Home, About Us, Rent a Bike, Contact Us, Privacy Policy, Search, 404
- **Light/dark mode** that follows the device setting and remembers the visitor's choice
- **Responsive design** with a mobile menu
- **Rent a Bike enquiry form** with live validation:
    - South African cell numbers (`082 123 4567` or `+27 82 123 4567`)
    - Email format, 4-digit postal code, no past collection dates
    - Structured address with city suggestions
    - Submit button stays disabled until the form is valid and POPIA consent is given
- **Contact form** with the same validation
- **Site search** with ranked results and a "No results found" message
- **Configurable contact details and social links** in `js/config.js`
- **POPIA Privacy Policy**

## Requirements

- **Java 17 or newer** - check with `java -version`
- **Maven** - check with `mvn -version`

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

## Project structure

```
mothale-holdings-site/
├── pom.xml                          Maven project file
├── README.md
└── src/main/
    ├── java/za/co/mothaleholdings/
    │   └── Main.java                Starts the web server
    └── resources/public/            The website
        ├── index.html               Home
        ├── about.html               About Us
        ├── rent.html                Rent a Bike enquiry form
        ├── contact.html             Contact Us
        ├── privacy.html             Privacy Policy (POPIA)
        ├── search.html              Search results
        ├── 404.html                 Page not found
        ├── css/style.css            All styles (light + dark mode)
        └── js/
            ├── layout.js            Shared header and footer
            ├── theme.js             Light/dark mode
            ├── validation.js        Shared form validation rules
            ├── rent-form.js         Rent a Bike form
            ├── config.js            Company contact details and social links
            ├── contact.js           Contact page and form
            ├── search-index.js      Searchable content
            └── search.js            Search ranking and results
```

## Updating company details

Phone number, WhatsApp number and social media links are in
`src/main/resources/public/js/config.js`. Change them there; no HTML changes are needed.

## Still to come

- [ ] Send form submissions to the Java back end
- [ ] Email notifications (to the company and to the customer)
- [ ] Unit tests (JUnit)
- [ ] Company logo, director profiles and contact numbers
- [ ] Deployment

## Author

**Tapiso Malete**