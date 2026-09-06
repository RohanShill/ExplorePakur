'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  currentImage?: string;
  onImageChange: (url: string) => void;
  onImageRemove?: () => void;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  currentImage,
  onImageChange,
  onImageRemove,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (file: File) => {
    setError('');
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
        return;
      }

      if (data.warning) {
        console.warn(data.message);
      }

      onImageChange(data.url);
    } catch (err) {
      setError('Network error during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleUpload(file);
    }
  };

  const handleUrlInput = () => {
    const url = prompt('Enter image URL:');
    if (url && url.startsWith('http')) {
      onImageChange(url);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-slate-200 mb-2">{label}</label>

      {currentImage ? (
        <div className="relative rounded-xl overflow-hidden border border-emerald-500/25 bg-[#0B130E]">
          <img
            src={currentImage}
            alt={label}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#111E16] hover:bg-[#16281E] text-slate-200 p-1.5 rounded-lg border border-emerald-500/25 transition-colors"
              title="Replace image"
            >
              <Upload size={14} />
            </button>
            {onImageRemove && (
              <button
                type="button"
                onClick={onImageRemove}
                className="bg-red-900/80 hover:bg-red-800 text-red-200 p-1.5 rounded-lg border border-red-500/25 transition-colors"
                title="Remove image"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-[#FF6B4A] bg-[#FF6B4A]/10'
              : 'border-emerald-500/30 hover:border-[#FF6B4A]/50 bg-[#0B130E]'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={28} className="text-[#FF6B4A] animate-spin" />
              <span className="text-xs text-slate-400">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon size={28} className="text-slate-500" />
              <span className="text-sm text-slate-300">Drop image here or click to browse</span>
              <span className="text-[11px] text-slate-500">JPEG, PNG, WebP — Max 5MB</span>
            </div>
          )}
        </div>
      )}

      {/* Or enter URL */}
      <button
        type="button"
        onClick={handleUrlInput}
        className="mt-2 text-[11px] text-slate-500 hover:text-[#FF6B4A] underline transition-colors"
      >
        Or paste an image URL instead
      </button>

      {error && (
        <p className="mt-1.5 text-xs text-red-400">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
