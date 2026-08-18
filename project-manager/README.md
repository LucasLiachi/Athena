# 🏛️ Athena — Gestão de Projetos Inteligente e Orientada por Dados

[![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-2.9-emerald?style=for-the-badge&logo=supabase)](https://supabase.com)

**Athena** é uma plataforma executiva de gestão de portfólio de projetos que transforma dados operacionais em decisões estratégicas previsíveis. Desenvolvida para líderes, gestores e equipes que necessitam de clareza sobre prazos, riscos, alocação de recursos e saúde financeira em tempo real.

---

## 🚀 Principais Funcionalidades

### 📊 Dashboard Executivo (`/dashboard`)
*   Indicadores macro do portfólio (projetos ativos, progresso médio, riscos críticos).
*   Visualização rápida dos status de saúde de cada iniciativa.
*   Leitura limpa, objetiva e acionável para tomada de decisão ágil.

### 📅 Linha do Tempo / Gantt (`/timeline`)
*   Visualização de cronogramas, marcos históricos e datas de entrega.
*   Estrutura clara de dependências e caminhos críticos.

### 📋 Quadro de Atividades (Kanban) (`/tickets`)
*   Gerenciamento dinâmico de tarefas e status de progresso.
*   Distribuição ágil e rastreamento de responsabilidades.

### 👥 Alocação de Equipe e Recursos (`/team`)
*   **Mapa de Riscos:** Identificação visual e antecipada de gargalos de alocação ou sobrecarga de profissionais.
*   Distribuição transparente de atividades e horas de dedicação.

### 💰 Relatórios Financeiros Analytics (`/financial-report`)
*   Análise detalhada de custos, orçamentos, desvios e saúde financeira das iniciativas.

---

## 🛠️ Tecnologias Utilizadas

*   **Core:** React 18, TypeScript, React Router DOM (v6)
*   **Interface (UI):** Tailwind CSS, Shadcn/ui, Radix UI, Framer Motion (para micro-animações premium)
*   **Visualização de Dados:** Recharts (gráficos executivos)
*   **Banco de Dados & Autenticação:** Supabase
*   **Testes:** Vitest & React Testing Library
*   **Build Tool & Dev Server:** Vite

---

## 💻 Instalação e Execução Local

### Pré-requisitos
*   Node.js (versão 18 ou superior)
*   Gerenciador de pacotes npm ou Bun

### Passos para rodar o projeto:

1.  **Clonar o repositório:**
    ```bash
    git clone https://github.com/AuraManage/project-flow.git
    cd project-flow
    ```

2.  **Instalar dependências:**
    ```bash
    npm install
    # ou usando bun:
    bun install
    ```

3.  **Configurar variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto com suas credenciais do Supabase:
    ```env
    VITE_SUPABASE_URL=seu_url_do_supabase
    VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
    ```

4.  **Iniciar servidor de desenvolvimento:**
    ```bash
    npm run dev
    # ou usando bun:
    bun run dev
    ```

5.  **Rodar a suíte de testes:**
    ```bash
    npm run test
    ```

---

## 🔄 Sincronização do Repositório (Multi-Remote)

Este repositório está configurado para publicar simultaneamente em duas origens do GitHub a partir de um único comando de push.

*   **Organização (AuraManage):** [https://github.com/AuraManage/project-flow](https://github.com/AuraManage/project-flow)
*   **Pessoal (Ronaldo Costa):** [https://github.com/Ronaldocosta2/project-flow](https://github.com/Ronaldocosta2/project-flow)

### Como atualizar ambos os repositórios:
Basta rodar o comando push padrão. O Git cuidará de atualizar as duas fontes automaticamente:
```bash
git push origin main
```
