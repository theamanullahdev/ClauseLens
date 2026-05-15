"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import DiffViewer from "./DiffViewer";

const ChangeCard = ({ change, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const getRecommendationColor = (rec) => {
    switch (rec) {
      case "Reject":
        return "text-red-400";
      case "Negotiate":
        return "text-yellow-400";
      case "Acceptable":
        return "text-green-400";
      default:
        return "text-neutral-400";
    }
  };

  const getChangeTypeIcon = (type) => {
    switch (type) {
      case "addition":
        return "➕";
      case "removal":
        return "➖";
      case "modification":
        return "✏️";
      default:
        return "•";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`border rounded-lg p-4 transition-all ${getRiskBg(
        change.risk_level
      )}`}
    >
      {/* Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-start justify-between hover:opacity-75 transition-opacity"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{getChangeTypeIcon(change.type)}</span>
            <h3 className="font-semibold text-white text-sm sm:text-base">
              {change.section}
            </h3>
            <motion.span
              className={`text-xs font-bold px-2 py-1 rounded border ${getRiskColor(
                change.risk_level
              )} border-current`}
            >
              {change.risk_level}
            </motion.span>
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed">
            {change.plain_english}
          </p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-3 flex-shrink-0 mt-1"
        >
          <ChevronDown className="w-4 h-4 text-neutral-400" />
        </motion.div>
      </motion.button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-4 border-t border-current border-opacity-20 pt-4"
          >
            {/* Why It Matters */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                Why It Matters
              </p>
              <p className="text-sm text-neutral-300 leading-relaxed">
                {change.why_it_matters}
              </p>
            </div>

            {/* Recommendation */}
            <div className="flex items-center justify-between p-3 bg-neutral-900/50 rounded-lg border border-neutral-700">
              <span className="text-sm text-neutral-400">Recommendation:</span>
              <motion.span
                className={`font-bold text-sm ${getRecommendationColor(
                  change.recommendation
                )}`}
              >
                {change.recommendation}
              </motion.span>
            </div>

            {/* Diff Viewer */}
            <DiffViewer change={change} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChangeCard;
