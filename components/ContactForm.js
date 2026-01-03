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
    <section id="contact" className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-light text-gray-900 sm:text-4xl font-serif">
            Get in Touch
          </h2>
          <p className="mt-4 text-lg text-gray-500 font-light">
            Have a question or proposal? Fill out the form below.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            
            {/* Honeypot for Spam Protection (Hidden) */}
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                placeholder="Your Name"
                className="block w-full px-4 py-3 rounded-md bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ease-in-out"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="you@example.com"
                className="block w-full px-4 py-3 rounded-md bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ease-in-out"
              />
            </div>

            {/* Message Input */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                name="message"
                id="message"
                required
                rows="4"
                placeholder="How can we help you?"
                className="block w-full px-4 py-3 rounded-md bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 ease-in-out resize-none"
              ></textarea>
            </div>

            {/* Acceptance Checkbox */}
            <div className="flex items-start">
              {/* <div className="flex items-center h-5">
                <input
                  id="acceptance"
                  name="acceptance"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 cursor-pointer"
                />
              </div> */}
              {/* <div className="ml-3 text-sm">
                <label htmlFor="acceptance" className="font-light text-gray-600 cursor-pointer">
                  I accept the{" "}
                  <a href="#" className="font-medium text-gray-900 underline hover:text-gray-700">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-medium text-gray-900 underline hover:text-gray-700">
                    Privacy Policy
                  </a>
                  .
                </label>
              </div> */}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          </form>

          {/* Success/Error Feedback */}
          {result === "Success" && (
            <div className="mt-4 p-4 rounded-md bg-green-50 border border-green-200">
              <p className="text-sm text-green-800 text-center">
                Thank you! Your message has been sent successfully.
              </p>
            </div>
          )}
          {result === "Error" && (
            <div className="mt-4 p-4 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-800 text-center">
                Something went wrong. Please try again later.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}