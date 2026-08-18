# Plan: FEAT-005 - Backend com SQLite

## Fases Técnicas

### Fase 1: Scaffold do Backend
1. Entrar na pasta `application/src/backend`.
2. Inicializar Node.js (`npm init -y`) e instalar dependências básicas: `express`, `cors`, `dotenv`. Dev dependencies: `typescript`, `ts-node`, `@types/node`, `@types/express`, `@types/cors`.
3. Configurar `tsconfig.json` isolado para o backend.

### Fase 2: Configuração do Banco
1. Instalar dependências do ORM: `prisma`, `@prisma/client`.
2. Inicializar Prisma com provider SQLite (`npx prisma init --datasource-provider sqlite`).
3. Declarar models básicos iniciais no `schema.prisma`.

### Fase 3: Desenvolvimento da API
1. Criar o ponto de entrada `server.ts`.
2. Habilitar middleware CORS e JSON parser.
3. Criar rotas dummy simulando os fluxos vitais usados hoje no frontend.

### Fase 4: Refatoração Frontend
1. Isolar chamadas atreladas ao Supabase.
2. Trocar lógicas de persistência para `fetch` apontando a nova API.
