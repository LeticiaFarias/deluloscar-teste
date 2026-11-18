import { useEffect, useState } from 'react'
import { categories, opcoesDe } from './data'
import { vote, results, demo } from './db'

function Categoria({ cat, onVoted }) {
  const [sel, setSel] = useState('')
  const [msg, setMsg] = useState('')
  const opcoes = opcoesDe(cat.tipo)
  const done = localStorage.getItem('v:' + cat.id)
  const enviar = async () => {
    try { await vote(cat.id, sel); localStorage.setItem('v:' + cat.id, sel); setMsg('Voto registrado! 💖'); onVoted() }
    catch (e) { setMsg(e.message); if (e.message.includes('já votou')) localStorage.setItem('v:' + cat.id, '1') }
  }
  return (
    <section className="card">
      <h2><span>{cat.emoji}</span> {cat.nome}</h2>
      {done ? <p className="ok">Você já votou aqui. Obrigada! 💖</p> : <>
        {opcoes.length === 0 && <p className="muted">Sem indicadas ainda. Rode <code>npm run tmdb</code> para carregar o elenco.</p>}
        <div className="opts">{opcoes.map((o) => (
          <button key={o.label} className={sel === o.label ? 'opt on' : 'opt'} onClick={() => setSel(o.label)}>
            {o.poster && <img src={o.poster} alt="" />}
            <span>{o.label}{o.sub && <small>{o.sub}</small>}</span>
          </button>
        ))}</div>
        <button className="go" disabled={!sel} onClick={enviar}>Votar</button>
        {msg && <p className="msg">{msg}</p>}
      </>}
    </section>
  )
}

function Resultados({ dados }) {
  return categories.map((cat) => {
    const rows = dados.filter((d) => d.category === cat.id).sort((a, b) => b.votos - a.votos).slice(0, 5)
    const total = rows.reduce((n, r) => n + r.votos, 0)
    return (
      <section className="card" key={cat.id}>
        <h2><span>{cat.emoji}</span> {cat.nome}</h2>
        {rows.length === 0 && <p className="muted">Ainda sem votos.</p>}
        {rows.map((r) => (
          <div className="bar" key={r.choice}>
            <div className="fill" style={{ width: (r.votos / total) * 100 + '%' }} />
            <span>{r.choice}</span><b>{Math.round((r.votos / total) * 100)}%</b>
          </div>
        ))}
      </section>
    )
  })
}

export default function App() {
  const [aba, setAba] = useState('votar')
  const [dados, setDados] = useState([])
  const carregar = () => results().then(setDados).catch(() => {})
  useEffect(() => { carregar() }, [aba])
  return (
    <>
      <header>
        <h1>Deluloscar</h1>
        <p>Os melhores GLs tailandeses de 2025–2026 · vote nas suas favoritas</p>
        <nav>
          <button className={aba === 'votar' ? 'on' : ''} onClick={() => setAba('votar')}>Votar</button>
          <button className={aba === 'res' ? 'on' : ''} onClick={() => setAba('res')}>Resultados</button>
        </nav>
      </header>
      <main>
        {demo && <p className="demo">Modo demonstração: votos salvos só neste navegador.</p>}
        {aba === 'votar' ? categories.map((c) => <Categoria key={c.id} cat={c} onVoted={carregar} />) : <Resultados dados={dados} />}
      </main>
      <footer>Feito com 🏳️‍🌈 por fãs, para fãs. Votação sem valor oficial.<br />Dados e imagens: TMDB. Este site usa a API do TMDB, mas não é endossado nem certificado por ele.</footer>
    </>
  )
}
