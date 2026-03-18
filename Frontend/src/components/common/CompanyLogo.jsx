import React from 'react';

/**
 * CompanyLogo component
 * Generates a circular logo with initials from the first two words of a name.
 * 
 * @param {Object} props
 * @param {string} props.name - The company or person name
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Size class (e.g., 'w-10 h-10')
 */
const CompanyLogo = ({ name, className = "", size = "w-10 h-10" }) => {
  const getInitials = (str) => {
    if (!str) return "??";
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  // Simple hash to consistently pick a background color based on name
  const getBGColor = (str) => {
    const colors = [
      'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 
      'bg-pink-500', 'bg-red-500', 'bg-orange-500', 
      'bg-yellow-500', 'bg-green-500', 'bg-teal-500', 'bg-cyan-500'
    ];
    if (!str) return colors[0];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const bgColor = getBGColor(name);

  return (
    <div 
      className={`rounded-full flex items-center justify-center text-white font-bold tracking-tighter ${size} ${bgColor} ${className} shadow-sm border border-white/10`}
      title={name}
    >
      <span className="text-[0.9em]">{initials}</span>
    </div>
  );
};

export default CompanyLogo;
