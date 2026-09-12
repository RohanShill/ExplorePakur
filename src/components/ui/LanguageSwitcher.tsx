"use client";

import React, { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  variant?: "desktop" | "mobile" | "compact";
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = "desktop",
  className = "",
}) => {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const [isPending, startTransition] = useTransition();

  // Detect active locale from pathname: e.g. /en/... or /hi/...
  const currentLocale = pathname.startsWith("/hi") ? "hi" : "en";

  const handleLanguageChange = (targetLocale: "en" | "hi") => {
    if (targetLocale === currentLocale) return;

    // Set persistence cookie
    if (typeof document !== "undefined") {
      document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }

    // Build target pathname
    let targetPath: string;
    if (pathname.startsWith("/en")) {
      targetPath = pathname.replace(/^\/en/, `/${targetLocale}`);
    } else if (pathname.startsWith("/hi")) {
      targetPath = pathname.replace(/^\/hi/, `/${targetLocale}`);
    } else {
      targetPath = `/${targetLocale}${pathname === "/" ? "" : pathname}`;
    }

    // Preserve query parameters if present in browser
    const queryString = typeof window !== "undefined" && window.location.search ? window.location.search : "";
    const finalUrl = `${targetPath}${queryString}`;

    startTransition(() => {
      router.push(finalUrl);
    });
  };

  if (variant === "mobile") {
    return (
      <div
        className={`flex items-center justify-between p-2 rounded-xl bg-[rgba(13,25,18,0.9)] border border-[rgba(212,169,66,0.2)] ${className}`}
        role="region"
        aria-label="Language selection"
      >
        <div className="flex items-center gap-2 text-xs text-[#7A9180] font-body pl-1">
          <Globe size={14} className="text-[#D4A942]" />
          <span>Language / भाषा</span>
        </div>
        <div className="flex items-center gap-1 bg-[rgba(3,8,6,0.8)] p-1 rounded-lg border border-[rgba(212,169,66,0.15)]">
          <button
            type="button"
            onClick={() => handleLanguageChange("en")}
            disabled={isPending}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all font-body ${
              currentLocale === "en"
                ? "bg-[#D4A942] text-[#030806] shadow-sm font-bold"
                : "text-[#7A9180] hover:text-[#F5F0E8]"
            }`}
            aria-pressed={currentLocale === "en"}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange("hi")}
            disabled={isPending}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all font-body ${
              currentLocale === "hi"
                ? "bg-[#D4A942] text-[#030806] shadow-sm font-bold"
                : "text-[#7A9180] hover:text-[#F5F0E8]"
            }`}
            aria-pressed={currentLocale === "hi"}
          >
            हिंदी
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center bg-[rgba(13,25,18,0.85)] border border-[rgba(212,169,66,0.25)] rounded-full p-1 shadow-[0_2px_12px_rgba(0,0,0,0.5)] backdrop-blur-md ${className}`}
      role="region"
      aria-label="Language selector"
    >
      <div className="pl-2 pr-1 text-[#D4A942]">
        <Globe size={13} />
      </div>
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => handleLanguageChange("en")}
          disabled={isPending}
          className={`px-2.5 py-1 rounded-full text-xs transition-all font-body ${
            currentLocale === "en"
              ? "bg-gradient-to-r from-[#D4A942] to-[#E8C060] text-[#030806] font-bold shadow-sm"
              : "text-[#7A9180] hover:text-[#F5F0E8] font-medium"
          }`}
          aria-pressed={currentLocale === "en"}
        >
          EN
        </button>
        <span className="text-[#4A6254] text-[10px]">|</span>
        <button
          type="button"
          onClick={() => handleLanguageChange("hi")}
          disabled={isPending}
          className={`px-2.5 py-1 rounded-full text-xs transition-all font-body ${
            currentLocale === "hi"
              ? "bg-gradient-to-r from-[#D4A942] to-[#E8C060] text-[#030806] font-bold shadow-sm"
              : "text-[#7A9180] hover:text-[#F5F0E8] font-medium"
          }`}
          aria-pressed={currentLocale === "hi"}
        >
          हिंदी
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
