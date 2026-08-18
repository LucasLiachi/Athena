# Control Plane Rules

1. Os arquivos em `control-plane/` e `.agents/` são versionados pelo Git e constituem os artefatos formais.
2. Nenhuma alteração manual em especificações aprovadas pode ocorrer sem revisão arquitetural ou versionamento explícito de Spec (`spec_versions`).
3. Toda decisão de arquitetura com impacto material (mudança de banco, protocolo, framework ou segurança) exige a criação de um ADR em `control-plane/architecture/adrs/`.
