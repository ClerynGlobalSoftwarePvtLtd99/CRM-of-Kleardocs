import EmailLog from "../models/EmailLog.model.js";
import { LeadHistory } from "../models/Lead.model.js";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { ApiError } from "../utils/response.js";

/**
 * Universal Template Parser
 * Replaces placeholders like {{name}} with actual data
 */
export const parseTemplate = (content, data) => {
  if (!content) return "";
  let parsed = content;
  
  // Standard placeholders
  const placeholders = {
    "{{name}}": data.name || data.customerName || "",
    "{{companyName}}": data.companyName || "",
    "{{phone}}": data.phone || "",
    "{{address}}": data.address || "",
    "{{invoiceNo}}": data.invoiceNo || "",
    "{{total}}": data.total || "",
    "{{due}}": data.due || "",
  };

  Object.entries(placeholders).forEach(([key, value]) => {
    parsed = parsed.replace(new RegExp(key, "g"), value);
  });

  return parsed;
};

/**
 * Log communication to History / EmailLog
 */
export const logCommunication = async ({ type, recipientId, recipientType, templateId, templateName, content, userId }) => {
  if (recipientType === "Lead") {
    await LeadHistory.create({
      lead: recipientId,
      type: "interaction",
      details: `${type} sent: ${templateName}`,
      notes: content.substring(0, 500), // Avoid massive logs
      createdBy: userId
    });
  } else {
    await EmailLog.create({
      customer: recipientId,
      template: templateId,
      templateName: templateName,
      date: new Date()
    });
  }
};

/**
 * Send Email with Attachment Support
 */
export const sendEmail = async ({ to, subject, html, customerId, leadId, templateId, templateName, userId, attachments = [] }) => {
  try {
    // Configure Transporter (Fallback to JSON for logging if no SMTP)
    let transporter;
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_PORT == 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Dummy logger transport if no SMTP set
      transporter = nodemailer.createTransport({
        jsonTransport: true
      });
      console.log("[MAILER] SMTP not configured. Using JSON logger.");
    }

    // Standard Branded Wrapper
    const brandedHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <!-- Header with Logo -->
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 2px solid #e9ecef;">
          <img src="cid:companyLogo" alt="Kleardocs" style="max-height: 60px;" />
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px; text-align: justify;">
          ${html}
        </div>

        ${(html.toLowerCase().includes("qr") || html.toLowerCase().includes("payment") || html.toLowerCase().includes("account number")) && !html.includes("cid:paymentQR") && !html.includes("data:image/") ? `
        <!-- QR Code for Payment -->
        <div style="padding: 20px; text-align: center; background-color: #fffaf0; border-top: 1px dashed #ffd700;">
          <p style="font-weight: bold; color: #856404; margin-bottom: 15px;">Scan to Pay</p>
          <img src="cid:paymentQR" alt="Payment QR" style="max-width: 200px; border: 5px solid #fff; shadow: 0 4px 6px rgba(0,0,0,0.1);" />
          <p style="font-size: 12px; color: #666; margin-top: 10px;">Please share a screenshot after payment.</p>
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="background-color: #343a40; color: #ffffff; padding: 20px; text-align: center; font-size: 13px;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} <strong>Kleardocs Solutions Private Limited</strong>. All rights reserved.</p>
          <p style="margin: 5px 0 0 0; color: #adb5bd;">Compliance | Excellence | Integrity</p>
        </div>
      </div>
    `;

    // Format attachments for Nodemailer
    const formattedAttachments = attachments.map(filepath => {
      const fullPath = path.join(process.cwd(), "public", filepath);
      return {
        filename: path.basename(filepath),
        path: fullPath
      };
    });

    // Add Embedded Branding Images
    const logoPath = path.join(process.cwd(), "..", "Frontend", "src", "assets", "logo.png");
    const qrPath = path.join(process.cwd(), "..", "PaymentQR.jpeg");

    if (fs.existsSync(logoPath)) {
      formattedAttachments.push({
        filename: 'logo.png',
        path: logoPath,
        cid: 'companyLogo'
      });
    }

    if (fs.existsSync(qrPath) && (html.toLowerCase().includes("qr") || html.toLowerCase().includes("payment") || html.toLowerCase().includes("account number"))) {
      formattedAttachments.push({
        filename: 'PaymentQR.jpeg',
        path: qrPath,
        cid: 'paymentQR'
      });
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || '"Kleardocs Solutions Private Limited" <kleardocssolutions@gmail.com>',
      to,
      subject,
      html: brandedHtml,
      attachments: formattedAttachments
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (!process.env.SMTP_HOST) {
      console.log("[MAILER] PREVIEW:", JSON.stringify(info.message, null, 2));
    } else {
      console.log(`[MAILER] Email sent: ${info.messageId}`);
    }

    await logCommunication({
      type: "Email",
      recipientId: customerId || leadId,
      recipientType: customerId ? "Customer" : "Lead",
      templateId,
      templateName,
      content: html,
      userId
    });

    return true;
  } catch (error) {
    console.error("[MAILER ERROR]", error);
    throw new ApiError(500, `Email failed to send: ${error.message}`);
  }
};

/**
 * Mock Send WhatsApp
 */
export const sendWhatsapp = async ({ phone, content, customerId, leadId, templateId, templateName, userId }) => {
  console.log(`[WHATSAPP] Sending message to ${phone}: ${content}`);
  
  await logCommunication({
    type: "WhatsApp",
    recipientId: customerId || leadId,
    recipientType: customerId ? "Customer" : "Lead",
    templateId,
    templateName,
    content,
    userId
  });

  return true;
};
