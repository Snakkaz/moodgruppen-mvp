"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Glass Card
export function GlassCard({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/20 dark:border-white/10",
        "bg-white/60 dark:bg-white/5",
        "backdrop-blur-xl backdrop-saturate-150",
        "shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)]",
        "dark:shadow-[0_0_6px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]",
        "transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Glass Button
export function GlassButton({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "ghost"
  size?: "sm" | "default" | "lg"
}) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center gap-2 cursor-pointer",
        "rounded-lg font-medium transition-all duration-200",
        "backdrop-blur-md backdrop-saturate-150",
        "border border-white/30 dark:border-white/10",
        "shadow-[0_0_4px_rgba(0,0,0,0.02),0_1px_4px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.4)]",
        "dark:shadow-[0_0_4px_rgba(0,0,0,0.1),0_1px_4px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)]",
        "hover:scale-[1.02] active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50",
        "disabled:pointer-events-none disabled:opacity-50",
        // Variants
        variant === "default" && "bg-white/50 dark:bg-white/5 text-gray-800 dark:text-gray-200 hover:bg-white/70 dark:hover:bg-white/10",
        variant === "primary" && "bg-indigo-500/80 dark:bg-indigo-500/60 text-white border-indigo-400/30 hover:bg-indigo-500/90 dark:hover:bg-indigo-500/70",
        variant === "ghost" && "bg-transparent border-transparent shadow-none hover:bg-white/30 dark:hover:bg-white/5",
        // Sizes
        size === "sm" && "text-xs px-3 py-1.5",
        size === "default" && "text-sm px-4 py-2.5",
        size === "lg" && "text-sm px-6 py-3",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Glass Input
export function GlassInput({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
        "bg-white/40 dark:bg-white/5",
        "backdrop-blur-sm",
        "border border-white/30 dark:border-white/10",
        "text-gray-900 dark:text-gray-100",
        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
        "shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]",
        "dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50",
        "focus:bg-white/60 dark:focus:bg-white/10",
        className
      )}
      {...props}
    />
  )
}

// Glass Textarea
export function GlassTextarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg px-3 py-2.5 text-sm transition-all duration-200 resize-none",
        "bg-white/40 dark:bg-white/5",
        "backdrop-blur-sm",
        "border border-white/30 dark:border-white/10",
        "text-gray-900 dark:text-gray-100",
        "placeholder:text-gray-400 dark:placeholder:text-gray-500",
        "shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]",
        "dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50",
        "focus:bg-white/60 dark:focus:bg-white/10",
        className
      )}
      {...props}
    />
  )
}

// Glass Select
export function GlassSelect({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
        "bg-white/40 dark:bg-white/5",
        "backdrop-blur-sm",
        "border border-white/30 dark:border-white/10",
        "text-gray-900 dark:text-gray-100",
        "shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]",
        "dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

// Glass Badge
export function GlassBadge({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium",
        "bg-white/40 dark:bg-white/10",
        "backdrop-blur-sm",
        "border border-white/30 dark:border-white/10",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
