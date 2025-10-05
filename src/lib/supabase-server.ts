import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export const createSupabaseServerClient = () => {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.then(store => store.get(name)?.value)
        },
        set(name: string, value: string, options: any) {
          cookieStore.then(store => store.set({ name, value, ...options }))
        },
        remove(name: string, options: any) {
          cookieStore.then(store => store.set({ name, value: '', ...options }))
        },
      },
    }
  )
}
