import { NextRequest, NextResponse } from 'next/server'
import { signUp } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, cnpj, userType } = await req.json()

    if (!email || !password || !name || !userType) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    if (!['company', 'university'].includes(userType)) {
      return NextResponse.json({ error: 'Tipo de usuário inválido' }, { status: 400 })
    }

    const result = await signUp({ email, password, name, cnpj }, userType)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ message: 'Cadastro realizado com sucesso', user: result.user }, { status: 201 })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
