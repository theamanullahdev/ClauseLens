"use client";

import React from "react";
import { motion } from "framer-motion";

const RiskOverview = ({ data }) => {
  const getRiskBadgeColor = (risk) => {
    switch (risk) {
      case "HIGH":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "MODERATE":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "LOW":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case "HIGH":
        return "⚠️";
      case "MODERATE":
        return "⚡";
      case "LOW":
        return "✓";
      default:
        return "•";
    }
  };

  // Count changes by risk level
  const changes = data?.changes || [];
  const criticalCount = changes.filter(
    (c) => c.risk_level === "CRITICAL"
  ).length || 0;
  const moderateCount = changes.filter(
    (c) => c.risk_level === "MODERATE"
  ).length || 0;
  const minorCount = changes.filter(
    (c) => c.risk_level === "MINOR"
  ).length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full border border-neutral-700 rounded-lg p-6 bg-neutral-900 space-y-4"
    >
      {/* Overall Risk */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-400 mb-1">Overall Risk</p>
          <p className="text-2xl font-bold">{data.summary || "No changes detected"}</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`px-4 py-2 rounded-lg border font-semibold text-lg ${getRiskBadgeColor(
            data.overall_risk
          )}`}
        >
          {getRiskIcon(data.overall_risk)} {data.overall_risk}
        </motion.div>
      </div>

      {/* Risk Breakdown */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-700">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-center"
        >
          <p className="text-2xl font-bold text-red-400">{criticalCount}</p>
          <p className="text-xs text-neutral-400 mt-1">Critical</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-center"
        >
          <p className="text-2xl font-bold text-yellow-400">{moderateCount}</p>
          <p className="text-xs text-neutral-400 mt-1">Moderate</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center"
        >
          <p className="text-2xl font-bold text-blue-400">{minorCount}</p>
          <p className="text-xs text-neutral-400 mt-1">Minor</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RiskOverview;
