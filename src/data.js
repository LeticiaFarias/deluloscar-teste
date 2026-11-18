import { seed } from './seed'
import extra from './shows.json' // gerado por scripts/fetch-tmdb.mjs

// Mescla seed + TMDB e tira quem o TMDB mostrou estar fora da janela 01/11/2025–01/11/2026
export const shows = seed.map((s) => ({ ...s, ...extra[s.id] })).filter((s) => s.elegivel !== false)
// tipo 'serie' = vota nos títulos acima; 'aberta' = indicação livre (casais, atrizes etc.)
export const categories = [
  { id: 'melhor-gl', nome: 'Melhor GL do Ano', emoji: '👑', tipo: 'serie' },
  { id: 'melhor-roteiro', nome: 'Melhor Roteiro', emoji: '✍️', tipo: 'serie' },
  { id: 'melhor-trilha', nome: 'Melhor Trilha Sonora', emoji: '🎶', tipo: 'serie' },
  { id: 'melhor-final', nome: 'Melhor Final', emoji: '🌅', tipo: 'serie' },
  { id: 'plot-twist', nome: 'Maior Plot Twist', emoji: '🌀', tipo: 'serie' },
  { id: 'melhor-casal', nome: 'Melhor Casal', emoji: '💞', tipo: 'aberta', dica: 'Ex.: Atriz A & Atriz B' },
  { id: 'melhor-atriz', nome: 'Melhor Atriz', emoji: '🎭', tipo: 'aberta', dica: 'Nome da atriz' },
  { id: 'revelacao', nome: 'Revelação do Ano', emoji: '✨', tipo: 'aberta', dica: 'Nome da atriz' },
  { id: 'melhor-beijo', nome: 'Melhor Beijo', emoji: '💋', tipo: 'aberta', dica: 'Série + episódio' },
]
