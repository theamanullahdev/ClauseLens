"use client";

import React from "react";
import { motion } from "framer-motion";

const RiskOverview = ({ data }) => {
  const changes = data?.changes || [];
  const critical = changes.filter((c) => c.risk_level === "CRITICAL").length;
  const moderate = changes.filter((c) => c.risk_level === "MODERATE").length;
  const minor = changes.filter((c) => c.risk_level === "MINOR").length;

  const riskConfig = {
    HIGH: {
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/30",
      glow: "shadow-[0_0_12px_rgba(255,51,102,0.2)]",
      dot: "bg-red-400",
    },
    MODERATE: {
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/30",
      glow: "shadow-[0_0_12px_rgba(255,170,0,0.2)]",
      dot: "bg-yellow-400",
    },
    LOW: {
      color: "text-[#00ff88]",
      bg: "bg-[#00ff88]/10 border-[#00ff88]/30",
      glow: "shadow-[0_0_12px_rgba(0,255,136,0.2)]",
      dot: "bg-[#00ff88]",
    },
  };
  const cfg = riskConfig[data.overall_risk] || riskConfig.LOW;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-xl border border-[#2a2e2a] bg-[#111411] overflow-hidden"
    >
      {/* Top strip */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2e2a]">
        <div>
          <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold mb-1">
            Overall Risk
          </p>
          <p className="text-white font-semibold text-sm leading-snug">
            {data.summary}
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm ${cfg.color} ${cfg.bg} ${cfg.glow}`}
        >
          <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
          {data.overall_risk}
        </motion.div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-[#2a2e2a]">
        {[
          {
            label: "Critical",
            count: critical,
            color: "text-red-400",
            bg: "hover:bg-red-500/5",
          },
          {
            label: "Moderate",
            count: moderate,
            color: "text-yellow-400",
            bg: "hover:bg-yellow-500/5",
          },
          {
            label: "Minor",
            count: minor,
            color: "text-blue-400",
            bg: "hover:bg-blue-500/5",
          },
        ].map((s) => (
          <motion.div
            key={s.label}
            whileHover={{ backgroundColor: "transparent" }}
            className={`flex flex-col items-center justify-center py-4 transition-colors ${s.bg}`}
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RiskOverview;
