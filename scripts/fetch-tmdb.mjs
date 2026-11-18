// Roda no build (GitHub Actions) ou local: TMDB_TOKEN=xxx npm run tmdb
// O token fica só no ambiente de build e NUNCA vai para o navegador.
import { writeFileSync } from 'node:fs'
import { seed } from '../src/seed.js'

const TOKEN = process.env.TMDB_TOKEN
if (!TOKEN) { console.log('TMDB_TOKEN ausente: mantendo src/shows.json como está.'); process.exit(0) }

const INI = '2025-11-01', FIM = '2026-11-30'
const api = async (p) => {
  const r = await fetch('https://api.themoviedb.org/3' + p, { headers: { Authorization: `Bearer ${TOKEN}` } })
  if (!r.ok) throw new Error(`${p} -> ${r.status}`)
  return r.json()
}

const out = {}
for (const s of seed) {
  const q = s.t.replace(/\s*\(.*\)/, '').replace(/^MuTeLuv:\s*/i, 'MuTeLuv ')
  try {
    const { results } = await api(`/search/tv?query=${encodeURIComponent(q)}&language=pt-BR`)
    const hit = results.find((r) => r.origin_country?.includes('TH') && (r.first_air_date || '') >= '2025-01-01')
    if (!hit) { console.log(`NÃO ACHEI no TMDB: ${s.t} (mantido da lista-base)`); continue }
    const d = await api(`/tv/${hit.id}?language=pt-BR&append_to_response=aggregate_credits`)
    const fim = d.status === 'Ended' ? d.last_air_date : null
    out[s.id] = {
      tmdbId: d.id,
      eps: d.number_of_episodes || s.eps,
      fim: fim || s.fim,
      poster: d.poster_path ? 'https://image.tmdb.org/t/p/w342' + d.poster_path : null,
      sinopse: d.overview || '',
      // TMDB gender 1 = feminino. As duas primeiras (por nº de episódios) formam o casal principal.
      elenco: (d.aggregate_credits?.cast || []).filter((c) => c.gender === 1).slice(0, 2).map((c) => c.name),
      // só marca inelegível quando o TMDB tem data de final e ela está fora da janela
      ...(fim ? { elegivel: fim >= INI && fim <= FIM } : {}),
    }
    console.log(`${out[s.id].elegivel === false ? 'FORA ' : 'ok   '} ${s.t} -> "${d.name}" ${d.first_air_date} / ${fim || 'sem final no TMDB'}`)
  } catch (e) { console.log(`ERRO ${s.t}: ${e.message}`) }
}
writeFileSync(new URL('../src/shows.json', import.meta.url), JSON.stringify(out, null, 1))
console.log(`Salvo: ${Object.keys(out).length}/${seed.length} séries.`)
