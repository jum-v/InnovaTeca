'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { LoginModal } from '@/components/login-modal';
import { RegisterModal } from '@/components/register-modal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import {
  Building2,
  GraduationCap,
  Search,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Users,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';

export default function ComoFuncionaPage() {
  const { user, userType } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onLoginClick={() => setLoginOpen(true)}
        onRegisterClick={() => setRegisterOpen(true)}
        isLoggedIn={!!user}
        userType={userType || undefined}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 flex justify-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,hsl(var(--primary)/.10),transparent)]" />
        <div className="container relative px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Como Funciona o{' '}
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                InnovaTeca
              </span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Conectamos empresas que buscam inovação com universidades que desenvolvem tecnologias de ponta
            </p>
          </div>
        </div>
      </section>

      {/* Para Empresas */}
      <section className="py-16 bg-muted/30 flex justify-center">
        <div className="container px-4">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary">Para Empresas</span>
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">
              Encontre a tecnologia perfeita para o seu desafio
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <StepCard
              icon={<Search className="h-8 w-8" />}
              number="1"
              title="Busque por Inovação"
              description="Descreva seu desafio ou necessidade tecnológica. Nossa IA analisa e encontra as tecnologias mais compatíveis no nosso banco de dados."
              color="primary"
            />
            <StepCard
              icon={<MessageCircle className="h-8 w-8" />}
              number="2"
              title="Conecte-se com Universidades"
              description="Entre em contato direto com os NITs (Núcleos de Inovação Tecnológica) das universidades que desenvolveram as tecnologias."
              color="secondary"
            />
            <StepCard
              icon={<CheckCircle className="h-8 w-8" />}
              number="3"
              title="Feche a Parceria"
              description="Negocie licenciamento, transferência de tecnologia ou parcerias de P&D diretamente com a universidade."
              color="accent"
            />
          </div>

          {!user && (
            <div className="mt-12 text-center">
              <Button size="lg" variant="hero" onClick={() => setRegisterOpen(true)}>
                Cadastrar Empresa
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Para Universidades */}
      <section className="py-16 flex justify-center">
        <div className="container px-4">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary">Para Universidades</span>
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">
              Conecte suas tecnologias com o mercado
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <StepCard
              icon={<Sparkles className="h-8 w-8" />}
              number="1"
              title="Cadastre Tecnologias"
              description="Publique as inovações desenvolvidas pela sua universidade com descrições detalhadas, áreas de aplicação e estágio de desenvolvimento."
              color="secondary"
            />
            <StepCard
              icon={<Target className="h-8 w-8" />}
              number="2"
              title="Seja Descoberto"
              description="Empresas buscando soluções encontram suas tecnologias através de busca inteligente com IA que faz o match perfeito."
              color="primary"
            />
            <StepCard
              icon={<Zap className="h-8 w-8" />}
              number="3"
              title="Transfira Tecnologia"
              description="Receba solicitações de contato de empresas interessadas e conduza o processo de transferência de tecnologia."
              color="accent"
            />
          </div>

          {!user && (
            <div className="mt-12 text-center">
              <Button size="lg" variant="hero" onClick={() => setRegisterOpen(true)}>
                Cadastrar Universidade
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16 bg-muted/30 flex justify-center">
        <div className="container px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold md:text-4xl mb-4">
              Por que usar o InnovaTeca?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Facilitamos a transferência de tecnologia e a inovação aberta no Brasil
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <BenefitCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Busca Inteligente com IA"
              description="Algoritmos avançados analisam necessidades e fazem match com as tecnologias mais relevantes."
            />
            <BenefitCard
              icon={<Zap className="h-6 w-6" />}
              title="Conexão Direta"
              description="Elimine intermediários e conecte-se diretamente com quem importa: universidades e empresas."
            />
            <BenefitCard
              icon={<Users className="h-6 w-6" />}
              title="Ecossistema Nacional"
              description="Acesse a maior rede de inovação aberta e transferência de tecnologia do Brasil."
            />
            <BenefitCard
              icon={<Target className="h-6 w-6" />}
              title="Tecnologias Validadas"
              description="Todas as tecnologias são cadastradas e validadas pelas próprias universidades."
            />
            <BenefitCard
              icon={<CheckCircle className="h-6 w-6" />}
              title="Processo Simplificado"
              description="Plataforma intuitiva que guia você em todo o processo de busca e conexão."
            />
            <BenefitCard
              icon={<MessageCircle className="h-6 w-6" />}
              title="Suporte Dedicado"
              description="Equipe pronta para ajudar empresas e universidades a maximizar resultados."
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-[linear-gradient(180deg,hsl(var(--card))_0%,hsl(var(--muted))_100%)] flex justify-center">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold md:text-4xl mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se às empresas e universidades que já fazem parte do maior ecossistema de inovação aberta do Brasil
          </p>
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="hero" onClick={() => setRegisterOpen(true)}>
                Criar Conta Gratuita
              </Button>
              <Button size="lg" variant="outline" onClick={() => setLoginOpen(true)}>
                Já tenho conta
              </Button>
            </div>
          ) : (
            <Button size="lg" variant="hero" onClick={() => window.location.href = '/'}>
              Explorar Tecnologias
            </Button>
          )}
        </div>
      </section>

      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />
      <RegisterModal
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </div>
  );
}

interface StepCardProps {
  icon: React.ReactNode;
  number: string;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
}

function StepCard({ icon, number, title, description, color }: StepCardProps) {
  return (
    <div className="relative">
      <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-white font-bold text-xl shadow-lg">
        {number}
      </div>
      <div className="border rounded-xl p-6 bg-card hover:shadow-lg transition-shadow h-full pt-8">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="border rounded-xl p-6 bg-card hover:shadow-md transition-shadow">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
