# Security and Token Budget Rules

1. Cada agente possui um limite de orçamento de tokens por execução (`tokenBudget`), configurável no catálogo de agentes.
2. Ferramentas destrutivas (`prod_deploy`, `force_push`, `drop_database`) são estritamente proibidas para agentes autônomos sem confirmação humana explícita.
3. Todas as chamadas de ferramentas (`tool_calls`) devem ser registradas com parâmetros, resultado, latência e status para auditoria em `ToolCall`.
