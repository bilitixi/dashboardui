import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Card({ children, className = '', title }: CardProps) {
  return (
    <div className={`bg-[#151f2e] border border-gray-700/50 rounded-xl p-4 ${className}`}>
      {title && <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>}
      {children}
    </div>
  );
}
