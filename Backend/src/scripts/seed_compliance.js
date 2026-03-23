import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const ComplianceSettingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hasExpiry: { type: Boolean, default: false },
  expiryDate: { type: Date },
  inc20: { type: Boolean, default: false },
  daysOfExpiry: { type: Number },
  expiryTemplate: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate' },
  completeTemplate: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate' },
  financialYear: { type: String, required: true },
  isNew: { type: Boolean, default: true },
});

const FinancialYearSchema = new mongoose.Schema({
  financialYear: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
});

const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const ComplianceSetting = mongoose.models.ComplianceSetting || mongoose.model('ComplianceSetting', ComplianceSettingSchema);
const FinancialYear = mongoose.models.FinancialYear || mongoose.model('FinancialYear', FinancialYearSchema);
const Template = mongoose.models.Template || mongoose.model('Template', TemplateSchema);

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // DROP COLLECTIONS TO AVOID INDEX COLLISIONS (Express 5 rename from 'year' to 'financialYear')
    try {
      await mongoose.connection.collection('financialyears').drop();
      console.log('Dropped financialyears collection');
    } catch (e) { console.log('financialyears collection not found, skipping drop'); }

    try {
      await mongoose.connection.collection('compliancesettings').drop();
      console.log('Dropped compliancesettings collection');
    } catch (e) { console.log('compliancesettings collection not found, skipping drop'); }

    // 1. Create Financial Years
    const years = ['2025-2026', '2024-2025', '2023-2024'];
    
    for (const year of years) {
      await FinancialYear.create({ financialYear: year });
    }
    console.log('Created Financial Years:', years.join(', '));

    const targetFY = '2023-2024';

    // 2. Create Templates if they don't exist
    const templateNames = [
      'Compliance Update', 
      'Annual Compliance Service - Jagjyot Singh',
      'Annual Compliance Service - Ritu Kaur',
      'Annual Compliance Service plus GST plus ESI - Ritu Kaur',
      'Annual Compliance - Onboarding',
      'Startup India Registration',
      'Startup India Promotion',
      'Website',
      'Professional Tax',
      'GST Filing',
      'Service List',
      'Next Quarter Payment',
      'INC 20A Reminder',
      'ROC plus GST plus ESI plus TDS',
      'Package plus payment details',
      'Annual Compliance plus Bookkeeping',
      'Director Resignation',
      'None'
    ];
    const templates = {};
    for (const name of templateNames) {
      let t = await Template.findOne({ name });
      if (!t) t = await Template.create({ name });
      templates[name] = t._id;
    }

    // 3. Dummy Data from Prompt
    const dummyCompliances = [
      {
        name: 'Preparation & Filing of Form ADT-01 (Auditor Appointment)',
        hasExpiry: true,
        daysOfExpiry: 30,
        expiryTemplate: templates['Compliance Update'],
        isNew: true,
        financialYear: targetFY
      },
      {
        name: 'Preparation & Filing of Form INC - 20A',
        hasExpiry: true,
        daysOfExpiry: 180,
        expiryTemplate: templates['Compliance Update'],
        isNew: true,
        financialYear: targetFY
      },
      {
        name: 'Preparation of 07 Required Statutory Registers',
        hasExpiry: false,
        isNew: false,
        financialYear: targetFY
      },
      {
        name: 'Preparation & Filing of Form DPT - 03',
        hasExpiry: false,
        isNew: false,
        financialYear: targetFY
      },
      {
        name: 'Issuance of Share Certificates (for all Shareholders)',
        hasExpiry: true,
        daysOfExpiry: 30,
        expiryTemplate: templates['Compliance Update'],
        isNew: true,
        financialYear: targetFY
      },
      {
        name: 'Preparation of MPB-01 (Disclosure of Interest by Directors)',
        hasExpiry: true,
        expiryDate: new Date('2026-04-30'),
        isNew: false,
        financialYear: targetFY
      },
      {
        name: 'Preparation of DIR-08 (Disclosure of Non-Disqualification by Directors)',
        hasExpiry: true,
        expiryDate: new Date('2026-04-30'),
        isNew: false,
        financialYear: targetFY
      },
      {
        name: 'Preparation & Filing of Balance Sheet and P&L Accounts',
        hasExpiry: true,
        expiryDate: new Date('2026-09-30'),
        expiryTemplate: templates['Compliance Update'],
        isNew: false,
        financialYear: targetFY
      },
      {
        name: 'Preparation & Filing of Audit Report, Director\'s Report & Extract of Annual Returns',
        hasExpiry: true,
        expiryDate: new Date('2026-09-30'),
        expiryTemplate: templates['Compliance Update'],
        isNew: false,
        financialYear: targetFY
      }
    ];

    await ComplianceSetting.insertMany(dummyCompliances);

    console.log('Seeding completed successfully! ✅');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
