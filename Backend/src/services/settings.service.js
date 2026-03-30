import EmailLog from "../models/EmailLog.model.js";
import SystemSetting from "../models/SystemSetting.model.js";

const getDateMatch = (startDate, endDate) => {
  const match = {};
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(`${endDate}T23:59:59.999Z`);
  }
  return match;
};

export const getEmailCountStats = async (startDate, endDate) => {
  const match = getDateMatch(startDate, endDate);

  const total = await EmailLog.countDocuments(match);
  
  const dailyAgg = await EmailLog.aggregate([
    { $match: match },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, count: { $sum: 1 } } },
    { $project: { _id: 0, date: "$_id", count: 1 } },
    { $sort: { date: 1 } }
  ]);

  return {
    total,
    data: dailyAgg
  };
};

export const getSystemSettings = async () => {
  let settings = await SystemSetting.findOne();
  if (!settings) {
    settings = await SystemSetting.create({});
  }
  return settings;
};

export const updateSystemSettings = async (data) => {
  let settings = await SystemSetting.findOne();
  if (!settings) {
    settings = new SystemSetting({});
  }
  
  const fields = [
    "invoicePrefix", "invoiceStartingNumber", "emailFromName", "fromEmail",
    "invoiceTemplate", "gstTemplate", "ptaxTemplate", "startupIndiaTemplate",
    "inc20Template", "recurringInvoiceTemplate", "serviceListTemplate",
    "websiteTemplate", "isoTemplate", "firmName", "firmRegistrationNumber",
    "firmAddress", "proprietorName", "membershipNumber"
  ];

  for (const f of fields) {
      if (data[f] !== undefined) settings[f] = data[f];
  }

  await settings.save();
  return settings;
};
