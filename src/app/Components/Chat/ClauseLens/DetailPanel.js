"use client";

import React from "react";
import { motion } from "framer-motion";

const DetailPanel = ({ change }) => {
  if (!change) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full border border-neutral-300 rounded-lg bg-black text-white p-6 flex items-center justify-center"
      >
        <p className="text-neutral-400 text-sm">Select a change to view details</p>
      </motion.div>
    );
  }

  const getRiskColor = (level) => {
    switch (level) {
      case "CRITICAL":
        return "text-red-400";
      case "MODERATE":
        return "text-yellow-400";
      case "MINOR":
        return "text-blue-400";
      default:
        return "text-neutral-400";
    }
  };

  const getRiskBg = (level) => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-500/10 border-red-500/30";
      case "MODERATE":
        return "bg-yellow-500/10 border-yellow-500/30";
      case "MINOR":
        return "bg-blue-500/10 border-blue-500/30";
      default:
        return "bg-neutral-500/10 border-neutral-500/30";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full border border-neutral-300 rounded-lg bg-black text-white p-6 flex flex-col overflow-y-auto"
    >
      {/* Header */}
      <div className="mb-6 border-b border-neutral-700 pb-4">
        <div className="flex items-start gap-3 mb-3">
          <div>
            <h2 className="text-xl font-semibold">{change.section}</h2>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span
                className={`text-xs font-bold px-2 py-1 rounded border ${getRiskColor(
                  change.risk_level
                )} border-current`}
              >
                {change.risk_level}
              </span>
              <span className="text-xs font-bold px-2 py-1 rounded border border-cyan-500/30 text-cyan-400 uppercase">
                {change.type}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
        {/* Plain English */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
            Change Summary
          </p>
          <p className="text-sm leading-relaxed text-neutral-200">
            {change.plain_english}
          </p>
        </motion.div>

        {/* Why It Matters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`space-y-2 p-4 rounded-lg border ${getRiskBg(
            change.risk_level
          )}`}
        >
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
            Why It Matters
          </p>
          <p className="text-sm leading-relaxed text-neutral-200">
            {change.why_it_matters}
          </p>
        </motion.div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
            Recommendation
          </p>
          <motion.div className="p-4 bg-neutral-900 border border-neutral-700 rounded-lg">
            <p
              className={`font-bold text-lg ${
                change.recommendation === "Reject"
                  ? "text-red-400"
                  : change.recommendation === "Negotiate"
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {change.recommendation}
            </p>
          </motion.div>
        </motion.div>

        {/* Original & Modified */}
        {(change.original || change.modified) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-3"
          >
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
              Text Comparison
            </p>

            {change.original && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-xs font-semibold text-red-400 mb-2 uppercase">
                  Original
                </p>
                <p className="text-sm text-red-300/80 leading-relaxed line-through opacity-75">
                  {change.original}
                </p>
              </div>
            )}

            {change.modified && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-xs font-semibold text-green-400 mb-2 uppercase">
                  Modified
                </p>
                <p className="text-sm text-green-300/80 leading-relaxed font-semibold">
                  {change.modified}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DetailPanel;
