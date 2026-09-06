import React from 'react';
import { SpotCategory } from '@/types';
import { Waves, Mountain, Flame, Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: SpotCategory;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  className,
  size = 'md',
}) => {
  const getCategoryConfig = (cat: SpotCategory) => {
    switch (cat) {
      case 'Waterfall':
        return {
          icon: Waves,
          bg: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]',
          dot: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]',
        };
      case 'Cave & Hill':
        return {
          icon: Mountain,
          bg: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
          dot: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
        };
      case 'Thermal Spring':
        return {
          icon: Flame,
          bg: 'bg-orange-950/70 text-[#FF6B4A] border-orange-500/30 shadow-[0_0_12px_rgba(255,107,74,0.2)]',
          dot: 'bg-[#FF6B4A] shadow-[0_0_8px_#FF6B4A]',
        };
      case 'Park & Heritage':
        return {
          icon: Landmark,
          bg: 'bg-amber-950/70 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
          dot: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]',
        };
      default:
        return {
          icon: Mountain,
          bg: 'bg-slate-900/80 text-slate-300 border-slate-700/50',
          dot: 'bg-slate-400',
        };
    }
  };

  const config = getCategoryConfig(category);
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    md: 'text-xs font-semibold px-3 py-1 gap-2',
    lg: 'text-sm font-bold px-3.5 py-1.5 gap-2.5',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border backdrop-blur-md transition-all duration-200',
        config.bg,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dot)} />
      <Icon size={iconSizes[size]} className="shrink-0" />
      <span>{category}</span>
    </span>
  );
};

export default CategoryBadge;
