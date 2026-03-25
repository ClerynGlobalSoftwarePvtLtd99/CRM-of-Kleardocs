import React from 'react';

const ContentLoader = ({ message = "Loading data...", className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center w-full py-12 min-h-[300px] bg-bg-secondary/30 rounded-2xl backdrop-blur-sm border border-bg-tertiary/20 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-[var(--color-bg-tertiary)] border-t-[var(--color-accent)] rounded-full animate-spin"></div>
        
        {/* Inner pulsing circle */}
        <div className="absolute w-8 h-8 bg-[var(--color-accent)]/20 rounded-full animate-pulse"></div>
      </div>
      
      <div className="mt-6 flex flex-col items-center gap-1">
        <p className="text-lg font-bold tracking-wide italic text-[var(--color-text-primary)] animate-pulse">
          {message.toUpperCase()}
        </p>
        <div className="h-1 w-24 bg-bg-tertiary rounded-full overflow-hidden">
          <div className="h-full bg-[var(--color-accent)] animate-[loading-bar_1.5s_infinite_ease-in-out]"></div>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 50%; transform: translateX(50%); }
          100% { width: 0%; transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default ContentLoader;
