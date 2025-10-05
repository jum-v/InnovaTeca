import { supabase } from './supabase';
import { supabaseAdmin } from './supabase-admin';
export type UserType = 'company' | 'university';

interface SignUpData {
  email: string;
  password: string;
  name: string;
  cnpj?: string;
}

interface SignInData {
  email: string;
  password: string;
}

/**
 * Cadastra um novo usuário usando Supabase Auth e cria registro na tabela correspondente
 */
export async function signUp(data: SignUpData, userType: UserType) {
  try {
    // 1. Criar usuário no Supabase Auth usando admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true, // Auto-confirmar email
      user_metadata: {
        user_type: userType,
        name: data.name,
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Falha ao criar usuário');

    // 2. Criar registro na tabela Company ou University usando admin client
    const tableName = userType === 'company' ? 'companies' : 'universities';
    const payload = {
      id: authData.user.id,
      name: data.name,
      email: data.email,
      ...(userType === 'company' ? { cnpj: data.cnpj || '' } : {}),
    };

    const { error: dbError } = await supabaseAdmin.from(tableName).insert(payload);
    if (dbError) throw dbError;

    return { success: true, user: authData.user };
  } catch (error: any) {
    console.error('Erro no cadastro:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Faz login de um usuário usando Supabase Auth
 */
export async function signIn(data: SignInData, userType: UserType) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Credenciais inválidas');

    // Verificar se o tipo de usuário corresponde
    const userMetadata = authData.user.user_metadata;
    if (userMetadata.user_type !== userType) {
      await supabase.auth.signOut();
      throw new Error(`Esta conta não é de ${userType === 'company' ? 'empresa' : 'universidade'}`);
    }

    return { success: true, user: authData.user, session: authData.session };
  } catch (error: any) {
    console.error('Erro no login:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Faz logout do usuário
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Erro no logout:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtém o usuário autenticado atual
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { success: true, user };
  } catch (error: any) {
    console.error('Erro ao obter usuário:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtém a sessão atual
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { success: true, session };
  } catch (error: any) {
    console.error('Erro ao obter sessão:', error);
    return { success: false, error: error.message };
  }
}
