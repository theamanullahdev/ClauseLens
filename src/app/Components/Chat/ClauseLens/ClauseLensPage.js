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
    <div
      className="min-h-[calc(100vh-64px)]"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
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
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
                style={{
                  border: "1px solid var(--border-color)",
                  background: "var(--accent-muted)",
                  color: "var(--accent)",
                }}
              >
                AI-Powered
              </div>
              <h1
                className="text-3xl sm:text-4xl font-bold leading-tight"
                style={{ color: "var(--foreground)" }}
              >
                Contract{" "}
                <span style={{ color: "var(--accent)" }}>Analysis</span>
              </h1>
              <p
                className="text-sm max-w-md mx-auto leading-relaxed"
                style={{ color: "var(--foreground)", opacity: 0.6 }}
              >
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
                  className="p-3 rounded-lg"
                  style={{
                    border: "1px solid var(--border-color)",
                    background: "var(--surface-strong)",
                  }}
                >
                  <p className="text-lg mb-1">{f.icon}</p>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "var(--foreground)", opacity: 0.6 }}
                  >
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
                className="max-w-lg mx-auto rounded-xl p-10 text-center space-y-4 mt-12"
                style={{
                  border: "1px solid rgba(239,68,68,0.3)",
                  background: "rgba(239,68,68,0.05)",
                }}
              >
                <p className="text-4xl">⚠️</p>
                <p className="text-red-500 font-semibold text-lg">
                  Analysis Failed
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--foreground)", opacity: 0.6 }}
                >
                  {error}
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleReset}
                  className="px-6 py-2.5 font-semibold rounded-lg text-sm transition-colors"
                  style={{ background: "var(--accent)", color: "#fff" }}
                >
                  Try Again
                </motion.button>
              </motion.div>
            ) : analysisData ? (
              <>
                {/* Toolbar */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl"
                  style={{
                    border: "1px solid var(--border-color)",
                    background: "var(--surface-strong)",
                    fontSize: `${zoom / 100}em`,
                  }}
                >
                  {/* Left: summary */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        analysisData.overall_risk === "HIGH"
                          ? "text-red-500 border-red-400/30 bg-red-400/10"
                          : analysisData.overall_risk === "MODERATE"
                            ? "text-yellow-500 border-yellow-400/30 bg-yellow-400/10"
                            : ""
                      }`}
                      style={
                        analysisData.overall_risk !== "HIGH" &&
                        analysisData.overall_risk !== "MODERATE"
                          ? {
                              color: "var(--accent)",
                              border: "1px solid var(--border-color)",
                              background: "var(--accent-muted)",
                            }
                          : {}
                      }
                    >
                      {analysisData.overall_risk} RISK
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--foreground)", opacity: 0.5 }}
                    >
                      {analysisData.summary}
                    </span>
                  </div>

                  {/* Right: zoom + downloads + reset */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Zoom */}
                    <div
                      className="flex items-center gap-1 rounded-lg overflow-hidden"
                      style={{ border: "1px solid var(--border-color)" }}
                    >
                      <button
                        onClick={zoomOut}
                        className="px-2.5 py-1.5 transition-all text-xs"
                        style={{ color: "var(--foreground)", opacity: 0.6 }}
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={zoomReset}
                        className="px-2.5 py-1.5 text-xs font-mono min-w-[42px] text-center"
                        style={{
                          color: "var(--foreground)",
                          opacity: 0.5,
                          borderLeft: "1px solid var(--border-color)",
                          borderRight: "1px solid var(--border-color)",
                        }}
                      >
                        {zoom}%
                      </button>
                      <button
                        onClick={zoomIn}
                        className="px-2.5 py-1.5 transition-all text-xs"
                        style={{ color: "var(--foreground)", opacity: 0.6 }}
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <DownloadButtons data={analysisData} />

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleReset}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        border: "1px solid var(--border-color)",
                        color: "var(--foreground)",
                        background: "transparent",
                        opacity: 0.7,
                      }}
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
