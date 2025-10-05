import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient()

    const { data: technology, error } = await supabase
      .from('technologies')
      .select(`
        id,
        title,
        excerpt,
        description,
        trl,
        tags,
        created_at,
        university:universities(name, email)
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Erro ao buscar tecnologia:', error)
      return NextResponse.json(
        { error: 'Tecnologia não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ technology }, { status: 200 })
  } catch (error: any) {
    console.error('Erro ao buscar tecnologia:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar tecnologia' },
      { status: 500 }
    )
  }
}
