'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2, Bot, User } from 'lucide-react'
import { toast } from 'sonner'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Olá! Sou seu assistente de busca de tecnologias. Descreva seu problema ou necessidade e eu ajudarei a encontrar tecnologias adequadas das universidades. 🎓',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setIsLoading(true)

    // Adicionar mensagem do usuário
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem')
      }

      const data = await response.json()

      // Adicionar resposta do assistente
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.response },
      ])
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao processar mensagem')
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col h-[600px] border border-border/50 rounded-lg bg-card shadow-sm'>
      {/* Header */}
      <div className='flex items-center gap-3 p-4 border-b border-border/50 bg-muted/30'>
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary'>
          <Bot className='h-5 w-5 text-primary-foreground' />
        </div>
        <div>
          <h3 className='font-semibold'>Assistente de Busca IA</h3>
          <p className='text-xs text-muted-foreground'>Powered by Claude 3.5</p>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary flex-shrink-0'>
                <Bot className='h-4 w-4 text-primary-foreground' />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <p className='text-sm whitespace-pre-wrap'>{message.content}</p>
            </div>
            {message.role === 'user' && (
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted flex-shrink-0'>
                <User className='h-4 w-4' />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className='flex gap-3 justify-start'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary flex-shrink-0'>
              <Bot className='h-4 w-4 text-primary-foreground' />
            </div>
            <div className='bg-muted rounded-lg px-4 py-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className='p-4 border-t border-border/50'>
        <div className='flex gap-2'>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Descreva seu problema ou necessidade...'
            className='min-h-[60px] max-h-[120px] resize-none'
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />
          <Button
            type='submit'
            size='icon'
            disabled={!input.trim() || isLoading}
            className='h-[60px] w-[60px] flex-shrink-0'
          >
            {isLoading ? (
              <Loader2 className='h-5 w-5 animate-spin' />
            ) : (
              <Send className='h-5 w-5' />
            )}
          </Button>
        </div>
        <p className='text-xs text-muted-foreground mt-2'>
          Pressione Enter para enviar, Shift + Enter para quebra de linha
        </p>
      </form>
    </div>
  )
}
