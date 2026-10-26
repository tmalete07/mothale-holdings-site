// Company contact details in ONE place.
// Update these when the company supplies them - no HTML changes needed.
const SITE_CONFIG = {
    email: "mothalestockvel@gmail.com",
    address: "1 Bokmakierie Road, Daggafontein, Springs, Gauteng, 1559",

    phone: "",      // e.g. "011 123 4567" - still to be supplied by the company
    whatsapp: "",   // international format, digits only, e.g. "27821234567"

    // To add a platform later (Instagram, LinkedIn...), add one line here.
    // icon  = the official logo file in images/social/ (downloaded from the platform's brand page)
    // color = the brand colour shown when the visitor hovers over the button
    socials: [
        { name: "Facebook", url: "https://www.facebook.com/", icon: "images/social/facebook.png", color: "#0866FF" },   // replace url with the company's page
        { name: "TikTok", url: "https://www.tiktok.com/", icon: "images/social/tiktok.png", color: "#FE2C55" }          // replace url with the company's profile
    ],

    // Used for the WhatsApp button - it only appears once a WhatsApp number is filled in above
    whatsappIcon: { icon: "images/social/whatsapp.png", color: "#25D366" }
};