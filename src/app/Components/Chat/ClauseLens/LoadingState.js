"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { label: "Reading document structure",      triggerAt: 3  },
  { label: "Mapping clause boundaries",       triggerAt: 8  },
  { label: "Diffing original vs revised",     triggerAt: 14 },
  { label: "Running risk classification",     triggerAt: 22 },
  { label: "Scoring each change",             triggerAt: 35 },
  { label: "Writing plain-English summaries", triggerAt: 55 },
  { label: "Finalizing report",               triggerAt: 85 },
];

const MESSAGES = [
  "Parsing document structure…",
  "Mapping clause boundaries…",
  "Comparing versions side-by-side…",
  "Identifying risk patterns…",
  "Scoring liability clauses…",
  "Evaluating indemnification changes…",
  "Checking termination language…",
  "Analyzing payment terms…",
  "Reviewing IP ownership clauses…",
  "Writing plain-English summaries…",
  "Finalizing risk assessment…",
];

const LOGS = [
  "→ Loaded 2 documents",
  "→ Tokenizing paragraphs…",
  "→ Found clause segments",
  "→ Running semantic diff…",
  "→ Deltas identified",
  "→ Classifying risk levels…",
  "→ Generating summaries…",
  "→ Building JSON response…",
];

const Shimmer = ({ width = "100%", delay = 0 }) => (
  <motion.div
    animate={{ opacity: [0.25, 0.55, 0.25] }}
    transition={{ duration: 1.8, repeat: Infinity, delay }}
    style={{ width }}
    className="h-3 rounded-full"
    style={{ width, background: "var(--border-color)" }}
  />
);

