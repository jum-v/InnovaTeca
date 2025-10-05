'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { CompanyHeader } from '@/components/company-header'
import { AIChat } from '@/components/ai-chat'
import { toast } from 'sonner'

function ChatContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('query')

  return <AIChat initialQuery={initialQuery || undefined} />
}

export default function CompanyChatPage() {
  const { user, userType, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user || userType !== 'company') {
        toast.error('Acesso negado')
        router.push('/')
      }
    }
  }, [user, userType, loading, router])

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <CompanyHeader currentPage='chat' />

      <main className='flex-1 container mx-auto px-4 py-8 max-w-7xl'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-2'>
            Busca Inteligente de Tecnologias
          </h1>
          <p className='text-muted-foreground'>
            Descreva seu problema ou necessidade e nossa IA encontrará as
            tecnologias mais adequadas
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Chat Interface - 2 columns */}
          <div className='lg:col-span-2'>
            <Suspense fallback={<div className='flex items-center justify-center h-[600px]'>Carregando chat...</div>}>
              <ChatContent />
            </Suspense>
          </div>

          {/* Sidebar com dicas - 1 column */}
          <div className='space-y-6'>
            <div className='rounded-lg border border-border/50 p-6 bg-card'>
              <h2 className='text-xl font-semibold mb-4'>Como usar</h2>
              <ul className='space-y-3 text-sm text-muted-foreground'>
                <li className='flex gap-2'>
                  <span className='text-primary font-bold'>1.</span>
                  <span>
                    Descreva seu problema, necessidade ou área de interesse
                  </span>
                </li>
                <li className='flex gap-2'>
                  <span className='text-primary font-bold'>2.</span>
                  <span>
                    A IA analisará e recomendará tecnologias relevantes
                  </span>
                </li>
                <li className='flex gap-2'>
                  <span className='text-primary font-bold'>3.</span>
                  <span>
                    Clique nos links para ver detalhes e entrar em contato
                  </span>
                </li>
                <li className='flex gap-2'>
                  <span className='text-primary font-bold'>4.</span>
                  <span>Refine sua busca com perguntas de acompanhamento</span>
                </li>
              </ul>
            </div>

            <div className='rounded-lg border border-border/50 p-6 bg-card'>
              <h2 className='text-xl font-semibold mb-4'>
                Exemplos de perguntas
              </h2>
              <div className='space-y-2 text-sm'>
                <div className='p-3 rounded-md bg-muted/50'>
                  "Preciso de uma solução para reduzir emissões de CO2"
                </div>
                <div className='p-3 rounded-md bg-muted/50'>
                  "Busco tecnologias de IoT para monitoramento"
                </div>
                <div className='p-3 rounded-md bg-muted/50'>
                  "Quais inovações existem em nanotecnologia?"
                </div>
                <div className='p-3 rounded-md bg-muted/50'>
                  "Preciso de bioplásticos sustentáveis"
                </div>
              </div>
            </div>

            <div className='rounded-lg border border-border/50 p-6 bg-card'>
              <h2 className='text-xl font-semibold mb-4'>Dicas</h2>
              <ul className='space-y-3 text-sm'>
                <li className='flex items-start gap-2'>
                  <span className='text-primary'>✓</span>
                  <span>Seja específico sobre o setor e aplicação</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-primary'>✓</span>
                  <span>Mencione requisitos técnicos importantes</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-primary'>✓</span>
                  <span>Indique nível de maturidade desejado (TRL)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
