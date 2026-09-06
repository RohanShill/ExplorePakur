'use client';

import React from 'react';
import { MessageSquareShare } from 'lucide-react';
import { buildWhatsAppLink, cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  phone?: string;
  message: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'compact';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  spotTitle?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phone = '919431100001', // Default verified Pakur Eco-Tourism Helpdesk / Taxi network
  message,
  label = 'Book Taxi / Guide',
  variant = 'primary',
  size = 'md',
  className,
  spotTitle,
}) => {
  const defaultText = spotTitle
    ? `Johar! I am planning to visit *${spotTitle}* in Pakur district. Please help me with local taxi booking and guide arrangements.`
    : message;

  const url = buildWhatsAppLink(phone, defaultText);

  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-95 shadow-sm group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2';

  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-emerald-600/30',
    secondary: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200',
    outline: 'border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-300 dark:hover:bg-emerald-950/40',
    compact: 'bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg p-2',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-5 py-3 gap-2.5 font-semibold',
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} via WhatsApp`}
      className={cn(baseStyles, variants[variant], variant !== 'compact' && sizes[size], className)}
    >
      <MessageSquareShare className={cn('shrink-0 transition-transform group-hover:scale-110', size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />
      {variant !== 'compact' && <span>{label}</span>}
    </a>
  );
};

export default WhatsAppButton;
