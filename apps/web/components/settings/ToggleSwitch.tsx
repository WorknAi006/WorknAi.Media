"use client";

import React from "react";
import { motion } from "framer-motion";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`flex items-center justify-between gap-4 cursor-pointer select-none ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      }`}
    >
      {(label || description) && (
        <div className="flex-1 pr-2">
          {label && (
            <span className="text-xs font-semibold text-white tracking-wide">
              {label}
            </span>
          )}
          {description && (
            <p className="mt-0.5 text-[11px] text-zinc-400 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Switch Track */}
      <div
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-300 ${
          checked
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_12px_rgba(59,130,246,0.5)]"
            : "bg-white/10 border border-white/10"
        }`}
      >
        {/* Switch Thumb with spring physics */}
        <motion.div
          animate={{ x: checked ? 22 : 3 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-md"
        />
      </div>
    </div>
  );
}
