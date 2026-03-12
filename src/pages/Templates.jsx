import React, { useState, useMemo } from 'react'
import { X, Trash2, Paperclip, Plus } from 'lucide-react'
import TemplatesHeader from '../components/templates/TemplatesHeader'
import TemplatesFilters from '../components/templates/TemplatesFilters'
import TemplatesTable from '../components/templates/TemplatesTable'
import RichTextEditor from '../components/RichTextEditor'

const STATUSES = ['Active', 'Inactive']

const TEMPLATE_VARIABLES = [
  { title: 'General:', vars: ['{{name}}', '{{companyName}}', '{{address}}'] },
  {
    title: 'Annual Compliance Service Only:',
    vars: ['{{username}}', '{{password}}'],
  },
  {
    title: 'Invoice Only:',
    vars: ['{{invoiceNo}}', '{{invoiceDate}}', '{{invoiceAmount}}'],
  },
  {
    title: 'Annual Compliance Only:',
    vars: [
      '{{complianceName}}',
      '{{complianceDoneDate}}',
      '{{complianceExpiryDate}}',
    ],
  },
]


const INITIAL_TEMPLATES = [
  {
    id: 1,
    created: '20th June 2025 2:13 pm',
    name: 'Director Resignation',
    subject: 'Startup Station - Director Resignation Services',
    status: 'Active',
    attachments: [],
    body: `<table style="background: #ffffff; border-collapse: collapse; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif; text-align: center; margin: 0 auto; width: 100%; max-width: 600px;" width="100%" align="center" class="mce-item-table">
  <tbody>
    <tr>
      <td style="background-color: #03479fff; color: white; font-size: 20px; font-weight: bold; padding: 15px; text-align: center;">Startup India Registration</td>
    </tr>
    <tr>
      <td style="padding: 15px; text-align: center;">
        <img src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" width="150" style="display: block; margin: 0 auto;" />
      </td>
    </tr>
    <tr>
      <td style="padding: 15px; font-size: 16px; text-align: center; color: #004AAD;">
        Thank you for choosing <strong>Startup Station</strong> for <br /><strong>Director Resignation Services</strong>.<br />We appreciate your trust in our services.
      </td>
    </tr>
    <tr>
      <td style="padding: 15px; text-align: center;">
        <table style="border-collapse: collapse; margin: 0 auto; width: 100%;" width="100%" class="mce-item-table">
          <tbody>
            <tr>
              <th style="padding: 12px; background-color: #004AAD; color: white; border: 1px solid #cce5ff; text-align: center; width: 33%;">Invoice Number</th>
              <th style="padding: 12px; background-color: #004AAD; color: white; border: 1px solid #cce5ff; text-align: center; width: 33%;">Invoice Amount</th>
              <th style="padding: 12px; background-color: #004AAD; color: white; border: 1px solid #cce5ff; text-align: center; width: 33%;">Invoice Date</th>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #cce5ff; text-align: center; color: #004AAD;">{{invoiceNo}}</td>
              <td style="padding: 12px; border: 1px solid #cce5ff; text-align: center; color: #004AAD;">{{invoiceAmount}}</td>
              <td style="padding: 12px; border: 1px solid #cce5ff; text-align: center; color: #004AAD;">{{invoiceDate}}</td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 15px; font-size: 16px; font-weight: bold; background: #e6f2ff; color: #004AAD; text-align: center;">
        To proceed, please provide the following documents to your Relationship Manager:
      </td>
    </tr>
    <tr>
      <td style="padding: 15px; background: #f0f8ff; text-align: center;">
        <h3 style="margin-top: 0; margin-bottom: 10px; color: #004AAD;">Contact Details</h3>
        <p style="margin: 0 0 5px 0; color: #004AAD;">Relationship Manager: <a style="color: #0056b3; text-decoration: none; font-weight: bold;" href="tel:+919674962601">+91 96749 62601</a></p>
        <p style="margin: 0 0 5px 0; color: #004AAD;">Accountant 1: <a style="color: #0056b3; text-decoration: none; font-weight: bold;" href="tel:+917605868584">+91 7605 868 584</a></p>
        <p style="margin: 0 0 0 0; color: #004AAD;">Accountant 2: <a style="color: #0056b3; text-decoration: none; font-weight: bold;" href="tel:+919583723661">+91 95837 23661</a></p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px; text-align: center;">
        <a style="display: inline-block; background-color: #004AAD; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;" href="https://g.page/r/CcT54IQgtRJaEAE/review">Leave a Review</a>
      </td>
    </tr>
    <tr>
      <td style="padding: 15px; background: #e6f2ff; font-size: 14px; color: #004AAD; text-align: center;">
        📧 Contact us: <a style="color: #0056b3; text-decoration: none; font-weight: bold;" href="mailto:contact@startupstation.in">contact@startupstation.in</a>
      </td>
    </tr>
  </tbody>
</table>`,
  },
  {
    id: 2,
    created: '1st March 2025 6:21 pm',
    name: 'Annual Compliance plus Bookkeeping',
    subject:
      'Annual Compliance Package by Startup Station plus Bookkeeping Services',
    status: 'Active',
    attachments: [],
    body: `<div style="background-color: rgb(255, 255, 255); margin: 20px auto; padding: 20px; max-width: 700px; border-radius: 8px; box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 10px; --darkreader-inline-bgcolor: var(--darkreader-background-ffffff, #181a1b); --darkreader-inline-boxshadow: var(--darkreader-background-0000001a, rgba(0, 0, 0, 0.1)) 0px 0px 10px;" data-mce-style="background-color: #fff; margin: 20px auto; padding: 20px; max-width: 700px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);" data-darkreader-inline-bgcolor="" data-darkreader-inline-boxshadow=""><div style="text-align: center; padding-bottom: 20px;" data-mce-style="text-align: center; padding-bottom: 20px;"><img style="width: 180px;" src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" data-mce-style="width: 180px;" data-mce-src="https://startupstation.in/images/logo/logoNw.png"></div><div><p>Dear Sir,</p><p>We are excited to serve you in the upcoming year and ensure smooth compliance for your company.</p><p>Please find below our <span style="color: rgb(255, 111, 97); font-weight: bold; --darkreader-inline-color: var(--darkreader-text-ff6f61, #ff6c5d);" data-mce-style="color: #ff6f61; font-weight: bold;" data-darkreader-inline-color="">Annual Compliance Package</span>, which covers all necessary Annual ROC Compliances and Income Tax Return filing services for your company.</p><h3 style="color: rgb(0, 123, 255); --darkreader-inline-color: var(--darkreader-text-007bff, #33a2ff);" data-mce-style="color: #007bff;" data-darkreader-inline-color="">📌 Package Details:</h3><ul><li>Preparation &amp; Filing of Form ADT-01 (Auditor Appointment)</li><li>Application of Dormant Status under ESI Act</li><li>Preparation &amp; Filing of Form INC-20A</li><li>Issuance of Share Certificates</li><li>Preparation of Board Resolutions</li><li>Preparation of AGM Resolutions</li><li>Preparation &amp; Filing of AOC-04&nbsp;</li><li>Preparation &amp; Filing of MGT-07</li><li>Statutory Registers</li><li>MPB-01</li><li>DIR-08</li><li>Preparation &amp; Filing of Financial Statements</li><li>Preparation &amp; Filing of Audit</li><li>Preparation &amp; Filing of Directors’ Reports</li><li>Preparation &amp; Filing of Income Tax Returns</li><li>DPT-3,</li><li>MGT-14</li><li>DIR-3 E-KYC</li><li>Free consultation for legal and compliance matters</li></ul><h3 style="color: rgb(0, 123, 255); --darkreader-inline-color: var(--darkreader-text-007bff, #33a2ff);" data-mce-style="color: #007bff;" data-darkreader-inline-color="">💰 Pricing:</h3><p><strong>Annual ROC Compliances:</strong> Rs. 7,999 + govt. fees (approx. Rs. 1500 quarterly)</p><p><strong>GST Filings:</strong> Rs. 300 for NIL return, Rs. 500 for normal filings per month.</p><p><strong>Bookkeeping Services:</strong> Minimum Rs. 2000 per month plus Rs. 50 per Invoice (both Sales and Purchase). Accounts will be maintained in Tally. Monthly Reports will be sent (At least 5 reports for tracking and monitoring performance).</p><h3 style="color: rgb(0, 123, 255); --darkreader-inline-color: var(--darkreader-text-007bff, #33a2ff);" data-mce-style="color: #007bff;" data-darkreader-inline-color="">📄 Required Documents:</h3><ul><li>MOA and AOA</li><li>Certificate of Incorporation</li><li>PAN of any 1 director</li></ul><p>We accept UPI, Card, and Bank Transfers for payment.</p><p>The compliance calendar is on Page 3 of the package. Attached is our Invoice for Quarter 1.</p><p><strong>We confirm:</strong> In case of any negligence on our part resulting in penalties, we shall bear the penalty cost.</p><p>For queries or clarifications, feel free to <a style="display: inline-block; padding: 12px 24px; background-color: rgb(0, 123, 255); color: rgb(255, 255, 255); text-decoration: none; border-radius: 5px; margin-top: 20px; --darkreader-inline-bgcolor: var(--darkreader-background-007bff, #0062cc); --darkreader-inline-color: var(--darkreader-text-ffffff, #e8e6e3);" href="https://startupstation.in/" data-mce-style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;" data-mce-href="https://startupstation.in/" data-darkreader-inline-bgcolor="" data-darkreader-inline-color="">Visit our Website!</a>.</p><p>Looking forward to working with you!</p></div><div style="text-align: center; font-size: 14px; color: rgb(119, 119, 119); margin-top: 30px; --darkreader-inline-color: var(--darkreader-text-777777, #9d9488);" data-mce-style="text-align: center; font-size: 14px; color: #777; margin-top: 30px;" data-darkreader-inline-color=""><p>Thanks &amp; Regards,</p><p><strong>Startup Station</strong><br>Your trusted partner in compliance and legal services.</p></div></div>`,
  },
  {
    id: 3,
    created: '26th February 2025 3:19 pm',
    name: 'Package plus payment details',
    subject: 'Annual Compliance Package by Startup Station',
    status: 'Active',
    attachments: [],
    body: `<tbody><tr><td style="text-align: center;" data-mce-style="text-align: center;"><img style="margin-bottom: 10px; margin:0 auto;" src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" width="150" data-mce-style="margin-bottom: 10px;" data-mce-src="https://startupstation.in/images/logo/logoNw.png"><h2 style="color: #333;" data-mce-style="color: #333;">Annual Compliance Package</h2><p style="font-size: 16px; color: #555;" data-mce-style="font-size: 16px; color: #555;">Dear Sir,</p><p style="font-size: 14px; color: #555;" data-mce-style="font-size: 14px; color: #555;">We are excited to serve you in the upcoming year and ensure smooth compliance for your company.</p><p style="font-size: 14px; color: #555;" data-mce-style="font-size: 14px; color: #555;">Please find below our <strong>Annual Compliance Package</strong>, which covers all necessary Annual ROC Compliances and Income Tax Return filing services.</p><hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;" data-mce-style="border: 0; height: 1px; background: #ddd; margin: 20px 0;"><h3 style="color: #007bff;" data-mce-style="color: #007bff;">Package Details:</h3><ul style="text-align: left; color: #444; font-size: 14px; line-height: 1.6;" data-mce-style="text-align: left; color: #444; font-size: 14px; line-height: 1.6;"><li>Preparation &amp; Filing of Form ADT-01 (Auditor Appointment)</li><li>Preparation &amp; Filing of Form INC-20A (Commencement of Business)</li><li>Issuance of Share Certificates (for all Shareholders)</li><li>Preparation of Board Meeting &amp; AGM/EGM Minutes</li><li>Filing of Form AOC-04 (Financial Annual Return)</li><li>Filing of Form MGT-07 (Management Annual Return)</li><li>Preparation of Statutory Registers</li><li>Filing of Balance Sheet, P&amp;L, and Audit Reports</li><li>Income Tax Return Filing</li><li>Filing of DPT-3, MGT-14, DIR-3 E-KYC</li><li><strong>Free legal &amp; compliance consultation</strong></li></ul><h3 style="color: #007bff;" data-mce-style="color: #007bff;">Pricing:</h3><ul style="text-align: left; color: #444; font-size: 14px;" data-mce-style="text-align: left; color: #444; font-size: 14px;"><li><strong>Annual ROC Compliances:</strong> ₹7,999 plus government fees (Approx ₹1500) payable quarterly</li><li><strong>GST Filings:</strong> ₹300 for NIL return, ₹500 for normal filings per month</li></ul><h3 style="color: #007bff;" data-mce-style="color: #007bff;">Required Documents:</h3><ul style="text-align: left; color: #444; font-size: 14px;" data-mce-style="text-align: left; color: #444; font-size: 14px;"><li>MOA and AOA</li><li>Certificate of Incorporation</li><li>PAN of any 1 director</li></ul><hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;" data-mce-style="border: 0; height: 1px; background: #ddd; margin: 20px 0;"><h3 style="color: #007bff;" data-mce-style="color: #007bff;">Payment Details:</h3><p style="color: #555; font-size: 14px;" data-mce-style="color: #555; font-size: 14px;">We accept UPI, Card, and Bank Transfers. Please find our payment details below:</p><p style="color: #222; font-size: 16px; font-weight: bold;" data-mce-style="color: #222; font-size: 16px; font-weight: bold;">UPI ID: startupstation@axl</p><p><strong>Alternatively, you can transfer directly to our bank account:</strong></p><p style="color: #222; font-size: 14px; font-weight: bold;" data-mce-style="color: #222; font-size: 14px; font-weight: bold;">Bank Name: STARTUP STATION FINANCIAL SERVICES PRIVATE LIMITED<br>Account Number: 50200094441194<br>IFSC Code: HDFC0005385</p><p style="text-align: center; font-weight: bold; color: #333;" data-mce-style="text-align: center; font-weight: bold; color: #333;">Scan to Pay:</p><p style="text-align: center;" data-mce-style="text-align: center;"><img style="border: 2px solid #007bff; border-radius: 8px;" src="https://startupstation.in/images/ssupi.jpg" alt="QR Code" width="150" data-mce-style="border: 2px solid #007bff; border-radius: 8px;" data-mce-src="https://startupstation.in/images/ssupi.jpg"></p><p style="text-align: center; font-size: 14px; color: #555;" data-mce-style="text-align: center; font-size: 14px; color: #555;">Please let us know if you need any assistance. We look forward to working with you!</p><h3 style="text-align: center; color: #007bff;" data-mce-style="text-align: center; color: #007bff;">Quick Links:</h3><p style="text-align: center;" data-mce-style="text-align: center;"><a style="background: #007bff; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-size: 14px;" href="https://compliances.startupstation.in/" data-mce-style="background: #007bff; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-size: 14px;" data-mce-href="https://compliances.startupstation.in/">Access CRM</a> &nbsp;&nbsp; <a style="background: #28a745; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-size: 14px;" href="https://maps.app.goo.gl/bVW5RwSNnHjQ25W57" data-mce-style="background: #28a745; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-size: 14px;" data-mce-href="https://maps.app.goo.gl/bVW5RwSNnHjQ25W57">Leave a Review</a></p><h3 style="text-align: center; color: #007bff;" data-mce-style="text-align: center; color: #007bff;">Contact Us:</h3><p style="text-align: center; font-size: 14px; color: #555;" data-mce-style="text-align: center; font-size: 14px; color: #555;"><strong>Email:</strong> support@startupstation.in<br><strong>Phone:</strong> +91-9876543210<br><strong>Website:</strong> <a style="color: #007bff;" href="https://www.startupstation.in" data-mce-style="color: #007bff;" data-mce-href="https://www.startupstation.in">www.startupstation.in</a></p><p style="text-align: center; font-size: 14px; font-weight: bold; color: #333;" data-mce-style="text-align: center; font-size: 14px; font-weight: bold; color: #333;">Thanks &amp; Regards,<br>Startup Station Financial Services Pvt Ltd</p></td></tr></tbody>`,
  },
  {
    id: 4,
    created: '26th February 2025 11:59 am',
    name: 'ROC plus GST plus ESI plus TDS',
    subject: 'Annual Compliance Package by Startup Station',
    status: 'Active',
    attachments: [],
    body: `<tbody><tr><td align="center"><table style="border-radius: 8px; padding: 20px; box-shadow: 0px 5px 10px rgba(0,0,0,0.1);" border="0" width="650px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" data-mce-style="border-radius: 8px; padding: 20px; box-shadow: 0px 5px 10px rgba(0,0,0,0.1);" class="mce-item-table"><tbody><tr><td style="padding-bottom: 20px;" align="center" data-mce-style="padding-bottom: 20px;"><img src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" width="180px" data-mce-src="https://startupstation.in/images/logo/logoNw.png"></td></tr><tr><td style="padding: 20px; font-size: 16px; color: #333;" data-mce-style="padding: 20px; font-size: 16px; color: #333;"><p>Dear Sir,</p><p>We are excited to serve you in the upcoming year and ensure smooth compliance for your company.</p><p>Please find attached our <strong>Annual Compliance Package</strong>, covering all necessary Annual ROC Compliances and Income Tax Return filing services.</p></td></tr><tr><td style="padding: 20px;" data-mce-style="padding: 20px;"><h3 style="color: #007bff; font-size: 18px;" data-mce-style="color: #007bff; font-size: 18px;">📌 Package Details:</h3><table style="border-collapse: collapse; text-align: left; font-size: 14px;" border="1" width="100%" cellspacing="0" cellpadding="10" data-mce-style="border-collapse: collapse; text-align: left; font-size: 14px;"><tbody><tr style="background-color: #007bff; color: #ffffff;" data-mce-style="background-color: #007bff; color: #ffffff;"><th>Compliance Service</th><th>Details</th></tr><tr><td>Form ADT-01</td><td>Auditor Appointment (Auditor fees included)</td></tr><tr><td>Form INC-20A</td><td>Commencement of Business &amp; Proof of Deposit of Paid-Up Capital</td></tr><tr><td>Share Certificates</td><td>Issuance of Share Certificates for all Shareholders</td></tr><tr><td>Board &amp; AGM Minutes</td><td>Preparation of Notices and Minutes</td></tr><tr><td>Statutory Registers</td><td>Preparation of 07 Required Registers</td></tr><tr><td>Annual Filings</td><td>Form AOC-04, Form MGT-07, Financials, and Management Reports</td></tr><tr><td>Income Tax &amp; GST</td><td>Filing of Income Tax Returns, DIR-3 E-KYC, and GST Filings</td></tr><tr><td>Free Consultation</td><td>Legal &amp; Compliance Support</td></tr></tbody></table></td></tr><tr><td style="padding: 20px;" data-mce-style="padding: 20px;"><h3 style="color: #007bff; font-size: 18px;" data-mce-style="color: #007bff; font-size: 18px;">💰 Pricing Plans:</h3><table style="border-collapse: collapse; text-align: left; font-size: 14px;" border="1" width="100%" cellspacing="0" cellpadding="10" data-mce-style="border-collapse: collapse; text-align: left; font-size: 14px;"><tbody><tr style="background-color: #007bff; color: #ffffff;" data-mce-style="background-color: #007bff; color: #ffffff;"><th>Plan</th><th>Price (Quarterly)</th></tr><tr><td>Annual ROC Compliances</td><td>₹2000 + Govt. Fees</td></tr><tr><td>ROC + GST Filings</td><td>₹3,250 + Govt. Fees</td></tr><tr><td>ROC + GST + ESI/PF Filings</td><td>₹4,250 + Govt. Fees</td></tr><tr><td>ROC + GST + PF/ESI + TDS</td><td>₹5,000 + Govt. Fees</td></tr></tbody></table></td></tr><tr><td style="padding: 20px;" data-mce-style="padding: 20px;"><h3 style="color: #007bff; font-size: 18px;" data-mce-style="color: #007bff; font-size: 18px;">📄 Required Documents:</h3><ul style="padding-left: 20px; font-size: 16px;" data-mce-style="padding-left: 20px; font-size: 16px;"><li><strong>MOA &amp; AOA</strong></li><li><strong>Certificate of Incorporation</strong></li><li><strong>PAN of any 1 director</strong></li></ul><p>We accept <strong>UPI, Card, and Bank Transfers</strong> for payment.</p></td></tr><tr><td style="padding: 20px;" align="center" data-mce-style="padding: 20px;"><a style="background-color: #28a745; color: #ffffff; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;" href="https://startupstation.in/" data-mce-style="background-color: #28a745; color: #ffffff; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;" data-mce-href="https://startupstation.in/">📧 Contact Us</a></td></tr><tr><td style="text-align: center; font-size: 14px; color: #888888; padding: 20px;" data-mce-style="text-align: center; font-size: 14px; color: #888888; padding: 20px;"><p>Best regards,<br><strong>Ritu Kaur</strong><br>Business Development Manager, Startup Station</p></td></tr></tbody></table></td></tr></tbody>`,
  },
  {
    id: 5,
    created: '22nd February 2025 8:05 am',
    name: 'INC 20A Reminder',
    subject: 'Urgent: INC-20A Filing Pending – Avoid Late Penalties!',
    status: 'Active',
    attachments: [],
    body: `<tbody>

<tr>
<td style="background-color:#343a40;color:white;font-size:20px;font-weight:bold;padding:15px;">
Urgent: INC-20A Filing Pending
</td>
</tr>

<tr>
<td style="padding:15px;">
<img src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" width="150">
</td>
</tr>

<tr>
<td style="padding:15px;font-size:16px;">
Hi <strong>{{companyName}}</strong>,<br>
This is to inform you that <strong>Filing of Form INC-20A</strong> is pending, and the due date is <strong>{{complianceExpiryDate}}</strong>.
</td>
</tr>

<tr>
<td style="padding:15px;background:#fff3cd;color:#856404;font-size:16px;font-weight:bold;">
It is important to file INC-20A as soon as possible to avoid unnecessary penalties.
</td>
</tr>

<tr>
<td style="padding:15px;font-size:16px;">
Please ensure to submit the required documents at the earliest:

<ul style="text-align:left;margin:15px auto;width:80%;padding-left:15px;">
<li>Bank statement showing the subscription amount received by the company.</li>

<li>
Photograph of the Registered Office showing both:
<ul>
<li>The external building.</li>
<li>The inside office, including at least one Director in the frame.</li>
</ul>
</li>

</ul>

</td>
</tr>

<tr>
<td style="padding:15px;font-size:16px;">
<strong>Late Fees for Filing INC-20A:</strong>

<ul style="text-align:left;margin:15px auto;width:80%;padding-left:15px;">
<li>Delay up to 30 days: ₹50 per day</li>
<li>Delay beyond 30 days and up to 60 days: ₹100 per day</li>
<li>Delay beyond 60 days and up to 90 days: ₹200 per day</li>
<li>Delay beyond 90 days: ₹300 per day</li>
</ul>

</td>
</tr>

<tr>
<td style="padding:20px;">

<a href="https://compliances.startupstation.in/"
style="display:inline-block;background-color:#343a40;color:white;padding:12px 20px;text-decoration:none;border-radius:5px;font-weight:bold;margin:5px;">
Access CRM Portal
</a>

<a href="https://g.page/r/CcT54IQgtRJaEAE/review"
style="display:inline-block;background-color:#007bff;color:white;padding:12px 20px;text-decoration:none;border-radius:5px;font-weight:bold;margin:5px;">
Leave a Review
</a>

</td>
</tr>

<tr>
<td style="padding:15px;">

<strong>Contact Details</strong><br>

Relationship Manager:
<a href="tel:+919674962601" style="color:#007bff;text-decoration:none;">
+91 96749 62601
</a><br>

Accountant 1:
<a href="tel:+917605868584" style="color:#007bff;text-decoration:none;">
+91 7605 868 584
</a><br>

Accountant 2:
<a href="tel:+919583723661" style="color:#007bff;text-decoration:none;">
+91 95837 23661
</a>

</td>
</tr>

<tr>
<td style="padding:15px;background:#f8f9fa;font-size:14px;color:#555;">
📧 Contact us:
<a href="mailto:contact@startupstation.in" style="color:#007bff;text-decoration:none;">
contact@startupstation.in
</a>
</td>
</tr>

</tbody>`,
  },
  {
    id: 6,
    created: '18th February 2025 9:45 am',
    name: 'Next Quarter Payment',
    subject:
      "Reminder: Upcoming Quarter's Payment \u2013 Complete Within 5 Days",
    status: 'Active',
    attachments: [],
    body: `<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f4f4f4" class="mce-item-table"><tbody><tr><td align="center"><table style="border-radius: 15px; box-shadow: 0 8px 20px rgba(0,0,0,0.2); overflow: hidden;" width="600" cellspacing="0" cellpadding="20" bgcolor="#ffffff" data-mce-style="border-radius: 15px; box-shadow: 0 8px 20px rgba(0,0,0,0.2); overflow: hidden;" class="mce-item-table"><tbody><tr><td style="background-color: #1abc9c; padding: 30px;" align="center" data-mce-style="background-color: #1abc9c; padding: 30px;"><img style="margin-bottom: 20px;" src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" width="170" data-mce-style="margin-bottom: 20px;" data-mce-src="https://startupstation.in/images/logo/logoNw.png"><h1 style="color: #fff; margin: 0; font-size: 28px; letter-spacing: 1px;" data-mce-style="color: #fff; margin: 0; font-size: 28px; letter-spacing: 1px;">Upcoming Quarter's Payment Notification</h1></td></tr><tr><td style="font-size: 16px; color: #34495e; padding: 20px; line-height: 1.8;" data-mce-style="font-size: 16px; color: #34495e; padding: 20px; line-height: 1.8;">Dear Valued Client,<br><br>This is a reminder for your <strong>upcoming quarter's payment</strong>. Kindly make the payment within <strong>5 days from the due date</strong> to continue enjoying our services seamlessly. <br><br><a style="display: inline-block; padding: 14px 32px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: bold; margin-top: 20px;" href="https://compliances.startupstation.in/" data-mce-style="display: inline-block; padding: 14px 32px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: bold; margin-top: 20px;" data-mce-href="https://compliances.startupstation.in/">Track Compliances &amp; Payment</a> <br><br><strong>Payment Details:</strong><br>UPI ID: <strong>startupstation@axl</strong><br><br>Alternatively, transfer directly to our bank account:<br><strong>Bank Name:</strong> STARTUP STATION FINANCIAL SERVICES PRIVATE LIMITED<br><strong>Account Number:</strong> 50200094441194<br><strong>IFSC Code:</strong> HDFC0005385</td></tr><tr><td align="center"><img style="margin: 25px 0; border: 4px solid #1abc9c; border-radius: 10px;" src="https://startupstation.in/images/ssupi.jpg" alt="QR Code for Payment" width="200" data-mce-style="margin: 25px 0; border: 4px solid #1abc9c; border-radius: 10px;" data-mce-src="https://startupstation.in/images/ssupi.jpg"></td></tr><tr><td style="font-size: 15px; color: #34495e; background-color: #ecf0f1; padding: 20px; line-height: 1.7;" data-mce-style="font-size: 15px; color: #34495e; background-color: #ecf0f1; padding: 20px; line-height: 1.7;"><strong>Contact Us:</strong><br>Relationship Manager: +91 96749 62601<br>Email: <a style="color: #3498db; text-decoration: underline;" href="mailto:contact@startupstation.in" data-mce-style="color: #3498db; text-decoration: underline;" data-mce-href="mailto:contact@startupstation.in">contact@startupstation.in</a></td></tr><tr><td style="font-size: 12px; color: #ffffff; padding: 20px; background-color: #000000;" align="center" data-mce-style="font-size: 12px; color: #ffffff; padding: 20px; background-color: #000000;">© 2025 Startup Station Financial Services Private Limited. All rights reserved.</td></tr></tbody></table></td></tr></tbody></table>`,
  },
  {
    id: 7,
    created: '18th February 2025 9:31 am',
    name: 'Service List',
    subject:
      'Discover Our Key Services to Boost Your Business – Startup Station',
    status: 'Active',
    attachments: [],
    body: `<table style="border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); overflow: hidden;" width="600" cellspacing="0" cellpadding="20" bgcolor="#ffffff" data-mce-style="border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); overflow: hidden;" class="mce-item-table"><tbody><tr><td style="background-color: #000000; padding: 20px;" align="center" data-mce-style="background-color: #000000; padding: 20px;"><img style="margin-bottom: 15px;" src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" width="160" data-mce-style="margin-bottom: 15px;" data-mce-src="https://startupstation.in/images/logo/logoNw.png"><h1 style="color: #f1c40f; margin: 0; font-size: 28px;" data-mce-style="color: #f1c40f; margin: 0; font-size: 28px;">Explore Our Key Services</h1></td></tr><tr><td style="font-size: 16px; color: #333333; padding: 20px; line-height: 1.8;" data-mce-style="font-size: 16px; color: #333333; padding: 20px; line-height: 1.8;">Thank you for choosing Startup Station! Along with our Annual Compliance Package, we offer a variety of services to support your business:<ul style="list-style: none; padding: 0;" data-mce-style="list-style: none; padding: 0;"><li>✔️ <strong>Startup India Registration</strong> at Rs. 2999 (including Organization DSC)</li><li>✔️ <strong>GST Registration</strong> at Rs. 999</li><li>✔️ <strong>MSME Registration</strong> at Rs. 999</li><li>✔️ <strong>Website Development</strong> starting at Rs. 4999</li><li>✔️ <strong>Digital Marketing Services</strong> – Customized Pricing</li><li>✔️ <strong>Logo Designing Services</strong></li><li>✔️ <strong>Income Tax Return Filing</strong> starting at just Rs. 499</li></ul><a style="display: inline-block; padding: 12px 24px; background-color: #2980b9; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px;" href="https://startupstation.in" data-mce-style="display: inline-block; padding: 12px 24px; background-color: #2980b9; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px;" data-mce-href="https://startupstation.in">Explore More Services</a></td></tr><tr><td style="font-size: 14px; color: #555555; background-color: #ecf0f1; padding: 20px; line-height: 1.5;" data-mce-style="font-size: 14px; color: #555555; background-color: #ecf0f1; padding: 20px; line-height: 1.5;"><strong>Contact Us:</strong><br>Relationship Manager: +91 96749 62601<br>Accountant 1: +91 7605 868 584<br>Accountant 2: +91 95837 23661<br>Email: <a style="color: #2980b9; text-decoration: none;" href="mailto:contact@startupstation.in" data-mce-style="color: #2980b9; text-decoration: none;" data-mce-href="mailto:contact@startupstation.in">contact@startupstation.in</a></td></tr><tr><td style="font-size: 12px; color: #ffffff; padding: 20px; background-color: #000000;" align="center" data-mce-style="font-size: 12px; color: #ffffff; padding: 20px; background-color: #000000;">© 2025 Startup Station Financial Services Private Limited. All rights reserved.</td></tr></tbody></table>`,
  },
  {
    id: 8,
    created: '17th February 2025 2:24 pm',
    name: 'GST Filing',
    subject: 'Urgent: Submit Your GST Invoices by 6th for Timely Filing!',
    status: 'Active',
    attachments: [],
    body: `<table style="border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.15);" width="600" cellspacing="0" cellpadding="20" bgcolor="#ffffff" data-mce-style="border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.15);" class="mce-item-table"><tbody><tr><td align="center"><img src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" width="150" data-mce-src="https://startupstation.in/images/logo/logoNw.png"></td></tr><tr><td style="font-size: 24px; font-weight: bold; color: #34495e;" align="center" data-mce-style="font-size: 24px; font-weight: bold; color: #34495e;">GST Return Filing for January 2025</td></tr><tr><td style="font-size: 16px; color: #555555; padding: 20px; line-height: 1.5;" data-mce-style="font-size: 16px; color: #555555; padding: 20px; line-height: 1.5;">Hi Members,<br><br>We are in the process of filing your GST Return for the previous month. To ensure a smooth and timely filing, please provide us with the Sales and Purchase Invoices for the previous month.<br><br>We kindly request that you send us these documents before <strong> 6th of this month</strong>, so we can complete the filings without any last-minute rush.<br><br>Thank you for your cooperation.</td></tr><tr><td style="font-size: 14px; color: #555555; padding: 10px 20px;" data-mce-style="font-size: 14px; color: #555555; padding: 10px 20px;"><strong>Contact Us:</strong><br>Relationship Manager: +91 96749 62601<br>Accountant 1: +91 7605 868 584<br>Accountant 2: +91 95837 23661<br>Email: contact@startupstation.in</td></tr><tr><td style="font-size: 12px; color: #aaaaaa; padding: 20px;" align="center" data-mce-style="font-size: 12px; color: #aaaaaa; padding: 20px;">© 2025 Startup Station Financial Services Private Limited. All rights reserved.</td></tr></tbody></table>`,
  },
  {
    id: 9,
    created: '17th February 2025 2:17 pm',
    name: 'Professional Tax',
    subject: 'Get Professional Tax Registration immediately!',
    status: 'Active',
    attachments: [],
    body: `<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f9f9f9" class="mce-item-table"><tbody><tr><td align="center"><table style="border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.15);" width="600" cellspacing="0" cellpadding="20" bgcolor="#ffffff" data-mce-style="border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.15);" class="mce-item-table"><tbody><tr><td align="center"><img src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" width="150" data-mce-src="https://startupstation.in/images/logo/logoNw.png"></td></tr><tr><td style="font-size: 26px; font-weight: bold; color: #2c3e50;" align="center" data-mce-style="font-size: 26px; font-weight: bold; color: #2c3e50;">⚖️ Get Professional Tax Registration for your Company at just ₹1,000! (Plus Govt. Fees)</td></tr><tr><td style="font-size: 16px; color: #555555; padding: 10px 20px;" data-mce-style="font-size: 16px; color: #555555; padding: 10px 20px;">Did you know you are required to obtain Professional Tax Registration for your company if it's not located in these states: <strong>Arunachal Pradesh, Delhi, Goa, Haryana, Uttar Pradesh, Uttaranchal, Andaman and Nicobar, Chandigarh, Daman and Diu, Dadra and Nagar Haveli, Lakshadweep.</strong> <br><br>Ensure compliance and avoid penalties with our hassle-free registration service.</td></tr><tr><td align="center"><a style="display: inline-block; padding: 12px 30px; margin: 20px 10px; font-size: 16px; color: #ffffff; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); text-decoration: none; border-radius: 5px;" href="https://wa.me/919674560602?text=Hi%2C%20want%20to%20know%20about%20Professional%20Tax%20Registration." data-mce-style="display: inline-block; padding: 12px 30px; margin: 20px 10px; font-size: 16px; color: #ffffff; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); text-decoration: none; border-radius: 5px;" data-mce-href="https://wa.me/919674560602?text=Hi%2C%20want%20to%20know%20about%20Professional%20Tax%20Registration.">Contact on WhatsApp</a></td></tr><tr><td style="font-size: 14px; color: #555555; padding: 10px 20px;" data-mce-style="font-size: 14px; color: #555555; padding: 10px 20px;"><strong>Contact Us:</strong><br>Relationship Manager: +91 96749 62601<br>Accountant 1: +91 7605 868 584<br>Accountant 2: +91 95837 23661<br>Email: contact@startupstation.in</td></tr><tr><td style="padding: 20px;" align="center" data-mce-style="padding: 20px;"><a style="display: inline-block; padding: 10px 20px; font-size: 14px; color: #ffffff; background-color: #27ae60; text-decoration: none; border-radius: 5px;" href="https://g.page/r/CcT54IQgtRJaEAE/review" data-mce-style="display: inline-block; padding: 10px 20px; font-size: 14px; color: #ffffff; background-color: #27ae60; text-decoration: none; border-radius: 5px;" data-mce-href="https://g.page/r/CcT54IQgtRJaEAE/review">Leave a Review</a></td></tr><tr><td style="font-size: 12px; color: #aaaaaa;" align="center" data-mce-style="font-size: 12px; color: #aaaaaa;">© 2025 Startup Station Financial Services Private Limited. All rights reserved.</td></tr></tbody></table></td></tr></tbody></table>`,
  },
  {
    id: 10,
    created: '17th February 2025 2:07 pm',
    name: 'Website',
    subject: 'Your Website at just Rs 9999!',
    status: 'Active',
    attachments: [],
    body: `<table style="background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);" width="600" cellspacing="0" cellpadding="0" align="center" data-mce-style="background-color: #ffffff; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);" class="mce-item-table"><tbody><tr><td style="padding: 20px;" align="center" data-mce-style="padding: 20px;"><img src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" width="150" data-mce-src="https://startupstation.in/images/logo/logoNw.png"></td></tr><tr><td style="padding: 20px; font-size: 24px; color: #333333; font-weight: bold;" align="center" data-mce-style="padding: 20px; font-size: 24px; color: #333333; font-weight: bold;">Website Designing Services Starting at Just Rs. 9999</td></tr><tr><td style="padding: 10px 20px; font-size: 16px; color: #555555;" align="center" data-mce-style="padding: 10px 20px; font-size: 16px; color: #555555;">Looking for a professional and responsive website We offer expert website development with modern designs and the latest technology.</td></tr><tr><td style="padding: 10px; font-size: 20px; color: #ff5722; font-weight: bold;" align="center" data-mce-style="padding: 10px; font-size: 20px; color: #ff5722; font-weight: bold;">Starting at Rs. 9999 Only</td></tr><tr><td style="padding: 10px;" align="center" data-mce-style="padding: 10px;"><table border="0" width="90%" cellspacing="0" cellpadding="5" class="mce-item-table"><tbody><tr><td style="font-size: 16px;" align="left" data-mce-style="font-size: 16px;">1. Custom Website Design Up to 5 Pages</td></tr><tr><td style="font-size: 16px;" align="left" data-mce-style="font-size: 16px;">2. SEO Optimized and Fast Loading Websites</td></tr><tr><td style="font-size: 16px;" align="left" data-mce-style="font-size: 16px;">3. Mobile and Tablet Friendly 100 percent Responsive</td></tr><tr><td style="font-size: 16px;" align="left" data-mce-style="font-size: 16px;">4. Contact Form Integration</td></tr><tr><td style="font-size: 16px;" align="left" data-mce-style="font-size: 16px;">5. Free One Month Support</td></tr><tr><td style="font-size: 16px;" align="left" data-mce-style="font-size: 16px;">6. Hosting and Domain Assistance</td></tr></tbody></table></td></tr><tr><td style="padding: 10px; font-size: 18px; font-weight: bold;" align="center" data-mce-style="padding: 10px; font-size: 18px; font-weight: bold;">Technologies We Use</td></tr><tr><td style="font-size: 16px; color: #555555;" align="center" data-mce-style="font-size: 16px; color: #555555;">Front End HTML CSS JavaScript <br>Back End NodeJS</td></tr><tr><td style="padding: 20px;" align="center" data-mce-style="padding: 20px;"><a style="background-color: #25d366; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px;" href="https://wa.me/919674560602?text=Hi%2C%20I%20am%20interested%20in%20your%20website%20designing%20services." data-mce-style="background-color: #25d366; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px;" data-mce-href="https://wa.me/919674560602?text=Hi%2C%20I%20am%20interested%20in%20your%20website%20designing%20services."> Chat on WhatsApp </a></td></tr><tr><td style="padding: 10px;" align="center" data-mce-style="padding: 10px;"><img src="https://i.ibb.co/BBKP2b6/QRCode-1.png" alt="WhatsApp QR Code" width="150" data-mce-src="https://i.ibb.co/BBKP2b6/QRCode-1.png"></td></tr><tr><td style="padding: 20px; font-size: 14px; color: #888888;" align="center" data-mce-style="padding: 20px; font-size: 14px; color: #888888;">Call us at 91 9674560602 | Visit <a style="color: #0073e6; text-decoration: none;" href="https://www.startupstation.in" data-mce-style="color: #0073e6; text-decoration: none;" data-mce-href="https://www.startupstation.in">www.startupstation.in</a></td></tr></tbody></table>`,
  },
  {
    id: 11,
    created: '17th February 2025 1:56 pm',
    name: 'Startup India Promotion',
    subject:
      'Get Your Startup India Registration (DPIIT Certificate) at Just ₹2,999 with Startup Station! 🚀',
    status: 'Active',
    attachments: [],
    body: `<table border="0" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f0f4f8" class="mce-item-table"><tbody><tr><td align="center"><table style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" width="600" cellspacing="0" cellpadding="20" bgcolor="#ffffff" data-mce-style="border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" class="mce-item-table"><tbody><tr><td style="background-color: #000000; padding: 20px; border-top-left-radius: 10px; border-top-right-radius: 10px;" align="center" data-mce-style="background-color: #000000; padding: 20px; border-top-left-radius: 10px; border-top-right-radius: 10px;"><img src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" width="150" data-mce-src="https://startupstation.in/images/logo/logoNw.png"></td></tr><tr><td style="font-size: 28px; font-weight: bold; color: #333333;" align="center" data-mce-style="font-size: 28px; font-weight: bold; color: #333333;">🚀 Get Your Startup India Registration Certificate at Just ₹2,999!</td></tr><tr><td style="font-size: 16px; color: #666666;" align="center" data-mce-style="font-size: 16px; color: #666666;">Benefit from Tax Exemptions, Easy Compliance, Access to Funding, and much more — now with Organization Digital Signature included!</td></tr><tr><td style="font-size: 14px; color: #444444; padding: 15px 20px;" data-mce-style="font-size: 14px; color: #444444; padding: 15px 20px;"><strong>Documents Required:</strong><ul><li>GSTIN Certificate (if applicable)</li><li>PAN of the Company</li><li>Certificate of Incorporation</li><li>Bank Statement for the last month</li><li>Authorized Signatory Board Resolution</li><li>PAN and Aadhar of any one Director</li><li>Phone Number and Email</li><li>Address of any one Director</li></ul></td></tr><tr><td align="center"><a style="display: inline-block; padding: 14px 35px; margin: 20px 0; font-size: 16px; color: #fff; background: linear-gradient(135deg, #004080, #0073e6); text-decoration: none; border-radius: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);" href="https://wa.me/919674560602?text=Hi%2C%20Want%20to%20know%20about%20Startup%20India%20Registration." data-mce-style="display: inline-block; padding: 14px 35px; margin: 20px 0; font-size: 16px; color: #fff; background: linear-gradient(135deg, #004080, #0073e6); text-decoration: none; border-radius: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);" data-mce-href="https://wa.me/919674560602?text=Hi%2C%20Want%20to%20know%20about%20Startup%20India%20Registration.">Whatsapp Us Now!</a></td></tr><tr><td style="font-size: 14px; color: #555555; padding: 15px 20px;" data-mce-style="font-size: 14px; color: #555555; padding: 15px 20px;"><strong>Contact Us:</strong><br>Relationship Manager: +91 96749 62601<br>Accountant 1: +91 7605 868 584<br>Accountant 2: +91 95837 23661<br>Email: contact@startupstation.in</td></tr><tr><td style="padding: 20px;" align="center" data-mce-style="padding: 20px;"><a style="display: inline-block; padding: 12px 25px; font-size: 14px; color: #ffffff; background: linear-gradient(135deg, #ff6b6b, #ff4757); text-decoration: none; border-radius: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);" href="https://g.page/r/CcT54IQgtRJaEAE/review" data-mce-style="display: inline-block; padding: 12px 25px; font-size: 14px; color: #ffffff; background: linear-gradient(135deg, #ff6b6b, #ff4757); text-decoration: none; border-radius: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);" data-mce-href="https://g.page/r/CcT54IQgtRJaEAE/review">Leave a Review</a></td></tr><tr><td style="font-size: 12px; color: #888888; padding: 15px;" align="center" data-mce-style="font-size: 12px; color: #888888; padding: 15px;">© 2025 Startup Station Financial Services Private Limited. All rights reserved.</td></tr></tbody></table></td></tr></tbody></table>`,
  },
  {
    id: 12,
    created: '12th February 2025 10:20 pm',
    name: 'Startup India Registration',
    subject: 'Startup India Registration - Next Steps & Document Submission',
    status: 'Active',
    attachments: [{ id: 1, name: 'Startup India Guide.pdf' }],
    body: `<table style="background: #ffffff; border-collapse: collapse; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif; text-align: center;" width="600" align="center" data-mce-style="background: #ffffff; border-collapse: collapse; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif; text-align: center;" class="mce-item-table"><tbody><tr><td style="background-color: #343a40; color: white; font-size: 20px; font-weight: bold; padding: 15px;" data-mce-style="background-color: #343a40; color: white; font-size: 20px; font-weight: bold; padding: 15px;">Startup India Registration</td></tr><tr><td style="padding: 15px;" data-mce-style="padding: 15px;"><img src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" width="150" data-mce-src="https://startupstation.in/images/logo/logoNw.png"></td></tr><tr><td style="padding: 15px; font-size: 16px;" data-mce-style="padding: 15px; font-size: 16px;">Thank you for choosing <strong>Startup Station</strong> for <strong>Startup India Registration</strong>. We appreciate your trust in our services.</td></tr><tr><td style="padding: 15px;" data-mce-style="padding: 15px;"><table style="border-collapse: collapse;" width="100%" data-mce-style="border-collapse: collapse;" class="mce-item-table"><tbody><tr><th style="padding: 12px; background-color: #343a40; color: white; border: 1px solid #ddd;" data-mce-style="padding: 12px; background-color: #343a40; color: white; border: 1px solid #ddd;">Invoice Number</th><th style="padding: 12px; background-color: #343a40; color: white; border: 1px solid #ddd;" data-mce-style="padding: 12px; background-color: #343a40; color: white; border: 1px solid #ddd;">Invoice Amount</th><th style="padding: 12px; background-color: #343a40; color: white; border: 1px solid #ddd;" data-mce-style="padding: 12px; background-color: #343a40; color: white; border: 1px solid #ddd;">Invoice Date</th></tr><tr><td style="padding: 12px; border: 1px solid #ddd;" data-mce-style="padding: 12px; border: 1px solid #ddd;">{{invoiceNo}}</td><td style="padding: 12px; border: 1px solid #ddd;" data-mce-style="padding: 12px; border: 1px solid #ddd;">{{invoiceAmount}}</td><td style="padding: 12px; border: 1px solid #ddd;" data-mce-style="padding: 12px; border: 1px solid #ddd;">{{invoiceDate}}</td></tr></tbody></table></td></tr><tr><td style="padding: 15px; font-size: 16px; font-weight: bold; background: #fff3cd; color: #856404;" data-mce-style="padding: 15px; font-size: 16px; font-weight: bold; background: #fff3cd; color: #856404;">To proceed, please provide the following documents to your Relationship Manager:</td></tr><tr><td style="padding: 15px;" data-mce-style="padding: 15px;"><table style="border-collapse: collapse;" width="100%" data-mce-style="border-collapse: collapse;" class="mce-item-table"><tbody><tr><td style="padding: 10px; border: 1px solid #ddd;" data-mce-style="padding: 10px; border: 1px solid #ddd;">1. GSTIN Certificate (if applicable)</td></tr><tr><td style="padding: 10px; border: 1px solid #ddd;" data-mce-style="padding: 10px; border: 1px solid #ddd;">2. PAN of the Company</td></tr><tr><td style="padding: 10px; border: 1px solid #ddd;" data-mce-style="padding: 10px; border: 1px solid #ddd;">3. Certificate of Incorporation</td></tr><tr><td style="padding: 10px; border: 1px solid #ddd;" data-mce-style="padding: 10px; border: 1px solid #ddd;">4. Bank Statement for the last month</td></tr><tr><td style="padding: 10px; border: 1px solid #ddd;" data-mce-style="padding: 10px; border: 1px solid #ddd;">5. Authorized Signatory Board Resolution (Template provided by us)</td></tr><tr><td style="padding: 10px; border: 1px solid #ddd;" data-mce-style="padding: 10px; border: 1px solid #ddd;">6. PAN and Aadhar of any one Director</td></tr><tr><td style="padding: 10px; border: 1px solid #ddd;" data-mce-style="padding: 10px; border: 1px solid #ddd;">7. Phone Number and Email</td></tr><tr><td style="padding: 10px; border: 1px solid #ddd;" data-mce-style="padding: 10px; border: 1px solid #ddd;">8. Address of any one Director</td></tr></tbody></table></td></tr><tr><td style="padding: 15px;" data-mce-style="padding: 15px;">Please submit the documents at your earliest convenience to ensure a smooth registration process. If you need any assistance, feel free to reach out.</td></tr><tr><td style="padding: 15px; background: #f8f9fa;" data-mce-style="padding: 15px; background: #f8f9fa;"><strong>Contact Details</strong><br>Relationship Manager: <a style="color: #007bff; text-decoration: none;" href="tel:+919674962601" data-mce-style="color: #007bff; text-decoration: none;" data-mce-href="tel:+919674962601">+91 96749 62601</a><br>Accountant 1: <a style="color: #007bff; text-decoration: none;" href="tel:+917605868584" data-mce-style="color: #007bff; text-decoration: none;" data-mce-href="tel:+917605868584">+91 7605 868 584</a><br>Accountant 2: <a style="color: #007bff; text-decoration: none;" href="tel:+919583723661" data-mce-style="color: #007bff; text-decoration: none;" data-mce-href="tel:+919583723661">+91 95837 23661</a></td></tr><tr><td style="padding: 20px;" data-mce-style="padding: 20px;"><a style="display: inline-block; background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;" href="https://g.page/r/CcT54IQgtRJaEAE/review" data-mce-style="display: inline-block; background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;" data-mce-href="https://g.page/r/CcT54IQgtRJaEAE/review">Leave a Review</a></td></tr><tr><td style="padding: 15px; background: #f8f9fa; font-size: 14px; color: #555;" data-mce-style="padding: 15px; background: #f8f9fa; font-size: 14px; color: #555;">📧 Contact us: <a style="color: #007bff; text-decoration: none;" href="mailto:contact@startupstation.in" data-mce-style="color: #007bff; text-decoration: none;" data-mce-href="mailto:contact@startupstation.in">contact@startupstation.in</a></td></tr></tbody></table>`,
  },
  {
    id: 13,
    created: '12th February 2025 8:49 pm',
    name: 'Annual Compliance - Onboarding',
    subject: 'Welcome to Startup Station – Your Annual Compliance Access',
    status: 'Active',
    attachments: [],
    body: `<table style="background: #ffffff; border-collapse: collapse; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif; text-align: center;" width="600" align="center" data-mce-style="background: #ffffff; border-collapse: collapse; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); font-family: Arial, sans-serif; text-align: center;" class="mce-item-table"><tbody><tr><td style="background-color: #343a40; color: white; font-size: 20px; font-weight: bold; padding: 15px;" data-mce-style="background-color: #343a40; color: white; font-size: 20px; font-weight: bold; padding: 15px;">Welcome to Startup Station</td></tr><tr><td style="padding: 15px;" data-mce-style="padding: 15px;"><img src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" width="150" data-mce-src="https://startupstation.in/images/logo/logoNw.png"></td></tr><tr><td style="padding: 15px; font-size: 16px;" data-mce-style="padding: 15px; font-size: 16px;">Dear <strong>{{companyName}}</strong>,<br>We are delighted to onboard you for Annual Compliance Services.</td></tr><tr><td style="padding: 15px;" data-mce-style="padding: 15px;"><table style="border-collapse: collapse;" width="100%" data-mce-style="border-collapse: collapse;" class="mce-item-table"><tbody><tr><th style="padding: 12px; background-color: #343a40; color: white; border: 1px solid #ddd;" data-mce-style="padding: 12px; background-color: #343a40; color: white; border: 1px solid #ddd;">Invoice Number</th><th style="padding: 12px; background-color: #343a40; color: white; border: 1px solid #ddd;" data-mce-style="padding: 12px; background-color: #343a40; color: white; border: 1px solid #ddd;">Invoice Amount</th><th style="padding: 12px; background-color: #343a40; color: white; border: 1px solid #ddd;" data-mce-style="padding: 12px; background-color: #343a40; color: white; border: 1px solid #ddd;">Invoice Date</th></tr><tr><td style="padding: 12px; border: 1px solid #ddd;" data-mce-style="padding: 12px; border: 1px solid #ddd;">{{invoiceNo}}</td><td style="padding: 12px; border: 1px solid #ddd;" data-mce-style="padding: 12px; border: 1px solid #ddd;">{{invoiceAmount}}</td><td style="padding: 12px; border: 1px solid #ddd;" data-mce-style="padding: 12px; border: 1px solid #ddd;">{{invoiceDate}}</td></tr></tbody></table></td></tr><tr><td style="padding: 15px;" data-mce-style="padding: 15px;">We have provided you access to our CRM portal, where you can update and track your compliances to ensure timely submissions and avoid penalties.</td></tr><tr><td style="padding: 15px;" data-mce-style="padding: 15px;"><table style="border-collapse: collapse;" width="100%" data-mce-style="border-collapse: collapse;" class="mce-item-table"><tbody><tr><th style="padding: 12px; background-color: #343a40; color: white; border: 1px solid #ddd;" data-mce-style="padding: 12px; background-color: #343a40; color: white; border: 1px solid #ddd;">Username</th><th style="padding: 12px; background-color: #343a40; color: white; border: 1px solid #ddd;" data-mce-style="padding: 12px; background-color: #343a40; color: white; border: 1px solid #ddd;">Password</th></tr><tr><td style="padding: 12px; border: 1px solid #ddd;" data-mce-style="padding: 12px; border: 1px solid #ddd;">{{username}}</td><td style="padding: 12px; border: 1px solid #ddd;" data-mce-style="padding: 12px; border: 1px solid #ddd;">{{password}}</td></tr></tbody></table></td></tr><tr><td style="padding: 15px; background: #fff3cd; color: #856404; font-size: 16px; font-weight: bold;" data-mce-style="padding: 15px; background: #fff3cd; color: #856404; font-size: 16px; font-weight: bold;">A WhatsApp group will be created to handle all your compliances.</td></tr><tr><td style="padding: 20px;" data-mce-style="padding: 20px;"><a style="display: inline-block; background-color: #343a40; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px;" href="https://compliances.startupstation.in/" data-mce-style="display: inline-block; background-color: #343a40; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px;" data-mce-href="https://compliances.startupstation.in/">Access CRM Portal</a> <a style="display: inline-block; background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px;" href="https://g.page/r/CcT54IQgtRJaEAE/review" data-mce-style="display: inline-block; background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px;" data-mce-href="https://g.page/r/CcT54IQgtRJaEAE/review">Leave a Review</a></td></tr><tr><td style="padding: 15px;" data-mce-style="padding: 15px;"><strong>Contact Details</strong><br>Relationship Manager: <a style="color: #007bff; text-decoration: none;" href="tel:+919674962601" data-mce-style="color: #007bff; text-decoration: none;" data-mce-href="tel:+919674962601">+91 96749 62601</a><br>Accountant 1: <a style="color: #007bff; text-decoration: none;" href="tel:+917605868584" data-mce-style="color: #007bff; text-decoration: none;" data-mce-href="tel:+917605868584">+91 7605 868 584</a><br>Accountant 2: <a style="color: #007bff; text-decoration: none;" href="tel:+919583723661" data-mce-style="color: #007bff; text-decoration: none;" data-mce-href="tel:+919583723661">+91 95837 23661</a></td></tr><tr><td style="padding: 15px; background: #f8f9fa; font-size: 14px; color: #555;" data-mce-style="padding: 15px; background: #f8f9fa; font-size: 14px; color: #555;">📧 Contact us: <a style="color: #007bff; text-decoration: none;" href="mailto:contact@startupstation.in" data-mce-style="color: #007bff; text-decoration: none;" data-mce-href="mailto:contact@startupstation.in">contact@startupstation.in</a></td></tr><tr><td style="padding: 15px; background: #e9ecef; font-size: 14px; color: #555;" data-mce-style="padding: 15px; background: #e9ecef; font-size: 14px; color: #555;"><strong>Bank Details:</strong><br>Bank Name: HDFC Bank<br>Account Name: Startup Station Financial Services Pvt Ltd<br>Account Number: 50200094441194<br>IFSC Code: HDFC0005385<br>Branch: Ruby More, Kolkata</td></tr><tr><td style="padding: 15px; background: #ffffff; font-size: 14px; color: #555;" data-mce-style="padding: 15px; background: #ffffff; font-size: 14px; color: #555;"><strong>UPI ID:</strong> startupstation@idfcbank<br><img style="margin-top: 15px;" src="https://startupstation.in/images/ssupi.jpg" alt="QR Code for UPI" width="150" data-mce-style="margin-top: 15px;" data-mce-src="https://startupstation.in/images/ssupi.jpg"></td></tr></tbody></table>`,
  },
  {
    id: 14,
    created: '24th January 2025 12:00 pm',
    name: 'Annual Compliance Service plus GST plus ESI - Ritu Kaur',
    subject: 'Annual Compliance Package for {{companyName}}',
    status: 'Active',
    attachments: [],
    body: `<tbody><tr><td align="center"><table style="border-radius: 8px; padding: 20px; box-shadow: 0px 5px 10px rgba(0,0,0,0.1);" border="0" width="650px" cellspacing="0" cellpadding="0" bgcolor="#ffffff" data-mce-style="border-radius: 8px; padding: 20px; box-shadow: 0px 5px 10px rgba(0,0,0,0.1);" class="mce-item-table"><tbody><tr><td style="padding-bottom: 20px;" align="center" data-mce-style="padding-bottom: 20px;"><img src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" width="180px" data-mce-src="https://startupstation.in/images/logo/logoNw.png"></td></tr><tr><td style="padding: 20px; font-size: 16px; color: #333;" data-mce-style="padding: 20px; font-size: 16px; color: #333;"><p>Dear Sir,</p><p>We are excited to serve you in the upcoming year and ensure smooth compliance for your company.</p><p>Please find attached our <strong>Annual Compliance Package</strong>, covering all necessary Annual ROC Compliances and Income Tax Return filing services.</p></td></tr><tr><td style="padding: 20px;" data-mce-style="padding: 20px;"><h3 style="color: #007bff; font-size: 18px;" data-mce-style="color: #007bff; font-size: 18px;">📌 Package Details:</h3><table style="border-collapse: collapse; text-align: left; font-size: 14px;" border="1" width="100%" cellspacing="0" cellpadding="10" data-mce-style="border-collapse: collapse; text-align: left; font-size: 14px;"><tbody><tr style="background-color: #007bff; color: #ffffff;" data-mce-style="background-color: #007bff; color: #ffffff;"><th>Compliance Service</th><th>Details</th></tr><tr><td>Form ADT-01</td><td>Auditor Appointment (Auditor fees included)</td></tr><tr><td>Form INC-20A</td><td>Commencement of Business &amp; Proof of Deposit of Paid-Up Capital</td></tr><tr><td>Share Certificates</td><td>Issuance of Share Certificates for all Shareholders</td></tr><tr><td>Board &amp; AGM Minutes</td><td>Preparation of Notices and Minutes</td></tr><tr><td>Statutory Registers</td><td>Preparation of 07 Required Registers</td></tr><tr><td>Annual Filings</td><td>Form AOC-04, Form MGT-07, Financials, and Management Reports</td></tr><tr><td>Income Tax &amp; GST</td><td>Filing of Income Tax Returns, DIR-3 E-KYC, and GST Filings</td></tr><tr><td>Free Consultation</td><td>Legal &amp; Compliance Support</td></tr></tbody></table></td></tr><tr><td style="padding: 20px;" data-mce-style="padding: 20px;"><h3 style="color: #007bff; font-size: 18px;" data-mce-style="color: #007bff; font-size: 18px;">💰 Pricing Plans:</h3><table style="border-collapse: collapse; text-align: left; font-size: 14px;" border="1" width="100%" cellspacing="0" cellpadding="10" data-mce-style="border-collapse: collapse; text-align: left; font-size: 14px;"><tbody><tr style="background-color: #007bff; color: #ffffff;" data-mce-style="background-color: #007bff; color: #ffffff;"><th>Plan</th><th>Price (Quarterly)</th></tr><tr><td>Annual ROC Compliances</td><td>₹7,999 + Govt. Fees</td></tr><tr><td>ROC + GST Filings</td><td>₹13,000 + Govt. Fees</td></tr><tr><td>ROC + GST + ESI/PF Filings</td><td>₹17,000 + Govt. Fees</td></tr></tbody></table></td></tr><tr><td style="padding: 20px;" data-mce-style="padding: 20px;"><h3 style="color: #007bff; font-size: 18px;" data-mce-style="color: #007bff; font-size: 18px;">📄 Required Documents:</h3><ul style="padding-left: 20px; font-size: 16px;" data-mce-style="padding-left: 20px; font-size: 16px;"><li><strong>MOA &amp; AOA</strong></li><li><strong>Certificate of Incorporation</strong></li><li><strong>PAN of any 1 director</strong></li></ul><p>We accept <strong>UPI, Card, and Bank Transfers</strong> for payment.</p></td></tr><tr><td style="padding: 20px;" align="center" data-mce-style="padding: 20px;"><a style="background-color: #28a745; color: #ffffff; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;" href="https://startupstation.in/" data-mce-style="background-color: #28a745; color: #ffffff; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;" data-mce-href="https://startupstation.in/">📧 Contact Us</a></td></tr><tr><td style="text-align: center; font-size: 14px; color: #888888; padding: 20px;" data-mce-style="text-align: center; font-size: 14px; color: #888888; padding: 20px;"><p>Best regards,<br><strong>Ritu Kaur</strong><br>Business Development Manager, Startup Station</p></td></tr></tbody></table></td></tr></tbody>`,
  },
  {
    id: 15,
    created: '22nd January 2025 9:50 am',
    name: 'Annual Compliance Service - Ritu Kaur',
    subject: 'Annual Compliance Package for {{companyName}}',
    status: 'Active',
    attachments: [],
    body: `<div style="background-color: #fff; margin: 20px auto; padding: 20px; max-width: 700px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);" data-mce-style="background-color: #fff; margin: 20px auto; padding: 20px; max-width: 700px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);"><div style="text-align: center; padding-bottom: 20px;" data-mce-style="text-align: center; padding-bottom: 20px;"><img style="width: 180px;" src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" data-mce-style="width: 180px;" data-mce-src="https://startupstation.in/images/logo/logoNw.png"></div><div><p>Dear Sir,</p><p>We are excited to serve you in the upcoming year and ensure smooth compliance for your company.</p><p>Please find below our <span style="color: #ff6f61; font-weight: bold;" data-mce-style="color: #ff6f61; font-weight: bold;">Annual Compliance Package</span>, which covers all necessary Annual ROC Compliances and Income Tax Return filing services for your company.</p><h3 style="color: #007bff;" data-mce-style="color: #007bff;">📌 Package Details:</h3><ul><li>Preparation &amp; Filing of Form ADT-01 (Auditor Appointment)</li><li>Application of Dormant Status under ESI Act</li><li>Preparation &amp; Filing of Form INC-20A</li><li>Issuance of Share Certificates</li><li>Preparation of Board Resolutions</li><li>Preparation of AGM Resolutions</li><li>Preparation &amp; Filing of AOC-04</li><li>Preparation &amp; Filing of MGT-07</li><li>Statutory Registers</li><li>MPB-01</li><li>DIR-08</li><li>Preparation &amp; Filing of Financial Statements</li><li>Preparation &amp; Filing of Audit</li><li>Preparation &amp; Filing of Directors' Reports</li><li>Preparation &amp; Filing of Income Tax Returns</li><li>DPT-3</li><li>MGT-14</li><li>DIR-3 E-KYC</li><li>Free consultation for legal and compliance matters</li></ul><h3 style="color: #007bff;" data-mce-style="color: #007bff;">💰 Pricing:</h3><p><strong>Annual ROC Compliances:</strong> Rs. 7,999 + govt. fees (approx. Rs. 1500) to be paid quarterly i.e. Rs. 2000 per quarter.</p><p><strong>GST Filings:</strong> Rs. 300 for NIL return, Rs. 500 for normal filings per month.</p><h3 style="color: #007bff;" data-mce-style="color: #007bff;">📄 Required Documents:</h3><ul><li>MOA and AOA</li><li>Certificate of Incorporation</li><li>PAN of any 1 director</li></ul><p>We accept UPI, Card, and Bank Transfers for payment.</p><p>The compliance calendar is on Page 3 of the package. Attached is our Invoice for Quarter 1.</p><p><strong>We confirm:</strong> In case of any negligence on our part resulting in penalties, we shall bear the penalty cost.</p><p>For queries or clarifications, feel free to <a style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;" href="https://startupstation.in/" data-mce-style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;" data-mce-href="https://startupstation.in/">Visit our Website!</a>.</p><p>Looking forward to working with you!</p></div><div style="text-align: center; font-size: 14px; color: #777; margin-top: 30px;" data-mce-style="text-align: center; font-size: 14px; color: #777; margin-top: 30px;"><p>Thanks &amp; Regards,</p><p><strong>Startup Station</strong><br>Your trusted partner in compliance and legal services.</p></div></div>`,
  },
  {
    id: 16,
    created: '21st January 2025 11:30 pm',
    name: 'Compliance Update',
    subject: 'Compliance Update - {{complianceName}} for {{companyName}}',
    status: 'Active',
    attachments: [],
    body: `<table style="max-width: 600px; background-color: #ffffff; margin: 40px auto; padding: 20px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); text-align: center;" border="0" width="100%" cellspacing="0" cellpadding="0" align="center" data-mce-style="max-width: 600px; background-color: #ffffff; margin: 40px auto; padding: 20px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); text-align: center;" class="mce-item-table"><tbody><tr><td><img style="width: 180px; margin-bottom: 20px;" src="https://startupstation.in/images/logo/logoNw.png" alt="Startup Station Logo" data-mce-style="width: 180px; margin-bottom: 20px;" data-mce-src="https://startupstation.in/images/logo/logoNw.png"></td></tr><tr><td><h2 style="color: #333333; font-size: 24px; font-weight: bold; margin-bottom: 15px;" data-mce-style="color: #333333; font-size: 24px; font-weight: bold; margin-bottom: 15px;">Hello {{companyName}},</h2></td></tr><tr><td><p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 10px 0;" data-mce-style="color: #555555; font-size: 16px; line-height: 1.6; margin: 10px 0;">We are pleased to inform you that <strong>{{complianceName}}</strong> for your company has been successfully filed on {{complianceDoneDate}}</p><p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 10px 0;" data-mce-style="color: #555555; font-size: 16px; line-height: 1.6; margin: 10px 0;">You can track the status of your Annual Compliance by clicking the button below:</p></td></tr><tr><td style="padding: 10px;" data-mce-style="padding: 10px;"><a style="display: inline-block; width: 80%; max-width: 300px; padding: 12px; background-color: #007bff; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px; margin: 10px auto; text-align: center;" href="https://compliances.startupstation.in/" data-mce-style="display: inline-block; width: 80%; max-width: 300px; padding: 12px; background-color: #007bff; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px; margin: 10px auto; text-align: center;" data-mce-href="https://compliances.startupstation.in/">📌 Track Compliance</a></td></tr><tr><td style="padding: 10px;" data-mce-style="padding: 10px;"><a style="display: inline-block; width: 80%; max-width: 300px; padding: 12px; background-color: #ff9800; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px; margin: 10px auto; text-align: center;" href="https://g.page/r/CcT54IQgtRJaEAE/review" data-mce-style="display: inline-block; width: 80%; max-width: 300px; padding: 12px; background-color: #ff9800; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px; margin: 10px auto; text-align: center;" data-mce-href="https://g.page/r/CcT54IQgtRJaEAE/review">⭐ Rate Us on Google</a></td></tr><tr><td><p style="margin-top: 30px; font-size: 14px; color: #888888;" data-mce-style="margin-top: 30px; font-size: 14px; color: #888888;">Best regards,<br><strong>Startup Station Team</strong></p></td></tr></tbody></table>`,
  },
  {
    id: 17,
    created: '8th January 2025 8:41 am',
    name: 'Annual Compliance Service - Jagjyot Singh',
    subject: 'Annual Compliance Service by Startup Station',
    status: 'Active',
    attachments: [],
    body: `<div>Dear Sir,</div><div><br></div><div>We are excited to serve you in the upcoming year and ensure smooth compliance for your company.</div><div><br></div><div>Please find attached our Annual Compliance Package, which covers all necessary Annual ROC Compliances and Income Tax Return filing services for your company.</div><div><br></div><div><strong>Package Details:</strong></div><ul><li>Preparation &amp; Filing of Form ADT-01 (Auditor Appointment) (Auditor fees included in the quotation)</li><li>Preparation &amp; Filing of Form INC-20A (Commencement of Business &amp; Proof of Deposit of Paid-Up Capital)</li><li>Issuance of Share Certificates (for all Shareholders)</li><li>Preparation of Notice and Minutes of Board Meetings</li><li>Preparation of Notice and Minutes of the Annual General Meeting (AGM) &amp; Extra-Ordinary General Meeting (EGM)</li><li>Preparation &amp; Filing of Form AOC-04 (Financials Related Annual Return)</li><li>Preparation &amp; Filing of Form MGT-07 (Management Related Annual Return)</li><li>Preparation of 07 Required Statutory Registers</li><li>Preparation of MPB-01 (Disclosure of Interest by Directors)</li><li>Preparation of DIR-08 (Disclosure of Non-Disqualification by Directors)</li><li>Preparation &amp; Filing of Balance Sheet and P&amp;L Accounts</li><li>Preparation &amp; Filing of Audit Report, Director's Report &amp; Extract of Annual Returns</li><li>Filing of Income Tax Returns</li><li>ESI/PF Filings</li><li>GST Filings</li><li>DIR-3 E-KYC</li><li>Free consultation regarding any legal and compliance matters.</li></ul><div><strong>Pricing:</strong></div><ul><li>Annual ROC Compliances: Rs. 7,999 plus government fees payable quarterly</li></ul><div><strong>Required Documents to Start:</strong></div><ol><li>MOA and AOA</li><li>Certificate of Incorporation</li><li>PAN of any 1 director</li></ol><div>We accept UPI, Card, and Bank Transfers for payment.</div><div><br></div><div>We are also attaching herewith details of the Chartered Accountant who will be assigned for your Annual Compliances.</div><div><br></div><div>Should you have any queries or need further clarification, feel free to reach out. We are happy to assist you.</div><div><br></div><div>Looking forward to working with you!</div><div><br></div><div>Thanks &amp; Regards</div><div><img src="https://crm.startupstation.in/8ac183c6-ac4a-4fb7-8943-1f80e699876e" alt="Signature" style="max-width: 200px; display: block; margin-top: 10px;"></div>`,
  },
]

