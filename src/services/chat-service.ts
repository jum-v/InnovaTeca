import type { Document } from 'langchain/document'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { z } from 'zod'
import { Pool } from 'pg'
import { GoogleGenerativeAI } from '@google/generative-ai'

const geminiApiKey = process.env.GEMINI_API_KEY
if (!geminiApiKey) {
  throw new Error('GEMINI_API_KEY is not set')
}
const genAI = new GoogleGenerativeAI(geminiApiKey)
const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' })

// Initialize a singleton PG pool for direct queries
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set')
}
const pgPool = new Pool({ connectionString: databaseUrl })

export const TechnologyInputSchema = z.object({
  title: z.string().nullable().optional(),
  description: z.string().optional(),
  excerpt: z.string().optional(),
  trl: z.string().optional(),
})

export type TechnologyData = z.infer<typeof TechnologyInputSchema>

export async function findSimilarTechnologies(
  title: string,
  limit: number = 3,
  cutOff: number = 0.45,
) {
  try {
    const response = await embeddingModel.embedContent(title)
    const queryEmbedding = response.embedding.values

    validateEmbedding(queryEmbedding)

    // Build similarity expression once to reuse in SELECT and WHERE
    const embeddingLiteral = JSON.stringify(queryEmbedding)
    const similarityExpr = `(1 - vector_distance_cos(e.embedding, vector32(${embeddingLiteral})))`

    const query = `
      SELECT 
        t.id,
        t.title,
        t.description,
        t.excerpt,
        t.trl,
        e.chunk_content,
        ${similarityExpr} as similarity_score
      FROM technology_embeddings e
      JOIN technologies t ON t.id = e.technology_id
      WHERE t.title != $1
        AND ${similarityExpr} > $2
      ORDER BY similarity_score DESC
      LIMIT $3
    `

    const { rows } = await pgPool.query(query, [title, cutOff, limit])

    return rows
  } catch (error) {
    console.error('Error finding similar Technologys:', error)
    throw new Error('Failed to find similar Technologys')
  }
}

export async function storeTechnologyAsEmbeddings(
  TechnologyId: string,
  TechnologyData: TechnologyData,
) {
  const parsed = TechnologyInputSchema.safeParse(TechnologyData)

  if (!parsed.success) {
    console.error('Validation error:', parsed.error)
    return false
  }

  const markdown = await TechnologyToMarkdown(parsed.data)
  const chunks = await chunkMarkdownDocument(markdown)
  const embeddings = await createEmbeddingsFromDocuments(TechnologyId, chunks)

  try {
    embeddings.forEach((e) => validateEmbedding(e.embedding))

    const client = await pgPool.connect()
    try {
      await client.query('BEGIN')
      await client.query('DELETE FROM technology_embeddings WHERE technology_id = $1', [
        TechnologyId,
      ])
      for (const e of embeddings) {
        await client.query(
          'INSERT INTO technology_embeddings (technology_id, chunk_content, embedding) VALUES ($1, $2, $3)',
          [TechnologyId, e.chunk_content, JSON.stringify(e.embedding)],
        )
      }
      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
    return true
  } catch (error) {
    // Log error securely
    console.error('Failed to store embeddings', error)
    return false
  }
}

function validateEmbedding(embedding: any) {
  if (!Array.isArray(embedding) || embedding.length !== 768) {
    throw new Error('Invalid embedding size')
  }
  if (!embedding.every((v) => typeof v === 'number')) {
    throw new Error('Embedding must be an array of numbers')
  }
}

async function TechnologyToMarkdown(data: TechnologyData) {
  let md = ''

  if (data.title) {
    md += `# ${data.title}\n\n`
  }
  if (data.description) {
    md += `**Descrição:**  \n${data.description}\n\n`
  }
  if (data.excerpt) {
    md += `**Resumo:**  \n${data.excerpt}\n\n`
  }
  if (data.trl) {
    md += `**TRL:**  \n${data.trl}\n\n`
  }

  return md.trim()
}

async function chunkMarkdownDocument(markdown: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 3072,
    chunkOverlap: 300,
  })

  return await splitter.createDocuments([markdown])
}

async function createEmbeddingsFromDocuments(technologyId: string, chunks: Document[]) {
  return await Promise.all(
    chunks.map(async (chunk) => {
      const response = await embeddingModel.embedContent(chunk.pageContent)
      return {
        technology_id: technologyId,
        chunk_content: chunk.pageContent,
        embedding: response.embedding.values,
      }
    }),
  )
}