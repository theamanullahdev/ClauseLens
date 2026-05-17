"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Zap } from "lucide-react";
import { useAppContext } from "@/Contexts/AppRouters";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/About" },
  { label: "ClauseLens", href: "/ClauseLens" },
 // { label: "CV Maker", href: "/CVmaker" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { theme, toggleTheme } = useAppContext();
  const isDarkMode = theme === "dark";

  // Theme styles: Dark mode hero, Light mode polite cousin
  const containerClass = isDarkMode
    ? "bg-[#0a0a0a] border-b border-[#2a2e2a] text-white"
    : "bg-[#f5f7f5] border-b border-[#d0e6d0] text-gray-900";

  const logoClass = isDarkMode
    ? "bg-[#111411] border border-[#2a2e2a] text-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.3)]"
    : "bg-white border border-[#008844] text-[#008844] shadow-none";

  const getNavLinkClass = (isActive) => {
    if (isActive) {
      return isDarkMode
        ? "bg-[#00ff88] text-black border border-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.4)]"
        : "bg-[#008844] text-white border border-[#008844] shadow-none";
    }
    return isDarkMode
      ? "border border-[#2a2e2a] text-gray-300 hover:bg-[#00ff88] hover:text-black hover:border-[#00ff88] hover:shadow-[0_0_8px_rgba(0,255,136,0.3)] transition-all"
      : "border border-[#c0dcc0] text-gray-700 hover:bg-[#008844] hover:text-white hover:border-[#008844] transition-all";
  };

  const getMobileLinkClass = (isActive) => {
    if (isActive) {
      return isDarkMode
        ? "bg-[#00ff88] text-black border border-[#00ff88]"
        : "bg-[#008844] text-white border border-[#008844]";
    }
    return isDarkMode
      ? "border border-[#2a2e2a] text-gray-300 hover:bg-[#00ff88] hover:text-black hover:border-[#00ff88]"
      : "border border-[#c0dcc0] text-gray-700 hover:bg-[#008844] hover:text-white hover:border-[#008844]";
  };

  const toggleButtonClass = isDarkMode
    ? "border border-[#2a2e2a] text-[#00ff88] hover:bg-[#00ff88] hover:text-black hover:border-[#00ff88] hover:shadow-[0_0_8px_rgba(0,255,136,0.3)]"
    : "border border-[#c0dcc0] text-[#008844] hover:bg-[#008844] hover:text-white hover:border-[#008844]";

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full px-6 py-4 transition-colors duration-200 ${containerClass}`}
    >
      <div className="flex justify-between items-center">
        {/* Logo with Zap icon - but clean, no goofiness */}
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className={`w-9 h-9 flex items-center justify-center text-lg font-bold rounded-lg transition-all ${logoClass}`}
          >
            <Zap className="w-5 h-5" />
          </motion.div>
          <span className="font-semibold tracking-tight text-inherit text-lg sm:text-xl">
            ClauseLens
          </span>
        </Link>

        {/* Right side: desktop nav + toggle + mobile button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-2 sm:gap-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className={`px-4 py-2 font-medium text-sm sm:text-base rounded-lg transition-all ${getNavLinkClass(
                      isActive,
                    )}`}
                  >
                    {item.label}
                  </motion.button>
                </Link>
              );
            })}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all ${toggleButtonClass}`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 rounded-lg border ${isDarkMode ? "border-[#2a2e2a] text-[#00ff88]" : "border-[#c0dcc0] text-[#008844]"}`}
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown – clean, no squiggles */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col sm:hidden mt-5 space-y-2"
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
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-all ${getMobileLinkClass(
                      isActive,
                    )}`}
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
