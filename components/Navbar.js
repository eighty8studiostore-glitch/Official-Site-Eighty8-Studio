"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const classNames = (...classes) => classes.filter(Boolean).join(" ");

const MotionLink = motion(Link);

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const navLinks = [
    { name: "1 Click ERP", href: "/oneclick" },
    { name: "Services", href: "/#services" },
    { name: "About", href: "/#about" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={classNames(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm"
            : "bg-white border-b border-gray-100",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-16 sm:h-18 flex items-center justify-between">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/logo.jpeg"
                alt="Eighty8 Studio"
                width={30}
                height={30}
                priority
                className="transition-transform duration-300 group-hover:scale-105"
              />
              
            </Link>

            {/* DESKTOP LINKS */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium
                  text-gray-700 hover:text-gray-900
                  transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              <MotionLink
                href="/"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold
                text-white bg-[rgb(239,88,75)] hover:bg-[rgb(220,72,60)]
                rounded-lg shadow-lg shadow-[rgba(239,88,75,0.35)]
                transition-all"
              >
                Start Free Trial
                <ArrowRight size={16} />
              </MotionLink>

              <MotionLink
                href="/oneclick#demo"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="hidden md:flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                text-gray-800 border border-gray-300 bg-gray-50
                rounded-lg hover:bg-gray-100 transition"
              >
                <Play size={14} />
                Request Demo
              </MotionLink>

              {/* MOBILE TOGGLE */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 z-50 relative"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                    >
                      <X size={22} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                    >
                      <Menu size={22} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-white lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b">
              <span className="font-semibold text-gray-900">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            {/* Links */}
            <div className="px-6 pt-6 space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-4 rounded-xl
                  text-lg font-medium text-gray-900
                  hover:bg-gray-100 transition"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile CTAs */}
            <div className="absolute bottom-0 inset-x-0 p-6 space-y-3 border-t bg-white">
              <Link
                href="/oneclick#demo"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3
                text-sm font-semibold text-gray-900
                border border-gray-300 rounded-lg bg-gray-50"
              >
                <Play size={16} />
                Request Demo
              </Link>

              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3
                text-sm font-semibold text-white
                bg-[rgb(239,88,75)] rounded-lg shadow-lg"
              >
                Start Free Trial
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}