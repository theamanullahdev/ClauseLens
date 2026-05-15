"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

/* ─── floating particles ─── */
const PARTICLES = [...Array(28)].map((_, i) => ({
  size: Math.random() * 3 + 1,
  left: Math.random() * 100,
  top: Math.random() * 100,
  color:
    i % 5 === 0
      ? "#00ff88"
      : i % 5 === 1
      ? "#00aaff"
      : i % 5 === 2
      ? "#00ff88"
      : i % 5 === 3
      ? "#ffffff"
      : "#00ff88",
  opacity: 0.04 + Math.random() * 0.1,
  dur: 6 + Math.random() * 8,
  delay: Math.random() * 6,
  yRange: 30 + Math.random() * 50,
}));

const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {PARTICLES.map((p, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: p.size,
          height: p.size,
          left: `${p.left}%`,
          top: `${p.top}%`,
          background: p.color,
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

/* ─── animated word cycler ─── */
const WORDS = ["Dangerous.", "Confusing.", "Expensive.", "Clear."];
const WORD_COLORS = ["#ff4444", "#ff9900", "#ffdd00", "#00ff88"];

function WordCycler() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setIdx((i) => (i + 1) % WORDS.length), idx === WORDS.length - 1 ? 3000 : 1800);
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
      {/* invisible placeholder to reserve henight */}
      <span className="invisible font-extrabold">{WORDS[0]}</span>
    </span>
  );
}

/* ─── risk badge ─── */
function RiskBadge({ level, color, bg, border, delay }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-mono text-xs font-extrabold uppercase tracking-wider"
      style={{ color, background: bg, borderColor: border }}
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
      whileHover={{ y: -6, borderColor: `${accent}55` }}
      className="group relative flex flex-col gap-5 p-8 rounded-3xl border border-[#1e241e] bg-[#0d110d] transition-all duration-400 overflow-hidden"
    >
      {/* hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
        style={{
          background: `radial-gradient(ellipse at 30% 0%, ${accent}08 0%, transparent 65%)`,
        }}
      />
      {/* top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      {/* step number */}
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-mono font-extrabold uppercase tracking-[0.2em] opacity-40"
          style={{ color: accent }}
        >
          Step {number}
        </span>
        <span className="text-2xl">{icon}</span>
      </div>

      <div>
        <h3 className="text-xl font-extrabold text-white mb-2 leading-snug">{title}</h3>
        <p className="text-sm text-neutral-500 leading-relaxed">{body}</p>
      </div>

      {/* bottom connector line (not on last) */}
    </motion.div>
  );
}

/* ─── scan line effect ─── */
function ScanLines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.015]"
      style={{
        backgroundImage: "repeating-linear-gradient(0deg, #00ff88 0px, #00ff88 1px, transparent 1px, transparent 3px)",
        backgroundSize: "100% 3px",
      }}
    />
  );
}

