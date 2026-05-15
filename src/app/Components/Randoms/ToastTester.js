"use client";
import React from "react";
import { toast } from "react-toastify";

const ToastTester = () => {
  return (
    <button
      onClick={() => toast.success("🎉 Toast works perfectly!")}
    >
      Test Toast
    </button>
  );
};

export default ToastTester;
