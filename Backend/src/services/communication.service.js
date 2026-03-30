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

    // Format attachments for Nodemailer
    const formattedAttachments = attachments.map(filepath => {
      // filepath is like /uploads/templates/filename.pdf
      const fullPath = path.join(process.cwd(), "public", filepath);
      return {
        filename: path.basename(filepath),
        path: fullPath
      };
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || '"KlearDocs" <kleardocssolutions@gmail.com>',
      to,
      subject,
      html,
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
