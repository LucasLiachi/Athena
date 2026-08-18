# ADR-0001: Migração de Supabase para SQLite

## Contexto
O projeto estava originalmente acoplado ao Supabase para autenticação e persistência de dados consumidos diretamente pelo frontend (React/Vite). Com a introdução da arquitetura de Agentic OS (Control Plane / Execution Plane), tornou-se necessário desvincular o sistema de plataformas em nuvem proprietárias para reduzir custos operacionais, facilitar o setup local autossuficiente e isolar o domínio em um backend.

## Decisão
Decidimos substituir o uso do provedor `@supabase/supabase-js` por uma arquitetura local-first baseada em SQLite.

1. **Camada de Dados**: SQLite gerenciado via Prisma ORM.
2. **Backend**: Serviço Node.js/Express hospedado em `application/src/backend/` responsável por abstrair o banco de dados.
3. **Frontend**: Refatoração das integrações para consumir endpoints REST via Fetch/Axios.

## Status
Aceito.

## Consequências
- Maior controle do schema (via Prisma Migrations).
- Acesso ao banco de dados retirado do cliente (browser) e mantido estritamente no backend, aumentando a segurança em cenários multitenant.
- O projeto passa a exigir execução de dois serviços locais (Vite + Node API) no ambiente de dev.
