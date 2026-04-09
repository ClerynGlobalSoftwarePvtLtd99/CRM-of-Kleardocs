import 'dotenv/config';
import mongoose from 'mongoose';
import Lead from '../src/models/Lead.model.js';

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const totalCount = await Lead.countDocuments();
    console.log('Total leads in DB (any status):', totalCount);
    
    const activeLeads = await Lead.countDocuments({ isCustomer: { $ne: true } });
    console.log('Total active leads (isCustomer != true):', activeLeads);
    
    const sample = await Lead.find().limit(5).select('name isCustomer createdAt');
    console.log('Sample Leads:', JSON.stringify(sample, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
