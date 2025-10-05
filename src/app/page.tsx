"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { SearchPrompt } from "@/components/search-prompt"
import { TechnologyCard } from "@/components/technology-card"
import type { Technology } from "@/components/technology-card"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"
import { Button } from "@/components/ui/button"
import { Sparkles, Target, Zap, Users } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"


export default function Home() {
  const { user, userType } = useAuth()
  const router = useRouter()
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [isLoadingTech, setIsLoadingTech] = useState(true)


  useEffect(() => {
    fetchTechnologies()
  }, [])

  const fetchTechnologies = async () => {
    try {
      setIsLoadingTech(true)
      const response = await fetch('/api/technologies')
      const data = await response.json()

      if (response.ok) {
        setTechnologies(data.technologies)
      }
    } catch (error) {
      console.error('Erro ao carregar tecnologias:', error)
    } finally {
      setIsLoadingTech(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!user) {
      toast.info("Faça login para ver os resultados da sua busca")
      setLoginOpen(true)
    } else if (userType === 'company') {
      // Redirecionar para página de chat com query
      router.push(`/company/chat?query=${encodeURIComponent(query)}`)
    } else {
      toast.info("Busca por IA disponível apenas para empresas")
    }
  }




  return (
    <div className="min-h-screen bg-background min-w-screen flex flex-col items-center justify-center">
      <div className="w-full">
        <Header
          onLoginClick={() => setLoginOpen(true)}
          onRegisterClick={() => setRegisterOpen(true)}
          isLoggedIn={!!user}
          userType={userType || undefined}
        />

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

            {isLoadingTech ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando tecnologias...</p>
              </div>
            ) : technologies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Nenhuma tecnologia cadastrada ainda.</p>
                <p className="text-sm text-muted-foreground">Seja a primeira universidade a cadastrar uma inovação!</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {technologies.slice(0, 6).map((tech) => (
                  <TechnologyCard key={tech.id} technology={tech} onAskToContact={() => setLoginOpen(true)} />
                ))}
              </div>
            )}
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

        <LoginModal
          open={loginOpen}
          onOpenChange={setLoginOpen}
          onSwitchToRegister={() => { setLoginOpen(false); setRegisterOpen(true) }}
        />
        <RegisterModal
          open={registerOpen}
          onOpenChange={setRegisterOpen}
          onSwitchToLogin={() => { setRegisterOpen(false); setLoginOpen(true) }}
        />
      </div>
    </div>
  )
}

function Feature({ icon, title, desc, tone }: { icon: React.ReactNode; title: string; desc: string; tone: "primary" | "secondary" | "accent" }) {
  const styles = {
    primary: {
      bg: "bg-muted/50",
      border: "border-border/50",
      icon: "text-foreground",
      hoverBg: "group-hover:bg-muted",
      hoverBorder: "group-hover:border-border"
    },
    secondary: {
      bg: "bg-info/10",
      border: "border-info/20",
      icon: "text-info",
      hoverBg: "group-hover:bg-info/15",
      hoverBorder: "group-hover:border-info/30"
    },
    accent: {
      bg: "bg-success/10",
      border: "border-success/20",
      icon: "text-success",
      hoverBg: "group-hover:bg-success/15",
      hoverBorder: "group-hover:border-success/30"
    }
  }

  const style = styles[tone]

  return (
    <div className="flex flex-col items-center text-center group">
      <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl border transition-all duration-200 group-hover:scale-105 ${style.bg} ${style.border} ${style.hoverBg} ${style.hoverBorder}`}>
        <div className={style.icon}>{icon}</div>
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed px-2 md:px-0 max-w-[200px] md:max-w-none">{desc}</p>
    </div>
  )
}