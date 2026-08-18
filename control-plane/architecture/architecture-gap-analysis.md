# Athena Architecture Gap Analysis

## 1. Contexto e Objetivo
Esta auditoria avalia a distância entre o estado atual do repositório **Athena** (anteriormente estruturado como uma simulação de gerenciador de projetos tradicional) e o objetivo estratégico de transformá-lo em uma **Plataforma de Governança e Execução de Engenharia Agentic (Agentic OS)** operada por agentes como especialistas.

---

## 2. Comparativo Estrutural

| Dimensão | Estado Anterior | Estado Alvo (Agentic OS) | Lacuna Identificada |
| :--- | :--- | :--- | :--- |
| **Entrada de Trabalho** | Ideias viravam tarefas ou tickets diretamente (TK-101) sem portão de qualidade. | Fluxo de ciclo de vida: `Roadmap → Architecture Review → ADR → SDD → Plan → Tasks → Execution → Audit`. | Ausência de Quality Gates e transição formal de estágios. |
| **Agentes** | Membros humanos genéricos com papéis fixos e horas estimadas. | Agentes como Especialistas (Personas) com escopos, instruções, orçamentos de tokens, ferramentas permitidas e monitoramento ao vivo. | Falta de catálogo de personas, permissões de tools e visualização de runs. |
| **Estado Operacional** | SQLite mínimo com apenas `User` e `Project`. | SQLite como repositório de estado operacional com 17 entidades relacionais interligadas aos artefatos Git. | Ausência de rastreabilidade de Features, Specs, Runs, Tool Calls e Custos. |
| **Control Plane** | Diretórios `.ai` embrionários e documentação estática. | Estrutura nativa `.agents/` do Antigravity (rules, skills progressivas, workflows executáveis e MCP). | Falta de integração com capacidades nativas da IDE e runtime. |
| **Execução & Código** | Tentativa de programar antes de planejar. | Proibição de código antes de Architecture Approved + Spec Ready + Plan Ready + Tasks Ready. | Risco de alucinação e trabalho não governado por agentes. |

---

## 3. Riscos de Migração e Mitigações

1. **Risco de Perda de Usabilidade no Frontend**:
   - *Mitigação*: Manter a experiência visual rica e fluida, transformando as telas atuais em interfaces de alto impacto com visão de personas ilustradas, kanbans de governança e consoles de execução em tempo real.
2. **Risco de Dessincronização entre Arquivos Markdown e SQLite**:
   - *Mitigação*: Definir os arquivos Git (`control-plane/`) como a fonte canônica da verdade para especificações e ADRs, enquanto o SQLite armazena o índice, relações, execuções e telemetria.
3. **Risco de Execuções sem Evidências**:
   - *Mitigação*: Cada task concluída deve obrigatoriamente produzir um registro na entidade `Evidence` contendo logs, diffs ou testes antes de ser liberada para auditoria.
