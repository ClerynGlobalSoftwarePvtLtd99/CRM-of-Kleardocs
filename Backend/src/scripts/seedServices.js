import mongoose from "mongoose";
import "dotenv/config";
import Service from "../models/Service.model.js";

const services = [
  { name: "Annual Compliance",                           template: "Annual Compliance - Onboarding",                    hsn: "998399", professionalFees: 2000, govtFees: 0 },
  { name: "GST Filing",                                  template: "Compliance Update",                                  hsn: "4984",   professionalFees: 6000, govtFees: 1000 },
  { name: "Section 8 Company",                           template: "Compliance Update",                                  hsn: "9999",   professionalFees: 1000, govtFees: 0 },
  { name: "Startup India Registration",                  template: "Startup India Registration",                         hsn: "998399", professionalFees: 3000, govtFees: 0 },
  { name: "Import Export Code",                          template: "Compliance Update",                                  hsn: "998399", professionalFees: 1000, govtFees: 0 },
  { name: "FSSAI Central",                               template: "Compliance Update",                                  hsn: "998399", professionalFees: 3000, govtFees: 0 },
  { name: "GST Registration",                            template: "Compliance Update",                                  hsn: "998399", professionalFees: 1000, govtFees: 0 },
  { name: "FSSAI State Registration",                    template: "Compliance Update",                                  hsn: "998399", professionalFees: 2500, govtFees: 0 },
  { name: "CA Certification",                            template: "Compliance Update",                                  hsn: "998399", professionalFees: 1000, govtFees: 0 },
  { name: "Director Resignation",                        template: "Director Resignation",                               hsn: "998399", professionalFees: 2000, govtFees: 0 },
  { name: "MSME Certification",                          template: "Service List",                                       hsn: "998399", professionalFees: 1000, govtFees: 0 },
  { name: "Trademark Registration",                       template: "Compliance Update",                                  hsn: "998399", professionalFees: 1000, govtFees: 0 },
  { name: "MOA Amendment",                               template: "Compliance Update",                                  hsn: "998399", professionalFees: 3000, govtFees: 0 },
  { name: "Auditor Resignation",                         template: "Annual Compliance Service - Ritu Kaur",              hsn: "998399", professionalFees: 2000, govtFees: 0 },
  { name: "TDS RETURN",                                  template: "Compliance Update",                                  hsn: "998399", professionalFees: 2000, govtFees: 0 },
  { name: "Board Meeting & Statutory Documentation Services", template: "Compliance Update",                             hsn: "998399", professionalFees: 3000, govtFees: 0 },
  { name: "Professional Tax Registration Services",      template: "Compliance Update",                                  hsn: "998399", professionalFees: 1500, govtFees: 0 },
  { name: "PRIVATE LIMITED COMPANY",                     template: "Compliance Update",                                  hsn: "998599", professionalFees: 8000, govtFees: 0 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const deleted = await Service.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.deletedCount} existing services`);

    const inserted = await Service.insertMany(
      services.map((s) => ({ ...s, status: true }))
    );
    console.log(`✅ Inserted ${inserted.length} services:`);
    inserted.forEach((s) => console.log(`   - ${s.name} (₹${s.professionalFees})`));

    console.log("\n🎉 Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();
