# Deluloscar — sistema de votação
Monorepo pnpm: React 18 + Vite + TypeScript + Tailwind, Express + Prisma + PostgreSQL e Zod compartilhado. PostgreSQL hospedado no Supabase. **Não usa Docker.**

## Requisitos
Node.js 20+, pnpm 9+ e um projeto Supabase ativo.

## Configurar Supabase
1. Em Project Settings → Database → Connection string, copie a URI PostgreSQL (Session pooler recomendado para IPv4).
2. Configure DATABASE_URL em .env; codifique caracteres especiais da senha usando URL encoding.
3. A migration SQL está em apps/api/prisma/migrations/20261118190000_create_voting_application_schema/migration.sql. Ela cria as tabelas, índices e enums e ativa RLS.
4. A migration foi aplicada diretamente ao banco durante a preparação. Como o Prisma mantém seu próprio histórico, após configurar .env execute uma vez `pnpm db:resolve` para registrar essa migration como aplicada no histórico Prisma. Em bancos novos, prefira aplicar com `pnpm db:deploy` (e não execute db:resolve nesse caso).
5. O backend usa Prisma no servidor. Nenhuma chave service_role é necessária no navegador; não exponha credenciais privadas.

## Instalar
```bash
corepack enable
pnpm install
cp .env.example .env
```
Preencha DATABASE_URL, JWT_SECRET (32+ caracteres), CORS_ORIGIN, ADMIN_EMAIL e ADMIN_PASSWORD (12+ caracteres).

## Banco e seed
```bash
pnpm db:generate
pnpm db:resolve
pnpm db:deploy
pnpm db:seed
```
O seed cria/atualiza a conta admin configurada, quatro categorias e indicados de exemplo. Altere a senha padrão antes de produção.

## Executar
```bash
pnpm dev
```
Frontend http://localhost:5173 · API http://localhost:3333 · Health http://localhost:3333/health

`pnpm build` compila os pacotes; `pnpm typecheck` verifica TypeScript.

## Endpoints
- POST /api/auth/register e POST /api/auth/login
- GET /api/categories e GET /api/categories/:slug
- POST /api/votes e GET /api/votes/me
- GET /api/results (403 com { "message": "em apuração" } até publicar)
- GET /api/admin/results
- GET /api/admin/voting-state e PATCH /api/admin/voting-state

## Segurança
Cadastro público cria apenas role USER. requireAdmin consulta users.role no banco. Senhas usam bcrypt, JWT tem expiração configurável, POST /votes tem rate limit e o fechamento é sincronizado com a transação de voto. RLS habilitado e sem grants públicos diretos às tabelas. Nunca commite .env, senha do banco ou JWT_SECRET.
