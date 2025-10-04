"use client"

import { ReactNode } from "react"

export function Modal({ open, onOpenChange, title, children }: { open: boolean; onOpenChange: (v: boolean) => void; title?: string; children: ReactNode }) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
            <div className="relative z-[61] w-full max-w-md rounded-xl border bg-card p-6 shadow-xl">
                {title && <h3 className="mb-4 text-lg font-semibold">{title}</h3>}
                {children}
            </div>
        </div>
    )
}