"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import ChangeCard from "./ChangeCard";

const ChangeList = ({ data, onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filters = [
    { label: "All", value: "ALL" },
    { label: "Critical", value: "CRITICAL" },
    { label: "Moderate", value: "MODERATE" },
    { label: "Minor", value: "MINOR" },
  ];

  // Safely handle data
  const changes = data?.changes || [];
  const filteredChanges = changes.filter(
    (change) => activeFilter === "ALL" || change.risk_level === activeFilter
  );

  const handleFilterChange = (value) => {
    setActiveFilter(value);
    if (onFilterChange) {
      onFilterChange(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full border border-neutral-300 rounded-lg bg-black text-white p-6 flex flex-col"
    >
      <div className="mb-6 border-b border-neutral-700 pb-4">
        <h2 className="text-lg font-semibold">Detected Changes</h2>
        <p className="text-xs text-neutral-400 mt-1">
          {filteredChanges.length} change{filteredChanges.length !== 1 ? "s" : ""}{" "}
          found
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <motion.button
            key={filter.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFilterChange(filter.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === filter.value
                ? "bg-cyan-500 text-black"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            {filter.label}
          </motion.button>
        ))}
      </div>

      {/* Changes List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
        {filteredChanges.length > 0 ? (
          filteredChanges.map((change, index) => (
            <ChangeCard key={change.id} change={change} index={index} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-32 text-neutral-500 text-sm"
          >
            No changes found in this category
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ChangeList;
