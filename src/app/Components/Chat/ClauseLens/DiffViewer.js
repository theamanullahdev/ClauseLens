"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const DiffViewer = ({ change }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="border border-neutral-700 rounded-lg p-4 bg-neutral-900/50"
    >
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between hover:opacity-75 transition-opacity"
      >
        <span className="text-sm font-medium text-neutral-300">View Details</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-neutral-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-3"
          >
            {/* Original Text */}
            {change.original && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Original
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <p className="text-sm text-red-300/90 leading-relaxed line-through opacity-75">
                    {change.original}
                  </p>
                </motion.div>
              </div>
            )}

            {/* Modified Text */}
            {change.modified && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Revised
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                >
                  <p className="text-sm text-green-300/90 leading-relaxed font-semibold">
                    {change.modified}
                  </p>
                </motion.div>
              </div>
            )}

            {/* Addition Only */}
            {change.type === "addition" && !change.original && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Added
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg"
                >
                  <p className="text-sm text-cyan-300/90 leading-relaxed">
                    {change.modified}
                  </p>
                </motion.div>
              </div>
            )}

            {/* Removal Only */}
            {change.type === "removal" && !change.modified && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                  Removed
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <p className="text-sm text-red-300/90 leading-relaxed line-through opacity-75">
                    {change.original}
                  </p>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DiffViewer;
