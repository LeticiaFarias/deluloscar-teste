import { seed } from './seed'
import extra from './shows.json' // gerado por scripts/fetch-tmdb.mjs

// Mescla seed + TMDB e tira quem o TMDB mostrou estar fora da janela 01/11/2025–01/11/2026
export const shows = seed.map((s) => ({ ...s, ...extra[s.id] })).filter((s) => s.elegivel !== false)

// Casal = as duas atrizes principais (do TMDB). Para corrigir uma série, defina `casal: ['Nome A', 'Nome B']` em src/seed.js
const par = (s) => s.casal || s.elenco?.slice(0, 2) || []
const comPar = shows.filter((s) => par(s).length === 2)

const casais = comPar.map((s) => ({ label: par(s).join(' & '), sub: s.t, poster: s.poster }))
const atrizes = [...new Map(comPar.flatMap((s) => par(s).map((n) => [n, { label: n, sub: s.t, poster: s.poster }]))).values()]
const titulos = shows.map((s) => ({ label: s.t, poster: s.poster }))

export const opcoesDe = (tipo) => ({ serie: titulos, casal: casais, atriz: atrizes })[tipo]

// tipo: 'serie' (títulos) | 'casal' (duplas) | 'atriz' (atrizes). Tudo de marcar, sem campo aberto.
export const categories = [
  { id: 'melhor-gl', nome: 'Melhor GL do Ano', emoji: '👑', tipo: 'serie' },
  { id: 'melhor-roteiro', nome: 'Melhor Roteiro', emoji: '✍️', tipo: 'serie' },
  { id: 'melhor-trilha', nome: 'Melhor Trilha Sonora', emoji: '🎶', tipo: 'serie' },
  { id: 'melhor-final', nome: 'Melhor Final', emoji: '🌅', tipo: 'serie' },
  { id: 'plot-twist', nome: 'Maior Plot Twist', emoji: '🌀', tipo: 'serie' },
  { id: 'melhor-beijo', nome: 'Melhor Beijo (série)', emoji: '💋', tipo: 'serie' },
  { id: 'melhor-casal', nome: 'Melhor Casal', emoji: '💞', tipo: 'casal' },
  { id: 'melhor-atriz', nome: 'Melhor Atriz', emoji: '🎭', tipo: 'atriz' },
  { id: 'revelacao', nome: 'Revelação do Ano', emoji: '✨', tipo: 'atriz' },
]
