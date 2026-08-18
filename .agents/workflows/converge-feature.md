# Workflow: Converge Feature

1. O Auditor (*Athena Sentinel*) analisa todas as Tasks e Evidências da Feature.
2. Valida se a cobertura de testes atinge o critério e se não há pontas soltas.
3. Se conforme, marca o status da Feature como `CONVERGED`.
4. Emite um evento em `AuditEvent` com sumário da entrega.
