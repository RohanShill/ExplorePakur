import React from "react";
import { SpotCategory } from "@/types";
import { Waves, Mountain, Flame, Landmark, Store } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: SpotCategory;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  className,
  size = "md",
}) => {
  const getCategoryConfig = (cat: SpotCategory) => {
    switch (cat) {
      case "Waterfall":
        return { icon: Waves,    cls: "badge-waterfall" };
      case "Cave & Hill":
        return { icon: Mountain, cls: "badge-cave" };
      case "Thermal Spring":
        return { icon: Flame,    cls: "badge-hotspring" };
      case "Park & Heritage":
        return { icon: Landmark, cls: "badge-heritage" };
      case "Local Market & Culture":
        return { icon: Store,    cls: "badge-park" };
      default:
        return { icon: Mountain, cls: "badge-default" };
    }
  };

  const { icon: Icon, cls } = getCategoryConfig(category);

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-[11px] font-semibold px-2.5 py-1 gap-1.5",
    lg: "text-xs font-semibold px-3 py-1.5 gap-2",
  };

  const iconSizes = { sm: 11, md: 13, lg: 15 };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border backdrop-blur-md font-body transition-all",
        cls,
        sizeClasses[size],
        className
      )}
    >
      <Icon size={iconSizes[size]} className="shrink-0" />
      <span>{category}</span>
    </span>
  );
};

export default CategoryBadge;
