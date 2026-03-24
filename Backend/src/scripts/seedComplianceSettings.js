import mongoose from "mongoose";
import dotenv from "dotenv";
import { FinancialYear } from "../models/ComplianceSetting.model.js";
import ComplianceSetting from "../models/ComplianceSetting.model.js";
import EmailTemplate from "../models/EmailTemplate.model.js";

dotenv.config({ path: ".env" });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // 1. Create Financial Year
    const fyYear = "2025-2026";
    let fy = await FinancialYear.findOne({ financialYear: fyYear });
    if (!fy) {
      fy = await FinancialYear.create({ financialYear: fyYear });
      console.log(`Created Financial Year: ${fyYear}`);
    } else {
      console.log(`Financial Year ${fyYear} already exists.`);
    }

    // 2. Create Email Templates
    const templateNames = [
      "Compliance Update",
      "Annual Compliance Service - Jagjyot Singh",
      "Annual Compliance Service - Ritu Kaur",
      "Annual Compliance Service plus GST plus ESI - Ritu Kaur",
      "Annual Compliance - Onboarding",
      "Startup India Registration",
      "Startup India Promotion",
      "Website",
      "Professional Tax",
      "GST Filing",
      "Service List",
      "Next Quarter Payment",
      "INC 20A Reminder",
      "ROC plus GST plus ESI plus TDS",
      "Package plus payment details",
      "Annual Compliance plus Bookkeeping",
      "Director Resignation"
    ];

    const templates = {};
    for (const name of templateNames) {
      let t = await EmailTemplate.findOne({ name });
      if (!t) {
        t = await EmailTemplate.create({
          name,
          subject: `${name} - {{companyName}}`,
          body: `<html><body><p>Dear {{name}},</p><p>This is a notification for ${name}.</p></body></html>`,
          type: "Email"
        });
        console.log(`Created template: ${name}`);
      }
      templates[name] = t._id;
    }

    // 3. Create Compliance Settings
    await ComplianceSetting.deleteMany({ financialYear: fyYear });
    console.log(`Deleted existing compliance settings for ${fyYear}`);

    const complianceSettings = [
      {
        name: "Preparation & Filing of Form ADT-01 (Auditor Appointment)",
        financialYear: fyYear,
        hasExpiry: true,
        forNewCompany: true,
        daysOfExpiry: 30,
        expiryTemplate: templates["Compliance Update"]
      },
      {
        name: "Preparation & Filing of Form INC - 20A",
        financialYear: fyYear,
        hasExpiry: true,
        daysOfExpiry: 180,
        expiryTemplate: templates["Compliance Update"],
        inc20: true
      },
      {
        name: "Preparation of 07 Required Statutory Registers",
        financialYear: fyYear,
        hasExpiry: false,
        isNew: false
      },
      {
        name: "Preparation & Filing of Form DPT - 03",
        financialYear: fyYear,
        hasExpiry: false,
        isNew: false
      },
      {
        name: "Issuance of Share Certificates (for all Shareholders)",
        financialYear: fyYear,
        hasExpiry: true,
        daysOfExpiry: 30,
        expiryTemplate: templates["Compliance Update"]
      },
      {
        name: "Preparation of MPB-01 (Disclosure of Interest by Directors)",
        financialYear: fyYear,
        hasExpiry: true,
        expiryDate: new Date("2026-04-30"),
        isNew: false
      },
      {
        name: "Preparation of DIR-08 (Disclosure of Non-Disqualification by Directors)",
        financialYear: fyYear,
        hasExpiry: true,
        expiryDate: new Date("2026-04-30"),
        isNew: false
      },
      {
        name: "Preparation & Filing of Balance Sheet and P&L Accounts",
        financialYear: fyYear,
        hasExpiry: true,
        expiryDate: new Date("2026-09-30"),
        forNewCompany: false,
        expiryTemplate: templates["Compliance Update"]
      },
      {
        name: "Preparation & Filing of Audit Report, Director's Report & Extract of Annual Returns",
        financialYear: fyYear,
        hasExpiry: true,
        expiryDate: new Date("2026-09-30"),
        isNew: false,
        expiryTemplate: templates["Compliance Update"]
      }
    ];

    for (const setting of complianceSettings) {
      const existing = await ComplianceSetting.findOne({ 
        name: setting.name, 
        financialYear: setting.financialYear 
      });
      if (!existing) {
        await ComplianceSetting.create(setting);
        console.log(`Created Compliance Setting: ${setting.name}`);
      } else {
        console.log(`Compliance Setting ${setting.name} already exists for ${fyYear}.`);
      }
    }

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
