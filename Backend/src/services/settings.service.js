import EmailLog from "../models/EmailLog.model.js";

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
