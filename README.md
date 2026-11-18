# Deluloscar
1. `npm install && npm run dev`
2. Crie um projeto grátis no Supabase, rode `supabase.sql`, e crie `.env` com:
   VITE_SUPABASE_URL=...  VITE_SUPABASE_ANON_KEY=...
3. Deploy: Vercel (importe o repo, adicione as 2 variáveis) ou GitHub Pages (`npm run build` e publique `dist/`).
Sem as variáveis o site roda em modo demonstração (votos só no navegador).
Edite `src/data.js` para ajustar séries e categorias.
