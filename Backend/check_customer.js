// Test script to check customer incorporation date in database
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from './src/models/Customer.model.js';

dotenv.config();

async function checkCustomer() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    // Get the customer ID from command line or use a default
    const customerId = process.argv[2];
    
    if (!customerId) {
      console.log('Please provide a customer ID as argument');
      console.log('Usage: node check_customer.js <customerId>\n');
      
      // Show all customers with their incorporation dates
      console.log('Listing all customers:\n');
      const allCustomers = await Customer.find({}).select('_id companyName name incorporationDate').lean();
      
      allCustomers.forEach((c, i) => {
        console.log(`${i + 1}. ID: ${c._id}`);
        console.log(`   Company: ${c.companyName}`);
        console.log(`   Name: ${c.name}`);
        console.log(`   Incorporation Date: ${c.incorporationDate}`);
        console.log(`   Type: ${typeof c.incorporationDate}`);
        console.log('');
      });
      
      return;
    }

    // Get specific customer
    const customer = await Customer.findById(customerId).lean();
    
    if (!customer) {
      console.log('Customer not found!');
      return;
    }

    console.log('===== CUSTOMER DETAILS =====');
    console.log('ID:', customer._id);
    console.log('Company Name:', customer.companyName);
    console.log('Name:', customer.name);
    console.log('All fields:', Object.keys(customer));
    console.log('');
    console.log('incorporationDate:', customer.incorporationDate);
    console.log('incorporationDate type:', typeof customer.incorporationDate);
    console.log('dateOfIncorporation:', customer.dateOfIncorporation);
    console.log('incorporation_date:', customer.incorporation_date);
    console.log('');
    console.log('Full customer object:');
    console.log(JSON.stringify(customer, null, 2));
    console.log('===========================\n');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCustomer();
