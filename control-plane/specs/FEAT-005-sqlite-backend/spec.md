# Spec: FEAT-005 - Backend com SQLite

## Contratos e Comportamentos

### 1. Camada de Dados
- O backend operará o SQLite utilizando Prisma ORM.
- O arquivo `.sqlite` deve ser gerado na raiz da subpasta `backend/prisma/dev.db`.

### 2. Camada API
- O servidor Express.js servirá na porta 3001.
- Todas as respostas da API usarão JSON.
- A comunicação com o Frontend deve estar configurada para evitar problemas de CORS no ambiente local.

### 3. Integração Frontend
- O frontend (`application/src/frontend/`) atualizará suas variáveis de ambiente (`VITE_API_URL` em vez de `VITE_SUPABASE_URL`) para apontar para `http://localhost:3001`.
- O pacote `@supabase/supabase-js` será removido ou desativado.
