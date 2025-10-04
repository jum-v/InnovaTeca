export const GradientTextExamples = () => {
  return (
    <div className='p-8 space-y-8 bg-background'>
      <h1 className='text-3xl font-bold text-center mb-8'>
        Exemplos de Texto com Gradiente
      </h1>

      {/* Exemplo 1: Gradiente básico */}
      <div className='space-y-2'>
        <h2 className='text-lg font-semibold text-foreground'>
          1. Gradiente Básico (.text-gradient)
        </h2>
        <p className='text-2xl font-bold text-gradient'>
          Innovatec - Conectando Inovação e Tecnologia
        </p>
      </div>

      {/* Exemplo 2: Gradiente hero */}
      <div className='space-y-2'>
        <h2 className='text-lg font-semibold text-foreground'>
          2. Gradiente Hero (.text-gradient-hero)
        </h2>
        <p className='text-2xl font-bold text-gradient-hero'>
          Soluções Tecnológicas para Empresas
        </p>
      </div>

      {/* Exemplo 3: Gradiente card */}
      <div className='space-y-2'>
        <h2 className='text-lg font-semibold text-foreground'>
          3. Gradiente Card (.text-gradient-card)
        </h2>
        <p className='text-2xl font-bold text-gradient-card'>
          Tecnologias Licenciáveis das Universidades
        </p>
      </div>

      {/* Exemplo 4: Gradiente animado */}
      <div className='space-y-2'>
        <h2 className='text-lg font-semibold text-foreground'>
          4. Gradiente Animado (.text-gradient-animated)
        </h2>
        <p className='text-2xl font-bold text-gradient-animated'>
          Matchmaking Inteligente com IA
        </p>
      </div>

      {/* Exemplo 5: Diferentes tamanhos */}
      <div className='space-y-4'>
        <h2 className='text-lg font-semibold text-foreground'>5. Diferentes Tamanhos</h2>
        <div className='space-y-2'>
          <p className='text-sm text-gradient'>Texto pequeno com gradiente</p>
          <p className='text-base text-gradient'>Texto médio com gradiente</p>
          <p className='text-lg text-gradient'>Texto grande com gradiente</p>
          <p className='text-xl text-gradient'>Texto extra grande com gradiente</p>
          <p className='text-2xl text-gradient'>Texto 2xl com gradiente</p>
          <p className='text-3xl text-gradient'>Texto 3xl com gradiente</p>
          <p className='text-4xl text-gradient'>Texto 4xl com gradiente</p>
        </div>
      </div>

      {/* Exemplo 6: Diferentes pesos de fonte */}
      <div className='space-y-4'>
        <h2 className='text-lg font-semibold text-foreground'>
          6. Diferentes Pesos de Fonte
        </h2>
        <div className='space-y-2'>
          <p className='text-xl font-light text-gradient'>Font Light</p>
          <p className='text-xl font-normal text-gradient'>Font Normal</p>
          <p className='text-xl font-medium text-gradient'>Font Medium</p>
          <p className='text-xl font-semibold text-gradient'>Font Semibold</p>
          <p className='text-xl font-bold text-gradient'>Font Bold</p>
          <p className='text-xl font-extrabold text-gradient'>Font Extrabold</p>
        </div>
      </div>

      {/* Exemplo 7: Com hover effects */}
      <div className='space-y-4'>
        <h2 className='text-lg font-semibold text-foreground'>7. Com Efeitos de Hover</h2>
        <div className='space-y-2'>
          <p className='text-xl font-bold text-gradient hover:scale-105 transition-transform cursor-pointer'>
            Hover para escalar
          </p>
          <p className='text-xl font-bold text-gradient hover:opacity-80 transition-opacity cursor-pointer'>
            Hover para opacidade
          </p>
        </div>
      </div>

      {/* Código de exemplo */}
      <div className='space-y-4 mt-8 p-4 bg-muted rounded-lg'>
        <h2 className='text-lg font-semibold text-foreground'>Como usar:</h2>
        <pre className='text-sm text-foreground/80 overflow-x-auto'>
          {`// Gradiente básico
<span className="text-gradient">Texto com gradiente</span>

// Gradiente hero
<span className="text-gradient-hero">Texto com gradiente hero</span>

// Gradiente card
<span className="text-gradient-card">Texto com gradiente card</span>

// Gradiente animado
<span className="text-gradient-animated">Texto com gradiente animado</span>

// Combinando com outras classes
<span className="text-2xl font-bold text-gradient hover:scale-105 transition-transform">
  Texto com gradiente e hover
</span>`}
        </pre>
      </div>
    </div>
  )
}
