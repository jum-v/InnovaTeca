import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { email, password, userType } = await req.json()
    if (!email || !password || !userType) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const supabase = createSupabaseServerClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return NextResponse.json({ error: error.message }, { status: 401 })

    // Verifica metadata p/ evitar login cruzado (empresa vs universidade)
    const currentType = data.user?.user_metadata?.user_type
    if (currentType !== userType) {
      await supabase.auth.signOut()
      return NextResponse.json(
        { error: `Esta conta não é de ${userType === 'company' ? 'empresa' : 'universidade'}` },
        { status: 403 }
      )
    }

    // Cookies já foram setados pelo helper
    return NextResponse.json({ message: 'Login ok' }, { status: 200 })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
