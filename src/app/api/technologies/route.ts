import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Verificar se é uma universidade
    const userType = user.user_metadata?.user_type;
    if (userType !== 'university') {
      return NextResponse.json(
        { error: 'Apenas universidades podem cadastrar tecnologias' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, excerpt, description, trl, tags, industrial_sector } = body;

    // Validações
    if (!title || !excerpt || !description) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Criar tecnologia no Supabase
    const { data: technology, error: dbError } = await supabase
      .from('technologies')
      .insert([{
        title,
        excerpt,
        description,
        trl: trl || null,
        tags: tags || [],
        industrial_sector: industrial_sector || null,
        university_id: user.id,
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Erro no banco:', dbError);
      throw dbError;
    }


    return NextResponse.json(
      {
        message: 'Tecnologia cadastrada com sucesso',
        technology,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Erro ao cadastrar tecnologia:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const universityId = searchParams.get('university_id');

    let query = supabase
      .from('technologies')
      .select(`
        *,
        university:universities (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (universityId) {
      query = query.eq('university_id', universityId);
    }

    const { data: technologies, error } = await query;

    if (error) {
      console.error('Erro ao buscar tecnologias:', error);
      throw error;
    }

    return NextResponse.json({ technologies }, { status: 200 });
  } catch (error: any) {
    console.error('Erro ao buscar tecnologias:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
