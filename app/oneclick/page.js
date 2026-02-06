import React from "react";
import Image from "next/image";
import {
  Check,
  ArrowRight,
  Zap,
  Shield,
  Smartphone,
  Calculator,
  MessageCircle,
  FileText,
  Play,
  BarChart,
  Users,
  Globe,
  Clock,
  Database,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

import {
  WifiOff,
  Bolt,
  MessageSquare,
  ClipboardList,
  FolderOpen,
  NotebookText,
} from "lucide-react";

export const metadata = {
  title:
    "ERPFlow | Complete Business Management Solution for Modern Enterprises",
  description:
    "Streamline operations, automate workflows, and drive growth with our comprehensive ERP platform designed for businesses of all sizes.",
};

export default function ERPPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white selection:bg-blue-500/30">
      <Navbar />

      {/* --- SECTION 1: HERO WITH CMYK VALUE PROPOSITION --- */}
      <section className="relative pt-24 sm:pt-32 lg:pt-36 pb-20 sm:pb-24 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white">
        {/* CMYK Atmospheric Background */}
        <div className="absolute -top-40 -left-40 w-[320px] sm:w-[520px] h-[320px] sm:h-[520px] bg-cyan-500/12 rounded-full blur-[140px]" />
        <div className="absolute top-1/4 -right-40 w-[320px] sm:w-[520px] h-[320px] sm:h-[520px] bg-fuchsia-500/12 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 w-[260px] sm:w-[420px] h-[260px] sm:h-[420px] bg-yellow-400/12 rounded-full blur-[120px]" />

        {/* Grid Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.035)_1px,transparent_0)] bg-[size:36px_36px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-300 text-gray-900 text-xs sm:text-sm font-semibold shadow-sm mb-8 sm:mb-10">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-r from-cyan-600 via-fuchsia-600 to-yellow-400" />
            Trusted by 5,000+ Businesses
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 sm:mb-6 max-w-4xl leading-tight text-gray-900">
            One Platform,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-cyan-600 via-yellow-500">
              Unlimited Possibilities
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-xl text-gray-700 max-w-3xl mb-10 sm:mb-12 leading-relaxed px-2 sm:px-0">
            {/* Mobile */}
            <span className="block sm:hidden">
              Streamline your business operations with our intelligent ERP
              platform.
            </span>

            {/* Tablet & Desktop */}
            <span className="hidden sm:block">
              Streamline your entire business operations—from finance to ERM
              analytics—with our intelligent ERP platform. Automate workflows,
              unlock insights, and scale with confidence.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16 sm:mb-20">
            <a
              href="#demo"
              className="group w-full sm:w-auto px-6 sm:px-8 py-4 rounded-lg font-semibold text-white
            bg-gradient-to-r from-cyan-600 via-fuchsia-600 to-yellow-500
            hover:brightness-110 transition-all duration-300
            shadow-lg shadow-black/15 flex items-center gap-3 justify-center"
            >
              Schedule a Personalized Demo
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>

            <a
              href="#features"
              className="group w-full sm:w-auto px-6 sm:px-8 py-4 bg-white border border-gray-300
            text-gray-900 font-semibold rounded-lg transition-all duration-300
            flex items-center gap-3 justify-center hover:shadow-md"
            >
              <Play size={18} />
              Watch Platform Overview
            </a>
          </div>

          {/* Demo Video */}
          <div className="relative w-full max-w-5xl aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-gray-300 shadow-[0_25px_60px_rgba(0,0,0,0.18)]">
            {/* Gradient Frame */}
            <div
              className="absolute inset-0 rounded-2xl sm:rounded-3xl p-[1px]
            bg-gradient-to-r from-cyan-500/40 via-fuchsia-500/40 to-yellow-400/40"
            />

            {/* Video */}
            <iframe
              src="https://www.youtube.com/embed/lHTMJIAS_Zc?autoplay=1&mute=1&loop=1&playlist=lHTMJIAS_Zc&controls=0&modestbranding=1&rel=0&playsinline=1"
              title="ERP Platform Demo"
              className="absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl pointer-events-none"
              allow="autoplay; encrypted-media; picture-in-picture"
            />

            {/* Click Overlay */}
            <a
              href="https://www.youtube.com/watch?v=lHTMJIAS_Zc"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10 flex items-center justify-center
            bg-black/10 hover:bg-black/35 transition-all duration-300"
            >
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-md rounded-full
              flex items-center justify-center scale-95 hover:scale-100 transition-transform"
              >
                <Play size={28} className="text-gray-900 ml-1" />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: VALUE PROPOSITION --- */}
      <section
        className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-gray-100"
        id="why-upgrade"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="mb-14 sm:mb-20 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 
            bg-fuchsia-50 border border-fuchsia-200
            rounded-full text-fuchsia-700 font-semibold text-xs sm:text-sm mb-4"
            >
              Why 1Click?
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5 sm:mb-6">
              Why{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-cyan-600 to-yellow-500">
                1Click ERP
              </span>
              ?
            </h2>

            {/* Description */}
            <p className="text-base sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              {/* Mobile */}
              <span className="block sm:hidden">
                Printing businesses struggle with manual work, errors, and
                confusion. We simplify it.
              </span>

              {/* Tablet & Desktop */}
              <span className="hidden sm:block">
                Most printing presses run on chaos—manual calculations,
                unorganized job cards and scattered ledgers.
                <span className="font-semibold text-gray-900">
                  {" "}
                  We offer a simple solution.
                </span>
              </span>
            </p>
          </div>

          {/* Core Reasons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {/* SMART CALCULATIONS */}
            <div
              className="group relative bg-white rounded-2xl sm:rounded-3xl border border-gray-200 
            p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]
            hover:shadow-[0_30px_70px_rgba(0,0,0,0.12)]
            transition-all duration-300"
            >
              <div
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-5 sm:mb-6
              bg-gradient-to-br from-yellow-500 to-fuchsia-600 text-white"
              >
                <Calculator size={22} strokeWidth={2.2} />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                Smart Calculations
              </h3>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {/* Mobile */}
                <span className="block sm:hidden">
                  Job calculations done instantly and accurately.
                </span>

                {/* Desktop */}
                <span className="hidden sm:block">
                  Total paper weight, number of reams, CtP sets, and forms—
                  <span className="font-semibold text-gray-900">
                    calculated automatically.
                  </span>{" "}
                  Get accurate job details instantly without manual
                  calculations.
                </span>
              </p>

              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-transparent group-hover:border-fuchsia-300 transition-colors" />
            </div>

            {/* UNORGANIZED JOB CARDS */}
            <div
              className="group relative bg-white rounded-2xl sm:rounded-3xl border border-gray-200 
            p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]
            hover:shadow-[0_30px_70px_rgba(0,0,0,0.12)]
            transition-all duration-300"
            >
              <div
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-5 sm:mb-6
              bg-gradient-to-br from-fuchsia-600 to-cyan-600 text-white"
              >
                <FileText size={22} strokeWidth={2.2} />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                Unorganized Job Cards
              </h3>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {/* Mobile */}
                <span className="block sm:hidden">
                  Paper-based job cards make tracking difficult.
                </span>

                {/* Desktop */}
                <span className="hidden sm:block">
                  Job details are written on paper or scattered across files.
                  Tracking order status, reprints, or pending work becomes
                  confusing and time-consuming.
                </span>
              </p>

              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-transparent group-hover:border-cyan-300 transition-colors" />
            </div>

            {/* SCATTERED LEDGERS */}
            <div
              className="group relative bg-white rounded-2xl sm:rounded-3xl border border-gray-200 
            p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]
            hover:shadow-[0_30px_70px_rgba(0,0,0,0.12)]
            transition-all duration-300"
            >
              <div
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-5 sm:mb-6
              bg-gradient-to-br from-cyan-600 to-yellow-500 text-white"
              >
                <FolderOpen size={22} strokeWidth={2.2} />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                Scattered Ledgers
              </h3>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {/* Mobile */}
                <span className="block sm:hidden">
                  Payments and balances are hard to track.
                </span>

                {/* Desktop */}
                <span className="hidden sm:block">
                  Payment records are spread across notebooks, files, and
                  spreadsheets. Finding balances, pending payments, or past
                  entries becomes slow and error-prone.
                </span>
              </p>

              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-transparent group-hover:border-yellow-300 transition-colors" />
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: CORE FEATURES --- */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* LEFT — IMAGE */}
            <div className="relative flex justify-center lg:justify-start order-1 lg:order-none">
              {/* Ambient Glow */}
              <div
                className="absolute -inset-8 sm:-inset-10 rounded-3xl
              bg-gradient-to-br from-fuchsia-500/25 via-cyan-500/20 to-yellow-400/20
              blur-3xl"
              />

              {/* Image Card */}
              <div
                className="relative max-w-md sm:max-w-xl w-full
              rounded-2xl sm:rounded-3xl border border-gray-300/60
              bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50
              shadow-[0_30px_80px_rgba(0,0,0,0.14)]
              p-4 sm:p-5 md:p-6 overflow-hidden"
              >
                <img
                  src="/hero_svg3.png"
                  alt="1Click ERP Dashboard"
                  className="w-full h-auto object-contain rounded-xl sm:rounded-2xl"
                />
              </div>
            </div>

            {/* RIGHT — CONTENT */}
            <div className="order-2">
              {/* Label */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 mb-5 sm:mb-6
              bg-fuchsia-50 border border-fuchsia-200
              rounded-full text-fuchsia-700 font-semibold text-xs sm:text-sm"
              >
                Complete Control
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Everything you need to run your press.
              </h2>

              {/* Description */}
              <p className="text-base sm:text-lg text-gray-700 mb-8 sm:mb-10 leading-relaxed">
                {/* Mobile */}
                <span className="block sm:hidden">
                  One powerful system to manage invoicing, jobs, and clients.
                </span>

                {/* Desktop */}
                <span className="hidden sm:block">
                  From invoicing to job tracking, 1Click brings your entire
                  printing workflow into one fast, reliable system—designed for
                  real-world printing businesses.
                </span>
              </p>

              {/* Features */}
              <div className="space-y-6 sm:space-y-8">
                {/* Feature 1 */}
                <div className="flex gap-4 sm:gap-5">
                  <div
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center
                  bg-gradient-to-br from-fuchsia-600 to-cyan-600 text-white"
                  >
                    <Zap size={22} />
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                      Instant Invoice Generation
                    </h3>

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {/* Mobile */}
                      <span className="block sm:hidden">
                        Generate GST invoices instantly with one click.
                      </span>

                      {/* Desktop */}
                      <span className="hidden sm:block">
                        Create GST-compliant invoices with one click. Client
                        details, tax codes, and totals are auto-filled—no manual
                        errors.
                      </span>
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex gap-4 sm:gap-5">
                  <div
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center
                  bg-gradient-to-br from-cyan-600 to-yellow-500 text-white"
                  >
                    <MessageSquare size={22} />
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                      WhatsApp Integration
                    </h3>

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {/* Mobile */}
                      <span className="block sm:hidden">
                        Send invoices & quotes directly on WhatsApp.
                      </span>

                      {/* Desktop */}
                      <span className="hidden sm:block">
                        Send quotes and invoices directly to your client’s
                        WhatsApp the moment they’re generated—no downloads, no
                        follow-ups.
                      </span>
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex gap-4 sm:gap-5">
                  <div
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center
                  bg-gradient-to-br from-yellow-500 to-fuchsia-600 text-white"
                  >
                    <NotebookText size={22} />
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                      Job Card Management
                    </h3>

                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {/* Mobile */}
                      <span className="block sm:hidden">
                        Track jobs from start to finish easily.
                      </span>

                      {/* Desktop */}
                      <span className="hidden sm:block">
                        Track every job—from design to cutting to binding. Know
                        exactly where an order is and what’s pending.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================
   TESTIMONIAL SECTION
================================  */}

      {/* --- SECTION 6: DEMO REQUEST --- */}
      <section
        id="demo"
        className="py-5 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-gray-50 to-gray-100"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            {/* Header Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 mb-5 sm:mb-6
            bg-fuchsia-50 border border-fuchsia-200
            rounded-full text-fuchsia-700 font-semibold text-xs sm:text-sm"
            >
              Request a Demo
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              See{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-cyan-600 to-yellow-500">
                1Click ERP
              </span>{" "}
              in Action
            </h2>

            {/* Subtext */}
            <p className="text-base sm:text-xl text-gray-700 mb-12 sm:mb-16 leading-relaxed px-2 sm:px-0">
              {/* Mobile */}
              <span className="block sm:hidden">
                See how 1Click ERP simplifies billing, job tracking, and daily
                operations.
              </span>

              {/* Tablet & Desktop */}
              <span className="hidden sm:block">
                Discover how printing businesses are replacing manual chaos with
                faster billing, accurate job tracking, and complete operational
                visibility—all in one system.
              </span>
            </p>

            {/* Demo Card */}
            <div
              className="relative bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50
            rounded-2xl sm:rounded-3xl border border-gray-200
            shadow-[0_30px_80px_rgba(0,0,0,0.12)]
            p-6 sm:p-8 md:p-12 text-left"
            >
              {/* Accent Line */}
              <div
                className="absolute inset-x-0 top-0 h-1 rounded-t-2xl sm:rounded-t-3xl
              bg-gradient-to-r from-fuchsia-600 via-cyan-600 to-yellow-400"
              />

              {/* Card Header */}
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Request a Personalized Demo
                </h3>

                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {/* Mobile */}
                  <span className="block sm:hidden">
                    Tell us a little about your business and see how 1Click ERP
                    fits your workflow.
                  </span>

                  {/* Desktop */}
                  <span className="hidden sm:block">
                    Share a few details about your printing business and our
                    product expert will walk you through exactly how 1Click ERP
                    fits your workflow—from quotation to delivery.
                  </span>
                </p>
              </div>

              {/* Contact Form */}
              <section id="contact-form" className="py-4 sm:py-5">
                <ContactForm />
              </section>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// --- Helper Components ---

