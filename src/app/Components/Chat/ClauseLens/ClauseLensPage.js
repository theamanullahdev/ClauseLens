"use client";

"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import UploadZone from "./UploadZone";
import RiskOverview from "./RiskOverview";
import ChangeList from "./ChangeList";
import DetailPanel from "./DetailPanel";
import LoadingState from "./LoadingState";

const ClauseLensPage = () => {
  const [step, setStep] = useState("upload"); // 'upload' or 'results'
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedChange, setSelectedChange] = useState(null);
  const [error, setError] = useState(null);

  const handleFilesSelected = async (files) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/Chat/Analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          original: files.original,
          revised: files.revised,
        }),
      });

      const result = await response.json().catch(() => ({
        error: "Failed to parse server response",
      }));

      if (result.error) {
        setError(result.error || "Failed to analyze documents");
        toast.error("❌ " + (result.error || "Analysis failed"));
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status}`);
      }

      // Validate response structure
      if (!result.changes || !Array.isArray(result.changes)) {
        throw new Error("Invalid response format from server");
      }

      setAnalysisData(result);
      setStep("results");
      setSelectedChange(result.changes?.[0] || null);
      toast.success("✅ Analysis complete!");
    } catch (err) {
      console.error("Analysis error:", err);
      const errorMsg =
        err.message || "Failed to analyze documents - please try again";
      setError(errorMsg);
      toast.error("❌ " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setAnalysisData(null);
    setSelectedChange(null);
    setError(null);
  };

  const handleChangeSelect = (change) => {
    setSelectedChange(change);
  };

  return (
    <div className="w-full" style={{ height: "calc(100vh - 80px)" }}>
      <div className="w-full h-full flex flex-col md:flex-row gap-6 px-6 py-6">
        {/* Left Panel */}
        <AnimatePresence mode="wait">
          {step === "upload" ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full md:w-1/2 h-full"
            >
              <UploadZone onFilesSelected={handleFilesSelected} />
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full md:w-1/2 h-full flex flex-col gap-4 overflow-y-auto"
            >
              {loading ? (
                <LoadingState />
              ) : error ? (
                <motion.div className="border border-red-500/30 bg-red-500/10 rounded-lg p-6 text-red-400">
                  <p className="font-semibold mb-2">Error</p>
                  <p className="text-sm mb-4">{error}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Try Again
                  </motion.button>
                </motion.div>
              ) : (
                <>
                  {analysisData && <RiskOverview data={analysisData} />}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-lg font-semibold hover:bg-neutral-700 transition-colors"
                  >
                    Upload New Documents
                  </motion.button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Panel */}
        <AnimatePresence mode="wait">
          {step === "upload" ? (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="hidden md:flex w-1/2 h-full border border-neutral-700 rounded-lg bg-neutral-900/50 items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <p className="text-neutral-500 text-sm">
                  Upload two contract versions to begin analysis
                </p>
              </motion.div>
            </motion.div>
          ) : loading ? (
            <motion.div
              key="loading-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full md:w-1/2 h-full"
            >
              <LoadingState />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full md:w-1/2 h-full border border-red-500/30 bg-red-500/10 rounded-lg p-6 flex items-center justify-center"
            >
              <p className="text-red-400 text-sm text-center">{error}</p>
            </motion.div>
          ) : (
            <motion.div
              key="results-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full md:w-1/2 h-full flex flex-col gap-6"
            >
              {analysisData && (
                <>
                  <ChangeList
                    data={analysisData}
                    onSelectChange={handleChangeSelect}
                  />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClauseLensPage;
