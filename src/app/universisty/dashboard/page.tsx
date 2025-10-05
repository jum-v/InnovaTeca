import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Dashboard da Universidade — InnovaTeca',
}

export default async function UniversityDashboardPage() {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/')
  if (user.user_metadata?.user_type !== 'university') redirect('/')

  const { data: uni, error } = await supabase
    .from('universities')
    .select('name, email, created_at')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Erro carregando perfil da universidade:', error)
  }

  const displayName = uni?.name ?? user.user_metadata?.name ?? 'Sua Universidade'

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Olá, {displayName}</h1>
            <p className="text-muted-foreground mt-1">
              Cadastre e gerencie as tecnologias da sua instituição.
            </p>
          </div>
          <div className="flex gap-2">
            <form action="/api/auth/signout" method="post">
              <Button type="submit" variant="outline">Sair</Button>
            </form>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border p-6 bg-card">
            <h2 className="text-lg font-semibold mb-1">Cadastrar Tecnologia</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Publique um novo ativo para ser encontrado por empresas.
            </p>
            <Link href="/university/new-technology">
              <Button variant="hero">Nova tecnologia</Button>
            </Link>
          </div>

          <div className="rounded-xl border p-6 bg-card">
            <h2 className="text-lg font-semibold mb-1">Minhas Tecnologias</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Veja, edite e acompanhe o interesse do mercado.
            </p>
            <Link href="/university/technologies">
              <Button variant="outline">Ver todas</Button>
            </Link>
          </div>
        </section>

        <section className="mt-8">
          <div className="rounded-xl border p-6 bg-card">
            <h2 className="text-lg font-semibold mb-2">Perfil Institucional</h2>
            <div className="text-sm grid sm:grid-cols-2 gap-2 text-muted-foreground">
              <div><span className="font-medium text-foreground">Nome: </span>{displayName}</div>
              <div><span className="font-medium text-foreground">E-mail: </span>{uni?.email ?? user.email}</div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="rounded-xl border p-6 bg-card">
            <h3 className="text-base font-semibold mb-2">Tecnologias publicadas</h3>
            <p className="text-sm text-muted-foreground">Nenhuma tecnologia cadastrada ainda.</p>
            <div className="mt-4">
              <Link href="/university/new-technology">
                <Button variant="outline">Cadastrar a primeira</Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
