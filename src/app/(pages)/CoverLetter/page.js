"use client";
import React from "react";
import CoverletterFinal from "@/Components/Chat/CoverLetter/CoverletterFinal";

const CoverLetter = () => {
  return (
    <div
      className="w-screen overflow-x-hidden overflow-y-auto scrollbar-hide"
      style={{ minHeight: "calc(100vh - 80px)" }}
    >
      <CoverletterFinal />
    </div>
  );
};

export default CoverLetter;