const DEFAULT_FORM = {
  name: '',
  subject: '',
  status: 'Active',
  body: '',
}

const TemplateFormFields = ({ formData, setFormData }) => (
  <div className="space-y-4">
    {/* Name */}
    <div>
      <label className="block text-sm text-[var(--color-text-secondary)] mb-1 font-medium">
        Name
      </label>
      <input
        type="text"
        required
        value={formData.name}
        onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
        className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)]"
      />
    </div>
    {/* Subject */}
    <div>
      <label className="block text-sm text-[var(--color-text-secondary)] mb-1 font-medium">
        Subject
      </label>
      <input
        type="text"
        required
        value={formData.subject}
        onChange={(e) =>
          setFormData((f) => ({ ...f, subject: e.target.value }))
        }
        className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)]"
      />
    </div>
    {/* Status */}
    <div>
      <label className="block text-sm text-[var(--color-text-secondary)] mb-1 font-medium">
        Status
      </label>
      <select
        value={formData.status}
        onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value }))}
        className="w-full px-3 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] text-[var(--color-text-primary)]"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
    {/* Template Variables Help */}
    <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-3 text-xs text-[var(--color-text-secondary)] space-y-2">
      {TEMPLATE_VARIABLES.map((group) => (
        <div key={group.title}>
          <p className="font-semibold text-[var(--color-text-primary)] mb-1">
            {group.title}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {group.vars.map((v) => (
              <span
                key={v}
                className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded px-2 py-0.5 font-mono"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
    {/* Rich Text Editor */}
    <div>
      <label className="block text-sm text-[var(--color-text-secondary)] mb-1 font-medium">
        Email Body
      </label>
      <div className="rounded-lg overflow-hidden border border-[var(--color-bg-tertiary)] bg-[var(--color-bg-primary)]">
        <RichTextEditor
          value={formData.body}
          onChange={(val) => setFormData((f) => ({ ...f, body: val }))}
        />
      </div>
    </div>
  </div>
)

const Templates = () => {
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES)
  const [searchFilter, setSearchFilter] = useState('')

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false)

  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [formData, setFormData] = useState(DEFAULT_FORM)

  const filteredTemplates = useMemo(() => {
    if (!searchFilter.trim()) return templates
    const q = searchFilter.toLowerCase()
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)
    )
  }, [templates, searchFilter])

  const openAddModal = () => {
    setFormData(DEFAULT_FORM)
    setIsAddModalOpen(true)
  }

  const openEditModal = (tmpl) => {
    setSelectedTemplate(tmpl)
    setFormData({
      name: tmpl.name,
      subject: tmpl.subject,
      status: tmpl.status,
      body: tmpl.body || '',
    })
    setIsEditModalOpen(true)
  }

  const openManageModal = (tmpl) => {
    setSelectedTemplate(tmpl)
    setIsManageModalOpen(true)
  }

  const handleAddSubmit = (e) => {
    e.preventDefault()
    const now = new Date()
    const d = now.getDate()
    const suffix = d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const created = `${d}${suffix} ${months[now.getMonth()]} ${now.getFullYear()} ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase()}`
    setTemplates((prev) => [
      { id: Date.now(), created, ...formData, attachments: [] },
      ...prev,
    ])
    setIsAddModalOpen(false)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === selectedTemplate.id ? { ...t, ...formData } : t
      )
    )
    setIsEditModalOpen(false)
  }

  const addAttachment = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === selectedTemplate.id
            ? {
                ...t,
                attachments: [
                  ...(t.attachments || []),
                  { id: Date.now(), name: file.name },
                ],
              }
            : t
        )
      )
      setSelectedTemplate((prev) => ({
        ...prev,
        attachments: [
          ...(prev.attachments || []),
          { id: Date.now(), name: file.name },
        ],
      }))
    }
    input.click()
  }

  const removeAttachment = (attachId) => {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === selectedTemplate.id
          ? {
              ...t,
              attachments: t.attachments.filter((a) => a.id !== attachId),
            }
          : t
      )
    )
    setSelectedTemplate((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.id !== attachId),
    }))
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw] text-[var(--color-text-primary)]">
      <TemplatesHeader count={templates.length} onAddClick={openAddModal} />
      <TemplatesFilters
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
      />
      <TemplatesTable
        templates={filteredTemplates}
        onEditClick={openEditModal}
        onManageClick={openManageModal}
      />

      {/* ── Add Template Modal ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-xl w-full max-w-[80%] flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-bg-tertiary)]">
              <h2 className="text-lg font-bold">Add New Email Template</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] flex-1">
              <form id="add-template-form" onSubmit={handleAddSubmit}>
                <TemplateFormFields
                  formData={formData}
                  setFormData={setFormData}
                />
              </form>
            </div>
            <div className="p-5 border-t border-[var(--color-bg-tertiary)]">
              <button
                type="submit"
                form="add-template-form"
                className="w-full bg-[var(--color-accent)] hover:bg-yellow-500 text-white py-2.5 rounded-lg font-bold transition-colors"
              >
                ADD NEW TEMPLATE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Template Modal ── */}
      {isEditModalOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-xl w-full max-w-[80%] flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-bg-tertiary)]">
              <h2 className="text-lg font-bold">Edit Job</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--color-bg-tertiary)] flex-1">
              <form id="edit-template-form" onSubmit={handleEditSubmit}>
                <TemplateFormFields
                  formData={formData}
                  setFormData={setFormData}
                />
              </form>
            </div>
            <div className="p-5 border-t border-[var(--color-bg-tertiary)]">
              <button
                type="submit"
                form="edit-template-form"
                className="w-full bg-[var(--color-accent)] hover:bg-yellow-500 text-white py-2.5 rounded-lg font-bold transition-colors"
              >
                Update Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Manage Attachments Modal ── */}
      {isManageModalOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-bg-tertiary)] rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-[var(--color-bg-tertiary)]">
              <h2 className="text-lg font-bold">Email Attachments</h2>
              <button
                onClick={() => setIsManageModalOpen(false)}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div className="bg-[var(--color-bg-tertiary)] rounded-lg px-4 py-3">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Template Name
                </p>
                <p className="font-semibold">{selectedTemplate.name}</p>
              </div>
              {/* Attachments List */}
              <div className="space-y-2">
                {(selectedTemplate.attachments || []).length === 0 ? (
                  <p className="text-sm text-[var(--color-text-secondary)] italic text-center py-4">
                    No attachments yet.
                  </p>
                ) : (
                  selectedTemplate.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between bg-[var(--color-bg-primary)] border border-[var(--color-bg-tertiary)] rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Paperclip
                          size={14}
                          className="text-[var(--color-text-secondary)]"
                        />
                        <span className="text-sm">{att.name}</span>
                      </div>
                      <button
                        onClick={() => removeAttachment(att.id)}
                        className="text-red-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <button
                onClick={addAttachment}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[var(--color-bg-tertiary)] hover:border-[var(--color-accent)] rounded-lg py-3 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors"
              >
                <Plus size={16} />
                Add new file
              </button>
            </div>
            <div className="p-5 border-t border-[var(--color-bg-tertiary)]">
              <button
                onClick={() => setIsManageModalOpen(false)}
                className="w-full bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-accent)] hover:text-white text-[var(--color-text-primary)] py-2.5 rounded-lg font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Templates
