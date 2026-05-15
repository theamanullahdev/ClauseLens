"use client";

import dynamic from "next/dynamic";

const ClauseLensPage = dynamic(
  () => import("@/Components/Chat/ClauseLens/ClauseLensPage"),
  {
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        <p className="text-neutral-400">Loading...</p>
      </div>
    ),
    ssr: false,
  }
);

export default function ClauseLens() {
  return <ClauseLensPage />;
}
