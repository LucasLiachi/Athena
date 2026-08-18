# Athena Migration Roadmap (SDD Plan)

## 1. Features de Evolução do Athena

### FEAT-010: Antigravity Native Agents & Governance Plane
- **Objetivo**: Estruturar `.agents/` com regras, skills, workflows e MCP.
- **Impacto**: Alto (ADR Required: Não, alinhado com Antigravity specs).
- **Status**: EM EXECUÇÃO.

### FEAT-011: Schema Operacional SQLite Expandido
- **Objetivo**: Implementar no Prisma e SQLite as 17 entidades relacionais de governança, personas de agentes e execuções.
- **Impacto**: Alto (ADR Required: Sim - ADR-0002).
- **Status**: READY_FOR_IMPLEMENTATION.

### FEAT-012: Frontend UX das 6 Áreas & Feature Quality Gates
- **Objetivo**: Refatorar a aplicação React para as 6 áreas de navegação com visualização de features protegidas por Quality Gates.
- **Impacto**: Médio.
- **Status**: READY_FOR_IMPLEMENTATION.

### FEAT-013: Agent Desk & Live Swarm Execution Monitor
- **Objetivo**: Criar o catálogo de agentes como personas visuais, com seleção interativa para tasks e visualizador de execução em tempo real com tool calls e evidências.
- **Impacto**: Alto.
- **Status**: READY_FOR_IMPLEMENTATION.
