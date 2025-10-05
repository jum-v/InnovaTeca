import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
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
        { error: 'Apenas empresas podem enviar mensagens de contato' },
        { status: 403 }
      )
    }

    const { technology_id, name, email, company, message } = await req.json()

    if (!technology_id || !name || !email || !company || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar a universidade dona da tecnologia
    const { data: technology, error: techError } = await supabase
      .from('technologies')
      .select('university_id')
      .eq('id', technology_id)
      .single()

    if (techError || !technology) {
      return NextResponse.json(
        { error: 'Tecnologia não encontrada' },
        { status: 404 }
      )
    }

    // Criar contato
    const { error: contactError } = await supabase.from('contacts').insert({
      message: `De: ${name} (${email}) - ${company}\n\n${message}`,
      company_id: user.id,
      university_id: technology.university_id,
    })

    if (contactError) {
      console.error('Erro ao criar contato:', contactError)
      return NextResponse.json(
        { error: 'Erro ao enviar mensagem' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Mensagem enviada com sucesso' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Erro ao criar contato:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    )
  }
}
