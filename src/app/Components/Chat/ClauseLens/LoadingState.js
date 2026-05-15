"use client";

import React from "react";
import { motion } from "framer-motion";

const LoadingDots = () => (
  <div className="text-cyan-400 text-sm font-mono tracking-wide flex gap-1 items-center">
    <motion.span
      animate={{ opacity: [0.2, 1, 0.2] }}
      transition={{ duration: 1.2, repeat: Infinity }}
    >
      •
    </motion.span>
    <motion.span
      animate={{ opacity: [0.2, 1, 0.2] }}
      transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
    >
      •
    </motion.span>
    <motion.span
      animate={{ opacity: [0.2, 1, 0.2] }}
      transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
    >
      •
    </motion.span>
    <span className="ml-2">Analyzing Contract</span>
  </div>
);

const SkeletonLine = () => (
  <motion.div
    animate={{ opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 2, repeat: Infinity }}
    className="h-3 bg-neutral-700 rounded-full w-full mb-3"
  />
);

const LoadingState = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full flex flex-col gap-4"
    >
      <div className="flex items-center gap-3 mb-6">
        <LoadingDots />
      </div>

      {/* Skeleton Changes */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="border border-neutral-700 rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <SkeletonLine />
              </div>
              <div className="w-20 h-6 bg-neutral-700 rounded-full" />
            </div>
            <SkeletonLine />
            <SkeletonLine />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingState;
