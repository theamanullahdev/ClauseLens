"use client";
import React, { useState } from "react";
import Input from "./CoverInput";
import Show from "./CoverShow";

const CoverletterFinal = () => {
  const [inputData, setInputData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // <- NEW

  const handleSubmit = async (data) => {
    console.log("Received from Input:", data);
    setIsLoading(true); // start loading immediately
    setInputData(null); // clear old result

    try {
      const res = await fetch("/api/Chat/Cover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to generate cover letter");
      }

      const result = await res.json();
      setInputData(result);
    } catch (error) {
      setInputData({ error: error.message });
    } finally {
      setIsLoading(false); // stop loading
    }
  };

  return (
    <div className="w-full" style={{ height: "calc(100vh - 80px)" }}>
      <div className="w-full h-full flex flex-col md:flex-row gap-6 px-6 py-6">
        <div className="w-full md:w-1/2 h-full flex flex-col">
          <Show data={inputData} loading={isLoading} /> {/* <-- pass loading */}
        </div>
        <div className="w-full md:w-1/2 h-full flex flex-col">
          <Input onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CoverletterFinal;
