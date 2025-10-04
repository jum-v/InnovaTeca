import { PrismaClient } from '@prisma/client'

// Declara uma variável global para armazenar a instância do Prisma.
// Isso é necessário porque em desenvolvimento, o HMR do Next.js pode criar
// múltiplas instâncias do PrismaClient, esgotando as conexões do banco de dados.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Cria a instância do PrismaClient.
// Em produção, sempre criará uma nova instância.
// Em desenvolvimento, reutilizará a instância global `prisma` se ela já existir.
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'], // Opcional: para ver as queries SQL geradas no console.
  })

// Atribui a instância criada à variável global em ambiente de desenvolvimento.
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma
