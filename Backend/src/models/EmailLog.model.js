import mongoose from "mongoose";

const { Schema, model } = mongoose;

/**
 * Comprehensive Email Log Schema
 * Tracks all emails sent through Brevo API
 */
const emailLogSchema = new Schema(
  {
    // Entity Reference (Customer or Lead)
    entityType: {
      type: String,
      enum: ["customer", "lead"],
      required: true
    },
    customer: { type: Schema.Types.ObjectId, ref: "Customer" },
    lead: { type: Schema.Types.ObjectId, ref: "Lead" },

    // Template Reference
    template: { type: Schema.Types.ObjectId, ref: "EmailTemplate" },
    templateName: { type: String },

    // Email Details
    subject: { type: String, required: function() { return this.status !== 'failed'; } },
    htmlContent: { type: String },
    textContent: { type: String },

    // Recipients
    to: [{ type: String }], // Primary recipients
    cc: [{ type: String }],
    bcc: [{ type: String }],
    replyTo: { type: String },

    // Sender Information
    senderName: { type: String },
    senderEmail: { type: String },

    // Brevo API Response
    brevoMessageId: { type: String }, // Message ID from Brevo

    // Attachments
    attachments: [{
      name: { type: String },
      content: { type: String }, // base64 content or URL
      type: { type: String }, // mime type
      size: { type: Number }
    }],
    attachmentNames: [{ type: String }], // Simple list for quick reference

    // Sending Status
    status: {
      type: String,
      enum: ["pending", "sent", "delivered", "failed", "bounced"],
      default: "sent"
    },

    // Error Information (if failed)
    errorMessage: { type: String },
    errorCode: { type: String },

    // Metadata
    sentAt: { type: Date, default: Date.now },
    sentBy: { type: Schema.Types.ObjectId, ref: "User" },

    // Tags for categorization
    tags: [{ type: String }],

    // Custom Data (for any additional context)
    metadata: {
      type: Map,
      of: String
    }
  },
  { timestamps: true }
);

// Indexes for common queries
emailLogSchema.index({ customer: 1, createdAt: -1 });
emailLogSchema.index({ lead: 1, createdAt: -1 });
emailLogSchema.index({ brevoMessageId: 1 });
emailLogSchema.index({ status: 1 });
emailLogSchema.index({ sentAt: -1 });
emailLogSchema.index({ entityType: 1, sentAt: -1 });

export default model("EmailLog", emailLogSchema);