/**
 * Utility: Current Financial Year (Apr 1 – Mar 31 rule) 
 * Apr 1, 2026 – Mar 31, 2027  →  "2026-2027"
 * 
 * @returns {string} The current financial year in "YYYY-YYYY" format
 */
export const getCurrentFinancialYear = () => {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed; April = 3
  const year = now.getFullYear();
  return month >= 3 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};
