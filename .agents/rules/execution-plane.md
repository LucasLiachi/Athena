# Execution Plane Rules

1. Todo código de aplicação deve residir em `project-manager/`.
2. O Backend utiliza Node.js/TypeScript + Express + Prisma ORM apontando para SQLite local.
3. O Frontend utiliza React + TypeScript + Tailwind CSS / Vanilla CSS com design responsivo, refinado e componentes sem placeholders.
4. Qualquer implementação em lote deve validar os testes automatizados com `npm run test` antes de considerar a Task concluída.
