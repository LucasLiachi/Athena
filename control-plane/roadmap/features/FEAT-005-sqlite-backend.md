---
id: FEAT-005
title: Backend com SQLite
initiative: INIT-002-data-layer
status: READY_FOR_IMPLEMENTATION
priority: high
objective: Substituir o provedor em nuvem Supabase por uma API Node.js e banco SQLite.
---

# Feature: Backend com SQLite

## Objetivo
Criar um servidor backend no plano de execução (`application/src/backend/`) que receba as requisições HTTP do frontend e comunique-se com um arquivo de banco de dados SQLite local, substituindo completamente a dependência de serviços externos.

## Dependências
- Nenhuma. Feature fundacional.

## Restrições
- A nova API deve implementar endpoints que imitem as capabilities vitais de dados usadas hoje no painel (autenticação simulada/mockada, se necessário, e CRUD de recursos).
- O SQLite deve ser operado com o Prisma ORM por garantir segurança de tipos que se alinhe ao TypeScript do projeto.
