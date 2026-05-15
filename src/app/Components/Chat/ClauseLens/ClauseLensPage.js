"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import UploadZone from "./UploadZone";
import RiskOverview from "./RiskOverview";
import ChangeList from "./ChangeList";
import LoadingState from "./LoadingState";
import DownloadButtons from "./DownloadButtons";

const ClauseLensPage = () => {
  const [step, setStep] = useState("upload");
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(100);

  const zoomIn = () => setZoom((z) => Math.min(z + 10, 150));
  const zoomOut = () => setZoom((z) => Math.max(z - 10, 70));
  const zoomReset = () => setZoom(100);

  const handleFilesSelected = async (files) => {
    setLoading(true);
    setError(null);
    setStep("results");

    try {
      const response = await fetch("/api/Chat/Analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original: files.original,
          revised: files.revised,
        }),
      });

      const result = await response
        .json()
        .catch(() => ({ error: "Failed to parse server response" }));

      if (!response.ok || result.error)
        throw new Error(result.error || `Server error: ${response.status}`);
      if (!result.changes || !Array.isArray(result.changes))
        throw new Error("Invalid response format from server");

      setAnalysisData(result);
      toast.success("✅ Analysis complete!");
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message || "Failed to analyze documents — please try again");
      toast.error("❌ " + (err.message || "Analysis failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("upload");
    setAnalysisData(null);
    setError(null);
    setZoom(100);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0a0a0a] text-white">
      <AnimatePresence mode="wait">
        {/* ── UPLOAD ── */}
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl mx-auto px-4 py-12 flex flex-col gap-8"
          >
            {/* Hero */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00ff88]/20 bg-[#00ff88]/5 text-[#00ff88] text-xs font-semibold tracking-widest uppercase">
                AI-Powered
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                Contract <span className="text-[#00ff88]">Analysis</span>
              </h1>
              <p className="text-neutral-400 text-sm max-w-md mx-auto leading-relaxed">
                Upload two versions of a contract. Get every change detected,
                risk-scored, and explained in plain English.
              </p>
            </div>

            <UploadZone onFilesSelected={handleFilesSelected} />

            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { icon: "⚡", label: "Instant Analysis" },
                { icon: "🛡️", label: "Risk Scoring" },
                { icon: "📄", label: "Export Reports" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="p-3 rounded-lg border border-[#2a2e2a] bg-[#111411]"
                >
                  <p className="text-lg mb-1">{f.icon}</p>
                  <p className="text-xs text-neutral-400 font-medium">
                    {f.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── RESULTS ── */}
        {step === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="w-full px-4 sm:px-6 lg:px-10 py-6 flex flex-col gap-5"
          >
            {loading ? (
              <div className="max-w-4xl mx-auto w-full">
                <LoadingState />
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg mx-auto border border-red-500/30 bg-red-500/5 rounded-xl p-10 text-center space-y-4 mt-12"
              >
                <p className="text-4xl">⚠️</p>
                <p className="text-red-400 font-semibold text-lg">
                  Analysis Failed
                </p>
                <p className="text-neutral-400 text-sm">{error}</p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-[#00ff88] text-black font-semibold rounded-lg hover:bg-[#00dd77] transition-colors text-sm"
                >
                  Try Again
                </motion.button>
              </motion.div>
            ) : analysisData ? (
              <>
                {/* Toolbar */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl border border-[#2a2e2a] bg-[#111411]"
                  style={{ fontSize: `${zoom / 100}em` }}
                >
                  {/* Left: summary */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        analysisData.overall_risk === "HIGH"
                          ? "text-red-400 border-red-400/30 bg-red-400/10"
                          : analysisData.overall_risk === "MODERATE"
                            ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                            : "text-[#00ff88] border-[#00ff88]/30 bg-[#00ff88]/10"
                      }`}
                    >
                      {analysisData.overall_risk} RISK
                    </span>
                    <span className="text-xs text-neutral-500">
                      {analysisData.summary}
                    </span>
                  </div>

                  {/* Right: zoom + downloads + reset */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Zoom */}
                    <div className="flex items-center gap-1 border border-[#2a2e2a] rounded-lg overflow-hidden">
                      <button
                        onClick={zoomOut}
                        className="px-2.5 py-1.5 text-neutral-400 hover:text-[#00ff88] hover:bg-[#00ff88]/5 transition-all text-xs"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={zoomReset}
                        className="px-2.5 py-1.5 text-neutral-500 hover:text-white text-xs font-mono border-x border-[#2a2e2a] min-w-[42px] text-center"
                      >
                        {zoom}%
                      </button>
                      <button
                        onClick={zoomIn}
                        className="px-2.5 py-1.5 text-neutral-400 hover:text-[#00ff88] hover:bg-[#00ff88]/5 transition-all text-xs"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <DownloadButtons data={analysisData} />

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleReset}
                      className="flex items-center gap-1.5 px-3 py-2 border border-[#2a2e2a] text-neutral-400 rounded-lg text-xs font-semibold hover:border-[#00ff88]/30 hover:text-[#00ff88] transition-all"
                    >
                      <RotateCcw className="w-3 h-3" /> New Upload
                    </motion.button>
                  </div>
                </div>

                {/* Content — zoom applied here */}
                <div
                  style={{ fontSize: `${zoom / 100}em` }}
                  className="flex flex-col gap-5 transition-all duration-200"
                >
                  <RiskOverview data={analysisData} />
                  <ChangeList data={analysisData} />
                </div>
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClauseLensPage;
