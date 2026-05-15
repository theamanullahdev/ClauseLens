"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import ChangeCard from "./ChangeCard";

const FILTERS = [
  { label: "All", value: "ALL" },
  { label: "Critical", value: "CRITICAL" },
  { label: "Moderate", value: "MODERATE" },
  { label: "Minor", value: "MINOR" },
];

const ChangeList = ({ data }) => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const changes = data?.changes || [];
  const filtered = changes.filter(
    (c) => activeFilter === "ALL" || c.risk_level === activeFilter,
  );

  const countFor = (v) =>
    v === "ALL"
      ? changes.length
      : changes.filter((c) => c.risk_level === v).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full rounded-xl border border-[#2a2e2a] bg-[#0c0f0c] overflow-hidden"
    >
      {/* Header + filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-[#2a2e2a]">
        <div>
          <h2 className="text-sm font-semibold text-white">Detected Changes</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {filtered.length} change{filtered.length !== 1 ? "s" : ""} shown
          </p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <motion.button
              key={f.value}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveFilter(f.value)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all
                ${
                  activeFilter === f.value
                    ? "bg-[#00ff88] text-black"
                    : "bg-[#1a1e1a] text-neutral-400 border border-[#2a2e2a] hover:border-[#00ff88]/30 hover:text-[#00ff88]"
                }`}
            >
              {f.label}{" "}
              <span className="opacity-60 ml-0.5">({countFor(f.value)})</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto scrollbar-hide">
        {filtered.length > 0 ? (
          filtered.map((change, i) => (
            <ChangeCard key={change.id} change={change} index={i} />
          ))
        ) : (
          <div className="flex items-center justify-center h-24 text-neutral-600 text-sm">
            No changes in this category
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChangeList;
