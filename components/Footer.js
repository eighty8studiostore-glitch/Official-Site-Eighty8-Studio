import React from 'react';
import { Github, Twitter, Facebook, Instagram, ArrowUpRight, CheckCircle2, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-zinc-950 pt-20 pb-10 overflow-hidden border-t border-white/5">
      
      {/* 1. Minute Detail: Subtle Background Grid for Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Top Section: CTA & Brand */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tight mb-6">
              Let's build the <br />
              <span className="text-zinc-500">unimaginable.</span>
            </h2>
            <p className="text-zinc-400 max-w-md text-lg leading-relaxed">
              Eighty8 Studio is a digital product agency. We engineer robust software and design intuitive interfaces for the future.
            </p>
            
            {/* Minute Detail: Operational Status */}
            <div className="flex items-center gap-2 mt-8 px-4 py-2 bg-white/5 w-fit rounded-full border border-white/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-zinc-300 tracking-wide uppercase">
                Systems Operational • Accepting Projects
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-end items-start lg:items-end">
            <button className="group relative px-8 py-4 bg-white text-zinc-950 text-lg font-medium rounded-sm hover:bg-zinc-200 transition-all duration-300 flex items-center gap-3">
              Start a Project
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
            <p className="text-zinc-500 text-sm mt-4">
              Response time: Within 24 hours
            </p>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-16 pb-12">
          
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-medium mb-2">Services</h4>
            <FooterLink href="#">Web Development</FooterLink>
            <FooterLink href="#">App Development</FooterLink>
            <FooterLink href="#">UI/UX Design</FooterLink>
            <FooterLink href="#">Consulting</FooterLink>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-medium mb-2">Company</h4>
            <FooterLink href="#">About Eighty8</FooterLink>
            <FooterLink href="#">Careers</FooterLink>
            <FooterLink href="#">Our Process</FooterLink>
            <FooterLink href="#">Blog</FooterLink>
          </div>

           {/* Column 3 */}
           <div className="flex flex-col gap-4">
            <h4 className="text-white font-medium mb-2">Legal</h4>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
            <FooterLink href="#">Cookie Policy</FooterLink>
          </div>

          {/* Column 4: Connect */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-medium mb-2">Connect</h4>
            <div className="flex gap-4">
              <SocialIcon href="#" icon={<Facebook className="w-5 h-5" />} label="Facebook" />
              <SocialIcon href="#" icon={<Linkedin className="w-5 h-5" />} label="Linkedin" />
              <SocialIcon href="https://www.instagram.com/eighty8studio.social/" icon={<Instagram className="w-5 h-5" />} label="Instagram" />
            </div>
            <a href="mailto:eighty8studio.social@gmail.com" className="text-zinc-400 hover:text-white transition-colors text-sm mt-2">
              eighty8studio.social@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-zinc-500 text-sm">
          <p>© {currentYear} Eighty8 Studio. Made with intention.</p>
          <div className="flex items-center gap-1 mt-4 md:mt-0">
            <span>Designed in CorelDRAW</span>
            <span className="mx-2">•</span>
            <span>Coded in React</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// 2. Component for links to ensure consistent hover effects
function FooterLink({ href, children }) {
  return (
    <a 
      href={href} 
      className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm w-fit"
    >
      {children}
    </a>
  );
}

// 3. Component for social icons
function SocialIcon({ href, icon, label }) {
  return (
    <a 
      href={href} 
      aria-label={label}
      className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/20"
    >
      {icon}
    </a>
  );
}