export default function LoadingState() {
  const [elapsed, setElapsed]         = useState(0);
  const [msgIdx, setMsgIdx]           = useState(0);
  const [displayMsg, setDisplayMsg]   = useState(MESSAGES[0]);
  const [logs, setLogs]               = useState([]);
  const [showSkeletons, setShowSkeletons] = useState(false);
  const logRef    = useRef(null);
  const logIdxRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (elapsed > 0 && elapsed % 8 === 0) {
      const next = (msgIdx + 1) % MESSAGES.length;
      setMsgIdx(next);
      setTimeout(() => setDisplayMsg(MESSAGES[next]), 300);
    }
    if (elapsed === 8) setShowSkeletons(true);
    if (elapsed % 12 === 0 && logIdxRef.current < LOGS.length) {
      setLogs(l => [...l, LOGS[logIdxRef.current]]);
      logIdxRef.current++;
    }
  }, [elapsed]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const mins     = Math.floor(elapsed / 60);
  const secs     = elapsed % 60;
  const timeStr  = `${mins}:${String(secs).padStart(2, "0")}`;
  const progress = Math.min(95, (elapsed / 110) * 100);

  const getStepState = (step, idx) => {
    if (elapsed < step.triggerAt) return "pending";
    const next = STEPS[idx + 1];
    if (!next || elapsed < next.triggerAt) return "active";
    return "done";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full py-6 px-4 sm:px-6"
      style={{ maxWidth: "100%" }}
    >
      <div className="w-full" style={{ maxWidth: "960px", margin: "0 auto" }}>

        {/* ── Status header ─────────────────────────────────────────── */}
        <div
          className="flex items-center gap-4 px-5 py-4 rounded-xl mb-5"
          style={{
            border: "1px solid var(--border-color)",
            background: "var(--surface-strong)",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="flex-shrink-0"
            style={{
              width: 24,
              height: 24,
              border: "2.5px solid",
              borderColor: "var(--accent-muted) var(--accent-muted) var(--accent-muted) var(--accent)",
              borderRadius: "50%",
            }}
          />

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.p
                key={displayMsg}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="font-semibold truncate"
                style={{ fontSize: 16, color: "var(--foreground)" }}
              >
                {displayMsg}
              </motion.p>
            </AnimatePresence>
            <p style={{ fontSize: 13, color: "var(--foreground)", opacity: 0.45, marginTop: 2 }}>
              AI analysis in progress · may take up to 2 minutes
            </p>
          </div>

          {/* Timer pill */}
          <span
            className="flex-shrink-0 font-mono font-bold"
            style={{
              fontSize: 14,
              color: "var(--accent)",
              background: "var(--accent-muted)",
              border: "1px solid var(--border-color)",
              padding: "4px 14px",
              borderRadius: 999,
            }}
          >
            {timeStr}
          </span>
        </div>

        {/* ── Progress bar ───────────────────────────────────────────── */}
        <div
          className="w-full mb-5 overflow-hidden"
          style={{ height: 3, background: "var(--border-color)", borderRadius: 99 }}
        >
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ height: "100%", background: "var(--accent)", borderRadius: 99 }}
          />
        </div>

        {/* ── Two-column layout on md+ ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* LEFT — step checklist */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid var(--border-color)", background: "var(--surface-strong)" }}
          >
            <div
              className="px-5 py-3"
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <p
                className="font-semibold uppercase tracking-widest"
                style={{ fontSize: 11, color: "var(--foreground)", opacity: 0.4 }}
              >
                Progress
              </p>
            </div>

            <div className="p-4 space-y-2">
              {STEPS.map((step, idx) => {
                const state = getStepState(step, idx);
                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg"
                    style={{
                      border: "1px solid",
                      borderColor:
                        state === "done"   ? "var(--accent-muted)" :
                        state === "active" ? "var(--border-color)"  :
                        "transparent",
                      background:
                        state === "done"   ? "var(--accent-muted)" :
                        state === "active" ? "var(--surface-strong)" :
                        "transparent",
                      transition: "all 0.4s",
                    }}
                  >
                    {/* State icon */}
                    <div
                      className="flex-shrink-0 flex items-center justify-center"
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background:
                          state === "done"   ? "var(--accent-muted)" :
                          state === "active" ? "var(--accent-muted)" :
                          "var(--border-color)",
                        border: state === "active" ? "1.5px solid var(--accent)" : "none",
                        transition: "all 0.4s",
                      }}
                    >
                      {state === "done" ? (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4 7.5L8 2.5" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : state === "active" ? (
                        <motion.div
                          animate={{ scale: [1, 1.4, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                          style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }}
                        />
                      ) : (
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--border-color)" }} />
                      )}
                    </div>

                    <span
                      className="flex-1"
                      style={{
                        fontSize: 13,
                        color:
                          state === "done"   ? "var(--accent)"    :
                          state === "active" ? "var(--foreground)" :
                          "var(--foreground)",
                        opacity: state === "pending" ? 0.35 : 1,
                        transition: "all 0.4s",
                      }}
                    >
                      {step.label}
                    </span>

                    {state === "done" && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ fontSize: 11, fontFamily: "monospace", color: "var(--accent)", opacity: 0.5 }}
                      >
                        {step.triggerAt}s
                      </motion.span>
                    )}
                    {state === "active" && (
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ fontSize: 11, fontFamily: "monospace", color: "var(--foreground)", opacity: 0.4 }}
                      >
                        {elapsed}s
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT — skeletons + activity log */}
          <div className="flex flex-col gap-5">

            {/* Skeleton preview */}
            <div
              className="rounded-xl overflow-hidden flex-1"
              style={{ border: "1px solid var(--border-color)", background: "var(--surface-strong)" }}
            >
              <div
                className="px-5 py-3"
                style={{ borderBottom: "1px solid var(--border-color)" }}
              >
                <p
                  className="font-semibold uppercase tracking-widest"
                  style={{ fontSize: 11, color: "var(--foreground)", opacity: 0.4 }}
                >
                  {showSkeletons ? "Preview loading…" : "Waiting for results…"}
                </p>
              </div>

              <div className="p-4 space-y-3">
                <AnimatePresence>
                  {showSkeletons ? (
                    [0, 0.08, 0.16].map((d, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: d }}
                        className="rounded-xl p-4 space-y-3"
                        style={{ border: "1px solid var(--border-color)" }}
                      >
                        <div className="flex gap-3 items-center">
                          <Shimmer width="48%" delay={d} />
                          <Shimmer width="18%" delay={d + 0.05} />
                        </div>
                        <Shimmer width="92%" delay={d + 0.1} />
                        <Shimmer width="68%" delay={d + 0.15} />
                      </motion.div>
                    ))
                  ) : (
                    // placeholder before skeletons appear
                    [0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="rounded-xl p-4 space-y-3"
                        style={{ border: "1px solid var(--border-color)", opacity: 0.3 }}
                      >
                        <div className="flex gap-3">
                          <div className="h-3 rounded-full flex-1" style={{ background: "var(--border-color)" }} />
                          <div className="h-3 rounded-full w-16" style={{ background: "var(--border-color)" }} />
                        </div>
                        <div className="h-3 rounded-full" style={{ background: "var(--border-color)", width: "80%" }} />
                        <div className="h-3 rounded-full" style={{ background: "var(--border-color)", width: "55%" }} />
                      </div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Activity log */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid var(--border-color)", background: "var(--surface-strong)" }}
            >
              <div
                className="px-5 py-3"
                style={{ borderBottom: "1px solid var(--border-color)" }}
              >
                <p
                  className="font-semibold uppercase tracking-widest"
                  style={{ fontSize: 11, color: "var(--foreground)", opacity: 0.4 }}
                >
                  Activity
                </p>
              </div>
              <div
                ref={logRef}
                className="px-4 py-3 space-y-1.5 overflow-hidden"
                style={{ minHeight: 80, maxHeight: 120 }}
              >
                {logs.length === 0 ? (
                  <p style={{ fontSize: 13, color: "var(--foreground)", opacity: 0.25, fontFamily: "monospace" }}>
                    Waiting for activity…
                  </p>
                ) : (
                  logs.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        fontSize: 13,
                        fontFamily: "monospace",
                        color: "var(--accent)",
                        opacity: i === logs.length - 1 ? 0.8 : 0.4,
                      }}
                    >
                      {line}
                    </motion.p>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
}