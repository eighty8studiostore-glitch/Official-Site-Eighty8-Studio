import React from "react";
import Image from "next/image";
import { Check, ArrowRight, Zap, Shield, Smartphone, Calculator, MessageCircle, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm"; // Reusing your contact form for the "Book Demo" section

export const metadata = {
  title: "1Click ERP | The Operating System for Printing Businesses",
  description: "Offline-first, zero-latency ERP software for printing businesses. Manage quotes, invoices, and job cards instantly.",
};

export default function OneClickPage() {
  return (
    <main className="min-h-screen bg-zinc-950 selection:bg-orange-500/30">
      <Navbar />

      {/* --- SECTION 1: PRODUCT HERO --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-zinc-950 -z-20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold tracking-wider uppercase mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            v2.0 Now Available
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 max-w-4xl">
            The Brain of Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
              Printing Business.
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
            Stop using spreadsheets. 1Click ERP is an offline-first, lightning-fast operating system designed to handle Quotes, Invoices, and Production Tracking without internet dependency.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <a href="#demo" className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full transition-all shadow-lg shadow-orange-900/20 flex items-center gap-2 justify-center">
              Get a Live Demo <ArrowRight size={18} />
            </a>
            <a href="#features" className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 font-bold rounded-full transition-all flex items-center gap-2 justify-center">
              View Features
            </a>
          </div>

          {/* Hero Image / Video Container */}
          <div className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-orange-900/10 group">
             {/* Use your existing video or image here */}
            <div className="absolute inset-0 bg-zinc-900">
                 {/* Placeholder for the video you mentioned */}
                <video 
                    className="w-full h-full object-cover opacity-90"
                    src="/video/software.mp4" 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                />
            </div>
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
          </div>
        </div>
      </section>


      {/* --- SECTION 2: PAIN POINTS VS SOLUTION --- */}
      <section className="py-24 bg-zinc-900/50 border-y border-zinc-800" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why upgrade to 1Click?</h2>
            <p className="text-zinc-400">Most printing presses run on chaos. We built the cure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <FeatureCard 
                icon={<Zap className="text-yellow-400" />}
                title="Zero Latency"
                desc="Built with Rust & Tauri. It runs locally on your machine, meaning 0ms lag time even with 100,000 records."
             />
             <FeatureCard 
                icon={<Shield className="text-emerald-400" />}
                title="Offline First"
                desc="Internet down? No problem. Keep generating invoices and managing jobs. Data syncs when you reconnect."
             />
             <FeatureCard 
                icon={<Calculator className="text-blue-400" />}
                title="Smart Calculations"
                desc="Complex paper size, GSM, and cutting logic is handled automatically. Get exact quotes in seconds, not minutes."
             />
          </div>
        </div>
      </section>


      {/* --- SECTION 3: DETAILED FEATURES GRID --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            {/* Text Side */}
            <div>
                <h3 className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-4">Complete Control</h3>
                <h2 className="text-4xl font-bold text-white mb-6">Everything you need to run your press.</h2>
                
                <div className="space-y-6">
                    <DetailRow 
                        icon={<FileText />}
                        title="Instant Invoice Generation"
                        desc="Create GST-compliant invoices with one click. Auto-fill client details and tax codes."
                    />
                    <DetailRow 
                        icon={<MessageCircle />}
                        title="WhatsApp Integration"
                        desc="Send quotes and invoices directly to your client's WhatsApp immediately after generation."
                    />
                    <DetailRow 
                        icon={<Smartphone />}
                        title="Job Card Management"
                        desc="Track every job from design to cutting to binding. Know exactly where an order is."
                    />
                </div>
            </div>

            {/* Visual Side */}
            <div className="relative h-[600px] bg-zinc-900 rounded-3xl border border-zinc-800 p-8 flex items-center justify-center">
                {/* Abstract UI Representation */}
                <div className="relative w-full h-full">
                     <Image 
                        src="/UI/logo.jpeg" 
                        alt="Dashboard UI"
                        fill
                        className="object-contain"
                     />
                </div>
            </div>

        </div>
      </section>

      {/* --- SECTION 4: CTA / DEMO --- */}
      <div id="demo" className="bg-white">
        <div className="py-20 max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-zinc-900 mb-6">Ready to modernize your business?</h2>
            <p className="text-lg text-zinc-600 mb-10">
                Join the printing businesses that have switched to 1Click ERP. 
                Fill out the form below to schedule a personalized demo.
            </p>
        </div>
        
        {/* We reuse your existing Contact Form but wrap it to look integrated */}
        <div className="max-w-2xl mx-auto pb-20">
            <ContactForm />
        </div>
      </div>

      <Footer />
    </main>
  );
}

// --- Helper Components for this page ---

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-orange-500/50 transition-colors group">
            <div className="mb-6 p-3 bg-zinc-900 w-fit rounded-xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-zinc-400 leading-relaxed">{desc}</p>
        </div>
    );
}

function DetailRow({ icon, title, desc }) {
    return (
        <div className="flex gap-4">
            <div className="mt-1 p-2 bg-zinc-800 rounded-lg text-white h-fit">
                {icon}
            </div>
            <div>
                <h4 className="text-lg font-bold text-white">{title}</h4>
                <p className="text-zinc-400 mt-1">{desc}</p>
            </div>
        </div>
    );
}