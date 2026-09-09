"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles } from "lucide-react";

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "Travel Guidance & Itinerary",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message?: string;
    inquiryId?: string;
  }>({ type: "idle" });

  const categories = [
    "Travel Guidance & Itinerary",
    "Local Santhal Guide Network",
    "Spot Verification / Photo Submission",
    "Hotel & Stay Recommendation",
    "General Inquiry & Feedback",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "idle" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setStatus({
        type: "success",
        message: data.message,
        inquiryId: data.inquiryId,
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "Travel Guidance & Itinerary",
        message: "",
      });
    } catch (err: any) {
      setStatus({
        type: "error",
        message: err.message || "Something went wrong. Please try again or email us directly.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="luxury-card rounded-3xl p-6 sm:p-10 border border-[rgba(212,169,66,0.25)] relative overflow-hidden">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#D4A942] font-semibold font-body mb-2">
        <Sparkles size={14} />
        <span>Send a Message</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#F5F0E8] mb-6">
        How Can We Assist Your Pakur Journey?
      </h2>

      {status.type === "success" ? (
        <div className="p-6 rounded-2xl bg-[rgba(0,199,133,0.08)] border border-[rgba(0,199,133,0.3)] space-y-3 animate-fade-in">
          <div className="flex items-center gap-3 text-[#00C785]">
            <CheckCircle2 size={24} />
            <h3 className="font-bold font-serif text-base text-[#F5F0E8]">Inquiry Dispatched Successfully</h3>
          </div>
          <p className="text-xs sm:text-sm text-[#7A9180] font-body leading-relaxed">
            {status.message}
          </p>
          {status.inquiryId && (
            <p className="text-xs font-mono text-[#D4A942]">
              Tracking Ref: {status.inquiryId}
            </p>
          )}
          <div className="pt-3">
            <button
              onClick={() => setStatus({ type: "idle" })}
              className="text-xs font-semibold text-[#00C785] hover:underline font-body"
            >
              ← Send another message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {status.type === "error" && (
            <div className="p-4 rounded-xl bg-[rgba(255,107,74,0.1)] border border-[rgba(255,107,74,0.3)] flex items-center gap-3 text-xs text-[#FF6B4A]">
              <AlertCircle size={18} className="shrink-0" />
              <span>{status.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="text-xs font-semibold text-[#F5F0E8] font-body block">
                Full Name <span className="text-[#D4A942]">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                required
                placeholder="e.g. Rohan Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[rgba(8,17,11,0.7)] border border-[rgba(212,169,66,0.2)] focus:border-[#D4A942] rounded-xl px-4 py-3 text-sm text-[#F5F0E8] placeholder-[#4A6254] outline-none transition-all font-body"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="text-xs font-semibold text-[#F5F0E8] font-body block">
                Email Address <span className="text-[#D4A942]">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                required
                placeholder="rohan@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[rgba(8,17,11,0.7)] border border-[rgba(212,169,66,0.2)] focus:border-[#D4A942] rounded-xl px-4 py-3 text-sm text-[#F5F0E8] placeholder-[#4A6254] outline-none transition-all font-body"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Phone / WhatsApp */}
            <div className="space-y-1.5">
              <label htmlFor="contact-phone" className="text-xs font-semibold text-[#F5F0E8] font-body block">
                Phone / WhatsApp <span className="text-xs text-[#4A6254] font-normal">(Optional)</span>
              </label>
              <input
                id="contact-phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[rgba(8,17,11,0.7)] border border-[rgba(212,169,66,0.2)] focus:border-[#D4A942] rounded-xl px-4 py-3 text-sm text-[#F5F0E8] placeholder-[#4A6254] outline-none transition-all font-body"
              />
            </div>

            {/* Inquiry Category */}
            <div className="space-y-1.5">
              <label htmlFor="contact-category" className="text-xs font-semibold text-[#F5F0E8] font-body block">
                Inquiry Topic
              </label>
              <select
                id="contact-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#08110B] border border-[rgba(212,169,66,0.2)] focus:border-[#D4A942] rounded-xl px-4 py-3 text-sm text-[#F5F0E8] outline-none transition-all font-body cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#08110B] text-[#F5F0E8]">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label htmlFor="contact-message" className="text-xs font-semibold text-[#F5F0E8] font-body block">
              Your Message <span className="text-[#D4A942]">*</span>
            </label>
            <textarea
              id="contact-message"
              required
              rows={4}
              placeholder="Tell us about your upcoming travel plans, destination questions, or any collaboration details..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-[rgba(8,17,11,0.7)] border border-[rgba(212,169,66,0.2)] focus:border-[#D4A942] rounded-xl p-4 text-sm text-[#F5F0E8] placeholder-[#4A6254] outline-none transition-all font-body resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4A942] to-[#E8C56D] hover:from-[#c29636] hover:to-[#d4af54] disabled:opacity-50 text-[#08110B] font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-lg active:scale-95 font-body"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting Inquiry...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Transmit Inquiry</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
