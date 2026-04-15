import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from backend root
dotenv.config({ path: join(__dirname, '../../.env') });

// Dynamic import to handle ES modules properly
const { default: EmailTemplate } = await import('../models/EmailTemplate.model.js');

const updateTemplateLogos = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all templates with old logo URL
    const templates = await EmailTemplate.find({
      body: { $regex: 'crm.kleardocs.com/logo.svg', $options: 'i' }
    });

    console.log(`Found ${templates.length} templates with old logo URL`);

    // Update each template
    let updatedCount = 0;
    for (const template of templates) {
      const oldBody = template.body;
      const newBody = oldBody.replace(
        /https:\/\/crm\.kleardocs\.com\/logo\.svg/g,
        'https://www.kleardocs.com/logo.svg'
      );

      if (oldBody !== newBody) {
        template.body = newBody;
        await template.save();
        updatedCount++;
        console.log(`Updated template: ${template.name}`);
      }
    }

    console.log(`\nSuccessfully updated ${updatedCount} templates`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating templates:', error);
    process.exit(1);
  }
};

updateTemplateLogos();
