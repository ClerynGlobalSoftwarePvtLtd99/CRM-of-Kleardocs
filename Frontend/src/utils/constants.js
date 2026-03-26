export const SERVICES = [
  "Startup India Registration",
  "GST Registration",
  "MSME Registration",
  "Website Development",
  "Digital Marketing Services",
  "Logo Designing Services",
  "Income Tax Return Filing",
  "Annual Compliance Package",
  "Professional Tax Registration",
  "Director Registration",
  "Director Resignation",
  "GST Filing",
  "ESI/PF Filings",
  "TDS Filings",
];

export const SOURCES = [
  "Instagram",
  "Facebook",
  "YouTube",
  "WhatsApp",
  "Referral",
  "Website",
  "Cold Call",
  "Other",
];

export const STATES_AND_UTS = [
  "ANDHRA PRADESH",
  "ARUNACHAL PRADESH",
  "ASSAM",
  "BIHAR",
  "CHHATTISGARH",
  "GOA",
  "GUJARAT",
  "HARYANA",
  "HIMACHAL PRADESH",
  "JHARKHAND",
  "KARNATAKA",
  "KERALA",
  "MADHYA PRADESH",
  "MAHARASHTRA",
  "MANIPUR",
  "MEGHALAYA",
  "MIZORAM",
  "NAGALAND",
  "ODISHA",
  "PUNJAB",
  "RAJASTHAN",
  "SIKKIM",
  "TAMIL NADU",
  "TELANGANA",
  "TRIPURA",
  "UTTAR PRADESH",
  "UTTARAKHAND",
  "WEST BENGAL",
  "DELHI",
  "JAMMU AND KASHMIR",
  "LADAKH",
  "CHANDIGARH",
  "DADRA AND NAGAR HAVELI",
  "DAMAN AND DIU",
  "LAKSHADWEEP",
  "PUDUCHERRY",
  "ANDAMAN AND NICOBAR"
];

export const AGENTS = ["Ritu Kaur", "Jagjyot Singh", "Admin"];

export const CLIENT_TYPES = ["Hot", "Cold", "Warm"];

export const PRIORITIES = ["High", "Medium", "Low"];

export const RESPONSES = ["Interested", "Not Interested", "Call Back", "No Response", "Converted"];

export const COMPANY_TYPES = [
  "Private Limited Company",
  "Partnership",
  "Proprietorship",
  "LLP",
  "Public Limited Company",
  "Section 8 Company",
];

export const EMAIL_TEMPLATES = [
  { id: 1, name: "Compliance Update", subject: "Compliance Update - {{complianceName}} for {{companyName}}" },
  { id: 2, name: "Annual Compliance Service Jagjyot Singh", subject: "Annual Compliance Service by Startup Station" },
  { id: 3, name: "Annual Compliance Service - Ritu Kaur", subject: "Annual Compliance Package for {{companyName}}" },
  { id: 4, name: "Annual Compliance Service plus GST plus ESI - Ritu Kaur", subject: "Annual Compliance Package for {{companyName}}" },
  { id: 5, name: "Annual Compliance - Onboarding", subject: "Welcome to Startup Station – Your Annual Compliance Access" },
  { id: 6, name: "Startup India Registration", subject: "Startup India Registration - Next Steps & Document Submission" },
  { id: 7, name: "Startup India Promotion", subject: "Get Your Startup India Registration (DPIIT Certificate) at Just ₹2,999 with Startup Station! 🚀" },
  { id: 8, name: "Your Website at just Rs 5000!", subject: "Your Website at just Rs 5000!" },
  { id: 9, name: "Professional Tax", subject: "Get Professional Tax Registration immediately!" },
  { id: 10, name: "GST Filing", subject: "Urgent: Submit Your GST Invoices by 6th for Timely Filing!" },
  { id: 11, name: "Service List", subject: "Discover Our Key Services to Boost Your Business – Startup Station" },
  { id: 12, name: "Next Quarter Payment", subject: "Reminder: Upcoming Quarter's Payment – Complete Within 5 Days" },
  { id: 13, name: "INC 20A Reminder", subject: "Urgent: INC-20A Filing Pending – Avoid Late Penalties!" },
  { id: 14, name: "ROC plus GST plus ES", subject: "Annual Compliance Package by Startup Station" },
  { id: 15, name: "plus TDS", subject: "Annual Compliance Package by Startup Station" },
  { id: 16, name: "Package plus payment details", subject: "Annual Compliance Package by Startup Station plus Bookkeeping Services" },
  { id: 17, name: "Annual Compliance plus Bookkeeping", subject: "Annual Compliance Package for {{companyName}}" },
  { id: 18, name: "Director Registration", subject: "Startup Station - Director Resignation Services" },
];