/* ─── live demo mockup ─── */
function DemoMockup() {
  const clauses = [
    { text: "§4.2 Liability cap removed — unlimited exposure", risk: "CRITICAL", color: "#ff4444", bg: "#ff44440d", border: "#ff444425" },
    { text: "§7.1 Payment terms: Net-30 → Net-7", risk: "MODERATE", color: "#ffaa00", bg: "#ffaa000d", border: "#ffaa0025" },
    { text: "§12 Jurisdiction changed to Delaware", risk: "MINOR", color: "#00ff88", bg: "#00ff880d", border: "#00ff8825" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-md mx-auto"
    >
      {/* glow behind card */}
      <div className="absolute -inset-4 bg-[#00ff88]/5 rounded-3xl blur-2xl pointer-events-none" />

      <div className="relative rounded-2xl border border-[#1e2a1e] bg-[#0a0f0a] overflow-hidden shadow-2xl shadow-black/60">
        {/* top bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1a201a] bg-[#080c08]">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[10px] font-mono text-neutral-600 tracking-wider">clauselens — analysis.json</span>

          <div className="ml-auto flex items-center gap-1.5">
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"
            />
            <span className="text-[9px] font-mono text-[#00ff88]/50 uppercase tracking-widest">Live</span>
          </div>
        </div>

        {/* header row */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest">3 Changes Detected</span>
          <div className="flex gap-1.5">
            <RiskBadge level="CRITICAL" color="#ff4444" bg="#ff44441a" border="#ff444440" delay={0.9} />
            <RiskBadge level="1 MODERATE" color="#ffaa00" bg="#ffaa001a" border="#ffaa0040" delay={1.0} />
          </div>
        </div>

        {/* clauses */}
        <div className="px-4 pb-5 flex flex-col gap-2">
          {clauses.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + i * 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-3 p-3 rounded-xl border"
              style={{ background: c.bg, borderColor: c.border }}
            >
              <span
                className="text-[9px] font-extrabold font-mono uppercase tracking-wider border rounded-full px-2 py-0.5 flex-shrink-0 mt-0.5"
                style={{ color: c.color, borderColor: c.border }}
              >
                {c.risk}
              </span>
              <span className="text-xs text-neutral-400 leading-relaxed">{c.text}</span>
            </motion.div>
          ))}
        </div>

        {/* bottom recommendation bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="border-t border-[#1a201a] px-4 py-3 flex items-center justify-between bg-[#080c08]"
        >
          <span className="text-[10px] text-neutral-600 font-mono">Recommendation</span>
          <span className="text-xs font-extrabold text-red-400 font-mono">⚠ Do not sign — review first</span>
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
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <main className="bg-[#080c08] min-h-screen text-white overflow-x-hidden" style={{ fontFamily: "'DM Mono', 'Fira Mono', monospace" }}>

      {/* ══════════ SECTION 1: HERO ══════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center gap-16 px-6 sm:px-12 pt-24 pb-16 overflow-hidden"
      >
        <Particles />
        <ScanLines />

        {/* radial glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#00ff88]/4 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#00aaff]/3 rounded-full blur-[120px] pointer-events-none" />

        {/* corner brackets — decorative */}
        <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-[#00ff88]/20 pointer-events-none" />
        <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-[#00ff88]/20 pointer-events-none" />
        <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-[#00ff88]/20 pointer-events-none" />
        <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-[#00ff88]/20 pointer-events-none" />

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
            className="self-start flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00ff88]/20 bg-[#00ff88]/6 text-[#00ff88] text-[10px] font-bold tracking-[0.2em] uppercase mb-8"
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"
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
            className="text-neutral-400 text-base sm:text-lg leading-relaxed mb-10 max-w-md"
            style={{ fontFamily: "system-ui, sans-serif" }}
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
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#00ff88] text-black font-extrabold rounded-2xl text-sm cursor-pointer shadow-[0_0_60px_rgba(0,255,136,0.25)] hover:shadow-[0_0_80px_rgba(0,255,136,0.35)] transition-shadow"
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
                whileHover={{ scale: 1.02, borderColor: "rgba(0,255,136,0.3)" }}
                className="inline-flex items-center gap-2 px-6 py-4 border border-[#1e2a1e] text-neutral-400 font-semibold rounded-2xl text-sm cursor-pointer hover:text-white transition-all"
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
            className="flex items-center gap-6 text-[10px] font-mono text-neutral-700 uppercase tracking-widest"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-[#00ff88]">✓</span> No login
            </span>
            <span className="w-px h-3 bg-[#1e2a1e]" />
            <span className="flex items-center gap-1.5">
              <span className="text-[#00ff88]">✓</span> Zero data stored
            </span>
            <span className="w-px h-3 bg-[#1e2a1e]" />
            <span className="flex items-center gap-1.5">
              <span className="text-[#00ff88]">✓</span> Free
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
      <section className="relative px-6 sm:px-12 py-24 overflow-hidden border-t border-[#1a201a]">
        {/* bg decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#00ff88]/10 to-transparent" />
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
            <span className="text-[10px] font-mono font-bold text-[#00ff88] uppercase tracking-[0.25em] mb-4">
              How It Works
            </span>
            <h2
              className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight max-w-2xl"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Three steps.{" "}
              <span className="text-[#00ff88]">Total clarity.</span>
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
                className="w-full h-full bg-gradient-to-r from-[#00ff88]/20 via-[#00aaff]/20 to-[#00ff88]/20 origin-left"
              />
            </div>

            <StepCard
              number="01"
              icon="📄"
              title="Upload both contracts"
              body="Drop your original and revised contract — PDF, DOCX, or TXT. No account. No email. Nothing stored."
              delay={0}
              accent="#00ff88"
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
              accent="#00ff88"
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
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.45 }}
                whileHover={{ borderColor: "rgba(0,255,136,0.3)", scale: 1.03 }}
                className="flex flex-col items-center justify-center py-7 rounded-2xl border border-[#1a201a] bg-[#0d110d] transition-all duration-300 text-center gap-1"
              >
                <span className="text-xl sm:text-2xl font-extrabold text-[#00ff88] font-mono">{s.val}</span>
                <span className="text-[10px] text-neutral-600 uppercase tracking-wider" style={{ fontFamily: "system-ui, sans-serif" }}>
                  {s.desc}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ SECTION 3: CTA CLOSE ══════════ */}
      <section className="relative px-6 sm:px-12 py-24 overflow-hidden border-t border-[#1a201a]">
        {/* massive glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#00ff88]/6 rounded-full blur-[130px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] bg-[#00aaff]/4 rounded-full blur-[80px]" />
        </div>
        <Particles />

        {/* grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* pre-label */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[10px] font-mono font-bold text-[#00ff88] uppercase tracking-[0.25em] mb-6"
          >
            No Lawyer Required
          </motion.p>

          {/* giant headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl xl:text-7xl font-extrabold leading-[1.05] mb-6 tracking-tight"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            Stop guessing.{" "}
            <br />
            <span
              className="text-[#00ff88] relative"
              style={{
                textShadow: "0 0 60px rgba(0,255,136,0.3)",
              }}
            >
              Start knowing.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.25 }}
            className="text-neutral-400 text-base sm:text-lg max-w-xl leading-relaxed mb-12"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            Every contract revision hides something. ClauseLens shows you exactly
            what changed, what it costs you, and what to do next.
          </motion.p>

          {/* primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <Link href="/ClauseLens">
              <motion.span
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-3 px-12 py-5 bg-[#00ff88] text-black font-extrabold rounded-2xl text-base cursor-pointer shadow-[0_0_80px_rgba(0,255,136,0.3)] hover:shadow-[0_0_120px_rgba(0,255,136,0.45)] transition-shadow"
              >
                <span>Analyze My Contract</span>
                <motion.span
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.0, repeat: Infinity }}
                  className="text-lg"
                >
                  ⚡
                </motion.span>
              </motion.span>
            </Link>
          </motion.div>

          {/* final micro copy */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="mt-6 text-[11px] font-mono text-neutral-700 uppercase tracking-widest"
          >
            Free · Private · Instant
          </motion.p>

          {/* decorative risk tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-14 flex gap-3 flex-wrap justify-center"
          >
            {[
              { label: "CRITICAL", color: "#ff4444", bg: "#ff44441a", border: "#ff444430" },
              { label: "MODERATE", color: "#ffaa00", bg: "#ffaa001a", border: "#ffaa0030" },
              { label: "MINOR", color: "#00ff88", bg: "#00ff881a", border: "#00ff8830" },
            ].map((r) => (
              <motion.span
                key={r.label}
                whileHover={{ scale: 1.08, y: -2 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-extrabold font-mono uppercase tracking-wider transition-transform duration-200"
                style={{ color: r.color, background: r.bg, borderColor: r.border }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.color }} />
                {r.label}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-10 px-6 flex flex-col sm:flex-row items-center justify-between border-t border-[#1a201a] text-neutral-700 text-[11px] font-mono tracking-widest uppercase gap-4"
      >
        <span>
          <span className="text-[#00ff88]/40">ClauseLens</span> © {new Date().getFullYear()}
        </span>
        <Link href="/about">
          <span className="hover:text-[#00ff88]/50 transition-colors cursor-pointer">About →</span>
        </Link>
      </motion.footer>

    </main>
  );
}