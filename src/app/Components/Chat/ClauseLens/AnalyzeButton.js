"use client";

import React from "react";
import { motion } from "framer-motion";

const AnalyzeButton = ({ onClick, disabled, loading }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-3 px-4 font-semibold rounded-lg transition-all ${
        disabled || loading
          ? "opacity-50 cursor-not-allowed bg-neutral-700 text-neutral-400"
          : "bg-cyan-500 text-black hover:bg-cyan-400"
      }`}
    >
      {loading ? (
        <motion.div className="flex items-center justify-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-cyan-300/30 border-t-cyan-300 rounded-full"
          />
          Analyzing...
        </motion.div>
      ) : (
        "Analyze Documents"
      )}
    </motion.button>
  );
};

export default AnalyzeButton;
