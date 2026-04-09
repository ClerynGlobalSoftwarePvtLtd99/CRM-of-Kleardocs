import Lead, { LeadHistory } from "../models/Lead.model.js";
import Customer, { CustomerCompliance } from "../models/Customer.model.js";
import Invoice, { InvoicePayment } from "../models/Invoice.model.js";
import Job from "../models/Job.model.js";

const getDateMatch = (startDate, endDate, dateField = "createdAt") => {
  const match = {};
  if (startDate || endDate) {
    match[dateField] = {};
    if (startDate) {
      // Ensure we start at the very beginning of the startDate (00:00:00 local-ish / UTC normalized)
      const s = new Date(startDate);
      s.setUTCHours(0, 0, 0, 0);
      match[dateField].$gte = s;
    }
    if (endDate) {
      // Ensure we go to the very end of the endDate
      const e = new Date(endDate);
      e.setUTCHours(23, 59, 59, 999);
      match[dateField].$lte = e;
    }
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

  let periodMatch, prevPeriodMatch;
  let prevTotalDateMatch;

  if (startDate && endDate) {
    const sDate = new Date(startDate);
    const eDate = new Date(`${endDate}T23:59:59.999Z`);
    const duration = eDate.getTime() - sDate.getTime();
    
    periodMatch = dateMatch;
    // Previous period of same duration
    const pEndDate = new Date(sDate.getTime() - 1);
    const pStartDate = new Date(sDate.getTime() - duration - 1);
    prevPeriodMatch = { createdAt: { $gte: pStartDate, $lte: pEndDate } };
    
    // For "total" metrics, "previous" usually means up to the start of the current period
    prevTotalDateMatch = { createdAt: { $lt: sDate } };
  } else {
    periodMatch = { createdAt: { $gte: thirtyDaysAgo } };
    prevPeriodMatch = { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } };
    prevTotalDateMatch = { createdAt: { $lt: thirtyDaysAgo } };
  }

  // Current stats (Cumulative for Total/Status, Period-specific for New/Interactions)
  console.log("DEBUG: getLeadStats dateMatch:", JSON.stringify(dateMatch));
  console.log("DEBUG: getLeadStats periodMatch:", JSON.stringify(periodMatch));
  
  const total = await Lead.countDocuments({}); 
  const newLeads = await Lead.countDocuments(periodMatch);
  const interactedLeads = await LeadHistory.distinct("lead", { ...periodMatch, type: "interaction" }).then(res => res.length);
  const hot = await Lead.countDocuments({ type: "Hot" });
  const cold = await Lead.countDocuments({ type: "Cold" });

  console.log(`DEBUG: Counts - Total: ${total}, New: ${newLeads}, Hot: ${hot}, Cold: ${cold}`);

  // Previous stats for trends
  const prevDateMatchForTotal = startDate && endDate ? { createdAt: { $lt: new Date(startDate) } } : { createdAt: { $lt: thirtyDaysAgo } };
  const prevTotalAllTime = await Lead.countDocuments({ ...prevDateMatchForTotal });
  const prevNewLeads = await Lead.countDocuments(prevPeriodMatch);
  const prevInteracted = await LeadHistory.distinct("lead", { ...prevPeriodMatch, type: "interaction" }).then(res => res.length);
  const prevHot = await Lead.countDocuments({ type: "Hot", ...prevTotalDateMatch });
  const prevCold = await Lead.countDocuments({ type: "Cold", ...prevTotalDateMatch });

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

  // Current stats (Cumulative for Total, Period-specific for Compliance if needed, but usually cumulative is preferred for status cards)
  const total = await Customer.countDocuments({ active: true });
  const customersWithCompliance = await CustomerCompliance.distinct("customer");
  const withAnnualCompliance = customersWithCompliance.length;
  
  console.log(`DEBUG: Customer Counts - Total: ${total}, Compliance: ${withAnnualCompliance}`);

  // Previous stats for trends
  let prevDateMatch, prevComplianceMatch;

  if (startDate && endDate) {
    const sDate = new Date(startDate);
    const eDate = new Date(`${endDate}T23:59:59.999Z`);
    const duration = eDate.getTime() - sDate.getTime();

    // Previous total: customers onboarded before current period
    prevDateMatch = { onboardingDate: { $lt: sDate } };

    // Previous compliance: compliances in the previous period of same duration
    const pEndDate = new Date(sDate.getTime() - 1);
    const pStartDate = new Date(sDate.getTime() - duration - 1);
    prevComplianceMatch = { createdAt: { $gte: pStartDate, $lte: pEndDate } };
  } else {
    prevDateMatch = { onboardingDate: { $lt: thirtyDaysAgo } };
    prevComplianceMatch = { createdAt: { $lt: thirtyDaysAgo } };
  }
  
  const prevTotal = await Customer.countDocuments({ ...prevDateMatch, active: true });
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

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Current stats
  const totalInvoicesCount = await Invoice.countDocuments(invoiceMatch);
  
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

  // Previous stats for trends
  let prevDateMatch, prevPaymentDateMatch;

  if (startDate && endDate) {
    const sDate = new Date(startDate);
    const eDate = new Date(`${endDate}T23:59:59.999Z`);
    const duration = eDate.getTime() - sDate.getTime();

    const pEndDate = new Date(sDate.getTime() - 1);
    const pStartDate = new Date(sDate.getTime() - duration - 1);

    prevDateMatch = { invoiceDate: { $gte: pStartDate, $lte: pEndDate } };
    prevPaymentDateMatch = { paymentDate: { $gte: pStartDate, $lte: pEndDate } };
  } else {
    prevDateMatch = { invoiceDate: { $lt: thirtyDaysAgo } };
    prevPaymentDateMatch = { paymentDate: { $lt: thirtyDaysAgo } };
  }
  
  const prevInvoicesAgg = await Invoice.aggregate([
    { $match: prevDateMatch },
    { $group: { _id: null, totalSales: { $sum: "$total" }, totalDues: { $sum: "$due" } } }
  ]);
  const prevTotalSales = prevInvoicesAgg[0]?.totalSales || 0;
  const prevTotalDues = prevInvoicesAgg[0]?.totalDues || 0;

  const prevUnpaidPartialInvoices = await Invoice.countDocuments({ ...prevDateMatch, due: { $gt: 0 } });

  const prevPaymentsAgg = await InvoicePayment.aggregate([
    { $match: prevPaymentDateMatch },
    { $group: { _id: null, paymentReceived: { $sum: "$amount" } } }
  ]);
  const prevPaymentReceived = prevPaymentsAgg[0]?.paymentReceived || 0;

  const trendTotalSales = getPercentChange(totalSales, prevTotalSales);
  const trendTotalDues = getPercentChange(totalDues, prevTotalDues);
  const trendUnpaid = getPercentChange(unpaidPartialInvoices, prevUnpaidPartialInvoices);
  const trendPaymentReceived = getPercentChange(paymentReceived, prevPaymentReceived);

  return {
    totalInvoices: { value: totalInvoicesCount, trend: 'up', trendValue: null },
    totalSales: { value: totalSales, trend: trendTotalSales >= 0 ? 'up' : 'down', trendValue: Math.abs(trendTotalSales) },
    totalPayments: { value: totalPaymentsCount, trend: 'up', trendValue: null },
    paymentReceived: { value: paymentReceived, trend: trendPaymentReceived >= 0 ? 'up' : 'down', trendValue: Math.abs(trendPaymentReceived) },
    unpaidPartialInvoices: { value: unpaidPartialInvoices, trend: trendUnpaid >= 0 ? 'up' : 'down', trendValue: Math.abs(trendUnpaid) },
    totalDues: { value: totalDues, trend: trendTotalDues >= 0 ? 'up' : 'down', trendValue: Math.abs(trendTotalDues) }
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
    status: { $in: ["To be done", "Ongoing"] },
    hasExpiry: true,
    expiryDate: { $lt: now }
  });

  const notDoneJobs = await Job.countDocuments({ 
    ...jobMatch, 
    status: "To be done" 
  });

  const ongoingJobs = await Job.countDocuments({ 
    ...jobMatch, 
    status: "Ongoing" 
  });

  return {
    expiredNotDoneCompliances: { value: expiredNotDoneCompliances },
    notDoneCompliances: { value: notDoneCompliances },
    ongoingCompliances: { value: ongoingCompliances },
    expiredNotDoneJobs: { value: expiredNotDoneJobs },
    notDoneJobs: { value: notDoneJobs },
    ongoingJobs: { value: ongoingJobs }
  };
};

