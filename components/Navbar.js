"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper for conditional classes if you don't have the cn utility
const classNames = (...classes) => classes.filter(Boolean).join(" ");

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Detail: Handle scroll to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detail: Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const navLinks = [
    { name: "Latest Product", href: "#latest" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={classNames(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b",
        // Detail: Glassmorphism only activates on scroll for a cleaner initial look
        scrolled
          ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-zinc-200 dark:border-zinc-800 py-3"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* LOGO */}
        {/* Detail: Tracking toggler makes it feel premium. Added a group for hover effect. */}
        <a href="#" className="group relative z-50">
          <div className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white flex items-center gap-1">
            EIGHTY8
            <span className="text-[#FF4F00] transition-transform duration-300 group-hover:rotate-12">
              /
            </span>
            STUDIO
          </div>
        </a>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              className="relative px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Detail: Floating Pill Background Effect */}
              {hoveredIndex === index && (
                <motion.span
                  layoutId="hover-pill"
                  className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800/50 rounded-full -z-10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {item.name}
            </a>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4 z-50">
          {/* Theme Toggle (Optional, simplified for cleanliness) */}
          

          {/* CTA Button */}
          {/* Detail: Subtle shine effect and scale on hover */}
          
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden md:flex group items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#FF4F00] rounded-full transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:brightness-110 cursor-pointer"
            >
              Book a Call
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </motion.a>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-zinc-900 dark:text-white z-50 relative"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 left-0 w-full h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            <div className="flex flex-col items-center gap-6">
              {navLinks.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white hover:text-[#FF4F00] transition-colors"
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 px-8 py-3 text-lg font-bold text-white bg-[#FF4F00] rounded-full shadow-xl shadow-orange-500/20"
            >
              Book a Call
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}