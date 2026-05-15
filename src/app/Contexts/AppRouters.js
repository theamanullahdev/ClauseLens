"use client";
import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [testingVar, settestingVar ] = useState("");

  return (
    <AppContext.Provider value={{ loading, setLoading, output, setOutput, testingVar, settestingVar }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