function ValueCard({ icon, title, desc, features }) {
  return (
    <div className="group relative p-8 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="absolute top-0 left-8 -translate-y-1/2">
        <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
          {icon}
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{desc}</p>

        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <Check size={16} className="text-blue-500 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc, features }) {
  return (
    <div className="group flex gap-6 p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
      <div className="flex-shrink-0">
        <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{desc}</p>

        <div className="flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function IndustryCard({ title, description, color }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    violet: "bg-violet-50 border-violet-200 text-violet-700",
    rose: "bg-rose-50 border-rose-200 text-rose-700",
  };

  return (
    <div
      className={`group p-8 rounded-xl border-2 ${colorClasses[color]} hover:shadow-lg transition-all duration-300 cursor-pointer`}
    >
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm font-semibold">Learn more</span>
        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition-transform"
        />
      </div>
    </div>
  );
}

function TestimonialCard({ quote, author, role, company, accent }) {
  const accentMap = {
    fuchsia: "from-fuchsia-500 to-cyan-500",
    cyan: "from-cyan-500 to-yellow-400",
    yellow: "from-yellow-400 to-fuchsia-500",
  };

  return (
    <div
      className="relative bg-gradient-to-b from-gray-50 to-gray-100
      rounded-3xl border border-gray-200
      p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]
      hover:shadow-[0_30px_70px_rgba(0,0,0,0.12)]
      transition-all duration-300"
    >
      {/* Accent Bar */}
      <div
        className={`absolute top-0 left-0 w-full h-1 rounded-t-3xl
        bg-gradient-to-r ${accentMap[accent]}`}
      />

      {/* Quote */}
      <p className="text-gray-800 leading-relaxed mb-8">“{quote}”</p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center
          text-white font-bold
          bg-gradient-to-br ${accentMap[accent]}`}
        >
          {author.charAt(0)}
        </div>

        <div>
          <div className="font-semibold text-gray-900">{author}</div>
          <div className="text-sm text-gray-600">
            {role}, {company}
          </div>
        </div>
      </div>
    </div>
  );
}