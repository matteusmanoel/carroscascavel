# Carros Cascavel — desenvolvimento local

O schema Postgres interno continua se chamando `facilcar`. O banco desta máquina é outro container, na porta 5434, para não disputar com a FácilCar.

## Primeira vez

```bash
colima start
npm install
npm run setup
npm run dev
```

Admin local: `admin@carroscascavel.demo`. A senha está em `apps/web/.env` (`SEED_ADMIN_PASSWORD`), que não entra no git.

Postgres: `postgresql://postgres:postgres@127.0.0.1:5434/facilcar`


## Comandos úteis (raiz `facilcar/`)

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Next.js em modo desenvolvimento |
| `npm run build` | Build de produção |
| `npm run db:up` | Sobe container `carroscascavel-db` na porta 5434 |
| `npm run db:down` | Para containers |
| `npm run db:push` | Sincroniza schema Prisma (dev local) |
| `npm run db:deploy` | Migrations versionadas (Supabase/prod) |
| `npm run db:seed` | Dados demo |
| `npm run db:reset` | Apaga volume, recria DB + push + seed |
| `npm run setup` | `db:up` + wait + push + seed |

## Credenciais demo

- **Admin:** `admin@carroscascavel.demo` (senha em `apps/web/.env`)
- **Postgres:** `postgresql://postgres:postgres@127.0.0.1:5434/facilcar`

## Variáveis de ambiente

Copie `apps/web/.env.example` → `apps/web/.env` (ou use o `.env` já gerado para local).

Produção/Supabase: use `npm run db:deploy` com `DATABASE_URL` apontando para o Supabase (migrations incluem `storage.*` do Supabase).

## Docker sem Desktop

Este projeto usa **Colima** + **docker-compose** (CLI Homebrew):

```bash
colima start          # se o daemon não estiver rodando
docker-compose ps     # deve listar facilcar-db
```

Se `docker compose` falhar, use `docker-compose` (já configurado nos scripts npm).
