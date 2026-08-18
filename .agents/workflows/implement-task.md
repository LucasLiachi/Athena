# Workflow: Implement Task

1. O Lead Fullstack (*Leo*) ou o especialista designado recebe uma Task em status `READY`.
2. O agente inicia um `AgentRun` registrando o prompt de entrada.
3. Executa as modificações de código apenas nos arquivos autorizados.
4. Gera testes unitários / de integração associados.
5. Registra `ToolCall`s detalhadas.
6. O especialista em QA (*Quinn*) roda a suite de testes e anexa a `Evidence`.
