import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizeClasses = {
    sm: 'text-sm px-3.5 py-2 min-h-[40px] gap-1.5',
    md: 'text-base px-5 py-3 min-h-[48px] gap-2 shadow-sm',
    lg: 'text-lg px-6 py-4 min-h-[56px] gap-2.5 shadow-md',
  };

  const variantClasses = {
    primary: 'bg-brand-900 hover:bg-brand-800 text-white shadow-brand-900/20 focus:ring-2 focus:ring-brand-900 focus:ring-offset-2',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-2 focus:ring-slate-300',
    outline: 'bg-white border-2 border-slate-300 hover:bg-slate-50 text-slate-800 focus:ring-2 focus:ring-slate-200',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};