const fillDateGaps = (data, startDate, endDate, valueKey = "count", defaultValue = 0) => {
  const result = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const map = new Map(data.map(item => [item.date, item[valueKey]]));

  const current = new Date(start);
  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    result.push({
      date: dateStr,
      [valueKey]: map.has(dateStr) ? map.get(dateStr) : defaultValue
    });
    current.setDate(current.getDate() + 1);
  }
  return result;
};

export const getGraphStats = async (startDate, endDate) => {
  const now = new Date();
  const sDate = startDate || new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const eDate = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const dateMatch = getDateMatch(sDate, eDate);
  const interactionMatch = getDateMatch(sDate, eDate);
  interactionMatch.type = "interaction";

  const dailyLeadsAgg = await Lead.aggregate([
    { $match: { ...dateMatch, isCustomer: { $ne: true } } },
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
    { $match: getDateMatch(sDate, eDate, "invoiceDate") },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$invoiceDate" } }, amount: { $sum: "$total" }, count: { $sum: 1 } } },
    { $project: { _id: 0, date: "$_id", amount: 1, count: 1 } },
    { $sort: { date: 1 } }
  ]);

  return {
    dailyLeads: fillDateGaps(dailyLeadsAgg, sDate, eDate, "count"),
    dailyInteractions: fillDateGaps(dailyInteractionsAgg, sDate, eDate, "count"),
    dailySales: fillDateGaps(dailySalesAgg, sDate, eDate, "amount"),
    dailySalesCount: fillDateGaps(dailySalesAgg, sDate, eDate, "count")
  };
};

export const getComparisonStats = async (start1, end1, start2, end2) => {
  const data1 = await getGraphStats(start1, end1);
  const data2 = await getGraphStats(start2, end2);

  const format = (d1, d2, key) => {
    const maxLength = Math.max(d1.length, d2.length);
    const combined = [];
    for (let i = 0; i < maxLength; i++) {
        combined.push({
            day: `Day ${i + 1}`,
            range1: d1[i] ? d1[i][key] : 0,
            range2: d2[i] ? d2[i][key] : 0
        });
    }
    return combined;
  };

  return {
    leads: format(data1.dailyLeads, data2.dailyLeads, 'count'),
    interactions: format(data1.dailyInteractions, data2.dailyInteractions, 'count'),
    sales: format(data1.dailySales, data2.dailySales, 'amount'),
    salesCount: format(data1.dailySalesCount, data2.dailySalesCount, 'count')
  };
};