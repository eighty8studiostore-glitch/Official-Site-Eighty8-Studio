import React from 'react';
import { Monitor, Smartphone, Globe, Database, ArrowUpRight } from "lucide-react";
import Image from 'next/image';

const services = [
  {
    title: "Web Applications",
    desc: "High-performance SaaS platforms built with Latest Technology",
    icon: <Globe size={24} />,
    colSpan: "col-span-1 md:col-span-2",
    // Example: No image, uses default styling
    backgroundImage: "/bento/website.jpeg" 
  },
  {
    title: "Desktop Software",
    desc: "Secure, offline-first apps powered by Rust.",
    icon: <Monitor size={24} />,
    colSpan: "col-span-1",
    backgroundImage: "/bento/software.jpg"
  },
  {
    title: "Mobile Solutions",
    desc: "Custom Mobile Solutions for Android and Android Systms.",
    icon: <Smartphone size={24} />,
    colSpan: "col-span-1",
    backgroundImage: "/bento/mobile.jpeg"
  },
  {
    title: "Customized Enterprise Systems",
    desc: "Scalable ERP & CRM architectures for complex workflows.",
    icon: <Database size={24} />,
    colSpan: "col-span-1 md:col-span-2",
    backgroundImage: "/bento/custom.jpeg"
  },
];

export default function ServicesBento() {
  return (
    <section id='services' className="relative py-20 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Background Decor Elements (Subtle Grid) */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="mb-16 md:flex md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="text-blue-600 dark:text-blue-400 font-semibold tracking-wider text-sm uppercase mb-2 block">
            What We Deliver
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
            Our Expertise
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
            We don't just write code; we engineer digital solutions that elevate your business efficiency and scale with your ambition.
          </p>
        </div>
        
        {/* Call to Action Button (Optional but recommended for UI/UX) */}
        <button className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 px-6 py-3 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          View all services <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, idx) => (
          <div
            key={idx}
            className={`
              ${service.colSpan} group relative rounded-3xl overflow-hidden transition-all duration-500
              ${service.backgroundImage 
                ? 'text-white' // If image exists, force white text
                : 'bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }
            `}
          >
            {/* Background Image Logic */}
            {service.backgroundImage && (
              <>
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${service.backgroundImage})` }}
                />
                {/* Dark Overlay for readability on images */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              </>
            )}

            <div className="relative z-10 p-8 h-full flex flex-col justify-between min-h-[240px]">
              
              {/* Icon Header */}
              <div className="flex justify-between items-start">
                <div className={`
                  p-3 rounded-2xl w-fit mb-4 transition-all duration-300
                  ${service.backgroundImage 
                    ? 'bg-white/20 backdrop-blur-md border border-white/10 text-white' 
                    : 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-700 group-hover:scale-110'
                  }
                `}>
                  {service.icon}
                </div>
                
                {/* Subtle arrow interaction */}
                <ArrowUpRight 
                  size={20} 
                  className={`opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300
                    ${service.backgroundImage ? 'text-white' : 'text-zinc-400'}
                  `}
                />
              </div>

              {/* Text Content */}
              <div>
                <h3 className={`text-2xl font-bold mb-2 ${!service.backgroundImage && 'text-zinc-900 dark:text-zinc-100'}`}>
                  {service.title}
                </h3>
                <p className={`font-medium leading-relaxed ${service.backgroundImage ? 'text-zinc-200' : 'text-zinc-500 dark:text-zinc-400'}`}>
                  {service.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}