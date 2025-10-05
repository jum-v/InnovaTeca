'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/header'
import {
  ArrowLeft,
  Building2,
  Mail,
  TrendingUp,
  Calendar,
  Tag,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'

interface Technology {
  id: string
  title: string
  excerpt: string
  description: string
  university?: {
    name: string
    email: string
  }
  trl: string | number
  tags: string[]
  compatibility?: number
  created_at: string
}

export default function TechnologyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, userType } = useAuth()
  const [technology, setTechnology] = useState<Technology | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [contactOpen, setContactOpen] = useState(false)
  const [companyData, setCompanyData] = useState<any>(null)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  })

  useEffect(() => {
    if (params?.id) {
      fetchTechnology()
      if (user && userType === 'company') {
        fetchCompanyData()
      }
    }
  }, [params?.id, user, userType])

  const fetchTechnology = async () => {
    if (!params?.id) return
    try {
      setIsLoading(true)
      const response = await fetch(`/api/technologies/${params.id}`)
      const data = await response.json()

      if (response.ok) {
        setTechnology(data.technology)
      } else {
        toast.error('Tecnologia não encontrada')
        router.push('/')
      }
    } catch (error) {
      toast.error('Erro ao carregar tecnologia')
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCompanyData = async () => {
    if (!params?.id) return
    try {
      const response = await fetch('/api/company/profile')
      const data = await response.json()

      if (response.ok) {
        setCompanyData(data.company)
        // Auto-preencher formulário
        setContactForm({
          name: data.company.name || '',
          email: data.company.email || '',
          company: data.company.name || '',
          message: '',
        })
      } else {
        toast.error('Erro ao carregar dados da empresa')
      }
    } catch (error) {
      toast.error('Erro ao carregar dados da empresa')
    }
  }

  const getTRLColor = (trl: string | number) => {
    const trlNum = typeof trl === 'string' ? parseInt(trl) : trl
    if (trlNum >= 7) return 'bg-secondary text-secondary-foreground'
    if (trlNum >= 4) return 'bg-primary/10 text-primary'
    return 'bg-muted text-muted-foreground'
  }

  const getTRLDescription = (trl: string | number) => {
    const trlNum = typeof trl === 'string' ? parseInt(trl) : trl
    if (trlNum >= 7) return 'Pronto para mercado - demonstrado em ambiente operacional'
    if (trlNum >= 4) return 'Em desenvolvimento - validação em laboratório/ambiente relevante'
    return 'Pesquisa inicial - prova de conceito'
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          technology_id: params?.id || '',
          ...contactForm,
        }),
      })

      if (response.ok) {
        toast.success('Mensagem enviada com sucesso! A universidade entrará em contato em breve.')
        setContactOpen(false)
        setContactForm({ name: '', email: '', company: '', message: '' })
      } else {
        toast.error('Erro ao enviar mensagem')
      }
    } catch (error) {
      toast.error('Erro ao enviar mensagem')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header isLoggedIn={!!user} userType={userType || undefined} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Carregando tecnologia...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!technology) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header isLoggedIn={!!user} userType={userType || undefined} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Tecnologia não encontrada</h1>
            <p className="text-muted-foreground mb-6">
              A tecnologia que você procura não existe ou foi removida
            </p>
            <Button onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const universityName =
    typeof technology.university === 'string'
      ? technology.university
      : technology.university?.name || 'Universidade'
  const universityEmail =
    typeof technology.university === 'object'
      ? technology.university?.email
      : 'contato@universidade.edu.br'

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={!!user} userType={userType || undefined} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              {technology.compatibility && (
                <Badge className="bg-gradient-hero text-white font-semibold">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {technology.compatibility}% de Compatibilidade
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {technology.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {technology.excerpt}
              </p>
            </div>

            {/* Tags */}
            {technology.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {technology.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Description */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">Descrição Detalhada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed whitespace-pre-line text-[15px]">
                  {technology.description}
                </p>
              </CardContent>
            </Card>

            {/* TRL Info */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Nível de Maturidade Tecnológica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge
                  className={`${getTRLColor(technology.trl)} text-base px-4 py-2 font-semibold`}
                >
                  TRL {technology.trl}
                </Badge>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getTRLDescription(technology.trl)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* University Card */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-primary" />
                  Instituição
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <p className="font-semibold text-lg">{universityName}</p>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="break-words">{universityEmail}</span>
                  </div>
                </div>

                <div className="pt-2">
                  {userType === 'company' ? (
                    <Button
                      variant="hero"
                      className="w-full"
                      onClick={() => setContactOpen(true)}
                    >
                      Entrar em Contato
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        toast.info('Faça login como empresa para entrar em contato')
                        router.push('/')
                      }}
                    >
                      Entrar em Contato
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    Cadastrada em{' '}
                    {new Date(technology.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground break-all">
                    ID: {technology.id}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Entrar em Contato</DialogTitle>
            <DialogDescription className="text-base">
              Preencha o formulário abaixo para manifestar interesse nesta tecnologia.
              A universidade receberá sua mensagem e entrará em contato.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleContactSubmit} className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome do Contato *
              </Label>
              <Input
                id="name"
                required
                placeholder="Seu nome completo"
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm({ ...contactForm, name: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Nome da pessoa responsável pelo contato
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                E-mail *
              </Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="seu@email.com"
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm({ ...contactForm, email: e.target.value })
                }
                disabled={!!companyData}
              />
              {companyData && (
                <p className="text-xs text-muted-foreground">
                  E-mail da empresa cadastrada
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium">
                Empresa *
              </Label>
              <Input
                id="company"
                required
                placeholder="Nome da sua empresa"
                value={contactForm.company}
                onChange={(e) =>
                  setContactForm({ ...contactForm, company: e.target.value })
                }
                disabled={!!companyData}
              />
              {companyData && (
                <p className="text-xs text-muted-foreground">
                  Nome da empresa cadastrada
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium">
                Mensagem *
              </Label>
              <Textarea
                id="message"
                required
                placeholder="Descreva seu interesse nesta tecnologia, aplicações pretendidas, próximos passos..."
                className="min-h-[120px] resize-none"
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setContactOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="hero" className="flex-1">
                Enviar Mensagem
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
