---
name: audit
description: Auditoria de evidências de testes, verificação de conformidade e encerramento de Features no Athena.
---

# Audit Skill

Esta skill instrui o agente *Athena Sentinel (Auditor)* a:
1. Analisar as evidências registradas pela equipe (`Evidence`).
2. Validar se todos os testes passaram e se os critérios de aceite foram atendidos.
3. Declarar a Feature como `CONVERGED` ou solicitar retrabalho (`REVISE`).
