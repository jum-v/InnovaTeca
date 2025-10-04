"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function SearchPrompt({ onSearch }: { onSearch: (query: string) => void }) {
    const [value, setValue] = useState("")

    return (
        <div className="relative">
            <label className="mb-2 block text-sm font-medium text-muted-foreground">Ache uma tecnologia</label>
            <div className="flex items-center gap-2 rounded-xl border p-4 shadow-sm bg-white/0">
                <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Descreva sua dor (ex: reduzir emissão de carbono em 20%)"
                    className="h-24 flex-1 border-0 resize-none text-lg bg-transparent px-4 py-3 placeholder:text-base shadow-none focus:outline-none focus:ring-0"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && value.trim()) onSearch(value.trim())
                    }}
                />
                <Button size="icon" variant="hero" aria-label="Buscar" onClick={() => value.trim() && onSearch(value.trim())} className="cursor-pointer">
                    <ArrowRight className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}