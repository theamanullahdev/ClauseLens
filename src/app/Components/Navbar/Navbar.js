"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/About" },
  { label: "Cover Maker", href: "/CoverLetter" },
  { label: "CV Maker", href: "/CVmaker" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full px-6 py-4 bg-black text-white border-b border-neutral-800 shadow-[0_0_10px_rgba(255,255,255,0.06)]"
    >
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <motion.div whileHover={{ scale: 1.04 }}>
            <div className="w-9 h-9 bg-white text-black flex items-center justify-center text-lg font-bold rounded-lg border border-neutral-600">
              L
            </div>
          </motion.div>
          <span className="font-bold tracking-tight text-white text-lg sm:text-xl hidden min-[281px]:inline">
            Lettersmith
          </span>
        </Link>

        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="hidden sm:flex gap-2 sm:gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.button
                  whileHover={{
                    scale: 1.07,
                    backgroundColor: "rgba(6,182,212,0.3)",
                    color: "#fff",
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.1 }}
                  className={`px-4 py-2 border-2 font-medium text-sm sm:text-base tracking-wide rounded-lg transition-all hover:shadow-lg cursor-pointer
                  ${
                    isActive
                      ? "border-white bg-cyan-500 text-black"
                      : "border-white text-white"
                  }`}
                >
                  {item.label}
                </motion.button>
              </Link>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col sm:hidden mt-4 space-y-2"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full text-left px-4 py-2 border-2 rounded-lg font-medium tracking-wide
                    ${
                      isActive
                        ? "border-white bg-cyan-500 text-black"
                        : "border-white text-white"
                    }`}
                  >
                    {item.label}
                  </motion.button>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
