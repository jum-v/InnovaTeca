import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    if (user.user_metadata?.user_type !== 'company') {
      return NextResponse.json(
        { error: 'Apenas empresas podem acessar este endpoint' },
        { status: 403 }
      )
    }

    const { data: company, error } = await supabase
      .from('companies')
      .select('id, name, email, cnpj')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Erro ao buscar empresa:', error)
      return NextResponse.json(
        { error: 'Empresa não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ company }, { status: 200 })
  } catch (error: any) {
    console.error('Erro ao buscar perfil da empresa:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar perfil' },
      { status: 500 }
    )
  }
}
