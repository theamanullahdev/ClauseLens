"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

/* ─── floating particles (client-only random) ─── */
const Particles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = [...Array(28)].map((_, i) => ({
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      colorKey: i % 3,
      opacity: 0.04 + Math.random() * 0.1,
      dur: 6 + Math.random() * 8,
      delay: Math.random() * 6,
      yRange: 30 + Math.random() * 50,
    }));
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            background: "var(--accent)",
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -p.yRange, 0],
            opacity: [p.opacity * 0.3, p.opacity * 2.5, p.opacity * 0.3],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

/* ─── scan line effect ─── */
function ScanLines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: 0.015,
        backgroundImage:
          "repeating-linear-gradient(0deg, var(--accent) 0px, var(--accent) 1px, transparent 1px, transparent 3px)",
        backgroundSize: "100% 3px",
      }}
    />
  );
}

/* ─── animated word cycler ─── */
const WORDS = ["Dangerous.", "Confusing.", "Expensive.", "Clear."];
const WORD_COLORS = ["#ff4444", "#ff9900", "#ffdd00", "var(--accent)"];

function WordCycler() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(
      () => setIdx((i) => (i + 1) % WORDS.length),
      idx === WORDS.length - 1 ? 3000 : 1800,
    );
    return () => clearTimeout(t);
  }, [idx]);

  return (
    <span className="relative inline-block min-w-[220px] text-left">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 font-extrabold"
          style={{ color: WORD_COLORS[idx] }}
        >
          {WORDS[idx]}
        </motion.span>
      </AnimatePresence>
      <span className="invisible font-extrabold">{WORDS[0]}</span>
    </span>
  );
}

/* ─── risk badge ─── */
function RiskBadge({ level, color, bgColor, borderColor, delay }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-xs font-extrabold uppercase tracking-wider"
      style={{
        color,
        background: bgColor,
        borderColor,
      }}
    >
      <motion.span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: color }}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, delay }}
      />
      {level}
    </motion.span>
  );
}

