"use client";
import React from "react";
import { motion } from "framer-motion";

const Section = ({ title, subtitle, children }) => (
  <motion.section
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="max-w-4xl mx-auto py-16 px-6 border-b border-neutral-800"
  >
    <h2 className="text-3xl font-bold text-white mb-3">{title}</h2>
    <h3 className="text-xl text-neutral-400 mb-6">{subtitle}</h3>
    <div className="text-neutral-300 text-base leading-relaxed">{children}</div>
  </motion.section>
);

const QA = ({ q, a }) => (
  <div className="mb-8">
    <h4 className="font-semibold text-white mb-1">Q: {q}</h4>
    <p className="text-neutral-300 text-sm">{a}</p>
  </div>
);

const AboutPageComp = () => {
  return (
    <main className="bg-neutral-950 min-h-screen text-white font-sans overflow-x-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.4,
            },
          },
        }}
        className="flex flex-col items-center text-center pt-32 pb-24 px-6"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 3.7, ease: "easeOut", delay: 0.4 }}
          className="text-5xl font-extrabold leading-tight mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text animate-pulse"
        >
          Job hunt sucks. We fix that.
        </motion.h1>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ delay: 0.4, duration: 3.7 }}
          className="text-neutral-400 max-w-2xl text-lg leading-relaxed"
        >
          Lettersmith AI isnt here to babysit your resume. Its your wingman.
          Paste your stuff drop a job post chill a sec and boom—done.
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1 },
          }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-6 w-14 h-1 rounded-full bg-cyan-500 animate-pulse"
        />
      </motion.div>

      <Section title="Why We Built It" subtitle="No more ctrl+c ctrl+v life">
        <p className="mb-4">
          Let’s be real. You vibe with ten job posts they all want a custom
          letter. You open Google Docs. Blank page stares back. Mood killed.
        </p>
        <p>
          So we built Lettersmith. Feels like a cheat code. Feels good. Gets the
          job done without feeling robotic.
        </p>
      </Section>

      <Section title="What We’re On" subtitle="These are our north stars">
        <ul className="list-disc list-inside space-y-2">
          <li>Fast output no fluff no filler</li>
          <li>Never store your info never will</li>
          <li>We’re not writing for everyone we’re writing for you</li>
          <li>You stay in control always</li>
          <li>Change is the only plan we improve nonstop</li>
        </ul>
      </Section>

      <Section
        title="Questions You Might Drop"
        subtitle="Answers that don’t waste your scroll"
      >
        <QA
          q="What’s this thing even do"
          a="Makes you a clean slick cover letter based on your info and the job you want. Custom not generic."
        />
        <QA
          q="Is this safe to use"
          a="Yup. Your stuff stays on your device. We don’t track save or creep."
        />
        <QA
          q="Who’s behind this"
          a="Small crew who got tired of bad tools and fake AI. We built what we needed."
        />
        <QA
          q="How smart is this"
          a="Smart enough to sound human. Not smart enough to replace your vibe. That’s the point."
        />
      </Section>

      <Section title="Where We’re Headed" subtitle="Not just cover letters">
        <p className="mb-4">
          This isn’t a one‑and‑done tool. Lettersmith’s growing into your career
          buddy. Stuff we’re cooking:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Auto-scan your CV and match jobs</li>
          <li>Score your resume like a recruiter would</li>
          <li>Interview prep that doesn’t suck</li>
          <li>Make ur CV by giving it Your information.</li>
        </ul>
        <p>You build the skills we back you with the words.</p>
      </Section>

      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="py-24 text-center text-neutral-600 text-sm border-t border-neutral-800"
      >
        Built with sleepless nights, two mugs of instant coffee, and a lil too
        much hope © {new Date().getFullYear()}
      </motion.footer>
    </main>
  );
};

export default AboutPageComp;
