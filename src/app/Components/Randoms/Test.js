"use client";
import React from "react";
import { useAppContext } from "@/Contexts/AppRouters";

const Test = () => {
  const { testingVar, settestingVar } = useAppContext();

  return (
    <div>
      <h1>Context Test</h1>
      <p>testingVar: {testingVar}</p>
      <input
        type="text"
        value={testingVar}
        onChange={(e) => settestingVar(e.target.value)}
        placeholder="Type something..."
      />
    </div>
  );
};

export default Test;
