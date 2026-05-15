"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/* ─── animation presets ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const staggerChild = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── animated counter ─── */
const Counter = ({ target, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || target === "∞") return;
    let start = 0;
    const num = parseInt(target);
    const step = Math.ceil(num / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{target === "∞" ? "∞" : count}{suffix}</span>;
};

/* ─── floating particles ─── */
const PARTICLES = [...Array(22)].map((_, i) => ({
  size: Math.random() * 2.5 + 1,
  left: Math.random() * 100,
  top: Math.random() * 100,
  color: i % 3 === 0 ? "#00ff88" : i % 3 === 1 ? "#00aaff" : "#ffffff",
  opacity: 0.12 + Math.random() * 0.18,
  dur: 4 + Math.random() * 5,
  delay: Math.random() * 4,
  yRange: 20 + Math.random() * 40,
}));

const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {PARTICLES.map((p, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{ width: p.size, height: p.size, left: `${p.left}%`, top: `${p.top}%`, background: p.color, opacity: p.opacity }}
        animate={{ y: [0, -p.yRange, 0], opacity: [p.opacity * 0.5, p.opacity * 2, p.opacity * 0.5] }}
        transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
      />
    ))}
  </div>
);

/* ─── marquee ─── */
const MARQUEE_ITEMS = [
  "Zero Data Stored", "AI-Powered", "CRITICAL Detection", "MODERATE Risk",
  "MINOR Flags", "PDF · DOCX · TXT", "Plain English", "Instant Analysis",
  "Reject · Negotiate · Accept", "No Login Required",
];

const Marquee = () => (
  <div className="overflow-hidden border-y border-[#2a2e2a] bg-[#0c0f0c] py-3">
    <motion.div
      className="flex gap-10 whitespace-nowrap w-max"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
    >
      {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
        <span key={i} className="flex items-center gap-3 text-xs font-bold text-neutral-500 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] inline-block flex-shrink-0" />
          {item}
        </span>
      ))}
    </motion.div>
  </div>
);

/* ─── faq item ─── */
const FAQ_DATA = [
  { q: "Is my contract data stored anywhere?", a: "Never. Files are processed entirely in-memory and discarded after analysis. We don't log, store, or transmit your documents to any third party." },
  { q: "What file types are supported?", a: "PDF, DOCX, and TXT up to 10MB each. If your contract is in another format, convert it to one of these first." },
  { q: "How does the risk scoring work?", a: "Our AI reads both contract versions and classifies each change as CRITICAL, MODERATE, or MINOR based on legal weight, financial exposure, and enforceability impact." },
  { q: "Do I need an account?", a: "No. ClauseLens requires zero login, zero signup. Just upload and analyze." },
  { q: "Can it handle long contracts?", a: "Yes. The model processes large documents efficiently. For extremely dense multi-hundred-page contracts, we recommend splitting into sections." },
];

