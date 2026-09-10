"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Camera,
  Sparkles,
  Layers,
} from "lucide-react";

interface InteractivePhotoGalleryProps {
  spotTitle: string;
  coverImage?: string;
  galleryImages: string[];
}

export default function InteractivePhotoGallery({
  spotTitle,
  coverImage,
  galleryImages = [],
}: InteractivePhotoGalleryProps) {
  // Combine cover image and gallery images, eliminating duplicates
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (coverImage && coverImage.trim()) {
      list.push(coverImage.trim());
    }
    if (Array.isArray(galleryImages)) {
      galleryImages.forEach((img) => {
        if (img && img.trim() && !list.includes(img.trim())) {
          list.push(img.trim());
        }
      });
    }
    return list;
  }, [coverImage, galleryImages]);

  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Touch swipe handling for mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsZoomed(false);
    setIsOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    setIsZoomed(false);
    if (typeof document !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const nextImage = useCallback(() => {
    if (allImages.length <= 1) return;
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    if (allImages.length <= 1) return;
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  // Keyboard navigation & lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeLightbox, nextImage, prevImage]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Horizontal swipe threshold 40px and dominant over vertical scroll
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const toggleFullscreen = () => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  if (allImages.length === 0) return null;

  return (
    <>
      {/* Photo Gallery Grid on Page */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera size={18} className="text-[#D4A942]" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#F5F0E8]">
              Photo Gallery
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[rgba(212,169,66,0.12)] border border-[rgba(212,169,66,0.25)] text-[#D4A942] font-semibold font-body">
              {allImages.length} {allImages.length === 1 ? "Photo" : "Photos"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="text-xs font-semibold text-[#D4A942] hover:text-[#E8C060] flex items-center gap-1.5 transition-colors font-body group cursor-pointer"
          >
            <Maximize2 size={13} className="group-hover:scale-110 transition-transform" />
            <span>Open Slideshow</span>
          </button>
        </div>

        {/* Responsive Grid of Images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {allImages.map((img, i) => (
            <div
              key={i}
              onClick={() => openLightbox(i)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-[rgba(212,169,66,0.18)] hover:border-[#D4A942] bg-[var(--bg-elevated)] cursor-pointer transition-all duration-300 shadow-md hover:shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
              role="button"
              tabIndex={0}
              aria-label={`View photo ${i + 1} of ${spotTitle}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openLightbox(i);
              }}
            >
              <img
                src={img}
                alt={`${spotTitle} photo ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                loading="lazy"
              />

              {/* Dark Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-40 group-hover:opacity-85 transition-opacity duration-300" />

              {/* Pop Zoom Hover Indicator Badge */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(13,25,18,0.92)] border border-[rgba(212,169,66,0.6)] backdrop-blur-md shadow-2xl text-[#F5F0E8] text-xs font-semibold font-body">
                  <ZoomIn size={14} className="text-[#D4A942]" />
                  <span>Click to Zoom &amp; Slide</span>
                </div>
              </div>

              {/* Image Number Badge */}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 text-[10px] text-[#F5F0E8] font-body">
                {i === 0 ? "Cover Photo" : `Photo ${i + 1}`}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pop Zoom Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#030806]/95 backdrop-blur-2xl animate-fade-in select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Control Bar */}
          <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-b from-black/90 to-transparent">
            <div className="space-y-0.5 max-w-[60%] sm:max-w-[70%]">
              <h4 className="font-serif text-sm sm:text-base font-bold text-[#F5F0E8] truncate">
                {spotTitle}
              </h4>
              <p className="text-xs text-[#D4A942] font-semibold font-body flex items-center gap-2">
                <span>Photo {currentIndex + 1} of {allImages.length}</span>
                <span className="text-[#4A6254]">•</span>
                <span className="text-[#7A9180] hidden sm:inline text-[11px]">Swipe or use Left/Right arrow keys</span>
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                title={isZoomed ? "Zoom Out" : "Zoom In (or double click photo)"}
                className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isZoomed
                    ? "bg-[#D4A942] text-[#030806] border-[#D4A942]"
                    : "bg-[rgba(13,25,18,0.85)] border-[rgba(212,169,66,0.25)] text-[#F5F0E8] hover:text-[#D4A942] hover:border-[#D4A942]"
                }`}
              >
                {isZoomed ? <ZoomOut size={17} /> : <ZoomIn size={17} />}
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                title="Toggle Fullscreen"
                className="hidden sm:flex p-2.5 rounded-xl bg-[rgba(13,25,18,0.85)] border border-[rgba(212,169,66,0.25)] text-[#F5F0E8] hover:text-[#D4A942] hover:border-[#D4A942] transition-all cursor-pointer"
              >
                {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
              </button>

              <button
                type="button"
                onClick={closeLightbox}
                title="Close (Esc)"
                className="p-2 sm:p-2.5 rounded-xl bg-[rgba(232,99,74,0.18)] border border-[rgba(232,99,74,0.35)] text-[#F5F0E8] hover:bg-[rgba(232,99,74,0.4)] hover:text-white transition-all ml-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Central Main Viewport */}
          <div
            className="relative flex-1 flex items-center justify-center px-3 sm:px-16 overflow-hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeLightbox();
            }}
          >
            {/* Previous Arrow Button */}
            {allImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                title="Previous Image (Left Arrow or Swipe Right)"
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-[rgba(13,25,18,0.85)] border border-[rgba(212,169,66,0.3)] text-[#F5F0E8] hover:text-[#D4A942] hover:border-[#D4A942] hover:scale-110 active:scale-95 transition-all shadow-[0_4px_25px_rgba(0,0,0,0.8)] backdrop-blur-md cursor-pointer"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Active Image with Pop-Zoom Animation */}
            <div
              key={currentIndex}
              className={`relative max-w-full max-h-full flex items-center justify-center transition-all duration-300 ease-out ${
                isZoomed ? "overflow-auto cursor-zoom-out" : "cursor-zoom-in"
              }`}
              onDoubleClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={allImages[currentIndex]}
                alt={`${spotTitle} - Photo ${currentIndex + 1}`}
                className={`max-h-[66vh] sm:max-h-[74vh] max-w-[92vw] sm:max-w-[85vw] object-contain rounded-xl sm:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-[rgba(212,169,66,0.25)] transition-transform duration-300 select-none ${
                  isZoomed ? "scale-[1.75]" : "scale-100 animate-pop-zoom"
                }`}
                draggable={false}
              />
            </div>

            {/* Next Arrow Button */}
            {allImages.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                title="Next Image (Right Arrow or Swipe Left)"
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-[rgba(13,25,18,0.85)] border border-[rgba(212,169,66,0.3)] text-[#F5F0E8] hover:text-[#D4A942] hover:border-[#D4A942] hover:scale-110 active:scale-95 transition-all shadow-[0_4px_25px_rgba(0,0,0,0.8)] backdrop-blur-md cursor-pointer"
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          <div className="relative z-10 px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-t from-black/95 to-transparent">
            <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-1">
              {allImages.map((thumb, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIsZoomed(false);
                      setCurrentIndex(idx);
                    }}
                    className={`relative w-14 sm:w-20 aspect-video rounded-lg overflow-hidden border transition-all duration-200 shrink-0 cursor-pointer ${
                      isActive
                        ? "border-[#D4A942] ring-2 ring-[#D4A942]/60 scale-105 opacity-100 shadow-[0_0_15px_rgba(212,169,66,0.5)]"
                        : "border-white/10 opacity-50 hover:opacity-90 hover:border-white/30"
                    }`}
                  >
                    <img
                      src={thumb}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
