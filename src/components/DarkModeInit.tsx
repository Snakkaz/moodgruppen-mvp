"use client";
import { useEffect } from "react";

export function DarkModeInit() {
  useEffect(() => {
    if (localStorage.getItem("mg-dark") === "1") {
      document.documentElement.classList.add("dark");
    }
  }, []);
  return null;
}
