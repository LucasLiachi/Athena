# Athena Governance Rules

## Leis Fundamentais
1. **Pipeline de Governança Estrito**:
   `Roadmap → Architecture Review → ADR → SDD → Plan → Tasks → Agent Execution → Tests → Evidence → Audit → Converged`.
2. **Proibição de Código Antecipado**:
   Nenhum agente ou desenvolvedor pode modificar o código do `project-manager/` sem que a Feature tenha passado por Architecture Review e possua uma Spec e Tasks aprovadas.
3. **Agentes como Especialistas (Personas)**:
   Tarefas devem ser atribuídas à persona apropriada (ex: *Spec Architect* para SDD, *Lead Fullstack* para código, *QA Sentinel* para testes e *Athena Sentinel* para auditoria).
4. **Evidência Obrigatória**:
   Toda task finalizada precisa anexar evidência verificável (logs de teste, diffs ou benchmarks) antes de ser submetida à auditoria.
