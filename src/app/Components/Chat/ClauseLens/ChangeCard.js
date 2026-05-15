"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const RISK = {
  CRITICAL: {
    text: "text-red-400",
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    badge: "border-red-400/40 text-red-400",
  },
  MODERATE: {
    text: "text-yellow-400",
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
    badge: "border-yellow-400/40 text-yellow-400",
  },
  MINOR: {
    text: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    badge: "border-blue-400/40 text-blue-400",
  },
};

const REC = {
  Reject: "text-red-400",
  Negotiate: "text-yellow-400",
  Acceptable: "text-[#00ff88]",
};

const TYPE_ICON = { addition: "＋", removal: "－", modification: "✎" };

const ChangeCard = ({ change, index }) => {
  const [open, setOpen] = useState(false);
  const r = RISK[change.risk_level] || RISK.MINOR;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`rounded-xl border ${r.border} ${r.bg} overflow-hidden transition-all`}
    >
      {/* Header row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className={`text-base mt-0.5 flex-shrink-0 font-mono ${r.text}`}>
          {TYPE_ICON[change.type] || "•"}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h3 className="text-sm font-semibold text-white">
              {change.section}
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${r.badge}`}
            >
              {change.risk_level}
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {change.plain_english}
          </p>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 mt-1"
        >
          <ChevronDown className="w-4 h-4 text-neutral-500" />
        </motion.div>
      </button>

      {/* Expanded */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
              {/* Why it matters */}
              <div className="p-3 rounded-lg bg-[#111411] border border-[#2a2e2a]">
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold mb-1">
                  Why it matters
                </p>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {change.why_it_matters}
                </p>
              </div>

              {/* Recommendation */}
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#111411] border border-[#2a2e2a]">
                <span className="text-xs text-neutral-500">Recommendation</span>
                <span
                  className={`text-xs font-bold ${REC[change.recommendation] || "text-neutral-400"}`}
                >
                  {change.recommendation}
                </span>
              </div>

              {/* Text diff */}
              {(change.original || change.modified) && (
                <div className="space-y-2">
                  {change.original && (
                    <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                      <p className="text-[10px] text-red-400 uppercase tracking-wider font-semibold mb-1.5">
                        Before
                      </p>
                      <p className="text-xs text-red-300/70 leading-relaxed line-through">
                        {change.original}
                      </p>
                    </div>
                  )}
                  {change.modified && (
                    <div className="p-3 rounded-lg bg-[#00ff88]/5 border border-[#00ff88]/20">
                      <p className="text-[10px] text-[#00ff88] uppercase tracking-wider font-semibold mb-1.5">
                        After
                      </p>
                      <p className="text-xs text-[#00ff88]/80 leading-relaxed">
                        {change.modified}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChangeCard;