export const WHATSAPP_TEMPLATES = [
  {
    name: "retargeting_v4",
    content: "Avoid Penalties in {{Name}}\n\n🚨 Hurry up! Only 21 days left to avoid penalties. We noticed you still haven't appointed an auditor.\n\n🎉 Avail our Annual Compliance Package at a special discounted price of ₹7,999/year (payable quarterly) instead of ₹19,999.\n\n📦 Our package includes:\n\nForm ADT-1, AOC-4, MGT-7, Income Tax Return, and more.\n\n📋 Other Services:\n✅ GST Return filing: ₹299/month.\n✅ Startup India Registration: ₹2,999.\n✅ Trademark Filing: ₹999.\n\nDon't wait! Contact us today to secure your compliance.\n\nYou can Opt out by replying 'Stop' to us!"
  },
  {
    name: "ac2500_v6",
    content: "*Avoid Penalties in {{Name}}*\n\n🚀 Did you know Auditor Appointment is mandatory within 30 days of incorporation? Avoid penalties with our Annual ROC Compliance Package for Private Limited Companies at just ₹1,999 per quarter!\n📅Our package includes:\n\n1. Form ADT-1: Auditor Appointment 2. Form INC-20A 3. Form AOC-4: Financial Statements 4. Form MGT-7: Annual Return 5. MBP-1 and DIR-8 6. Board’s Report 7. DIR-3 KYC 8. Income Tax Return 9. Audit by a CA\n\n📋Other Services:\n\n✅ Plus, get GST Return filing for just ₹299/month.\n\n✅ Startup India Registration at ₹ 2999.\n\n✅ Trademark Filing at ₹ 999.\n\nYou can Opt out by replying 'Stop' to us!"
  },
  {
    name: "serviceautomation_v3",
    content: "Hello {{CustomerName}},\n\nThank you for choosing Startup Station for {{service name}}. The total cost for the service is Rs. {{Price}}. We kindly request you to transfer the amount at your earliest convenience and share a screenshot of the payment confirmation.\n\nTo complete your payment, you can:\n\nScan the QR code above, or\nTransfer the amount to our UPI ID: startupstation@idfcbank, or\nDirectly transfer the amount to our bank account:\nBanking Name: STARTUP STATION FINANCIAL SERVICES PRIVATE LIMITED\nBank Name: IDFC Bank\nAccount Number: 89674560601\nIFSC Code: IDFB0060119.\nYour dedicated Relationship Manager, Ritu Kaur, will be in touch with you shortly to assist further.\n\nBest regards,\nStartup Station\n\nIgnore if the payment is made!"
  },
  {
    name: "ac2500_v5",
    content: "*Avoid Penalties in {{Name}}*\n\n🚀 Did you know Auditor Appointment is mandatory within 30 days of incorporation? Avoid penalties with our Annual ROC Compliance Package for Private Limited Companies at just ₹1,999 per quarter!\n📅Our package includes:\n\n1. Form ADT-1: Auditor Appointment 2. Form INC-20A 3. Form AOC-4: Financial Statements 4. Form MGT-7: Annual Return 5. MBP-1 and DIR-8 6. Board’s Report 7. DIR-3 KYC 8. Income Tax Return 9. Audit by a CA\n\n📋Other Services:\n\n✅ Plus, get GST Return filing for just ₹299/month.\n\n✅ Startup India Registration at ₹ 2999.\n\n✅ Trademark Filing at ₹ 999.\n\nYou can Opt out by replying 'Stop' to us!"
  },
  {
    name: "2nd_quarter_payment_v6idfc_v2",
    content: "Hello {{Name}},\n\nThis is a friendly reminder regarding the payment for the SECOND QUARTER of your Annual Compliances with Startup Station. Kindly complete the payment at your earliest convenience to ensure uninterrupted services.\n\nPayment Options:\n\n1. UPI Transfer:\nUPI ID: startupstation@idfcbank\n\n2. Bank Transfer:\nBanking Name: STARTUP STATION FINANCIAL SERVICES PRIVATE LIMITED\nBank Name: IDFC Bank\nAccount Number: 89674560601\nIFSC Code: IDFB0060119\n\nIf you prefer, you can also scan the QR code below to complete the payment via UPI.\n\nInvoice for the 2nd quarter will be shared upon receiving the payment confirmation. Please share screenshot once the payment is made.\n\nThank you for sticking with us. We truly value your partnership and look forward to continuing our service to you.\n\nIgnore if the payment is already made."
  },
  {
    name: "2nd_quarter_payment_v6idfc",
    content: "Hello {{Name}},\n\nThis is a friendly reminder regarding the payment for the SECOND QUARTER of your Annual Compliances with Startup Station. Kindly complete the payment at your earliest convenience to ensure uninterrupted services.\n\nPayment Options:\n\n1. UPI Transfer:\nUPI ID: startupstation.axl\n\n2. Bank Transfer:\nBanking Name: STARTUP STATION FINANCIAL SERVICES PRIVATE LIMITED\nBank Name: IDFC Bank\nAccount Number: 89774560601\nIFSC Code: IDFB0060119\n\nIf you prefer, you can also scan the QR code below to complete the payment via UPI.\n\nInvoice for the 2nd quarter will be shared upon receiving the payment confirmation. Please share screenshot once the payment is made.\n\nThank you for sticking with us. We truly value your partnership and look forward to continuing our service to you.\n\nIgnore if the payment is already made"
  },
  {
    name: "1st_quarter_payment_v2idfc",
    content: "Hello {{Name}},\n\nWe are thrilled to assist you with your Annual Compliances. Please make the payment for the first quarter at your earliest convenience.\n\nYou can complete your payment by either scanning the QR code above or transferring the amount to our UPI ID: startupstation@idfcbank.\n\nAlternatively, you can transfer the amount directly to our bank account:\n\nBanking Name: STARTUP STATION FINANCIAL SERVICES PRIVATE LIMITED\nBank Name: IDFC Bank\nAccount Number: 89674560601\nIFSC Code: IDFB0060119.\n\nIgnore if the payment is already made."
  },
  {
    name: "ac2500_v4",
    content: "*Avoid Penalties in {{Name}}*\n\n🚀 Did you know Auditor Appointment is mandatory within 30 days of incorporation? Avoid penalties with our Annual ROC Compliance Package for Private Limited Companies at just ₹1,999 per quarter!\n📅Our package includes:\n\n1. Form ADT-1: Auditor Appointment 2. Form INC-20A 3. Form AOC-4: Financial Statements 4. Form MGT-7: Annual Return 5. MBP-1 and DIR-8 6. Board’s Report 7. DIR-3 KYC 8. Income Tax Return 9. Audit by a CA\n\n📋Other Services:\n\n✅ Plus, get GST Return filing for just ₹299/month.\n\n✅ Startup India Registration at ₹ 2999.\n\n✅ Trademark Filing at ₹ 999.\n\nYou can Opt out by replying 'Stop' to us!"
  },
  {
    name: "ac2500_v2",
    content: "*Avoid Penalties in {{Name}}*\n\n🚀 Did you know Auditor Appointment is mandatory within 30 days of incorporation? Avoid penalties with our Annual ROC Compliance Package for Private Limited Companies at just ₹2,499 per quarter!\n📅Our package includes:\n\n1. Form ADT-1: Auditor Appointment 2. Form INC-20A 3. Form AOC-4: Financial Statements 4. Form MGT-7: Annual Return 5. MBP-1 and DIR-8 6. Board’s Report 7. DIR-3 KYC 8. Income Tax Return 9. Audit by a CA\n\n📋Other Services:\n\n✅ Plus, get GST Return filing for just ₹299/month.\n\n✅ Startup India Registration at ₹ 2999.\n\n✅ Trademark Filing at ₹ 999.\n\nYou can Opt out by replying 'Stop' to us!"
  },
  {
    name: "ac2500",
    content: "*Avoid Penalties in {{Name}}*\n\n🚀 Did you know Auditor Appointment is mandatory within 30 days of incorporation? Avoid penalties with our Annual ROC Compliance Package for Private Limited Companies at just ₹1,999 per quarter!\n📅Our package includes:\n\n1. Form ADT-1: Auditor Appointment 2. Form INC-20A 3. Form AOC-4: Financial Statements 4. Form MGT-7: Annual Return 5. MBP-1 and DIR-8 6. Board’s Report 7. DIR-3 KYC 8. Income Tax Return 9. Audit by a CA\n\n📋Other Services:\n\n✅ Plus, get GST Return filing for just ₹299/month.\n\n✅ Startup India Registration at ₹ 2999.\n\n✅ Trademark Filing at ₹ 999.\n\nYou can Opt out by replying 'Stop' to us!"
  },
  {
    name: "utility_annualcom_v6",
    content: "Ensure Compliance for {{Name}}!\n\nHere are the essential ROC (Registrar of Companies), Income Tax and GST compliances you must meet:\n\n✅ Form ADT-1: Auditor Appointment (within 30 days of incorporation)\n✅ Form INC-20A: Certificate of Business Commencement\n✅ Form AOC-4: Filing of FS\n✅ Form MGT-7: Annual Return Filing\n✅ MBP-1 and DIR-8: Director Disclosures\n✅ Board’s Report: Preparation and Filing\n✅ DIR-3 KYC: Director KYC Verification\n✅ Income Tax Return Filing\n✅ Audit by a Chartered Accountant\n✅ GST Filings\n\nNon-compliance can result in significant penalties. Stay informed and avoid unnecessary penalties by ensuring these compliances are met on time.\n\nType 'Stop' to stop receiving our informative messages."
  },
  {
    name: "utility_annualcom_v5",
    content: " Ensure Compliance for {{Name}}!\n\nDid you know that certain key compliances are crucial for your company's legal standing and financial health? Missing deadlines can lead to significant penalties.\n\nHere are the essential ROC (Registrar of Companies) compliances you must meet:\n\n✅ Form ADT-1: Auditor Appointment (within 30 days of incorporation)\n✅ Form INC-20A: Certificate of Business Commencement\n✅ Form AOC-4: Filing of Financial Statements\n✅ Form MGT-7: Annual Return Filing\n✅ MBP-1 and DIR-8: Director Disclosures\n✅ Board’s Report: Preparation and Filing\n✅ DIR-3 KYC: Director KYC Verification\n✅ Income Tax Return Filing\n✅ Audit by a Chartered Accountant\n✅ GST Filings\n\nNon-compliance can result in penalties of up to ₹2 lakhs per year. Stay informed and avoid unnecessary penalties by ensuring these compliances are met on time.\n\nType 'Stop' to stop receiving our informative messages."
  },
  {
    name: "annualcompliance_v11",
    content: "*Avoid Penalties in {{Name}}*\n\n🚀 Did you know Auditor Appointment is mandatory within 30 days of incorporation? Avoid penalties with our Annual ROC Compliance Package for Private Limited Companies at just ₹1,999 per quarter!\n📅Our package includes:\n\n1. Form ADT-1: Auditor Appointment 2. Form INC-20A 3. Form AOC-4: Financial Statements 4. Form MGT-7: Annual Return 5. MBP-1 and DIR-8 6. Board’s Report 7. DIR-3 KYC 8. Income Tax Return 9. Audit by a CA\n\n📋Other Services:\n\n✅ Plus, get GST Return filing for just ₹299/month.\n\n✅ Startup India Registration at ₹ 2999.\n\n✅ Trademark Filing at ₹ 999.\n\nYou can Opt out by replying 'Stop' to us!"
  },
  {
    name: "annualcompliance_v10",
    content: "🚀 Did you know Auditor Appointment is mandatory within 30 days of incorporation? Avoid penalties with our Annual ROC Compliance Package for Private Limited Companies at just ₹1,999 per quarter!\n📅Our package includes:\n\n1. Form ADT-1: Auditor Appointment 2. Form INC-20A 3. Form AOC-4: Financial Statements 4. Form MGT-7: Annual Return 5. MBP-1 and DIR-8 6. Board’s Report 7. DIR-3 KYC 8. Income Tax Return 9. Audit by a CA\n\n📋Other Services:\n\n✅ Plus, get GST Return filing for just ₹299/month.\n\n✅ Startup India Registration at ₹ 2999.\n\n✅ Trademark Filing at ₹ 999.\n\nYou can Opt out by replying 'Stop' to us!"
  },
  {
    name: "itrfiling",
    content: "Hi,\n\nSince we're already preparing the financials for your Private Limited Company, it’s ideal that we also handle the Income Tax Returns (ITR) for you and your family.\n\n✅ Ensures your personal ITR is fully in sync with your company’s financials\n✅ Expert handling by the same team that knows your company inside-out\n✅ Flat fee of just ₹1000 per individual ITR\n✅ Hassle-free & prompt filing\n\nLet us know if you'd like us to take this forward for you or your family members."
  },
  {
    name: "annualcompliance_v9",
    content: "Avoid Penalties in {{Name}}\n\n🚀 Did you know Auditor Appointment is mandatory within 30 days of incorporation? Avoid penalties with our Annual ROC Compliance Package for Private Limited Companies at just ₹1,999 per quarter!\n📅Our package includes:\n\n1. Form ADT-1: Auditor Appointment 2. Form INC-20A 3. Form AOC-4: Financial Statements 4. Form MGT-7: Annual Return 5. MBP-1 and DIR-8 6. Board’s Report 7. DIR-3 KYC 8. Income Tax Return 9. Audit by a CA\n\n📋Other Services:\n\n✅ Plus, get GST Return filing for just ₹299/month.\n\n✅ Startup India Registration at ₹ 2999.\n\n✅ Trademark Filing at ₹ 999.\n\nYou can Opt out by replying 'Stop' to us!"
  },
  {
    name: "annualcompliance_v7",
    content: "Avoid Penalties in {{Name}}\n\n🚀 Did you know Auditor Appointment is mandatory within 30 days of incorporation? Avoid penalties with our Annual ROC Compliance Package for Private Limited Companies at just ₹2,999 per quarter.\n\n📅Our package includes:\n\n1. Form ADT-1: Auditor Appointment 2. Form INC-20A 3. Form AOC-4: Financial Statements 4. Form MGT-7: Annual Return 5. MBP-1 and DIR-8 6. Board’s Report 7. DIR-3 KYC 8. Income Tax Return 9. Audit by a CA\n\n📋Other Services:\n\n✅ Plus, get GST Return filing for just ₹299/month.\n\n✅ Startup India Registration at ₹ 2999.\n\n✅ Trademark Filing at ₹ 999.\n\nYou can Opt out by replying 'Stop' to us!"
  },
  {
    name: "holi2",
    content: "🎨🌈 Wishing you a vibrant and joyous Holi from all of us at Startup Station! 🌸 May this festival of colors fill your life with happiness, success, and endless opportunities. Let's celebrate the spirit of innovation and creativity together. Have a colorful and prosperous Holi!\n\nWarm regards,\nStartup Station Team"
  },
  {
    name: "holi",
    content: "🎨🌈 Wishing you a vibrant and joyous Holi from all of us at Startup Station! 🌸 May this festival of colors fill your life with happiness, success, and endless opportunities. Let's celebrate the spirit of innovation and creativity together. Have a colorful and prosperous Holi!\n\nRegards,\nStartup Station Team"
  },
  {
    name: "section8package_v3",
    content: "🌟 Registering a Section 8 Company is just the first step! 🌟\n\nTo operate effectively and maximize benefits, your NGO must have these essential registrations:\n\n📜 Section 12A Registration – Grants tax exemption\n💰 Section 80G Registration – Provides tax benefits to donors\n🏛️ Darpan Registration – Enables eligibility for government grants\n🌐 NITI Aayog Registration – Essential for participating in government schemes\n\n💼 Pricing Options:\n✅ 12A & 80G Registration – ₹2,999\n✅ Complete Package (All Registrations) – ₹5,999\n\n📞 Contact us today to ensure your NGO is fully compliant and ready to create an impact! 🚀\n\nPlease type STOP to stop receiving our amazing offers"
  },
  {
    name: "serviceautomation_v2",
    content: "Hello {{CustomerName}},\n\nThank you for choosing Startup Station for {{service name}}. The total cost for the service is Rs. {{Price}}. We kindly request you to transfer the amount at your earliest convenience and share a screenshot of the payment confirmation.\n\nTo complete your payment, you can:\n\nScan the QR code above, or\nTransfer the amount to our UPI ID: startupstation@axl, or\nDirectly transfer the amount to our bank account:\nBank Name: STARTUP STATION FINANCIAL SERVICES PRIVATE LIMITED\nAccount Number: 50200094441194\nIFSC Code: HDFC0005385\nYour dedicated Relationship Manager, Ritu Kaur, will be in touch with you shortly to assist further.\n\nBest regards,\nStartup Station\n\nIgnore if the payment is made!"
  },
  {
    name: "serviceautomation",
    content: "Hello {{CustomerName}},\n\nThank you for choosing Startup Station for {{service name}}. The total cost for the service is Rs. {{Price}}. We kindly request you to transfer the amount at your earliest convenience and share a screenshot of the payment confirmation.\n\nTo complete your payment, you can:\n\nScan the QR code above, or\nTransfer the amount to our UPI ID: startupstation@axl, or\nDirectly transfer the amount to our bank account:\nBank Name: STARTUP STATION FINANCIAL SERVICES PRIVATE LIMITED\nAccount Number: 50200094441194\nIFSC Code: HDFC0005385\nYour dedicated Relationship Manager, Ritu Kaur, will be in touch with you shortly to assist further.\n\nBest regards,\nStartup Station\n\nIgnore if the payment is made!"
  },
  {
    name: "1st_quarter_payment_v3",
    content: "Hello {{Name}},\n\nWe are thrilled to assist you with your Annual Compliances. Please make the payment for the second quarter at your earliest convenience.\n\nYou can complete your payment by either scanning the QR code above or transferring the amount to our UPI ID: startupstation@axl. Alternatively, you can transfer the amount directly to our bank account:\n\nBank Name: STARTUP STATION FINANCIAL SERVICES PRIVATE LIMITED\nAccount Number: 50200094441194\nIFSC Code: HDFC0005385.\n\nIgnore if the payment is already made."
  },
  {
    name: "video",
    content: "Avoid Penalties in your Company!\n\n🎉 Avail our Annual Compliance Package at a special discounted price of ₹7,999/year (payable quarterly) instead of ₹19,999.\n\n📦 Our package includes:\n\nForm ADT-1, AOC-4, MGT-7, Income Tax Return, and more.\n\n📋 Other Services:\n✅ GST Return filing: ₹299/month.\n✅ Startup India Registration: ₹2,999.\n✅ Trademark Filing: ₹999.\n\nDon't wait! Contact us today to secure your compliance.\n\nYou can Opt out by replying 'Stop' to us!"
  },
  {
    name: "utility_annualcom_v3",
    content: "🚀 Avoid Penalties for {{Name}}!\n\nDid you know that appointing an auditor is mandatory within 30 days of incorporation? Failing to comply can lead to penalties up to 4 times the normal fees!\n\nKey ROC Compliances You Must Meet:\n\n✅ Form ADT-1: Auditor Appointment (within 30 days of incorporation) ✅ Form INC-20A: Certificate of Business Commencement✅ Form AOC-4: Filing of Financial Statements✅ Form MGT-7: Annual Return Filing ✅ MBP-1 and DIR-8: Director Disclosures✅ Board’s Report: Preparation and Filing✅ DIR-3 KYC: Director KYC Verification✅ Income Tax Return Filing✅ Audit by a Chartered Accountant✅ GST Filings\n\nNon-compliance can even result in penalties of up to ₹2 lakhs per year.\n\n\nType 'Stop' to stop receiving our informative messages."
  },
  {
    name: "2nd_quarter_payment_v5",
    content: "Hello {{Name}},\n\nThis is a friendly reminder regarding the payment for the SECOND QUARTER of your Annual Compliances with Startup Station. Kindly complete the payment at your earliest convenience to ensure uninterrupted services.\n\nPayment Options:\n\n1. UPI Transfer:\nUPI ID: startupstation.axl\n\n2. Bank Transfer:\nBank Name: STARTUP STATION FINANCIAL SERVICES PRIVATE LIMITED\nAccount Number: 50200094441194\nIFSC Code: HDFC0005385\n\nIf you prefer, you can also scan the QR code below to complete the payment via UPI.\n\nInvoice for the 2nd quarter will be shared upon receiving the payment confirmation. Please share screenshot once the payment is made.\n\nThank you for sticking with us. We truly value your partnership and look forward to continuing our service to you.\n\nIgnore if the payment is already made."
  },
  {
    name: "2nd_quarter_payment_v4",
    content: "Hello {{Name}},\n\nThis is a friendly reminder regarding the payment for the second quarter of your Annual Compliances with Startup Station. Kindly complete the payment at your earliest convenience to ensure uninterrupted services.\n\nPayment Options:\n\n1. UPI Transfer:\nUPI ID: startupstation.axl\n\n2. Bank Transfer:\nBank Name: STARTUP STATION FINANCIAL SERVICES PRIVATE LIMITED\nAccount Number: 50200094441194\nIFSC Code: HDFC0005385\n\nIf you prefer, you can also scan the QR code below to complete the payment via UPI.\n\nInvoice for the 2nd quarter will be shared upon receiving the payment confirmation. Please share screenshot once the payment is made.\n\nThank you for sticking with us. We truly value your partnership and look forward to continuing our service to you.\n\nIgnore if the payment is already made."
  },
  {
    name: "utility_annualcom_v2",
    content: "🚀 Avoid Penalties for {{Name}}!\n\nDid you know that appointing an auditor is mandatory within 30 days of incorporation? Failing to comply can lead to penalties up to 4 times the normal fees!\n\nKey ROC Compliances You Must Meet:\n\n✅ Form ADT-1: Auditor Appointment (within 30 days of incorporation) ✅ Form INC-20A: Certificate of Business Commencement✅ Form AOC-4: Filing of Financial Statements✅ Form MGT-7: Annual Return Filing ✅ MBP-1 and DIR-8: Director Disclosures✅ Board’s Report: Preparation and Filing✅ DIR-3 KYC: Director KYC Verification✅ Income Tax Return Filing✅ Audit by a Chartered Accountant✅ GST Filings\n\nNon-compliance can even result in penalties of up to ₹2 lakhs per year.\n\n\nType 'Stop' to stop receiving our informative messages."
  },
  {
    name: "durgapuja",
    content: "Dear Sir/Madam,\n\nWe would like to inform you that our office will remain closed from 10th October 2024 to 13th October 2024 in observance of the Durga Puja Festival, a significant celebration here in West Bengal.\n\nRegular operations will resume on 14th October 2024.\n\nWishing you and your family a joyous and prosperous Durga Puja!\n\nWarm regards,\nStartup Station."
  },
  {
    name: "companycompliances_v3",
    content: "Avoid Penalties in your Company!\n\n🎉 Avail our Annual Compliance Package at a special discounted price of ₹7,999/year (payable quarterly) instead of ₹19,999.\n\n📦 Our package includes:\n\nForm ADT-1, AOC-4, MGT-7, Income Tax Return, and more.\n\n📋 Other Services:\n✅ GST Return filing: ₹299/month.\n✅ Startup India Registration: ₹2,999.\n✅ Trademark Filing: ₹999.\n\nDon't wait! Contact us today to secure your compliance.\n\nYou can Opt out by replying 'Stop' to us!"
  },
  {
    name: "utility_annualcom",
    content: "Hi {{Name}},\n\nThis is to follow up on our special offer! Our Annual Compliance Package is now ₹7,999/year (payable quarterly), covering Form ADT-1, AOC-4, MGT-7, ITR, and more.\n\nLet us take care of your compliance needs. Reply for more info!\n\nType stop to stop receiving our amazing offers."
  },
  {
    name: "2nd_quarter_payment_v3",
    content: "Hello {{Name}},\n\nThis is a friendly reminder regarding the payment for the second quarter of your Annual Compliances with Startup Station. Kindly complete the payment at your earliest convenience to ensure uninterrupted services.\n\nPayment Options:\n\n1. UPI Transfer:\nUPI ID: startupstation.axl\n\n2. Bank Transfer:\nBank Name: STARTUP STATION FINANCIAL SERVICES PRIVATE LIMITED\nAccount Number: 50200094441194\nIFSC Code: HDFC0005385\n\nIf you prefer, you can also scan the QR code below to complete the payment via UPI.\n\nThank you for sticking with us. We truly value your partnership and look forward to continuing our service to you.\n\nIgnore if the payment is already made."
  },
  {
    name: "agent_assing_broadcast",
    content: "Thank you for your interest in our service. Your Relationship Manager will get in touch with you shortly.\n\nType stop to stop receiving messages from us!"
  },
  {
    name: "1st_quarter_payment_v2",
    content: "Hello {{Name}},\n\nWe are thrilled to assist you with your Annual Compliances. Please make the payment for the second quarter at your earliest convenience.\n\nYou can complete your payment by either scanning the QR code above or transferring the amount to our UPI ID: startupstation.axl. Alternatively, you can transfer the amount directly to our bank account:\n\nBank Name: STARTUP STATION FINANCIAL SERVICES PRIVATE LIMITED\nAccount Number: 50200094441194\nIFSC Code: HDFC0005385.\n\nIgnore if the payment is already made."
  },
  {
    name: "1st_quarter_payment",
    content: "Hello {{Name}},\n\nWe are thrilled to assist you with your Annual Compliances. Please make the payment for the first quarter at your earliest convenience.\n\nYou can complete your payment by either scanning the QR code above or transferring the amount to our UPI ID: startupstation.axl. Alternatively, you can transfer the amount directly to our bank account:\n\nBank Name: STARTUP STATION FINANCIAL SERVICES PRIVATE LIMITED\nAccount Number: 50200094441194\nIFSC Code: HDFC0005385.\n\nIgnore if the payment is already made."
  },
  {
    name: "companycompliances_v2",
    content: "Avoid Penalties in your Company!\n\n🎉 Avail our Annual Compliance Package at a special discounted price of ₹11,999/year (payable quarterly) instead of ₹19,999.\n\n📦 Our package includes:\n\nForm ADT-1, AOC-4, MGT-7, Income Tax Return, and more.\n\n📋 Other Services:\n✅ GST Return filing: ₹299/month.\n✅ Startup India Registration: ₹2,999.\n✅ Trademark Filing: ₹999.\n\nDon't wait! Contact us today to secure your compliance.\n\nYou can Opt out by replying 'Stop' to us!"
  },
  {
    name: "companyregistrationuttarpradesh",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Uttar Pradesh and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3000\n3. Government Fees: ₹ 2150\nTotal Fees: ₹ 7,150\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationkarnataka_v2",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Karnataka and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3000\n3. Government Fees: ₹ 2,170\nTotal Fees: ₹ 7,170\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationkarnataka",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Uttar Pradesh and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹2,150\n3. Government Fees: ₹ 4,200\nTotal Fees: ₹ 7,150\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationkerala",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Kerala and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3,000\n3. Government Fees: ₹ 4,200\nTotal Fees: ₹ 9,200\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationjharkhand",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Jharkhand and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3,000\n3. Government Fees: ₹ 1,220\nTotal Fees: ₹ 6,220\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationsikkim",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Sikkim and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3,000\n3. Government Fees: ₹ 1,150\nTotal Fees: ₹ 6,150\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationtelangana",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Telangana and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3,000\n3. Government Fees: ₹ 2,700\nTotal Fees: ₹ 7,700\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned"
  },
  {
    name: "companyregistrationtamilnadu_v3",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Tamil Nadu and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3,000\n3. Government Fees: ₹ 1860\nTotal Fees: ₹ 6,860\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationassam1_v3",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Assam and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3,000\n3. Government Fees: ₹ 1700\nTotal Fees: ₹ 5,700\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationdelhi",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Delhi and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3,000\n3. Government Fees: ₹ 1500\nTotal Fees: ₹ 6,500\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationmadhyapradesh_v2",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Madhya Pradesh and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3000\n3. Government Fees: ₹ 7,700\nTotal Fees: ₹ 12,700\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationbihar",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Bihar and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3000\n3. Government Fees: ₹ 1,780\nTotal Fees: ₹ 6,780\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationpunjabv2_v3",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Punjab and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3000\n3. Government Fees: ₹ 11,100\nTotal Fees: ₹ 16,100\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companycompliances",
    content: "Avoid Penalties in your Company!\n\n🎉 Avail our Annual Compliance Package at a special discounted price of ₹7,999/year (payable quarterly) instead of ₹19,999.\n\n📦 Our package includes:\n\nForm ADT-1, AOC-4, MGT-7, Income Tax Return, and more.\n\n📋 Other Services:\n✅ GST Return filing: ₹299/month.\n✅ Startup India Registration: ₹2,999.\n✅ Trademark Filing: ₹999.\n\nDon't wait! Contact us today to secure your compliance.\n\nYou can Opt out by replying 'Stop' to us!"
  },
  {
    name: "companyregistrationmaharashta_v2",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Maharashtra and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3,000\n3. Government Fees: ₹ 2450\nTotal Fees: ₹ 7,450\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationassam1_v2",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Assam and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3,000\n3. Government Fees: ₹ 1700\nTotal Fees: ₹ 5,700\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationgujratv2_v2",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Gujrat and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3,000\n3. Government Fees: ₹ 1800\nTotal Fees: ₹ 6,800\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationpunjabv2",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Punjab and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹11.100\n3. Government Fees: ₹ 1800\nTotal Fees: ₹ 16,100\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationwb_v3",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state West Bengal and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3,000\n3. Government fees: ₹ 1500\nTotal Fees: ₹ 6500\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationhimachal_v2",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Himachal Pradesh and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3,000\n3. Government fees: ₹ 1300\nTotal Fees: ₹ 6300\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "agent_assing",
    content: "Your Relationship Manager (RM) is Mrs. Ritu Kaur. She will get in touch with you shortly."
  },
  {
    name: "companyregistrationgujratv2",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Gujrat and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3,000\n3. Government Fees: ₹ 1800\nTotal Fees: ₹ 6,800\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationassam",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Aassam and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3,000\n3. Government Fees: ₹ 1700\nTotal Fees: ₹ 5,700\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationmaharashta",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Maharashtra and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3,000\n3. Government Fees: ₹ 2450\nTotal Fees: ₹ 7,450\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned."
  },
  {
    name: "companyregistrationwb",
    content: "Here’s the quotation for setting up your Private Limited Company with 2 director in state Maharashtra and ₹1 lakh Authorized Share Capital:\n\n1. Professional Fees: ₹2000\n2. Digital Signatures for 2 Directors: ₹3,000\n3. Name Application Fees (Govt.): ₹1,000\n4. Stamp Duty Fees (Govt.): ₹370\nTotal Fees: ₹ 6370\n\nTimeline: 12-15 days\n\nTo get started, please provide:\n\n1. PAN and Aadhaar of the directors\n2. Phone numbers and email addresses of the directors\n3. Proof of registered office address\n4. Details of authorized and subscribed share capital\n5. Latest Bank Statement\n6. Electricity bill for the registered address\n7. . Industry in which the company will operate\n\nFeel free to reach out if you have any questions or need further information. Looking forward to helping you get started!\n\nOnce confirmed, a relationship manager will be assigned"
  },
  {
    name: "retargeting_v3",
    content: "Avoid Penalties in {{Name}}\n\n🚨 Hurry up! Only 21 days left to avoid penalties. We noticed you still haven't appointed an auditor.\n\n🎉 Avail our Annual Compliance Package at a special discounted price of ₹7,999/year (payable quarterly) instead of ₹19,999.\n\n📦 Our package includes:\n\nForm ADT-1, AOC-4, MGT-7, Income Tax Return, and more.\n\n📋 Other Services:\n✅ GST Return filing: ₹299/month.\n✅ Startup India Registration: ₹2,999.\n✅ Trademark Filing: ₹999.\n\nDon't wait! Contact us today to secure your compliance.\n\nYou can Opt out by replying 'Stop' to us!"
  }
];
