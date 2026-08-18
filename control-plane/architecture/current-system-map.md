# Athena Current System Map

## 1. Topologia de Código Atual

```text
Athena/
├── control-plane/
│   ├── .ai/                    # Configurações experimentais de agentes/skills
│   ├── architecture/adrs/      # ADRs em Markdown (ADR-0001)
│   ├── roadmap/features/       # Features em Markdown (FEAT-005)
│   └── specs/                  # Especificações técnicas
├── project-manager/
│   ├── src/frontend/           # React + Tailwind UI (Dashboard, Team, Projects, Timeline, Tickets)
│   ├── src/backend/            # Express Server + Prisma Client
│   └── database/               # SQLite local (app.db)
└── runtime/                    # Infraestrutura de agentes (LangGraph, Ruflo)
```

## 2. Inventário de Componentes e Dependências
- **Frontend Framework**: React 18, Vite, Tailwind CSS, Lucide Icons, Radix UI.
- **Backend API**: Node.js, Express, CORS, dotenv.
- **ORM & Banco**: Prisma 6, SQLite (`file:./project-manager/database/app.db`).
- **Estado Atual da UX**: Focado em horas trabalhadas e métricas convencionais, sem controle de pipeline agentic.
