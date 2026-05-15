"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Uploader from "./Uploader";
import { toast } from "react-toastify";


const Input = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    prompt: "",
    jobDescription: "",
    cvText: "",
    file: null,
    tone: "professional",
    language: "english",
    length: "medium",
    style: "minimalist",
  });

  const [showUploader, setShowUploader] = useState(false);
  const promptRef = useRef(null);

  useEffect(() => {
    if (promptRef.current) {
      promptRef.current.style.height = "auto";
      promptRef.current.style.height = `${Math.min(
        promptRef.current.scrollHeight,
        10 * 24
      )}px`;
    }
  }, [formData.prompt]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = () => {
    setShowUploader(true);
  };

  const handleUploaderDone = (parsedText) => {
    setFormData((prev) => ({
      ...prev,
      cvText: prev.cvText
        ? prev.cvText.trim() + "\n\n" + parsedText.trim()
        : parsedText.trim(),
    }));
    setShowUploader(false);
  };

  const handleUploaderClose = () => {
    setShowUploader(false);
  };

  const handleSubmit = () => {
    const payload = { ...formData };
    console.log("Submitted Payload:", payload);
    if (onSubmit) onSubmit(payload);
  };

  return (
    <>
      <AnimatePresence>
        {showUploader && (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          >
            <Uploader
              onDone={handleUploaderDone}
              onClose={handleUploaderClose}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full flex flex-col border border-neutral-300 rounded-lg bg-black text-white"
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Prompt</label>
            <motion.textarea
              name="prompt"
              ref={promptRef}
              value={formData.prompt}
              onChange={handleChange}
              rows={1}
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="w-full bg-black border border-neutral-600 px-3 py-2 rounded-md resize-none outline-none focus:ring-2 focus:ring-cyan-500 overflow-y-auto max-h-[240px]"
              placeholder="e.g., Write a cover letter for a frontend dev role"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Job Description</label>
            <motion.textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              rows={5}
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="w-full bg-black border border-neutral-600 px-3 py-2 rounded-md resize-none outline-none focus:ring-2 focus:ring-cyan-500 overflow-y-auto max-h-[120px]"
              placeholder="Paste job description here..."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Your CV (Text)</label>
            <motion.textarea
              name="cvText"
              value={formData.cvText}
              onChange={handleChange}
              rows={5}
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="w-full bg-black border border-neutral-600 px-3 py-2 rounded-md resize-none outline-none focus:ring-2 focus:ring-cyan-500 overflow-y-auto max-h-[120px]"
              placeholder="Paste your CV here..."
            />
          </div>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-black px-2 text-sm text-neutral-500">OR</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Upload CV File (.pdf or .docx)
            </label>
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 250 }}
              onClick={handleFileUpload}
              className="w-full border border-neutral-600 px-4 py-2 rounded-md bg-neutral-800 text-white hover:bg-neutral-700 transition-all duration-150 text-sm"
            >
              Upload File
            </motion.button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tone</label>
            <motion.select
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="w-full bg-black text-white border border-neutral-600 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="friendly">Friendly</option>
            </motion.select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Language</label>
            <motion.select
              name="language"
              value={formData.language}
              onChange={handleChange}
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="w-full bg-black text-white border border-neutral-600 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="english">English</option>
              <option value="urdu">Urdu</option>
              <option value="french">French</option>
            </motion.select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Length</label>
            <motion.select
              name="length"
              value={formData.length}
              onChange={handleChange}
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="w-full bg-black text-white border border-neutral-600 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </motion.select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Style</label>
            <motion.select
              name="style"
              value={formData.style}
              onChange={handleChange}
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="w-full bg-black text-white border border-neutral-600 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="minimalist">Minimalist</option>
              <option value="creative">Creative</option>
              <option value="formal">Formal</option>
              <option value="informal">Informal</option>
            </motion.select>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-800 bg-black">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 250 }}
            onClick={handleSubmit}
            className="w-full border-4 border-white text-white font-bold py-3 rounded-md hover:bg-white hover:text-black transition-all duration-200 tracking-wide"
          >
            Generate Cover Letter
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default Input;
