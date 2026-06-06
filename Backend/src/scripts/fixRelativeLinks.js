import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env from backend root
dotenv.config({ path: join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

const fixRelativeLinks = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MongoDB connection URI (MONGO_URI/MONGODB_URI) is not configured in env");
    }

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Dynamic import to handle ES modules properly
    const { default: EmailTemplate } = await import('../models/EmailTemplate.model.js');

    // Find all templates
    const templates = await EmailTemplate.find({});
    console.log(`Found ${templates.length} total templates in database`);

    let updatedCount = 0;
    
    // Regex to search for various corrupted relative client portal login links
    const targetPatterns = [
      /href=["']http:\/\/..\/clients\/login["']/gi,
      /href=["']\.\.\/clients\/login["']/gi,
      /href=["']\/clients\/login["']/gi
    ];

    for (const template of templates) {
      const oldBody = template.body;
      if (!oldBody) continue;

      let newBody = oldBody;

      // Replace any relative forms of clients/login with the absolute URL
      newBody = newBody.replace(/href=["']http:\/\/..\/clients\/login["']/gi, 'href="https://crm.kleardocs.com/clients/login"');
      newBody = newBody.replace(/href=["']\.\.\/clients\/login["']/gi, 'href="https://crm.kleardocs.com/clients/login"');
      
      // Be careful with replacing absolute root paths like /clients/login to not corrupt other URLs, 
      // but here it is specific to clients/login
      newBody = newBody.replace(/href=["']\/clients\/login["']/gi, 'href="https://crm.kleardocs.com/clients/login"');

      // Also clean up any loose references inside paragraph text or custom attributes if any
      newBody = newBody.replace(/http:\/\/..\/clients\/login/g, 'https://crm.kleardocs.com/clients/login');
      newBody = newBody.replace(/\.\.\/clients\/login/g, 'https://crm.kleardocs.com/clients/login');

      if (oldBody !== newBody) {
        template.body = newBody;
        await template.save();
        updatedCount++;
        console.log(`Successfully updated template: "${template.name}"`);
      }
    }

    console.log(`\nSuccessfully updated ${updatedCount} templates with absolute portal URLs.`);
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing template links:', error);
    process.exit(1);
  }
};

fixRelativeLinks();
