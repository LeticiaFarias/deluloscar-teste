import { createClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
const sb = url && key ? createClient(url, key) : null
export const demo = !sb // sem Supabase configurado, os votos ficam só no navegador
const voterId = () => {
  let v = localStorage.getItem('vid')
  if (!v) { v = crypto.randomUUID(); localStorage.setItem('vid', v) }
  return v
}
const norm = (s) => s.trim().replace(/\s+/g, ' ').slice(0, 80)
export async function vote(category, choice) {
  choice = norm(choice)
  if (!choice) throw new Error('Escolha uma opção.')
  if (!sb) {
    const d = JSON.parse(localStorage.getItem('demo') || '[]')
    if (d.some((x) => x.category === category)) throw new Error('Você já votou nesta categoria.')
    localStorage.setItem('demo', JSON.stringify([...d, { category, choice }]))
    return
  }
  const { error } = await sb.from('votes').insert({ category, choice, voter_id: voterId() })
  if (error) throw new Error(error.code === '23505' ? 'Você já votou nesta categoria.' : 'Erro ao votar.')
}
export async function results() {
  if (!sb) {
    const c = {}
    JSON.parse(localStorage.getItem('demo') || '[]').forEach((x) => { const k = x.category + '|' + x.choice; c[k] = (c[k] || 0) + 1 })
    return Object.entries(c).map(([k, votos]) => { const [category, choice] = k.split('|'); return { category, choice, votos } })
  }
  const { data, error } = await sb.from('results').select('category,choice,votos')
  if (error) throw error
  return data
}
