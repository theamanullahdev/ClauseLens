"use client";
import React from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { generatePDF } from "@/utils/generatePDF";
import { generateDOCX } from "@/utils/generateDOCX";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faFilePdf,
  faFileWord,
} from "@fortawesome/free-solid-svg-icons";

const ActionButtons = ({ content }) => {
  console.log("Received content in ActionButtons:", content);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error("Copy error:", err);
      toast.error("Copy failed.");
    }
  };

  const handleDownloadPDF = async () => {
    console.log("Calling generatePDF with:", content);
    try {
      await generatePDF(content);
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("PDF download failed.");
    }
  };

  const handleDownloadDOCX = async () => {
    console.log("Calling generateDOCX with:", content);
    try {
      await generateDOCX(content);
    } catch (err) {
      console.error("DOCX error:", err);
      toast.error("DOCX download failed.");
    }
  };

  const buttons = [
    {
      label: "Copy Letter",
      icon: faCopy,
      onClick: handleCopy,
    },
    {
      label: "Download PDF",
      icon: faFilePdf,
      onClick: handleDownloadPDF,
    },
    {
      label: "Download DOCX",
      icon: faFileWord,
      onClick: handleDownloadDOCX,
    },
    // You can add more here later, layout will adapt
  ];

  return (
    <div
      className="mt-6 grid gap-3 border-t border-neutral-800 pt-4"
      style={{ gridTemplateColumns: `repeat(${buttons.length}, 1fr)` }}
    >
      {buttons.map((btn, i) => (
        <motion.button
          key={i}
          onClick={btn.onClick}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-neutral-800 border border-white rounded hover:bg-white hover:text-black transition w-full"
        >
          <FontAwesomeIcon icon={btn.icon} className="text-base" />
          {btn.label}
        </motion.button>
      ))}
    </div>
  );
};

export default ActionButtons;
