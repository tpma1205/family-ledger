// 薄薄一層 Supabase CRUD。記錄者由資料庫預設 auth.uid() 填入，前端不送。
import { supabase } from './supabase.js'

const FRIENDLY = '無法連線，請稍後再試'

function unwrap({ data, error }) {
  if (error) {
    console.error(error)
    throw new Error(FRIENDLY)
  }
  return data
}

export async function listAll() {
  const [deposits, expenses] = await Promise.all([
    supabase.from('deposits').select('*').order('date').then(unwrap),
    supabase.from('expenses').select('*').order('date').then(unwrap),
  ])
  return { deposits, expenses }
}

const table = (kind) => (kind === 'deposit' ? 'deposits' : 'expenses')

export async function createRecord(kind, fields) {
  return supabase.from(table(kind)).insert(fields).select().single().then(unwrap)
}

export async function updateRecord(kind, id, fields) {
  return supabase.from(table(kind)).update(fields).eq('id', id).select().single().then(unwrap)
}

export async function deleteRecord(kind, id) {
  return supabase.from(table(kind)).delete().eq('id', id).then(unwrap)
}
