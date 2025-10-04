"use client"

import { useState } from "react"
import { Modal } from "./ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function RegisterModal({ open, onOpenChange, onSuccess, onGoToLogin }: {
    open: boolean
    onOpenChange: (v: boolean) => void
    onSuccess: (type: "company" | "university") => void
    onGoToLogin: () => void
}) {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [type, setType] = useState<"company" | "university">("company")

    return (
        <Modal open={open} onOpenChange={onOpenChange} title="Criar conta">
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label>Nome</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
                </div>
                <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@dominio.com" />
                </div>
                <div className="grid gap-2">
                    <Label>Senha</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <label className="flex items-center gap-2">
                        <input type="radio" className="accent-[hsl(var(--primary))]" checked={type === "company"} onChange={() => setType("company")} /> Empresa
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="radio" className="accent-[hsl(var(--primary))]" checked={type === "university"} onChange={() => setType("university")} /> Universidade/NIT
                    </label>
                </div>
                <Button className="w-full" variant="hero" onClick={() => onSuccess(type)}>Criar conta</Button>
                <p className="text-center text-sm text-muted-foreground">Já tem conta? <button className="underline" onClick={onGoToLogin}>Entrar</button></p>
            </div>
        </Modal>
    )
}