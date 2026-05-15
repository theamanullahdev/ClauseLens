"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen w-full px-6 py-16 sm:px-20 flex flex-col items-center justify-center text-white bg-black">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl sm:text-5xl font-bold text-center max-w-3xl"
      >
        Generate AI Cover Letters in Seconds.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-neutral-400 text-lg sm:text-xl mt-4 max-w-2xl text-center"
      >
        Lettersmith AI helps you skip the blank page. Just paste your CV, job
        description, and hit generate. Real-time. In-browser. No setup. No
        fluff.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-10 flex gap-4"
      >
        <Link
          href="/CoverLetter"
          className="px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-neutral-200 transition"
        >
          Try it now
        </Link>
        <Link
          href="/About"
          className="px-6 py-3 border border-white text-white rounded-md hover:bg-white hover:text-black transition"
        >
          Learn more
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-24 text-center max-w-2xl text-sm text-neutral-500 leading-6"
      >
        ✍️ Lettersmith AI was built for developers, designers, artists,
        freelancers, and anyone tired of typing the same thing 10 times for
        different jobs.
        <br />
        Fully browser-based, respects your wallet and privacy.
      </motion.div>
    </div>
  );
}
