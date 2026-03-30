import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/constants/templatesData.js');
let content = fs.readFileSync(filePath, 'utf8');

// The final POLISHED contact block the user wants (with labels Phone, WhatsApp and newlines for email)
const finalContactHtml = `
        <h3 style="margin-top: 0; margin-bottom: 10px; color: #008CBA; text-align: center;">Contact Details</h3>
        <p style="margin: 0 0 8px 0; color: #008CBA; font-weight: bold;">Phone: <a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="tel:+919875515290">+91 98755 15290</a></p>
        <p style="margin: 0 0 8px 0; color: #008CBA; font-weight: bold;">WhatsApp: <a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="https://wa.me/919875515290">+91 98755 15290</a></p>
        <p style="margin: 0 0 8px 0; color: #008CBA; font-weight: bold;">Email 1:<br><a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="mailto:info@kleardocs.com">info@kleardocs.com</a></p>
        <p style="margin: 0 0 0 0; color: #008CBA; font-weight: bold;">Email 2:<br><a style="color: #008CBA; text-decoration: none; font-weight: bold;" href="mailto:kleardocssolutions@gmail.com">kleardocssolutions@gmail.com</a></p>`.trim();

// 1. First, CLEAN UP all the duplicates I created in templatesData.js
// Match the entire block from the first Contact Details H3 to the end of the TD
const messyBlockRegex = /<td[^>]*>\s*<h3[^>]*>Contact Details<\/h3>.*?(<h3[^>]*>Contact Details<\/h3>).*?<\/td>/gs;
content = content.replace(messyBlockRegex, (match) => {
    // Keep only one header and the clean info
    return `<td style="padding: 15px; background: #f0f8ff; text-align: center;">\n${finalContactHtml}\n      </td>`;
});

// 2. Ensure all other templates use the same finalContactHtml
const singleHeaderRegex = /<h3[^>]*>Contact Details<\/h3>.*?<\/td>/gs;
content = content.replace(singleHeaderRegex, (match) => {
    return `${finalContactHtml}\n      </td>`;
});

// 3. Remove any emojis if they still exist in the source
content = content.replace(/📞 Call:/g, 'Phone:');
content = content.replace(/💬 WhatsApp:/g, 'WhatsApp:');
content = content.replace(/📧 Email 1:/g, 'Email 1:');
content = content.replace(/📧 Email 2:/g, 'Email 2:');

fs.writeFileSync(filePath, content);
console.log('Successfully cleaned and standardized templatesData.js source code.');
