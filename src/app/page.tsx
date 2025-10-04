"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { SearchPrompt } from "@/components/search-prompt"
import { TechnologyCard } from "@/components/technology-card"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"
import { mockTechnologies } from "@/data/mock-technologies"
import { Button } from "@/components/ui/button"
import { Sparkles, Target, Zap, Users } from "lucide-react"
import { toast } from "sonner"


export default function Home() {
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")


  const handleSearch = (query: string) => {
    setSearchQuery(query)
    toast.info("Faça login para ver os resultados da sua busca")
    setLoginOpen(true)
  }


  const handleAuthSuccess = (type: "company" | "university") => {
    toast.success("Bem-vindo! 🎉 (fluxo de navegação será plugado depois)")
    setLoginOpen(false)
    setRegisterOpen(false)
    // Se houver busca pendente e for empresa, você pode redirecionar usando next/navigation quando a rota existir
    // router.push(type === "company" && searchQuery ? `/company/search?query=${encodeURIComponent(searchQuery)}` : `/${type}/dashboard`)
  }


  return (
    <div className="min-h-screen bg-background min-w-screen flex flex-col items-center justify-center">
      <div className="w-full">
        <Header onLoginClick={() => setLoginOpen(true)} onRegisterClick={() => setRegisterOpen(true)} />

        {/* HERO */}
        <section className=" flex flex-col items-center justify-center relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,hsl(var(--primary)/.10),transparent)]" />
          <div className="container relative px-4 py-20 md:py-28 flex flex-col items-center">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Matchmaking com Inteligência Artificial</span>
              </div>

              <h1 className="mb-6 text-pretty text-4xl font-bold tracking-tight md:text-6xl">
                Ache uma <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">tecnologia</span> para o seu desafio
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
                Descreva sua necessidade no prompt abaixo e conecte-se com universidades e NITs em minutos.
              </p>

              <div className="mx-auto max-w-2xl">
                <SearchPrompt onSearch={handleSearch} />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="border-t border-border/50 bg-muted/30 py-16 flex justify-center">
          <div className="container px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <Feature icon={<Target className="h-8 w-8" />} title="Busca Inteligente" desc="IA analisa sua necessidade e encontra tecnologias compatíveis." tone="primary" />
              <Feature icon={<Zap className="h-8 w-8" />} title="Conexão Direta" desc="Fale imediatamente com universidades e NITs." tone="secondary" />
              <Feature icon={<Users className="h-8 w-8" />} title="Ecossistema" desc="Faça parte da maior rede de transferência de tecnologia." tone="accent" />
            </div>
          </div>
        </section>

        {/* FEED */}
        <section className="py-16 flex justify-center">
          <div className="container px-4">
            <div className="mb-10 text-center">
              <h2 className="mb-2 text-3xl font-bold md:text-4xl">Tecnologias em Destaque</h2>
              <p className="text-muted-foreground">Inovações recentes cadastradas pelas universidades</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockTechnologies.map((tech) => (
                <TechnologyCard key={tech.id} technology={tech} onAskToContact={() => setLoginOpen(true)} />
              ))}
            </div>
          </div>
        </section>
        {/* CTA */}
        <section className="border-t border-border/50 bg-[linear-gradient(180deg,hsl(var(--card))_0%,hsl(var(--muted))_100%)] py-20 flex justify-center">
          <div className="container px-4 text-center">
            <h2 className="mb-3 text-3xl font-bold md:text-4xl">Pronto para começar?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">Junte-se a empresas e universidades que já usam o InnovaTeca.</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="hero" onClick={() => setRegisterOpen(true)} className="cursor-pointer">Começar agora</Button>
              <Button size="lg" variant="outline" onClick={() => setLoginOpen(true)} className="cursor-pointer">Já tenho conta</Button>
            </div>
          </div>
        </section>

        <LoginModal open={loginOpen} onOpenChange={setLoginOpen} onSuccess={handleAuthSuccess} onGoToRegister={() => { setLoginOpen(false); setRegisterOpen(true) }} />
        <RegisterModal open={registerOpen} onOpenChange={setRegisterOpen} onSuccess={handleAuthSuccess} onGoToLogin={() => { setRegisterOpen(false); setLoginOpen(true) }} />
      </div>
    </div>
  )
}

function Feature({ icon, title, desc, tone }: { icon: React.ReactNode; title: string; desc: string; tone: "primary" | "secondary" | "accent" }) {
  const gradients = {
    primary: "bg-gradient-to-br from-primary/80 via-violet-400 to-primary/40",
    secondary: "bg-gradient-to-br from-secondary/80 via-blue-400 to-secondary/40",
    accent: "bg-gradient-to-br from-accent/80 via-pink-400 to-accent/40",
  }
  const borderColors = {
    primary: "border-primary",
    secondary: "border-secondary",
    accent: "border-accent",
  }
  const shadowColors = {
    primary: "shadow-primary/30",
    secondary: "shadow-secondary/30",
    accent: "shadow-accent/30",
  }
  const toneText = { primary: "text-secondary", secondary: "text-secondary", accent: "text-accent" }[tone]
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2 ${gradients[tone]} ${borderColors[tone]} shadow-lg ${shadowColors[tone]} transition-transform hover:scale-105 duration-200`}>
        <div className={`${toneText}`}>{icon}</div>
      </div>
      <h3 className="mb-1 text-lg font-semibold text-base md:text-lg drop-shadow-sm">{title}</h3>
      <p className="text-sm text-muted-foreground px-2 md:px-0 max-w-[180px] md:max-w-none">{desc}</p>
    </div>
  )
}