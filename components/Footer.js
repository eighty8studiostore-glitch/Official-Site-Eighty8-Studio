import React from "react";
import { Facebook, Instagram, Linkedin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-white via-gray-50 to-gray-100 pt-24 pb-10 overflow-hidden border-t border-gray-200">
      {/* Subtle CMYK Ambient Glow */}
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-fuchsia-500/10 rounded-full blur-[160px]" />
      <div className="absolute top-1/4 -right-40 w-[520px] h-[520px] bg-cyan-500/10 rounded-full blur-[160px]" />
      <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] bg-yellow-400/10 rounded-full blur-[140px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* TOP: Brand & CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-20">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">
              Let’s build something <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-cyan-600 to-yellow-500">
                reliable and scalable.
              </span>
            </h2>

            <p className="text-gray-700 max-w-md text-lg leading-relaxed">
              Eighty8 Studio partners with businesses to design, build, and
              deliver software that works in the real world — fast, secure, and
              maintainable.
            </p>

            {/* Operational Status */}
            <div className="flex items-center gap-2 mt-8 px-4 py-2 bg-white rounded-full border border-gray-200 w-fit shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-gray-700 tracking-wide uppercase">
                Accepting New Projects
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col justify-end items-start lg:items-end">
            <a
              href="tel:+918080228441"
              className="group relative px-8 py-4 rounded-lg font-semibold text-white
  bg-[rgb(239,88,75)] hover:bg-[rgb(220,72,60)]
  transition-all duration-300
  flex items-center gap-3
  shadow-lg shadow-[rgba(239,88,75,0.35)]"
            >
              Start a Project
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            <p className="text-gray-600 text-sm mt-4">
              Response time: within 24 hours
            </p>
          </div>
        </div>

        {/* LINKS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-gray-200 pt-16 pb-12">
          <FooterColumn title="Services">
            <FooterLink>Web Development</FooterLink>
            <FooterLink>App Development</FooterLink>
            <FooterLink>UI / UX Design</FooterLink>
            <FooterLink>Consulting</FooterLink>
          </FooterColumn>

          <FooterColumn title="Company">
            <FooterLink>About Eighty8</FooterLink>
            <FooterLink>Careers</FooterLink>
            <FooterLink>Our Process</FooterLink>
            <FooterLink>Blog</FooterLink>
          </FooterColumn>

          <FooterColumn title="Legal">
            <FooterLink>Privacy Policy</FooterLink>
            <FooterLink>Terms of Service</FooterLink>
            <FooterLink>Cookie Policy</FooterLink>
          </FooterColumn>

          <FooterColumn title="Connect">
            <div className="flex gap-4">
              <SocialIcon href="#" icon={<Facebook />} />
              <SocialIcon href="#" icon={<Linkedin />} />
              <SocialIcon
                href="https://www.instagram.com/eighty8studio.social/"
                icon={<Instagram />}
              />
            </div>

            <a
              href="mailto:eighty8studio.social@gmail.com"
              className="block text-gray-700 hover:text-gray-900 
  transition-colors text-sm sm:text-base 
  mt-2 break-all sm:break-normal"
            >
              eighty8studio.social@gmail.com
            </a>
          </FooterColumn>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 text-gray-600 text-sm">
          <p>© {currentYear} Eighty8 Studio. Infinite Possibilities.</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <span>Designed in CorelDRAW</span>
            <span>•</span>
            <span>Developed in VS Code</span>
            <span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Helpers */

function FooterColumn({ title, children }) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-gray-900 font-semibold mb-2">{title}</h4>
      {children}
    </div>
  );
}

function FooterLink({ children }) {
  return (
    <a
      href="#"
      className="text-gray-700 hover:text-fuchsia-600 transition-colors duration-200 text-sm w-fit"
    >
      {children}
    </a>
  );
}

function SocialIcon({ href, icon }) {
  return (
    <a
      href={href}
      className="p-2 rounded-full bg-white border border-gray-200
      text-gray-600 hover:text-fuchsia-600 hover:border-fuchsia-300
      transition-all duration-300"
    >
      {icon}
    </a>
  );
}