'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TechnologyCard } from '@/components/technology-card'
import type { Technology } from '@/components/technology-card'
import { CompanyHeader } from '@/components/company-header'
import { toast } from 'sonner'

export default function CompanyExplorePage() {
  const { user, userType, loading } = useAuth()
  const router = useRouter()
  const [technologies, setTechnologies] = useState<Technology[]>([])
  const [isLoadingTech, setIsLoadingTech] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  useEffect(() => {
    if (!loading) {
      if (!user || userType !== 'company') {
        toast.error('Acesso negado')
        router.push('/')
        return
      }
      fetchTechnologies()
    }
  }, [user, userType, loading, router])

  const fetchTechnologies = async () => {
    try {
      setIsLoadingTech(true)
      const response = await fetch('/api/technologies')
      const data = await response.json()

      if (response.ok) {
        setTechnologies(data.technologies)
      } else {
        toast.error('Erro ao carregar tecnologias')
      }
    } catch (error) {
      toast.error('Erro ao carregar tecnologias')
    } finally {
      setIsLoadingTech(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', { method: 'POST' })
      if (response.ok) {
        toast.success('Logout realizado com sucesso!')
        router.push('/')
      }
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(technologies.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTechnologies = technologies.slice(startIndex, endIndex)

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <CompanyHeader currentPage="explore" onSignOut={handleSignOut} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explorar Tecnologias</h1>
          <p className="text-muted-foreground">
            Descubra todas as inovações cadastradas pelas universidades
          </p>
        </div>

        {isLoadingTech ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando tecnologias...</p>
          </div>
        ) : technologies.length === 0 ? (
          <div className="border rounded-lg p-12 text-center">
            <p className="text-muted-foreground mb-4">
              Nenhuma tecnologia cadastrada ainda.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {currentTechnologies.map((tech) => (
                <TechnologyCard
                  key={tech.id}
                  technology={tech}
                  onAskToContact={() => toast.info('Funcionalidade de contato em breve')}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 py-8">
                <Button
                  variant="outline"
                  size="default"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="default"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="gap-2"
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
