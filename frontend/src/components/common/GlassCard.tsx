import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'hero' | 'unlocked';
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'hero',
  className = '',
}) => {
  const variantClass = variant === 'unlocked' ? 'glass-unlocked' : 'glass-hero';

  return (
    <div className={`rounded-3xl p-6 transition-all duration-300 ${variantClass} ${className}`}>
      {children}
    </div>
  );
};
