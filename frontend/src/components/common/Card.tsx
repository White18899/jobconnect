import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft transition-all duration-200 ${
        hoverEffect ? 'hover:border-slate-300 hover:shadow-soft-lg active:scale-[0.99] cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
