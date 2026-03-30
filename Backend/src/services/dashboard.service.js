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

const getPercentChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

export const getLeadStats = async (startDate, endDate) => {
  const dateMatch = getDateMatch(startDate, endDate);

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const periodMatch = (startDate || endDate) ? dateMatch : { createdAt: { $gte: thirtyDaysAgo } };
  const prevPeriodMatch = (startDate || endDate) 
    ? { createdAt: { $gte: new Date(0) } } // Fallback if dates are provided but we want to avoid complex math
    : { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } };

  // Current stats
  const total = await Lead.countDocuments({ ...dateMatch, isCustomer: { $ne: true } });
  const newLeads = await Lead.countDocuments({ ...periodMatch, isCustomer: { $ne: true } });
  const interactedLeads = await LeadHistory.distinct("lead", { ...periodMatch, type: "interaction" }).then(res => res.length);
  const hot = await Lead.countDocuments({ ...dateMatch, isCustomer: { $ne: true }, type: "Hot" });
  const cold = await Lead.countDocuments({ ...dateMatch, isCustomer: { $ne: true }, type: "Cold" });

  // Previous stats (for trends vs last 30 days)
  const prevTotalAllTime = await Lead.countDocuments({ isCustomer: { $ne: true }, createdAt: { $lt: thirtyDaysAgo } });
  const prevNewLeads = await Lead.countDocuments({ ...prevPeriodMatch, isCustomer: { $ne: true } });
  const prevInteracted = await LeadHistory.distinct("lead", { ...prevPeriodMatch, type: "interaction" }).then(res => res.length);
  const prevHot = await Lead.countDocuments({ isCustomer: { $ne: true }, type: "Hot", createdAt: { $lt: thirtyDaysAgo } });
  const prevCold = await Lead.countDocuments({ isCustomer: { $ne: true }, type: "Cold", createdAt: { $lt: thirtyDaysAgo } });

  const trendTotal = getPercentChange(total, prevTotalAllTime);
  const trendNew = getPercentChange(newLeads, prevNewLeads);
  const trendInteracted = getPercentChange(interactedLeads, prevInteracted);
  const trendHot = getPercentChange(hot, prevHot);
  const trendCold = getPercentChange(cold, prevCold);

  return {
    totalLeads: { value: total, trend: trendTotal >= 0 ? 'up' : 'down', trendValue: Math.abs(trendTotal) },
    newLeads: { value: newLeads, trend: trendNew >= 0 ? 'up' : 'down', trendValue: Math.abs(trendNew) },
    interactedLeads: { value: interactedLeads, trend: trendInteracted >= 0 ? 'up' : 'down', trendValue: Math.abs(trendInteracted) },
    hotLeads: { value: hot, trend: trendHot >= 0 ? 'up' : 'down', trendValue: Math.abs(trendHot) },
    coldLeads: { value: cold, trend: trendCold >= 0 ? 'up' : 'down', trendValue: Math.abs(trendCold) }
  };
};

export const getCustomerStats = async (startDate, endDate) => {
  const dateMatch = getDateMatch(startDate, endDate, "onboardingDate");

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Current stats
  const total = await Customer.countDocuments({ ...dateMatch, active: true });
  const customersWithCompliance = await CustomerCompliance.distinct("customer", { ...getDateMatch(startDate, endDate) });
  const withAnnualCompliance = customersWithCompliance.length;

  // Previous stats for trends
  const prevDateMatch = (startDate || endDate) 
    ? { onboardingDate: { $gte: new Date(0) } } 
    : { onboardingDate: { $lt: thirtyDaysAgo } };
  
  const prevTotal = await Customer.countDocuments({ ...prevDateMatch, active: true });

  const prevComplianceMatch = (startDate || endDate) 
    ? { createdAt: { $gte: new Date(0) } } 
    : { createdAt: { $lt: thirtyDaysAgo } };
  const prevCustomersWithCompliance = await CustomerCompliance.distinct("customer", prevComplianceMatch);
  const prevWithAnnualCompliance = prevCustomersWithCompliance.length;

  const trendTotal = getPercentChange(total, prevTotal);
  const trendCompliance = getPercentChange(withAnnualCompliance, prevWithAnnualCompliance);

  return {
    totalCustomers: { value: total, trend: trendTotal >= 0 ? 'up' : 'down', trendValue: Math.abs(trendTotal) },
    withAnnualCompliance: { value: withAnnualCompliance, trend: trendCompliance >= 0 ? 'up' : 'down', trendValue: Math.abs(trendCompliance) }
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