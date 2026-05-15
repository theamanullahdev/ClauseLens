"use client";
import React from "react";
import { motion } from "framer-motion";

const CVmaker = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-xl"
      >
        <h1 className="text-4xl font-bold mb-4">CV Maker? Its cooking.</h1>
        <p className="text-neutral-400 text-lg leading-relaxed">
          Your story deserves more than bullet points.
          <br />
          We’re building a CV tool that actually *gets* you.
          <br />
          Hang tight. Good things are on the way.
        </p>
      </motion.div>
    </div>
  );
};

export default CVmaker;
