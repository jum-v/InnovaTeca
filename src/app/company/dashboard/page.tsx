import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Button } from '@/components/ui/button'
import { Sparkles, LogOut } from 'lucide-react'

export const metadata = {
  title: 'Dashboard da Empresa — InnovaTeca',
}

export default async function CompanyDashboardPage() {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/')
  if (user.user_metadata?.user_type !== 'company') redirect('/')

  const { data: company, error } = await supabase
    .from('companies')
    .select('name, email, cnpj, created_at')
    .eq('id', user.id)
    .single()

  if (error) console.error('Erro carregando perfil da empresa:', error)

  const displayName = company?.name ?? user.user_metadata?.name ?? 'Sua Empresa'

  return (
    <main className="min-h-screen bg-background">
      <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <nav className='flex h-16 items-center justify-between px-4 w-full px-10'>
          <Link
            href='/'
            className='flex items-center gap-2 transition-transform hover:scale-105'
          >
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero shadow-md'>
              <Sparkles className='h-6 w-6 text-white' />
            </div>
            <span className='text-xl font-bold text-gradient'>InnovaTeca</span>
          </Link>

          <div className='flex items-center gap-3'>
            <Link href='/'>
              <Button variant='outline' size='sm'>
                Início
              </Button>
            </Link>
            <form action="/api/auth/signout" method="post">
              <Button type="submit" variant='ghost' size='sm'>
                <LogOut className='h-4 w-4 mr-2' />
                Sair
              </Button>
            </form>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Olá, {displayName}</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo ao seu painel. Encontre tecnologias e converse com universidades.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border p-6 bg-card">
            <h2 className="text-lg font-semibold mb-1">Procurar Soluções</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Descreva sua dor e deixe a IA encontrar tecnologias compatíveis.
            </p>
            <Link href="/">
              <Button variant="hero">Descrever necessidade</Button>
            </Link>
          </div>

          <div className="rounded-xl border p-6 bg-card">
            <h2 className="text-lg font-semibold mb-1">Tecnologias em Destaque</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Explore a vitrine pública e favorite o que te interessar.
            </p>
            <Link href="/">
              <Button variant="outline">Explorar vitrine</Button>
            </Link>
          </div>
        </section>

        <section className="mt-8">
          <div className="rounded-xl border p-6 bg-card">
            <h2 className="text-lg font-semibold mb-2">Seu Perfil</h2>
            <div className="text-sm grid sm:grid-cols-2 gap-2 text-muted-foreground">
              <div><span className="font-medium text-foreground">Nome: </span>{displayName}</div>
              <div><span className="font-medium text-foreground">E-mail: </span>{company?.email ?? user.email}</div>
              {company?.cnpj && (
                <div><span className="font-medium text-foreground">CNPJ: </span>{company.cnpj}</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
