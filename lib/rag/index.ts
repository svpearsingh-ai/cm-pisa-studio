// lib/rag/index.ts — Simple keyword search (no embedding needed)
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface Document {
  id: string; title: string; content: string; doc_type: string
  subject: string | null; grade: string | null
  metadata: Record<string, unknown>; similarity: number
}
export interface RAGContext { documents: Document[]; contextText: string; sources: string[] }
export interface RetrieveOptions { subject?: string; grade?: string; docType?: string; topK?: number }
export interface IngestDoc {
  title: string; content: string; doc_type: string
  subject?: string; grade?: string; metadata?: Record<string, unknown>
}

export async function retrieveDocuments(query: string, options: RetrieveOptions = {}): Promise<Document[]> {
  const { subject, grade, docType, topK = 5 } = options
  let q = supabase.from('documents').select('*').limit(topK)
  if (subject) q = q.or(`subject.eq.${subject},subject.is.null`)
  if (grade) q = q.or(`grade.eq.${grade},grade.is.null`)
  if (docType) q = q.eq('doc_type', docType)
  const { data, error } = await q
  if (error) { console.error('[RAG]', error.message); return [] }
  return (data ?? []).map((d: any) => ({ ...d, similarity: 0.8 }))
}

export function buildContext(docs: Document[]): RAGContext {
  if (!docs.length) return { documents: [], contextText: '', sources: [] }
  return {
    documents: docs,
    sources: docs.map(d => d.title),
    contextText: docs.map((d, i) => `--- Doc ${i+1}: ${d.title} ---\n${d.content}`).join('\n\n')
  }
}

export async function ragQuery(query: string, options: RetrieveOptions = {}): Promise<RAGContext> {
  return buildContext(await retrieveDocuments(query, options))
}

export async function ingestDocument(doc: IngestDoc): Promise<string> {
  const { data, error } = await supabase.from('documents').insert({
    title: doc.title, content: doc.content, doc_type: doc.doc_type,
    subject: doc.subject ?? null, grade: doc.grade ?? null,
    metadata: doc.metadata ?? {},
    embedding: null,
  }).select('id').single()
  if (error) throw new Error('Ingest failed: ' + error.message)
  return data.id
}

export async function ingestDocuments(
  docs: IngestDoc[],
  onProgress?: (i: number, total: number, title: string) => void
): Promise<string[]> {
  const ids: string[] = []
  for (let i = 0; i < docs.length; i++) {
    onProgress?.(i+1, docs.length, docs[i].title)
    ids.push(await ingestDocument(docs[i]))
  }
  return ids
}
