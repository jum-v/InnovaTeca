import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY não configurada')
}

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // Buscar tecnologias do Supabase
    const supabase = createSupabaseServerClient()
    const { data: technologies, error } = await supabase
      .from('technologies')
      .select(`
        id,
        title,
        excerpt,
        description,
        trl,
        tags,
        created_at,
        university:universities!inner(
          name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('[Chat API] Erro ao buscar tecnologias:', error)
    }

    // Preparar contexto com as tecnologias disponíveis
    const techContext = technologies
      ?.map((tech: any) => {
        const uni = Array.isArray(tech.university)
          ? tech.university[0]
          : tech.university
        return `
Tecnologia: ${tech.title}
Descrição: ${tech.excerpt || tech.description || 'Sem descrição'}
TRL: ${tech.trl}
Tags: ${Array.isArray(tech.tags) ? tech.tags.join(', ') : 'N/A'}
Universidade: ${uni?.name || 'N/A'}
URL: ${process.env.APP_URL || 'http://localhost:3000'}/technology/${tech.id}
        `.trim()
      })
      .join('\n\n---\n\n') || 'Nenhuma tecnologia disponível no momento.'

    // Criar prompt do sistema
    const systemPrompt = `Você é um assistente especializado em conectar empresas com tecnologias universitárias inovadoras.

Seu objetivo é ajudar empresas a encontrar soluções tecnológicas desenvolvidas por universidades que atendam suas necessidades.

TECNOLOGIAS DISPONÍVEIS:
${techContext}

INSTRUÇÕES:
1. Quando o usuário descrever um problema, necessidade ou interesse, analise as tecnologias disponíveis
2. Recomende as tecnologias mais relevantes com base na descrição do usuário
3. Para cada tecnologia recomendada, forneça:
   - Nome da tecnologia
   - Breve resumo de como ela pode ajudar
   - Nível TRL (maturidade)
   - Universidade responsável
   - Link clicável para mais detalhes
4. Seja objetivo, direto e útil
5. Se nenhuma tecnologia for adequada, informe honestamente e sugira áreas de busca
6. SEMPRE inclua os links completos (URLs) das tecnologias relevantes

Formato de resposta ideal:
"Com base na sua necessidade de [necessidade], encontrei X tecnologias que podem ajudar:

**1. [Nome da Tecnologia]**
- Como pode ajudar: [explicação breve]
- Nível TRL: [TRL]
- Universidade: [nome]
- [Link clicável para /technology/ID]

[continuar para outras tecnologias...]

Você pode clicar nos links para ver mais detalhes e entrar em contato com as universidades."`

    // Preparar mensagens para OpenRouter
    const messages = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...(history?.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })) || []),
      {
        role: 'user',
        content: message,
      },
    ]

    // Enviar requisição para OpenRouter
    const openRouterResponse = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
        'X-Title': 'InnovaTeca',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages,
      }),
    })

    if (!openRouterResponse.ok) {
      throw new Error(`OpenRouter API error: ${openRouterResponse.statusText}`)
    }

    const data = await openRouterResponse.json()
    const response = data.choices[0]?.message?.content || 'Desculpe, não consegui processar sua mensagem.'

    return NextResponse.json({
      response,
      technologies: technologies || [],
    })
  } catch (error: any) {
    console.error('[Chat API] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar mensagem', details: error.message },
      { status: 500 }
    )
  }
}