const FaqItem = ({ q, a, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      {...fadeUp(index * 0.07)}
      onClick={() => setOpen((o) => !o)}
      className={`border rounded-xl overflow-hidden cursor-pointer transition-all duration-300
        ${open ? "border-[#00ff88]/30 bg-[#0c120c]" : "border-[#2a2e2a] bg-[#111411] hover:border-[#00ff88]/20"}`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold text-white pr-4">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-[#00ff88] text-xl flex-shrink-0 leading-none"
        >+</motion.span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 pt-4 text-sm text-neutral-400 leading-relaxed border-t border-[#2a2e2a]">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── team data ─── */
const TEAM = [
  { name: "Amanullah", role: "Architecture & AI Pipeline", abbr: "AU", color: "#00ff88" },
  { name: "Fahad", role: "API & Backend Logic", abbr: "FA", color: "#00aaff" },
  { name: "Khizra", role: "File Upload & Parsing", abbr: "KH", color: "#ff9900" },
  { name: "Sehr", role: "UI/UX & Landing Page", abbr: "SE", color: "#ff3366" },
  { name: "Shafia", role: "Docs & Product Comms", abbr: "SH", color: "#aa88ff" },
];

/* ─── main ─── */
const AboutPage = () => {
  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden font-sans">

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center text-center px-4 sm:px-6 pt-24 sm:pt-32 pb-20 overflow-hidden">
        <Particles />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-[#00ff88]/4 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00ff88]/25 bg-[#00ff88]/8 text-[#00ff88] text-xs font-bold tracking-widest uppercase mb-8 relative z-10"
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          About ClauseLens
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 max-w-5xl"
        >
          Contract review that{" "}
          <span className="text-[#00ff88] relative inline-block">
            thinks like a lawyer.
            <motion.span
              className="absolute -bottom-1 left-0 h-[3px] bg-[#00ff88] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.9 }}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="relative z-10 text-neutral-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-12"
        >
          Upload two contract versions. Get every change detected, risk-scored,
          and explained in plain English — in seconds. No lawyers required.
        </motion.p>

        {/* animated terminal mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-2xl border border-[#2a2e2a] rounded-2xl bg-[#0d110d] overflow-hidden"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#2a2e2a] bg-[#111411]">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-[#00ff88]/60" />
            <span className="ml-3 text-xs text-neutral-600 font-mono">clauselens — analysis</span>
          </div>
          <div className="p-5 font-mono text-xs space-y-2">
            {[
              { label: "Scanning clauses...", color: "text-neutral-500" },
              { label: "Detected 7 changes", color: "text-neutral-300" },
              { label: "Risk analysis complete", color: "text-[#00ff88]" },
            ].map((line, i) => (
              <motion.div
                key={line.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.35 }}
                className={`flex items-center gap-2 ${line.color}`}
              >
                <span className="text-[#00ff88]">›</span>
                {line.label}
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1 + i * 0.35, type: "spring" }}
                  className="text-[#00ff88]"
                >✓</motion.span>
              </motion.div>
            ))}
            <div className="mt-4 space-y-2">
              {[
                { risk: "CRITICAL", label: "Liability cap removed", w: "85%", textCol: "text-red-400", barCol: "bg-red-500" },
                { risk: "MODERATE", label: "Payment window 30→60 days", w: "60%", textCol: "text-yellow-400", barCol: "bg-yellow-500" },
                { risk: "MINOR", label: "Governing law updated", w: "35%", textCol: "text-[#00ff88]", barCol: "bg-[#00ff88]" },
              ].map((item, i) => (
                <motion.div
                  key={item.risk}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.7 + i * 0.2 }}
                  className="flex items-center gap-3"
                >
                  <span className={`text-[10px] font-bold w-16 flex-shrink-0 ${item.textCol}`}>{item.risk}</span>
                  <div className="flex-1 h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${item.barCol}`}
                      initial={{ width: 0 }}
                      animate={{ width: item.w }}
                      transition={{ delay: 2 + i * 0.2, duration: 0.6 }}
                    />
                  </div>
                  <span className="text-neutral-600 text-[10px] hidden sm:block">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── STATS ── */}
      <section className="w-[82%] mx-auto py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { value: "3", suffix: "", label: "File Formats" },
            { value: "3", suffix: "x", label: "Risk Levels" },
            { value: "0", suffix: "", label: "Data Stored" },
            { value: "∞", suffix: "", label: "Contracts" },
          ].map((s) => (
            <motion.div
              key={s.label}
              variants={staggerChild}
              whileHover={{ scale: 1.04, borderColor: "rgba(0,255,136,0.35)" }}
              className="flex flex-col items-center justify-center py-10 rounded-2xl border border-[#2a2e2a] bg-[#111411] transition-all duration-300"
            >
              <span className="text-4xl sm:text-5xl font-extrabold text-[#00ff88] tabular-nums">
                <Counter target={s.value} suffix={s.suffix} />
              </span>
              <span className="text-xs text-neutral-500 mt-2 uppercase tracking-widest">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── WHY WE BUILT IT ── */}
      <section className="w-[82%] mx-auto py-16 border-t border-[#2a2e2a]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp(0)}>
            <p className="text-xs font-bold text-[#00ff88] uppercase tracking-widest mb-4">The Problem</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-5">
              The diff is where the <span className="text-[#00ff88]">danger lives.</span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-4">
              Contracts get revised. Clauses get swapped, liability caps quietly halved,
              termination windows tightened. Most people sign without catching it — not
              because they're careless, but because line-by-line comparison is brutal.
            </p>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              ClauseLens flags every change, explains it in plain English, and tells you
              whether to reject, negotiate, or accept. In seconds.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.15)} className="flex flex-col gap-3">
            {[
              { risk: "CRITICAL", label: "Liability cap removed", detail: "You are now fully exposed to unlimited damages.", badge: "text-red-400 border-red-400/30 bg-red-400/8", rec: "Reject", recCol: "text-red-400" },
              { risk: "MODERATE", label: "Payment window 30 → 60 days", detail: "Cash flow impact on invoices exceeding $50,000.", badge: "text-yellow-400 border-yellow-400/30 bg-yellow-400/8", rec: "Negotiate", recCol: "text-yellow-400" },
              { risk: "MINOR", label: "Governing law clause updated", detail: "Jurisdiction changed from NY to DE — minor impact.", badge: "text-[#00ff88] border-[#00ff88]/30 bg-[#00ff88]/8", rec: "Acceptable", recCol: "text-[#00ff88]" },
            ].map((item, i) => (
              <motion.div
                key={item.risk}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 6, borderColor: "rgba(0,255,136,0.2)" }}
                className="flex items-start gap-4 p-5 rounded-xl border border-[#2a2e2a] bg-[#111411] transition-all duration-300"
              >
                <span className={`flex-shrink-0 border rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase mt-0.5 ${item.badge}`}>
                  {item.risk}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{item.detail}</p>
                </div>
                <span className={`text-xs font-bold flex-shrink-0 ${item.recCol}`}>{item.rec}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="w-[82%] mx-auto py-16 border-t border-[#2a2e2a]">
        <motion.div {...fadeUp()} className="mb-12">
          <p className="text-xs font-bold text-[#00ff88] uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Four steps. Zero friction.</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[
            { n: "01", title: "Upload both contracts", body: "Drop original and revised — PDF, DOCX, or TXT. Max 10MB each.", icon: "📂" },
            { n: "02", title: "AI reads the diff", body: "Every changed clause, addition, and deletion detected automatically.", icon: "🔍" },
            { n: "03", title: "Risk scoring applied", body: "Each change tagged CRITICAL, MODERATE, or MINOR by legal impact.", icon: "⚠️" },
            { n: "04", title: "Get your report", body: "What changed, why it matters, and what to do — in plain English.", icon: "📋" },
          ].map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, borderColor: "rgba(0,255,136,0.35)" }}
              className="relative p-7 rounded-2xl border border-[#2a2e2a] bg-[#111411] transition-all duration-300 group overflow-hidden"
            >
              <span className="text-5xl font-extrabold text-[#2a2e2a] group-hover:text-[#00ff88]/12 transition-colors duration-300 font-mono block mb-4">
                {step.n}
              </span>
              <p className="text-2xl mb-4">{step.icon}</p>
              <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{step.body}</p>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00ff88] origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.35, duration: 0.5 }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="w-[82%] mx-auto py-16 border-t border-[#2a2e2a]">
        <motion.div {...fadeUp()} className="mb-12">
          <p className="text-xs font-bold text-[#00ff88] uppercase tracking-widest mb-3">Our Principles</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold">What we won't compromise on.</h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: "🔒", title: "Privacy first", body: "Zero storage. Zero logging. Your contract never leaves your session. We process in memory and discard immediately.", accent: "#00ff88" },
            { icon: "⚡", title: "Speed matters", body: "Analysis in seconds, not minutes. Because time is the one thing you can't get back when a deadline is closing in.", accent: "#00aaff" },
            { icon: "🎯", title: "Clarity over jargon", body: "Legal language stays legal. Our explanations don't. You shouldn't need a law degree to understand your own risk.", accent: "#ff9900" },
          ].map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5 }}
              className="group relative p-8 rounded-2xl border border-[#2a2e2a] bg-[#111411] transition-all duration-300 overflow-hidden"
            >
              <motion.div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: v.accent }}
              />
              <p className="text-3xl mb-5">{v.icon}</p>
              <h3 className="text-lg font-bold text-white mb-3">{v.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="w-[82%] mx-auto py-16 border-t border-[#2a2e2a]">
        <motion.div {...fadeUp()} className="mb-12">
          <p className="text-xs font-bold text-[#00ff88] uppercase tracking-widest mb-3">The Team</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Small crew. Sharp tools.</h2>
          <p className="text-neutral-500 text-sm mt-3 max-w-lg">
            Built by people who got tired of bad legal-tech and decided to fix it themselves.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {TEAM.map((member) => (
            <motion.div
              key={member.name}
              variants={staggerChild}
              whileHover={{ y: -6, scale: 1.02 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl border border-[#2a2e2a] bg-[#111411] transition-all duration-300 cursor-default"
            >
              <motion.div
                className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-extrabold mb-4 border-2 transition-all duration-300"
                style={{ background: `${member.color}15`, borderColor: `${member.color}30`, color: member.color }}
                whileHover={{ scale: 1.12 }}
              >
                {member.abbr}
              </motion.div>
              <p className="text-sm font-bold text-white">{member.name}</p>
              <p className="text-xs text-neutral-500 mt-1 leading-snug">{member.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section className="w-[82%] mx-auto py-16 border-t border-[#2a2e2a]">
        <motion.div {...fadeUp()} className="mb-10">
          <p className="text-xs font-bold text-[#00ff88] uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Questions, answered.</h2>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-3">
          {FAQ_DATA.map((item, i) => (
            <FaqItem key={item.q} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-[82%] mx-auto py-16">
        <motion.div
          {...fadeUp()}
          className="relative overflow-hidden rounded-3xl border border-[#00ff88]/20 bg-[#0c120c] p-10 sm:p-16 flex flex-col items-center text-center"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[280px] bg-[#00ff88]/6 rounded-full blur-[80px]" />
          </div>
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <motion.div
            animate={{ rotate: [0, 6, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl mb-6 relative z-10"
          >⚡</motion.div>
          <h2 className="relative z-10 text-3xl sm:text-5xl font-extrabold mb-4 leading-tight">
            Ready to read the fine print?
          </h2>
          <p className="relative z-10 text-neutral-400 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
            Upload your contracts and get a full risk analysis — free, instant, and private.
            No account needed.
          </p>
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="relative z-10 inline-flex items-center gap-2 px-10 py-4 bg-[#00ff88] text-black font-extrabold rounded-2xl text-sm hover:bg-[#00ee77] transition-colors"
          >
            Analyze a Contract
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >→</motion.span>
          </motion.a>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-10 text-center text-neutral-700 text-xs border-t border-[#2a2e2a]"
      >
        Built with sleepless nights and a healthy fear of bad contracts ·{" "}
        <span className="text-[#00ff88]/30">ClauseLens</span> © {new Date().getFullYear()}
      </motion.footer>
    </main>
  );
};

export default AboutPage;
