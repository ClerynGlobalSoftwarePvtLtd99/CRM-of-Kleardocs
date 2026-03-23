import Lead, { LeadHistory } from "../models/Lead.model.js";
import Customer, { CustomerCompliance } from "../models/Customer.model.js";
import Invoice, { InvoicePayment } from "../models/Invoice.model.js";
import Job from "../models/Job.model.js";

const getDateMatch = (startDate, endDate, dateField = "createdAt") => {
  const match = {};
  if (startDate || endDate) {
    match[dateField] = {};
    if (startDate) match[dateField].$gte = new Date(startDate);
    if (endDate) match[dateField].$lte = new Date(`${endDate}T23:59:59.999Z`);
  }
  return match;
};

export const getLeadStats = async (startDate, endDate) => {
  const dateMatch = getDateMatch(startDate, endDate);

  const total = await Lead.countDocuments({ ...dateMatch, isCustomer: false });
  // 'new' might simply be leads within recent x days or just total created in range if range is current month
  // We'll use the total in the date range as 'new' plus checking some status if applicable. Let's just use all created in range as 'new'
  const newLeads = await Lead.countDocuments({ ...dateMatch, isCustomer: false }); 
  
  const hot = await Lead.countDocuments({ ...dateMatch, isCustomer: false, type: "Hot" });
  const cold = await Lead.countDocuments({ ...dateMatch, isCustomer: false, type: "Cold" });

  const interacted = await LeadHistory.countDocuments({ ...dateMatch, type: "interaction" });

  return {
    total,
    new: newLeads,
    interacted,
    hot,
    cold
  };
};

export const getCustomerStats = async (startDate, endDate) => {
  const dateMatch = getDateMatch(startDate, endDate, "onboardingDate");
  const total = await Customer.countDocuments({ ...dateMatch, active: true });
  
  // Customers with annual compliance
  // Assuming CustomerCompliance has a reference to Customer
  const customersWithCompliance = await CustomerCompliance.distinct("customer", { ...getDateMatch(startDate, endDate) });
  
  return {
    total,
    withAnnualCompliance: customersWithCompliance.length
  };
};

export const getSalesStats = async (startDate, endDate) => {
  const invoiceMatch = getDateMatch(startDate, endDate, "invoiceDate");
  const paymentMatch = getDateMatch(startDate, endDate, "paymentDate");

  const totalInvoices = await Invoice.countDocuments(invoiceMatch);
  
  const invoicesAgg = await Invoice.aggregate([
    { $match: invoiceMatch },
    { $group: { _id: null, totalSales: { $sum: "$total" }, totalDues: { $sum: "$due" } } }
  ]);
  
  const totalSales = invoicesAgg[0]?.totalSales || 0;
  const totalDues = invoicesAgg[0]?.totalDues || 0;

  const unpaidPartialInvoices = await Invoice.countDocuments({ ...invoiceMatch, due: { $gt: 0 } });

  const totalPaymentsCount = await InvoicePayment.countDocuments(paymentMatch);
  const paymentsAgg = await InvoicePayment.aggregate([
    { $match: paymentMatch },
    { $group: { _id: null, paymentReceived: { $sum: "$amount" } } }
  ]);
  const paymentReceived = paymentsAgg[0]?.paymentReceived || 0;

  return {
    totalInvoices,
    totalSales,
    totalPayments: totalPaymentsCount,
    paymentReceived,
    unpaidPartialInvoices,
    totalDues
  };
};

export const getComplianceJobStats = async (startDate, endDate) => {
  const complianceMatch = getDateMatch(startDate, endDate);
  const jobMatch = getDateMatch(startDate, endDate);

  const now = new Date();

  const expiredNotDoneCompliances = await CustomerCompliance.countDocuments({ 
    ...complianceMatch, 
    status: { $in: ["To Be Done", "Ongoing"] },
    expiryDate: { $lt: now }
  });

  const notDoneCompliances = await CustomerCompliance.countDocuments({ 
    ...complianceMatch, 
    status: "To Be Done" 
  });

  const ongoingCompliances = await CustomerCompliance.countDocuments({ 
    ...complianceMatch, 
    status: "Ongoing" 
  });

  const expiredNotDoneJobs = await Job.countDocuments({ 
    ...jobMatch, 
    status: { $in: ["To Be Done", "Ongoing"] },
    hasExpiry: true,
    expiryDate: { $lt: now }
  });

  const notDoneJobs = await Job.countDocuments({ 
    ...jobMatch, 
    status: "To Be Done" 
  });

  const ongoingJobs = await Job.countDocuments({ 
    ...jobMatch, 
    status: "Ongoing" 
  });

  return {
    expiredNotDoneCompliances,
    notDoneCompliances,
    ongoingCompliances,
    expiredNotDoneJobs,
    notDoneJobs,
    ongoingJobs
  };
};

export const getGraphStats = async (startDate, endDate) => {
  const dateMatch = getDateMatch(startDate, endDate);
  const interactionMatch = getDateMatch(startDate, endDate);
  interactionMatch.type = "interaction";

  const dailyLeadsAgg = await Lead.aggregate([
    { $match: { ...dateMatch, isCustomer: false } },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $project: { _id: 0, date: "$_id", count: 1 } },
    { $sort: { date: 1 } }
  ]);

  const dailyInteractionsAgg = await LeadHistory.aggregate([
    { $match: interactionMatch },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
    { $project: { _id: 0, date: "$_id", count: 1 } },
    { $sort: { date: 1 } }
  ]);

  const dailySalesAgg = await Invoice.aggregate([
    { $match: getDateMatch(startDate, endDate, "invoiceDate") },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$invoiceDate" } }, amount: { $sum: "$total" }, count: { $sum: 1 } } },
    { $project: { _id: 0, date: "$_id", amount: 1, count: 1 } },
    { $sort: { date: 1 } }
  ]);

  return {
    dailyLeads: dailyLeadsAgg,
    dailyInteractions: dailyInteractionsAgg,
    dailySales: dailySalesAgg.map(i => ({ date: i.date, amount: i.amount })),
    dailySalesCount: dailySalesAgg.map(i => ({ date: i.date, count: i.count }))
  };
};