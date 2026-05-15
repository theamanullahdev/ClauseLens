"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X } from "lucide-react";
import { toast } from "react-toastify";
import { parseFile } from "@/lib/parseFile";

const UploadZone = ({ onFilesSelected }) => {
  const [files, setFiles] = useState({ original: null, revised: null });
  const [fileContent, setFileContent] = useState({ original: null, revised: null });
  const [loading, setLoading] = useState({ original: false, revised: false });
  const fileInputRef = useRef({ original: null, revised: null });

  const handleFileSelect = async (type, file) => {
    if (!file) return;

    // Check file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error("❌ Only PDF, DOCX, and TXT files are supported");
      return;
    }

    // Check file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("❌ File size exceeds 10MB limit");
      return;
    }

    setLoading((prev) => ({ ...prev, [type]: true }));
    setFiles((prev) => ({ ...prev, [type]: file }));

    try {
      const result = await parseFile(file);
      if (result.error) {
        toast.error(result.error);
        setFiles((prev) => ({ ...prev, [type]: null }));
      } else {
        setFileContent((prev) => ({ ...prev, [type]: result.text }));
        toast.success(`✅ ${type === "original" ? "Original" : "Revised"} document loaded`);
        
        // Auto-trigger if both files are loaded
        if ((type === "original" && fileContent.revised) || (type === "revised" && fileContent.original)) {
          setTimeout(() => {
            onFilesSelected({
              original: type === "original" ? result.text : fileContent.original,
              revised: type === "revised" ? result.text : fileContent.revised,
            });
          }, 300);
        }
      }
    } catch (error) {
      console.error("Parse error:", error);
      toast.error("Failed to parse file");
      setFiles((prev) => ({ ...prev, [type]: null }));
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    handleFileSelect(type, file);
  };

  const handleInputChange = (type, e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(type, file);
  };

  const clearFile = (type) => {
    setFiles((prev) => ({ ...prev, [type]: null }));
    setFileContent((prev) => ({ ...prev, [type]: null }));
    if (fileInputRef.current[type]) {
      fileInputRef.current[type].value = "";
    }
  };

  const UploadBox = ({ type, label }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDrop={(e) => handleDrop(e, type)}
      className="w-full flex flex-col border-2 border-dashed border-neutral-600 rounded-lg p-6 bg-neutral-900/50 hover:border-cyan-500/50 transition-colors cursor-pointer group"
      onClick={() => fileInputRef.current[type]?.click()}
    >
      <input
        ref={(el) => {
          fileInputRef.current[type] = el;
        }}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={(e) => handleInputChange(type, e)}
        className="hidden"
      />

      {files[type] ? (
        <motion.div
          key="file"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white truncate">
                {files[type].name}
              </p>
              <p className="text-xs text-neutral-400">
                {(files[type].size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              clearFile(type);
            }}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-neutral-400 hover:text-red-400" />
          </motion.button>
        </motion.div>
      ) : loading[type] ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full"
          />
          <p className="text-sm text-neutral-400">Parsing file...</p>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center group-hover:bg-neutral-700 transition-colors">
            <Upload className="w-6 h-6 text-neutral-400 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-white">{label}</p>
            <p className="text-xs text-neutral-400 mt-1">
              Drag & drop or click to upload
            </p>
            <p className="text-xs text-neutral-500 mt-1">PDF, DOCX, TXT • Max 10MB</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full border border-neutral-300 rounded-lg bg-black text-white p-6 flex flex-col"
    >
      <div className="mb-6 border-b border-neutral-700 pb-4">
        <h2 className="text-lg font-semibold">Contract Comparison</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Upload two versions of your contract to detect changes and assess risk levels.
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div className="flex-1 flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">Original Document</label>
          <UploadBox type="original" label="Original Document" />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <label className="text-sm font-medium text-neutral-300">Revised Document</label>
          <UploadBox type="revised" label="Revised Document" />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() =>
            fileContent.original &&
            fileContent.revised &&
            onFilesSelected({
              original: fileContent.original,
              revised: fileContent.revised,
            })
          }
          disabled={!fileContent.original || !fileContent.revised}
          className="w-full py-3 px-4 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
        >
          Analyze Documents
        </motion.button>
      </div>
    </motion.div>
  );
};

export default UploadZone;
