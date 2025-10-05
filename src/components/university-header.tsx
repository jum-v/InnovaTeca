'use client'

import { Button } from '@/components/ui/button'
import { Sparkles, Menu, LogOut, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface UniversityHeaderProps {
  onSignOut: () => void
}

export const UniversityHeader = ({ onSignOut }: UniversityHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
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
        <div className='hidden md:flex items-center gap-3'>
          <Link href='/university/dashboard'>
            <Button variant='outline' size='sm'>
              Dashboard
            </Button>
          </Link>
          <Link href='/university/new-technology'>
            <Button variant='hero' size='sm'>
              Cadastrar Tecnologia
            </Button>
          </Link>
          <Button variant='ghost' size='sm' onClick={onSignOut}>
            <LogOut className='h-4 w-4 mr-2' />
            Sair
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type='button'
          className='md:hidden p-2 text-foreground'
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className='md:hidden absolute top-16 left-0 right-0 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 shadow-lg'>
          <div className='px-4 py-6 flex flex-col gap-4'>
            <Link
              href='/university/dashboard'
              className='w-full'
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button variant='outline' size='default' className='w-full justify-center'>
                Dashboard
              </Button>
            </Link>
            <Link
              href='/university/new-technology'
              className='w-full'
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button variant='hero' size='default' className='w-full justify-center'>
                Cadastrar Tecnologia
              </Button>
            </Link>
            <div className='border-t border-border/40 pt-3'>
              <Button
                variant='ghost'
                size='default'
                className='w-full justify-center text-destructive hover:text-destructive hover:bg-destructive/10'
                onClick={() => {
                  onSignOut()
                  setMobileMenuOpen(false)
                }}
              >
                <LogOut className='h-4 w-4 mr-2' />
                Sair
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