/* ─── step card ─── */
function StepCard({ number, title, body, icon, delay, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col gap-5 p-8 rounded-3xl transition-all duration-400 overflow-hidden"
      style={{
        border: "1px solid var(--border-color)",
        background: "var(--surface-strong)",
      }}
    >
      {/* hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
        style={{
          background: `radial-gradient(ellipse at 30% 0%, ${accent}12 0%, transparent 65%)`,
        }}
      />
      {/* top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />

      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-mono font-extrabold uppercase tracking-[0.2em]"
          style={{ color: accent, opacity: 0.6 }}
        >
          Step {number}
        </span>
        <span className="text-2xl">{icon}</span>
      </div>

      <div>
        <h3
          className="text-xl font-extrabold mb-2 leading-snug"
          style={{ color: "var(--foreground)" }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--foreground)", opacity: 0.5 }}
        >
          {body}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── live demo mockup ─── */
function DemoMockup() {
  const clauses = [
    {
      text: "§4.2 Liability cap removed — unlimited exposure",
      risk: "CRITICAL",
      color: "#ff4444",
      bg: "rgba(255,68,68,0.06)",
      border: "rgba(255,68,68,0.18)",
    },
    {
      text: "§7.1 Payment terms: Net-30 → Net-7",
      risk: "MODERATE",
      color: "#ffaa00",
      bg: "rgba(255,170,0,0.06)",
      border: "rgba(255,170,0,0.18)",
    },
    {
      text: "§12 Jurisdiction changed to Delaware",
      risk: "MINOR",
      color: "var(--accent)",
      bg: "var(--accent-muted)",
      border: "var(--border-color)",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-md mx-auto"
    >
      {/* glow behind card */}
      <div
        className="absolute -inset-4 rounded-3xl blur-2xl pointer-events-none"
        style={{ background: "var(--accent-muted)" }}
      />

      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          border: "1px solid var(--border-color)",
          background: "var(--surface-strong)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        }}
      >
        {/* top bar */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{
            borderBottom: "1px solid var(--border-color)",
            background: "var(--surface-muted)",
          }}
        >
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: "var(--accent)", opacity: 0.7 }}
          />
          <span
            className="ml-3 text-[10px] font-mono tracking-wider"
            style={{ color: "var(--foreground)", opacity: 0.4 }}
          >
            clauselens — analysis.json
          </span>

          <div className="ml-auto flex items-center gap-1.5">
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            <span
              className="text-[9px] font-mono uppercase tracking-widest"
              style={{ color: "var(--accent)", opacity: 0.6 }}
            >
              Live
            </span>
          </div>
        </div>

        {/* header row */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <span
            className="text-[10px] font-mono uppercase tracking-widest"
            style={{ color: "var(--foreground)", opacity: 0.4 }}
          >
            3 Changes Detected
          </span>
          <div className="flex gap-1.5">
            <RiskBadge
              level="CRITICAL"
              color="#ff4444"
              bgColor="rgba(255,68,68,0.1)"
              borderColor="rgba(255,68,68,0.3)"
              delay={0.9}
            />
            <RiskBadge
              level="1 MODERATE"
              color="#ffaa00"
              bgColor="rgba(255,170,0,0.1)"
              borderColor="rgba(255,170,0,0.3)"
              delay={1.0}
            />
          </div>
        </div>

        {/* clauses */}
        <div className="px-4 pb-5 flex flex-col gap-2">
          {clauses.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 1.0 + i * 0.18,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-start gap-3 p-3 rounded-xl border"
              style={{ background: c.bg, borderColor: c.border }}
            >
              <span
                className="text-[9px] font-extrabold font-mono uppercase tracking-wider border rounded-full px-2 py-0.5 flex-shrink-0 mt-0.5"
                style={{ color: c.color, borderColor: c.border }}
              >
                {c.risk}
              </span>
              <span
                className="text-xs leading-relaxed"
                style={{ color: "var(--foreground)", opacity: 0.65 }}
              >
                {c.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* bottom recommendation bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="flex items-center justify-between px-4 py-3"
          style={{
            borderTop: "1px solid var(--border-color)",
            background: "var(--surface-muted)",
          }}
        >
          <span
            className="text-[10px] font-mono"
            style={{ color: "var(--foreground)", opacity: 0.4 }}
          >
            Recommendation
          </span>
          <span className="text-xs font-extrabold font-mono text-red-400">
            ⚠ Do not sign — review first
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   MAIN HOME PAGE
══════════════════════════════════════════ */
export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "'DM Mono', 'Fira Mono', monospace",
      }}
    >
      {/* ══════════ SECTION 1: HERO ══════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center gap-16 px-6 sm:px-12 pt-24 pb-16 overflow-hidden"
      >
        <Particles />
        <ScanLines />

        {/* radial glows */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[160px] pointer-events-none"
          style={{ background: "var(--accent-muted)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "rgba(0,170,255,0.04)" }}
        />

        {/* corner brackets */}
        {[
          "top-8 left-8 border-t-2 border-l-2",
          "top-8 right-8 border-t-2 border-r-2",
          "bottom-8 left-8 border-b-2 border-l-2",
          "bottom-8 right-8 border-b-2 border-r-2",
        ].map((cls, i) => (
          <div
            key={i}
            className={`absolute w-8 h-8 pointer-events-none ${cls}`}
            style={{ borderColor: "var(--accent)", opacity: 0.2 }}
          />
        ))}

        {/* LEFT: copy */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col max-w-xl"
        >
          {/* status badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="self-start flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-8"
            style={{
              border: "1px solid var(--border-color)",
              background: "var(--accent-muted)",
              color: "var(--accent)",
            }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent)" }}
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            AI Contract Intelligence
          </motion.div>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl xl:text-7xl font-extrabold leading-[1.0] tracking-tight mb-4"
            style={{ color: "var(--foreground)", fontFamily: "system-ui, sans-serif" }}
          >
            Contracts are
            <br />
            <WordCycler />
          </motion.h1>

          {/* sub */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="text-base sm:text-lg leading-relaxed mb-10 max-w-md"
            style={{
              color: "var(--foreground)",
              opacity: 0.6,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Drop two versions of any contract. ClauseLens finds every revision,
            scores every risk, and explains what it means — in seconds.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 mb-12"
          >
            <Link href="/ClauseLens">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-8 py-4 font-extrabold rounded-2xl text-sm cursor-pointer transition-shadow"
                style={{
                  background: "var(--accent)",
                  color: "var(--background)",
                  boxShadow: "0 0 60px color-mix(in srgb, var(--accent) 25%, transparent)",
                }}
              >
                <span>Analyze a Contract</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.1, repeat: Infinity }}
                  className="text-base"
                >
                  →
                </motion.span>
              </motion.span>
            </Link>
            <Link href="/about">
              <motion.span
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center gap-2 px-6 py-4 font-semibold rounded-2xl text-sm cursor-pointer transition-all"
                style={{
                  border: "1px solid var(--border-color)",
                  color: "var(--foreground)",
                  opacity: 0.7,
                }}
              >
                How it works ↓
              </motion.span>
            </Link>
          </motion.div>

          {/* trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest"
            style={{ color: "var(--foreground)", opacity: 0.4 }}
          >
            <span className="flex items-center gap-1.5">
              <span style={{ color: "var(--accent)" }}>✓</span> No login
            </span>
            <span
              className="w-px h-3"
              style={{ background: "var(--border-color)" }}
            />
            <span className="flex items-center gap-1.5">
              <span style={{ color: "var(--accent)" }}>✓</span> Zero data stored
            </span>
            <span
              className="w-px h-3"
              style={{ background: "var(--border-color)" }}
            />
            <span className="flex items-center gap-1.5">
              <span style={{ color: "var(--accent)" }}>✓</span> Free
            </span>
          </motion.div>
        </motion.div>

        {/* RIGHT: live demo card */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 w-full max-w-md"
        >
          <DemoMockup />
        </motion.div>
      </section>

      {/* ══════════ SECTION 2: HOW IT WORKS ══════════ */}
      <section
        className="relative px-6 sm:px-12 py-24 overflow-hidden"
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        {/* bg decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full"
            style={{
              background:
                "linear-gradient(to bottom, transparent, var(--accent-muted), transparent)",
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto">
          {/* section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center mb-20"
          >
            <span
              className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] mb-4"
              style={{ color: "var(--accent)" }}
            >
              How It Works
            </span>
            <h2
              className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight max-w-2xl"
              style={{ color: "var(--foreground)", fontFamily: "system-ui, sans-serif" }}
            >
              Three steps.{" "}
              <span style={{ color: "var(--accent)" }}>Total clarity.</span>
            </h2>
          </motion.div>

          {/* steps */}
          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* connector line (desktop) */}
            <div className="hidden md:block absolute top-12 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full origin-left"
                style={{
                  background:
                    "linear-gradient(to right, var(--accent-muted), rgba(0,170,255,0.15), var(--accent-muted))",
                }}
              />
            </div>

            <StepCard
              number="01"
              icon="📄"
              title="Upload both contracts"
              body="Drop your original and revised contract — PDF, DOCX, or TXT. No account. No email. Nothing stored."
              delay={0}
              accent="var(--accent)"
            />
            <StepCard
              number="02"
              icon="🔍"
              title="AI scans every clause"
              body="ClauseLens compares the two versions line by line. Every deletion, addition, and substitution is caught — even subtle rewording."
              delay={0.15}
              accent="#00aaff"
            />
            <StepCard
              number="03"
              icon="⚡"
              title="Get a risk breakdown"
              body="Each change is scored CRITICAL, MODERATE, or MINOR with a plain-English explanation and a clear recommendation: reject, negotiate, or accept."
              delay={0.3}
              accent="var(--accent)"
            />
          </div>

          {/* bottom stats row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { val: "3s", desc: "Avg. analysis time" },
              { val: "PDF · DOCX · TXT", desc: "Supported formats" },
              { val: "0", desc: "Data ever stored" },
              { val: "3", desc: "Risk levels scored" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                className="flex flex-col items-center justify-center py-8 px-4 rounded-2xl text-center transition-all duration-300"
                style={{
                  border: "1px solid var(--border-color)",
                  background: "var(--surface-strong)",
                }}
              >
                <span
                  className="text-2xl sm:text-3xl font-extrabold font-mono mb-1"
                  style={{ color: "var(--accent)" }}
                >
                  {s.val}
                </span>
                <span
                  className="text-[10px] uppercase tracking-widest font-mono"
                  style={{ color: "var(--foreground)", opacity: 0.4 }}
                >
                  {s.desc}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ SECTION 3: CTA ══════════ */}
      <section
        className="relative px-6 sm:px-12 py-28 overflow-hidden"
        style={{ borderTop: "1px solid var(--border-color)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "var(--accent-muted)" }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: "var(--accent-muted)" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-3xl mx-auto flex flex-col items-center text-center gap-8"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{
              border: "1px solid var(--border-color)",
              background: "var(--surface-strong)",
              color: "var(--accent)",
            }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--accent)" }}
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            Ready to analyze
          </div>

          <h2
            className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight"
            style={{ color: "var(--foreground)", fontFamily: "system-ui, sans-serif" }}
          >
            Stop signing contracts{" "}
            <span style={{ color: "var(--accent)" }}>blind.</span>
          </h2>

          <p
            className="text-base sm:text-lg max-w-xl leading-relaxed"
            style={{
              color: "var(--foreground)",
              opacity: 0.55,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Upload your contracts and get a full risk report in under 10 seconds.
            No account. No credit card. Nothing stored.
          </p>

          <Link href="/ClauseLens">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-10 py-5 font-extrabold rounded-2xl text-base cursor-pointer"
              style={{
                background: "var(--accent)",
                color: "var(--background)",
                boxShadow: "0 0 80px color-mix(in srgb, var(--accent) 30%, transparent)",
              }}
            >
              <span>Analyze a Contract — Free</span>
              <motion.span
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.span>
          </Link>

          <p
            className="text-xs font-mono uppercase tracking-widest"
            style={{ color: "var(--foreground)", opacity: 0.3 }}
          >
            PDF · DOCX · TXT &nbsp;·&nbsp; Max 10MB &nbsp;·&nbsp; No account required
          </p>
        </motion.div>
      </section>
    </main>
  );
}
