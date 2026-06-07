import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  highlighted?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', highlighted = false }) => {
  return (
    <div
      className={`rounded-xl border p-5 ${
        highlighted
          ? 'bg-red-900/20 border-red-500/40'
          : 'bg-[#1a2235] border-[#2a3548]'
      } ${className}`}
    >
      {children}
    </div>
  );
};
