"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileText, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { parseFile } from "@/lib/parseFile";

const UploadBox = ({ type, label, file, loading, onSelect, onClear }) => {
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) onSelect(type, f);
  };

  return (
    <motion.div
      whileHover={{ borderColor: "rgba(0,255,136,0.4)" }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current?.click()}
      className={`relative w-full rounded-xl border-2 border-dashed transition-all cursor-pointer p-5
        ${file ? "border-[#00ff88]/40 bg-[#00ff88]/5 cursor-default" : "border-[#2a2e2a] bg-[#111411] hover:bg-[#141814]"}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(type, f);
        }}
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 py-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-[#00ff88]/20 border-t-[#00ff88] rounded-full flex-shrink-0"
            />
            <p className="text-sm text-neutral-400">Parsing file...</p>
          </motion.div>
        ) : file ? (
          <motion.div
            key="file"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-[#00ff88]/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-[#00ff88]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {file.name}
              </p>
              <p className="text-xs text-neutral-500">
                {(file.size / 1024).toFixed(1)} KB · {label}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onClear(type);
              }}
              className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-neutral-400 hover:text-red-400" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 py-1"
          >
            <div className="w-9 h-9 rounded-lg bg-[#1a1e1a] border border-[#2a2e2a] flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-neutral-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="text-xs text-neutral-500">
                PDF, DOCX or TXT · Max 10MB
              </p>
            </div>
            <div className="ml-auto">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2a2e2a] text-xs text-neutral-400">
                <Upload className="w-3 h-3" /> Browse
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const UploadZone = ({ onFilesSelected }) => {
  const [files, setFiles] = useState({ original: null, revised: null });
  const [fileContent, setFileContent] = useState({
    original: null,
    revised: null,
  });
  const [loading, setLoading] = useState({ original: false, revised: false });

  const handleFileSelect = async (type, file) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("❌ Only PDF, DOCX, and TXT files supported");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("❌ File exceeds 10MB limit");
      return;
    }

    setLoading((p) => ({ ...p, [type]: true }));
    setFiles((p) => ({ ...p, [type]: file }));

    try {
      const result = await parseFile(file);
      if (result.error) {
        toast.error(result.error);
        setFiles((p) => ({ ...p, [type]: null }));
        return;
      }
      const newContent = { ...fileContent, [type]: result.text };
      setFileContent(newContent);
      toast.success(`✅ ${label(type)} loaded`);

      const other = type === "original" ? "revised" : "original";
      if (newContent[other]) {
        setTimeout(
          () =>
            onFilesSelected({
              original: newContent.original,
              revised: newContent.revised,
            }),
          300,
        );
      }
    } catch {
      toast.error("Failed to parse file");
      setFiles((p) => ({ ...p, [type]: null }));
    } finally {
      setLoading((p) => ({ ...p, [type]: false }));
    }
  };

  const clearFile = (type) => {
    setFiles((p) => ({ ...p, [type]: null }));
    setFileContent((p) => ({ ...p, [type]: null }));
  };

  const label = (type) =>
    type === "original" ? "Original Document" : "Revised Document";

  const bothReady = fileContent.original && fileContent.revised;

  return (
    <div className="w-full space-y-4">
      <UploadBox
        type="original"
        label="Original Contract"
        file={files.original}
        loading={loading.original}
        onSelect={handleFileSelect}
        onClear={clearFile}
      />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#2a2e2a]" />
        <span className="text-xs text-neutral-600 font-mono">vs</span>
        <div className="flex-1 h-px bg-[#2a2e2a]" />
      </div>

      <UploadBox
        type="revised"
        label="Revised Contract"
        file={files.revised}
        loading={loading.revised}
        onSelect={handleFileSelect}
        onClear={clearFile}
      />

      {/* Analyze button */}
      <motion.button
        whileHover={{ scale: bothReady ? 1.02 : 1 }}
        whileTap={{ scale: bothReady ? 0.98 : 1 }}
        onClick={() =>
          bothReady &&
          onFilesSelected({
            original: fileContent.original,
            revised: fileContent.revised,
          })
        }
        disabled={!bothReady}
        className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all mt-2
          ${
            bothReady
              ? "bg-[#00ff88] text-black hover:bg-[#00dd77] shadow-[0_0_20px_rgba(0,255,136,0.2)]"
              : "bg-[#111411] text-neutral-600 border border-[#2a2e2a] cursor-not-allowed"
          }`}
      >
        {bothReady
          ? "⚡ Analyze Documents"
          : "Upload both documents to continue"}
      </motion.button>
    </div>
  );
};

export default UploadZone;
