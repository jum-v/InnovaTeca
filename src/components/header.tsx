import { Button } from '@/components/ui/button'
import { Sparkles, Menu, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface HeaderProps {
  onLoginClick?: () => void
  onRegisterClick?: () => void
  isLoggedIn?: boolean
  userType?: 'company' | 'university'
}

export const Header = ({
  onLoginClick,
  onRegisterClick,
  isLoggedIn = false,
  userType,
}: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Logout realizado com sucesso!')
    router.push('/')
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b flex justify-between items-center border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <nav className='flex h-16 items-center justify-between px-4 w-full px-10'>
        <Link
          href='/'
          className='flex items-center gap-2 transition-transform hover:scale-105'
        >
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-hero shadow-md'>
            <Sparkles className='h-6 w-6 text-white' />
          </div>
          <span className='text-xl font-bold text-gradient'>InnovaTeca</span>
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center gap-6'>
          <Link
            href='/como-funciona'
            className='text-sm font-medium text-foreground/80 hover:text-foreground transition-colors'
          >
            Como Funciona
          </Link>

          {!isLoggedIn ? (
            <div className='flex items-center gap-3'>
              <Button variant='ghost' size='sm' onClick={onLoginClick}>
                Entrar
              </Button>
              <Button variant='hero' size='sm' onClick={onRegisterClick}>
                Cadastrar
              </Button>
            </div>
          ) : (
            <div className='flex items-center gap-3'>
              <Link
                href={
                  userType === 'university'
                    ? '/university/dashboard'
                    : userType === 'company'
                    ? '/company/dashboard'
                    : '/'
                }
              >
                <Button variant='outline' size='sm'>
                  Dashboard
                </Button>
              </Link>
              <Button variant='ghost' size='sm' onClick={handleSignOut}>
                <LogOut className='h-4 w-4 mr-2' />
                Sair
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type='button'
          className='md:hidden p-2 text-foreground'
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className='h-6 w-6' />
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className='md:hidden absolute top-16 left-0 right-0 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 shadow-lg'>
          <div className='px-4 py-6 flex flex-col gap-4'>
            <Link
              href='/como-funciona'
              className='text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2 px-3 rounded-md hover:bg-accent'
              onClick={() => setMobileMenuOpen(false)}
            >
              Como Funciona
            </Link>

            {!isLoggedIn ? (
              <div className='flex flex-col gap-3 pt-2 border-t border-border/40'>
                <Button
                  variant='ghost'
                  size='default'
                  onClick={() => {
                    onLoginClick?.()
                    setMobileMenuOpen(false)
                  }}
                  className='w-full justify-center'
                >
                  Entrar
                </Button>
                <Button
                  variant='hero'
                  size='default'
                  onClick={() => {
                    onRegisterClick?.()
                    setMobileMenuOpen(false)
                  }}
                  className='w-full justify-center'
                >
                  Cadastrar
                </Button>
              </div>
            ) : (
              <div className='flex flex-col gap-3 pt-2 border-t border-border/40'>
                <Link
                  href={
                    userType === 'university'
                      ? '/university/dashboard'
                      : userType === 'company'
                      ? '/company/dashboard'
                      : '/'
                  }
                  className='w-full'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant='outline' size='default' className='w-full justify-center'>
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant='ghost'
                  size='default'
                  className='w-full justify-center text-destructive hover:text-destructive hover:bg-destructive/10'
                  onClick={() => {
                    handleSignOut()
                    setMobileMenuOpen(false)
                  }}
                >
                  <LogOut className='h-4 w-4 mr-2' />
                  Sair
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
