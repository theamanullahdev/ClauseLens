"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ActionButtons from "./ActionButtons";

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
    <span className="ml-2">Generating Cover Letter</span>
  </div>
);

const Show = ({ data, loading }) => {
  console.log("Show component received data:", data);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full border border-neutral-300 rounded-lg p-4 flex flex-col bg-neutral-950 text-white overflow-y-auto"
    >
      <div className="mb-4 border-b border-neutral-700 pb-2">
        <h2 className="text-lg font-semibold">AI Generated Cover Letter</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Includes industry-relevant keywords to improve ATS compatibility and
          boost job match success.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-neutral-500 text-sm flex items-center gap-2"
          >
            <LoadingDots />
          </motion.div>
        ) : data?.aiMessage ? (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="whitespace-pre-wrap text-sm leading-relaxed font-mono tracking-wide"
          >
            {data.aiMessage}
            <ActionButtons content={data.aiMessage} />
          </motion.div>
        ) : data?.error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-red-400 text-sm"
          >
            {data.error}
          </motion.div>
        ) : (
          <motion.p
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-neutral-500 text-sm"
          >
            Waiting for input...
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Show;
