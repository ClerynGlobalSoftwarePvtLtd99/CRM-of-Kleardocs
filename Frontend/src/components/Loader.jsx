import React from 'react'

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--color-bg-primary)] z-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-[var(--color-bg-tertiary)] border-t-[var(--color-accent)] rounded-full animate-spin"></div>
        <p className="mt-4 text-[var(--color-text-secondary)] font-medium text-lg animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  )
}

export default Loader
