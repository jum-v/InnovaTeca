import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Button } from '@/components/ui/button'

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
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Olá, {displayName}</h1>
            <p className="text-muted-foreground mt-1">
              Bem-vindo ao seu painel. Encontre tecnologias e converse com universidades.
            </p>
          </div>
          <form action="/api/auth/signout" method="post">
            <Button type="submit" variant="outline">Sair</Button>
          </form>
        </header>

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
