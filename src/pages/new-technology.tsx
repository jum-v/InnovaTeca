'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Sparkles, X } from 'lucide-react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'

const NewTechnologyPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    trl: '',
  })
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const generateBusinessSummary = () => {
    setIsGeneratingAI(true)
    // Simula geração de IA
    setTimeout(() => {
      const aiSummary = `Esta inovação oferece uma solução prática e escalável para ${formData.title.toLowerCase()}, com potencial de aplicação imediata no mercado. A tecnologia demonstra viabilidade técnica e econômica, posicionando-se como alternativa competitiva no setor.`
      handleChange('summary', aiSummary)
      setIsGeneratingAI(false)
      toast.success('Resumo gerado com IA!')
    }, 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Tecnologia cadastrada com sucesso!')
    router.push('/university/dashboard')
  }

  return (
    <div className='min-h-screen bg-background'>
      <Header isLoggedIn={true} userType='university' />

      <div className='container mx-auto px-4 py-8 max-w-4xl'>
        <Button variant='ghost' onClick={() => router.back()} className='mb-6'>
          <ArrowLeft className='h-4 w-4' />
          Voltar
        </Button>

        <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-2'>Cadastrar Nova Tecnologia</h1>
          <p className='text-muted-foreground'>
            Preencha as informações abaixo para disponibilizar sua inovação na plataforma
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Dados principais da tecnologia que serão exibidos para as empresas
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Título da Tecnologia *</Label>
                <Input
                  id='title'
                  required
                  placeholder='Ex: Bioplástico de Alta Resistência à Base de Amido'
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='summary'>Resumo Executivo *</Label>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={generateBusinessSummary}
                    disabled={!formData.title || !formData.description || isGeneratingAI}
                  >
                    <Sparkles className='h-4 w-4' />
                    {isGeneratingAI ? 'Gerando...' : 'Gerar com IA'}
                  </Button>
                </div>
                <Textarea
                  id='summary'
                  required
                  placeholder='Resumo em linguagem acessível para executivos (1-2 parágrafos)'
                  className='min-h-[100px]'
                  value={formData.summary}
                  onChange={(e) => handleChange('summary', e.target.value)}
                />
                <p className='text-xs text-muted-foreground'>
                  Este resumo será o primeiro contato das empresas com sua tecnologia
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Descrição Técnica Detalhada *</Label>
                <Textarea
                  id='description'
                  required
                  placeholder='Descrição completa da tecnologia, incluindo metodologia, resultados e aplicações'
                  className='min-h-[200px]'
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Classificação</CardTitle>
              <CardDescription>
                Informações sobre o estágio de desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='trl'>TRL - Technology Readiness Level *</Label>
                <Select
                  required
                  value={formData.trl}
                  onValueChange={(v) => handleChange('trl', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione o nível de maturidade' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>
                      TRL 1 - Princípios básicos observados
                    </SelectItem>
                    <SelectItem value='2'>
                      TRL 2 - Conceito tecnológico formulado
                    </SelectItem>
                    <SelectItem value='3'>
                      TRL 3 - Prova de conceito experimental
                    </SelectItem>
                    <SelectItem value='4'>TRL 4 - Validação em laboratório</SelectItem>
                    <SelectItem value='5'>
                      TRL 5 - Validação em ambiente relevante
                    </SelectItem>
                    <SelectItem value='6'>
                      TRL 6 - Demonstração em ambiente relevante
                    </SelectItem>
                    <SelectItem value='7'>
                      TRL 7 - Demonstração em ambiente operacional
                    </SelectItem>
                    <SelectItem value='8'>
                      TRL 8 - Sistema completo e qualificado
                    </SelectItem>
                    <SelectItem value='9'>
                      TRL 9 - Sistema aprovado em ambiente operacional
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='tags'>Áreas de Aplicação / Tags</Label>
                <div className='flex gap-2'>
                  <Input
                    id='tags'
                    placeholder='Ex: Sustentabilidade, IoT, Nanotecnologia'
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type='button' onClick={addTag} variant='outline'>
                    Adicionar
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className='flex flex-wrap gap-2 mt-3'>
                    {tags.map((tag) => (
                      <Badge key={tag} variant='secondary' className='gap-1'>
                        {tag}
                        <button
                          type='button'
                          onClick={() => removeTag(tag)}
                          className='hover:text-destructive'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className='flex gap-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => router.back()}
              className='flex-1'
            >
              Cancelar
            </Button>
            <Button type='submit' variant='hero' className='flex-1'>
              Cadastrar Tecnologia
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export { NewTechnologyPage }
