"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-tr from-sky-600 to-sky-500 text-white shadow-xl shadow-sky-600/30 border border-white/20 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer ${
        isVisible ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none translate-y-4"
      }`}
      title="Return to top"
    >
      <ArrowUp className="w-5 h-5 animate-pulse" />
    </button>
  );
}
