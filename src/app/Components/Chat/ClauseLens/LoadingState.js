"use client";

import React from "react";
import { motion } from "framer-motion";

const Shimmer = ({ w = "full", delay = 0 }) => (
  <motion.div
    animate={{ opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 1.8, repeat: Infinity, delay }}
    className={`h-3 rounded-full bg-[#1e221e] w-${w}`}
  />
);

const LoadingState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-6 py-4"
  >
    {/* Status */}
    <div className="flex items-center gap-3 px-1">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        className="w-5 h-5 border-2 border-[#00ff88]/20 border-t-[#00ff88] rounded-full flex-shrink-0"
      />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-white">Analyzing contracts…</p>
        <p className="text-xs text-neutral-500">
          Detecting changes and assessing risk levels
        </p>
      </div>
    </div>

    {/* Skeleton risk bar */}
    <div className="rounded-xl border border-[#2a2e2a] bg-[#111411] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#2a2e2a] flex items-center justify-between">
        <div className="space-y-2 flex-1 mr-8">
          <Shimmer w="32" />
          <Shimmer w="48" delay={0.1} />
        </div>
        <div className="w-20 h-8 rounded-xl bg-[#1e221e] animate-pulse" />
      </div>
      <div className="grid grid-cols-3 divide-x divide-[#2a2e2a]">
        {[0, 0.1, 0.2].map((d, i) => (
          <div key={i} className="flex flex-col items-center py-4 gap-2">
            <div className="w-8 h-7 rounded-lg bg-[#1e221e] animate-pulse" />
            <div className="w-12 h-2.5 rounded-full bg-[#1e221e] animate-pulse" />
          </div>
        ))}
      </div>
    </div>

    {/* Skeleton cards */}
    <div className="rounded-xl border border-[#2a2e2a] bg-[#0c0f0c] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#2a2e2a]">
        <Shimmer w="28" />
      </div>
      <div className="p-4 space-y-3">
        {[0, 0.08, 0.16].map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d + 0.2 }}
            className="rounded-xl border border-[#2a2e2a] p-4 space-y-2.5"
          >
            <div className="flex gap-2">
              <Shimmer w="24" delay={d} />
              <div className="w-16 h-3 rounded-full bg-[#1e221e]" />
            </div>
            <Shimmer w="full" delay={d + 0.05} />
            <Shimmer w="3/4" delay={d + 0.1} />
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default LoadingState;
