"use client";

import { useState } from "react";

export default function ContactForm() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResult("");

    const formData = new FormData(event.target);

    // Append your Web3Forms Access Key here
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Success");
        event.target.reset();
      } else {
        console.error("Error", data);
        setResult("Error");
      }
    } catch (error) {
      console.error("Error", error);
      setResult("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 mb-4
          bg-fuchsia-50 border border-fuchsia-200
          rounded-full text-fuchsia-700 font-semibold text-sm"
          >
            Request a Demo
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Let’s Talk About Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-cyan-600 to-yellow-500">
              Printing Workflow
            </span>
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Share a few details and our product expert will show you how 1Click
            ERP can simplify invoicing, job tracking, and daily operations.
          </p>
        </div>

        {/* Form Container */}
        <div
          className="relative bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50
        rounded-3xl border border-gray-200
        shadow-[0_30px_80px_rgba(0,0,0,0.12)]
        p-8"
        >
          {/* CMYK Accent Line */}
          <div
            className="absolute inset-x-0 top-0 h-1 rounded-t-3xl
          bg-gradient-to-r from-fuchsia-600 via-cyan-600 to-yellow-400"
          />

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Honeypot */}
            <input type="checkbox" name="botcheck" className="hidden" />

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-lg
              bg-white border border-gray-300
              text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40
              transition-all"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobile"
                required
                placeholder="XXXXXXXXXX"
                className="w-full px-4 py-3 rounded-lg
      bg-white border border-gray-300
      text-gray-900 placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-cyan-500/40
      transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-lg
              bg-white border border-gray-300
              text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-cyan-500/40
              transition-all"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tell us about your printing business
              </label>
              <textarea
                name="message"
                rows="4"
                required
                placeholder="Number of machines, type of printing, current challenges…"
                className="w-full px-4 py-3 rounded-lg
              bg-white border border-gray-300
              text-gray-900 placeholder-gray-400 resize-none
              focus:outline-none focus:ring-2 focus:ring-yellow-400/40
              transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-lg font-semibold text-white
  bg-[rgb(239,88,75)] hover:bg-[rgb(220,72,60)]
  shadow-lg shadow-[rgba(239,88,75,0.35)]
  transition-all duration-300
  disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Request Demo"}
            </button>
          </form>

          {/* Feedback */}
          {result === "Success" && (
            <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-800 text-center">
                ✅ Thanks! Our team will contact you shortly.
              </p>
            </div>
          )}

          {result === "Error" && (
            <div className="mt-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-800 text-center">
                ❌ Something went wrong. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}