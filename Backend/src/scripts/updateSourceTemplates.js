import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/constants/templatesData.js');
let content = fs.readFileSync(filePath, 'utf8');

const finalContactHtml = `
        <h3 style="margin-top: 0; margin-bottom: 10px; color: #008CBA; text-align: center;">Contact Details</h3>
        <p style="margin: 0 0 8px 0; color: #008CBA; font-weight: bold;">Phone: <a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="tel:+919875515290">+91 98755 15290</a></p>
        <p style="margin: 0 0 8px 0; color: #008CBA; font-weight: bold;">WhatsApp: <a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="https://wa.me/919875515290">+91 98755 15290</a></p>
        <p style="margin: 0 0 8px 0; color: #008CBA; font-weight: bold;">Email 1:<br><a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="mailto:info@kleardocs.com">info@kleardocs.com</a></p>
        <p style="margin: 0 0 0 0; color: #008CBA; font-weight: bold;">Email 2:<br><a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="mailto:kleardocssolutions@gmail.com">kleardocssolutions@gmail.com</a></p>`.trim();

// Regex to find ANY Contact Details block in templatesData.js
// It looks for <h3...>Contact Details</h3> followed by p tags and ends at </td>
const contactBlockRegex = /<h3[^>]*>Contact Details<\/h3>.*?<\/td>/gs;

content = content.replace(contactBlockRegex, (match) => {
    return `<h3 style="margin-top: 0; margin-bottom: 10px; color: #008CBA; text-align: center;">Contact Details</h3>\n${finalContactHtml}\n      </td>`;
});

// Also search for any remaining contact@startupstation.in just in case
content = content.replace(/contact@startupstation\.in/g, 'info@kleardocs.com');

fs.writeFileSync(filePath, content);
console.log('Successfully updated templatesData.js with polished contact info.');
