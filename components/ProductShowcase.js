"use client";

import { useState, useRef } from "react";
import { Check, ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function ProductShowcase() {
  // State to track if the user is hovering over the media area
  const [isHovered, setIsHovered] = useState(false);
  
  // Ref to control the video element directly
  const videoRef = useRef(null);

  const features = [
    "Offline-first Architecture",
    "Smart Quotation Calculator",
    "Zero-Latency Calculations",
    "Job Card Management",
    "Auto WhatsApp Notifications",
    "Instant Invoice Generation",
  ];

  // Function to handle mouse entering the media area
  const handleMouseEnter = () => {
    setIsHovered(true);
    // Play video immediately when hovered
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  // Function to handle mouse leaving the media area
  const handleMouseLeave = () => {
    setIsHovered(false);
    // Pause and reset video when hover ends
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; 
    }
  };

  return (
    <section className="relative py-20 px-6 overflow-hidden text-white" id="latest">
      
      
      <Image
        src="/UI/bg.jpeg" // Replace with your actual background image path
        alt="Background Texture"
        fill
        className="object-cover object-center z-0  transform scale-x-[-1]"
        priority
      />
      
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="max-w-7xl mx-auto relative z-0">
        <div className="flex flex-col lg:flex-row items-stretch">
          
          {/* --- LEFT SIDE: Content --- */}
          <div className="flex-1 lg:pr-16 py-8 flex flex-col justify-center">
            
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-[1.1]">
              1Click ERP
            </h2>
            
            <p className="text-lg md:text-xl font-medium text-white/90 mb-10 leading-relaxed max-w-lg">
              More than a software, made for Printing Businesses that need perfection and invincible growth.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-2 mb-10">
              {features.map((item, i) => (
                <div key={i} className="flex items-center gap-3 ">
                  <div className="flex-shrink-0 flex items-center hover:bg-white hover:text-black justify-center w-6 h-6 rounded-full bg-black/10  text-shadow-blue-300">
                    <Check size={14} strokeWidth={4} />
                  </div>
                  <span className="text-base font-semibold text-white">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div>
              <a href="/oneclick" className="group flex items-center gap-3 px-0 py-4 bg-zinc-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg shadow-black/5 hover:shadow-xl hover:translate-y-[-2px]">
                Book Your Demo Now 
                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
              </a>
            </div>
          </div>

          {/* --- THE DIVIDER --- */}
          <div className="flex items-center justify-center lg:py-4">
             <div className="w-full h-px lg:w-px lg:h-full bg-zinc-900/10 lg:bg-gradient-to-b lg:from-transparent lg:via-zinc-900/20 lg:to-transparent my-8 lg:my-0" />
          </div>

          {/* --- RIGHT SIDE: Interactive Media Showcase --- */}
          <div className="flex-1 lg:pl-16 py-8 flex items-center justify-center">
            <div className="relative w-full max-w-xl">
              
              {/* Decorative Backdrop */}
              <div className="absolute top-4 -right-4 w-full h-full border-2 border-zinc-900/5 rounded-3xl z-0" />
              
              {/* Main Media Container */}
              <div 
                className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-zinc-900/20 bg-zinc-100 aspect-[4/3] group border border-white/20 cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                
                {/* 1. The Video Layer (Bottom Layer) */}
                {/* We keep it in DOM but hide it with opacity until hovered to prevent loading flicker */}
                <video
                  ref={videoRef}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                  src="/video/software.mp4" // Replace with your actual video path
                  muted
                  loop
                  playsInline
                />

                {/* 2. The Image Layer (Top Layer) */}
                <div 
                  className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                    isHovered ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <Image 
                    src="/UI/logo.jpeg" 
                    alt="1Click ERP Dashboard Interface" 
                    fill
                    className="object-cover object-center"
                    sizes="(max-w-768px) 100vw, 50vw"
                    priority
                  />
                  {/* Glossy Overlay only on image */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent pointer-events-none" />
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}