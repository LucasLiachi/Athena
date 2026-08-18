import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do Athena Agentic PMO Operating System...');

  // Limpar tabelas
  await prisma.auditViolation.deleteMany();
  await prisma.auditEvent.deleteMany();
  await prisma.toolCall.deleteMany();
  await prisma.agentRun.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.subtask.deleteMany();
  await prisma.taskDependency.deleteMany();
  await prisma.task.deleteMany();
  await prisma.story.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.spec.deleteMany();
  await prisma.adr.deleteMany();
  await prisma.architectureReview.deleteMany();
  await prisma.decision.deleteMany();
  await prisma.risk.deleteMany();
  await prisma.featureDependency.deleteMany();
  await prisma.featureAssumption.deleteMany();
  await prisma.featureQuestion.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.epic.deleteMany();
  await prisma.phase.deleteMany();
  await prisma.project.deleteMany();
  await prisma.portfolio.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.user.deleteMany();

  // 1. Criar os 13 Agentes Especialistas
  const agentsData = [
    {
      slug: 'orchestrator',
      name: 'Athena Prime (Orchestrator)',
      role: 'Orquestrador Geral do Fluxo Agentic',
      avatar: '🦉',
      description: 'Supervisiona o fluxo ponta a ponta, direciona demandas e garante avanço entre portões.',
      scope: 'Global Flow, Gate Approvals & Swarm Dispatching',
      modelPolicy: 'Claude 3.5 Sonnet / Gemini 1.5 Pro',
      tokenBudget: 200000,
      allowedTools: JSON.stringify(['filesystem', 'git', 'sqlite', 'gate_evaluator']),
      forbiddenTools: JSON.stringify(['force_push', 'direct_db_drop']),
      allowedTaskTypes: JSON.stringify(['DISCOVERY', 'RELEASE']),
      qualityGate: 'Bloqueia qualquer execução que tente pular fases do Development Level.',
    },
    {
      slug: 'roadmap-manager',
      name: 'Orion (Roadmap Manager)',
      role: 'Gestor Estratégico de Portfólio e Roadmap',
      avatar: '🗺',
      description: 'Estrutura portfólios, iniciativas, projetos e priorização no Roadmap.',
      scope: 'Portfolio, Projects, Phases, Epics & Roadmap Timeline',
      modelPolicy: 'GPT-4o / Claude 3.5 Sonnet',
      tokenBudget: 100000,
      allowedTools: JSON.stringify(['filesystem', 'sqlite', 'roadmap_engine']),
      forbiddenTools: JSON.stringify(['code_executor']),
      allowedTaskTypes: JSON.stringify(['DISCOVERY', 'PLANNING']),
      qualityGate: 'Toda feature deve possuir objetivo, valor e hipóteses documentadas.',
    },
    {
      slug: 'product-analyst',
      name: 'Maya (Product Analyst)',
      role: 'Analista de Produto & Discovery (L1)',
      avatar: '🔍',
      description: 'Especialista em refinamento de problemas, formulação de hipóteses e perguntas abertas.',
      scope: 'Discovery, User Interviews, Hypotheses & Open Questions',
      modelPolicy: 'Gemini 1.5 Pro',
      tokenBudget: 80000,
      allowedTools: JSON.stringify(['filesystem', 'web_search', 'sqlite']),
      forbiddenTools: JSON.stringify(['source_code_edit']),
      allowedTaskTypes: JSON.stringify(['DISCOVERY', 'RESEARCH']),
      qualityGate: 'Nenhuma hipótese crítica sem pergunta de validação associada.',
    },
    {
      slug: 'architecture-analyst',
      name: 'Marcus (Architecture Analyst)',
      role: 'Analista de Arquitetura & Impacto',
      avatar: '🏛',
      description: 'Analisa impacto em domínios, restrições não-funcionais e contratos de integração.',
      scope: 'Architecture Reviews, Domain Boundaries & Impact Analysis',
      modelPolicy: 'Claude 3.5 Sonnet',
      tokenBudget: 90000,
      allowedTools: JSON.stringify(['filesystem', 'architecture_checker', 'sqlite']),
      forbiddenTools: JSON.stringify(['code_implementation']),
      allowedTaskTypes: JSON.stringify(['ARCHITECTURE']),
      qualityGate: 'Toda alteração de banco, protocolo ou segurança exige análise formal.',
    },
    {
      slug: 'adr-architect',
      name: 'Thales (ADR Architect)',
      role: 'Arquiteto de Decisões Formais (ADRs)',
      avatar: '📜',
      description: 'Redige Architecture Decision Records com justificativas e análise de consequências.',
      scope: 'ADR Writing, Superseding & Technical Decision Records',
      modelPolicy: 'Claude 3.5 Sonnet',
      tokenBudget: 80000,
      allowedTools: JSON.stringify(['filesystem', 'adr_engine', 'sqlite']),
      forbiddenTools: JSON.stringify(['prod_deploy']),
      allowedTaskTypes: JSON.stringify(['ARCHITECTURE']),
      qualityGate: 'Decisões com impacto material devem possuir contexto e consequências explícitas.',
    },
    {
      slug: 'spec-architect',
      name: 'Sophia (Spec Architect)',
      role: 'Engenheira de Especificações SDD (L2)',
      avatar: '📐',
      description: 'Gera contratos de API, schemas, regras de negócio e critérios de aceite observáveis.',
      scope: 'Spec Kits, Behavior Specifications & API Contracts',
      modelPolicy: 'Claude 3.5 Sonnet / GPT-4o',
      tokenBudget: 120000,
      allowedTools: JSON.stringify(['filesystem', 'markdown_parser', 'sqlite']),
      forbiddenTools: JSON.stringify(['code_executor']),
      allowedTaskTypes: JSON.stringify(['SPECIFICATION']),
      qualityGate: 'Zero ambiguidades ou suposições não validadas nos contratos de dados.',
    },
    {
      slug: 'planner',
      name: 'Daniel (Planner & WBS Engineer)',
      role: 'Planejador Técnico & Decomposição (L3)',
      avatar: '🧭',
      description: 'Decompõe especificações em planos de engenharia e tarefas atômicas executáveis.',
      scope: 'Engineering Plans, Task Breakdowns, Estimations & Dependencies',
      modelPolicy: 'Claude 3.5 Sonnet',
      tokenBudget: 90000,
      allowedTools: JSON.stringify(['filesystem', 'wbs_decomposer', 'sqlite']),
      forbiddenTools: JSON.stringify(['source_code_edit']),
      allowedTaskTypes: JSON.stringify(['DESIGN', 'PLANNING']),
      qualityGate: 'Toda Task deve possuir critérios de aceite e tipo formal atribuído.',
    },
    {
      slug: 'implementer',
      name: 'Leo (Lead Implementer)',
      role: 'Engenheiro Líder de Implementação (L4)',
      avatar: '⚡',
      description: 'Desenvolve código limpo e seguro em TypeScript, React, Node.js e SQLite conforme a Spec.',
      scope: 'project-manager/ implementation, refactoring & integration',
      modelPolicy: 'Claude 3.5 Sonnet / Gemini 1.5 Flash',
      tokenBudget: 150000,
      allowedTools: JSON.stringify(['filesystem', 'terminal', 'git', 'sqlite', 'linter']),
      forbiddenTools: JSON.stringify(['bypass_spec', 'prod_deploy']),
      allowedTaskTypes: JSON.stringify(['IMPLEMENTATION', 'MIGRATION']),
      qualityGate: 'Código estritamente conforme o Spec e Design Doc aprovados.',
    },
    {
      slug: 'reviewer',
      name: 'Clara (Code Reviewer)',
      role: 'Revisora de Código & Boas Práticas',
      avatar: '👁️',
      description: 'Inspeciona diffs, conformidade com linters, convenções de código e segurança.',
      scope: 'Code Reviews, Static Analysis & Clean Code Enforcement',
      modelPolicy: 'Claude 3.5 Sonnet',
      tokenBudget: 70000,
      allowedTools: JSON.stringify(['filesystem', 'diff_viewer', 'linter']),
      forbiddenTools: JSON.stringify(['source_code_edit']),
      allowedTaskTypes: JSON.stringify(['VALIDATION']),
      qualityGate: 'Zero erros de tipagem, lint ou violações de regras arquiteturais.',
    },
    {
      slug: 'auditor',
      name: 'Sentinel (Compliance Auditor)',
      role: 'Auditor de Integridade e Quality Gates',
      avatar: '🛡',
      description: 'Verifica conformidade de requisitos, presença de evidências e integridade de governança.',
      scope: 'Audit Violations Detection, Evidence Checking & Final Convergence',
      modelPolicy: 'Claude 3.5 Sonnet / Gemini 1.5 Pro',
      tokenBudget: 100000,
      allowedTools: JSON.stringify(['filesystem', 'git', 'sqlite', 'audit_engine']),
      forbiddenTools: JSON.stringify(['bypass_audit']),
      allowedTaskTypes: JSON.stringify(['VALIDATION', 'AUDIT']),
      qualityGate: '100% de evidências válidas para todas as tasks da feature.',
    },
    {
      slug: 'researcher',
      name: 'Isaac (Technical Researcher)',
      role: 'Pesquisador Técnico & Benchmarks',
      avatar: '🧪',
      description: 'Executa investigações técnicas profundas, benchmarks e spikes exploratórios.',
      scope: 'Technical Spikes, Benchmarking, Performance & Research Notes',
      modelPolicy: 'Gemini 1.5 Pro',
      tokenBudget: 100000,
      allowedTools: JSON.stringify(['filesystem', 'terminal', 'web_search', 'sqlite']),
      forbiddenTools: JSON.stringify(['prod_deploy']),
      allowedTaskTypes: JSON.stringify(['RESEARCH']),
      qualityGate: 'Resultados comparativos documentados com evidências de performance.',
    },
    {
      slug: 'tester',
      name: 'Quinn (Test Specialist)',
      role: 'Especialista em Testes & Validação (L5)',
      avatar: '🔬',
      description: 'Cria e executa suites de testes unitários, testes de integração e asserções.',
      scope: 'Vitest, Test Automation, Coverage Analysis & Test Evidence',
      modelPolicy: 'Gemini 1.5 Flash / Claude 3.5 Sonnet',
      tokenBudget: 90000,
      allowedTools: JSON.stringify(['terminal', 'test_runner', 'filesystem']),
      forbiddenTools: JSON.stringify(['source_code_edit']),
      allowedTaskTypes: JSON.stringify(['TEST', 'VALIDATION']),
      qualityGate: '100% dos testes passando sem asserções flaky.',
    },
    {
      slug: 'release-manager',
      name: 'Hermes (Release Manager)',
      role: 'Gestor de Release & Operações (L6/L7)',
      avatar: '🚀',
      description: 'Empacota releases, gera changelogs, valida checklists e monitora métricas pós-deploy.',
      scope: 'Release Engineering, Rollouts, Changelogs & Post-Deployment Metrics',
      modelPolicy: 'Claude 3.5 Sonnet',
      tokenBudget: 80000,
      allowedTools: JSON.stringify(['filesystem', 'git', 'terminal', 'telemetry_reader']),
      forbiddenTools: JSON.stringify(['force_push']),
      allowedTaskTypes: JSON.stringify(['RELEASE', 'DOCUMENTATION']),
      qualityGate: 'Checklist de release 100% verificado e evidências anexadas.',
    },
  ];

  const createdAgents: Record<string, any> = {};
  for (const ag of agentsData) {
    createdAgents[ag.slug] = await prisma.agent.create({ data: ag });
  }

  // 2. WBS: Criar Portfolio
  const portfolio = await prisma.portfolio.create({
    data: {
      code: 'PORT-001',
      name: 'Athena Agentic Ecosystem',
      description: 'Ecossistema completo de governança, execução de engenharia e runtime autônomo.',
      status: 'ACTIVE',
    },
  });

  // 3. WBS: Criar Projetos
  const prjCore = await prisma.project.create({
    data: {
      portfolioId: portfolio.id,
      code: 'PRJ-001',
      name: 'Athena PMO & Engineering Platform',
      description: 'Plataforma de gestão visual de projetos, ciclo de vida de features e execução agentic.',
      status: 'ACTIVE',
    },
  });

  const prjData = await prisma.project.create({
    data: {
      portfolioId: portfolio.id,
      code: 'PRJ-002',
      name: 'Athena Data Layer & Operational State',
      description: 'Infraestrutura de persistência SQLite local, Prisma ORM e trilhas de auditoria imutáveis.',
      status: 'ACTIVE',
    },
  });

  // 4. WBS: Criar Fases de Projeto
  const phase1 = await prisma.phase.create({
    data: {
      projectId: prjCore.id,
      code: 'PHS-01',
      name: 'Fase 1: Fundações & Governança',
      order: 1,
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-08-15'),
    },
  });

  const phase2 = await prisma.phase.create({
    data: {
      projectId: prjCore.id,
      code: 'PHS-02',
      name: 'Fase 2: WBS, SDD & Agent Desk',
      order: 2,
      startDate: new Date('2026-08-16'),
      endDate: new Date('2026-09-15'),
    },
  });

  // 5. WBS: Criar Épicos
  const epicGovernance = await prisma.epic.create({
    data: {
      phaseId: phase1.id,
      code: 'EPC-001',
      title: 'Motor de Governança e Quality Gates',
      description: 'Mecanismos para bloqueio de código antecipado e controle rigoroso de maturidade.',
      status: 'COMPLETED',
    },
  });

  const epicPmo = await prisma.epic.create({
    data: {
      phaseId: phase2.id,
      code: 'EPC-002',
      title: 'Visual PMO & Roadmap Hierárquico',
      description: 'Telas de WBS, Development Level Board (L0-L7) e Feature Workspace 360°.',
      status: 'IN_PROGRESS',
    },
  });

  // 6. WBS: Criar Features com Separação Estrita de Development Level (L0-L7) e Status Operacional
  const featSqlite = await prisma.feature.create({
    data: {
      epicId: epicGovernance.id,
      code: 'FEAT-005',
      title: 'Backend com SQLite e Prisma ORM',
      objective: 'Implementar camada operacional local e autocontida no SQLite.',
      problem: 'Dependência de serviços externos em nuvem causava latência e custo.',
      businessValue: '100% de privacidade, portabilidade e velocidade em disco local.',
      developmentLevel: 'L7_OPERATE', // Nível de Maturidade
      operationalStatus: 'COMPLETED', // Status Operacional
      priority: 'HIGH',
      architecturalImpact: 'HIGH',
      adrRequired: true,
      owner: 'Orion (Roadmap Manager)',
    },
  });

  const featWbs = await prisma.feature.create({
    data: {
      epicId: epicPmo.id,
      code: 'FEAT-020',
      title: 'WBS 7 Níveis & Separação de Development Levels',
      objective: 'Estruturar o modelo relacional de 7 níveis e isolar Level de Status.',
      problem: 'Confundir maturidade com status impedia auditoria precisa do fluxo.',
      businessValue: 'Visibilidade executiva de ponta a ponta, da intenção à tarefa.',
      developmentLevel: 'L4_DEVELOPMENT',
      operationalStatus: 'IN_PROGRESS',
      priority: 'CRITICAL',
      architecturalImpact: 'HIGH',
      adrRequired: true,
      owner: 'Sophia (Spec Architect)',
    },
  });

  const featBoard = await prisma.feature.create({
    data: {
      epicId: epicPmo.id,
      code: 'FEAT-021',
      title: 'Roadmap Hierárquico & Development Level Board',
      objective: 'Construir visualização de Roadmap com chaveamento para Kanban L0-L7.',
      developmentLevel: 'L3_READY_FOR_DEV',
      operationalStatus: 'PLANNED',
      priority: 'HIGH',
      architecturalImpact: 'MEDIUM',
      adrRequired: false,
      owner: 'Daniel (Planner)',
    },
  });

  const featWorkspace = await prisma.feature.create({
    data: {
      epicId: epicPmo.id,
      code: 'FEAT-022',
      title: 'Feature Workspace 360° com Gestão de Riscos',
      objective: 'Tela completa com abas de Contexto, Riscos, Decisões, ADRs, SDD Kit e Tasks.',
      developmentLevel: 'L2_SPECIFICATION',
      operationalStatus: 'PLANNED',
      priority: 'HIGH',
      architecturalImpact: 'MEDIUM',
      adrRequired: false,
      owner: 'Maya (Product Analyst)',
    },
  });

  const featAudit = await prisma.feature.create({
    data: {
      epicId: epicPmo.id,
      code: 'FEAT-024',
      title: 'Motor de Auditoria Ativa com Detecção de Violações',
      objective: 'Detectar automaticamente tasks sem evidências ou requisitos sem spec.',
      developmentLevel: 'L1_DISCOVERY',
      operationalStatus: 'PLANNED',
      priority: 'CRITICAL',
      architecturalImpact: 'HIGH',
      adrRequired: true,
      owner: 'Sentinel (Compliance Auditor)',
    },
  });

  const featMultiTenant = await prisma.feature.create({
    data: {
      epicId: epicPmo.id,
      code: 'FEAT-025',
      title: 'Autenticação Local Multi-Perfil',
      objective: 'Isolamento de credenciais e auditoria de ações por perfil local.',
      developmentLevel: 'L0_IDEA',
      operationalStatus: 'PLANNED',
      priority: 'MEDIUM',
      architecturalImpact: 'LOW',
      adrRequired: false,
      owner: 'Maya (Product Analyst)',
    },
  });

  // 7. Riscos e Decisões
  await prisma.risk.create({
    data: {
      projectId: prjCore.id,
      featureId: featWbs.id,
      title: 'Sobrecarga de complexidade visual na árvore WBS',
      probability: 'MEDIUM',
      impact: 'HIGH',
      mitigation: 'Implementar navegação drill-down expansível com filtros por nível.',
      status: 'MITIGATED',
    },
  });

  await prisma.decision.create({
    data: {
      projectId: prjCore.id,
      featureId: featWbs.id,
      title: 'Isolamento Estrito de Level (Maturidade) vs Status (Operação)',
      rationale: 'Permite que uma feature esteja em L4 enquanto suas tasks estão TODO/DONE.',
      author: 'Marcus (Architecture Analyst)',
      status: 'APPROVED',
    },
  });

  // 8. ADRs
  await prisma.adr.create({
    data: {
      code: 'ADR-0003',
      featureId: featWbs.id,
      title: 'Separação de Development Level (L0-L7) e Status Operacional no SQLite',
      status: 'ACCEPTED',
      context: 'Maturidade de ciclo de vida e estado de execução diária são dimensões ortogonais.',
      decision: 'Criar campos separados developmentLevel e operationalStatus no banco.',
      consequences: 'Garante 100% de clareza na auditoria sem ambiguidades.',
      filePath: 'control-plane/architecture/adrs/ADR-0003-level-status-separation.md',
    },
  });

  // 9. SDD: Spec & Plan
  const specWbs = await prisma.spec.create({
    data: {
      featureId: featWbs.id,
      title: 'Especificação do Modelo WBS e Development Level',
      specDoc: '# Spec FEAT-020\nDefine contratos e comportamentos dos 7 níveis hierárquicos e 8 levels de maturidade.',
      designDoc: '# Design FEAT-020\nModelagem de banco relacional e schemas Prisma.',
      version: 1,
      status: 'APPROVED',
    },
  });

  const planWbs = await prisma.plan.create({
    data: {
      featureId: featWbs.id,
      specId: specWbs.id,
      title: 'Plano de Implementação da WBS',
      strategy: 'Etapa 1: Schema Prisma. Etapa 2: Seed. Etapa 3: Backend REST. Etapa 4: Frontend UI.',
    },
  });

  // 10. Stories e Tasks Tipadas (11 tipos)
  const story1 = await prisma.story.create({
    data: {
      featureId: featWbs.id,
      code: 'US-020-1',
      title: 'Visualização da WBS Completa',
      userPersona: 'Gerente de Projeto / Líder Técnico',
      wantTo: 'visualizar a árvore hierárquica desde o Portfolio até Subtasks',
      soThat: 'possa rastrear o impacto de cada entrega no nível estratégico',
      status: 'IN_PROGRESS',
    },
  });

  const task1 = await prisma.task.create({
    data: {
      featureId: featWbs.id,
      storyId: story1.id,
      planId: planWbs.id,
      code: 'TSK-020-1',
      title: 'Atualizar schema.prisma com 7 níveis de WBS',
      description: 'Modelar Portfolio, Project, Phase, Epic, Feature, Story, Task, Subtask.',
      taskType: 'SPECIFICATION',
      status: 'DONE',
      priority: 'CRITICAL',
      assignedAgentId: createdAgents['spec-architect'].id,
      acceptanceCriteria: 'Todos os relacionamentos com onDelete cascade configurados.',
    },
  });

  const task2 = await prisma.task.create({
    data: {
      featureId: featWbs.id,
      storyId: story1.id,
      planId: planWbs.id,
      code: 'TSK-020-2',
      title: 'Implementar endpoints REST de WBS no backend',
      description: 'Criar rotas para carregar a hierarquia completa com suporte a lazy loading.',
      taskType: 'IMPLEMENTATION',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      assignedAgentId: createdAgents['implementer'].id,
      acceptanceCriteria: 'Retornar JSON aninhado com contadores de progresso.',
    },
  });

  const task3 = await prisma.task.create({
    data: {
      featureId: featWbs.id,
      storyId: story1.id,
      planId: planWbs.id,
      code: 'TSK-020-3',
      title: 'Construir visualizador de WBS e Development Level Board no Frontend',
      description: 'Criar componentes React com abas para WBS e Development Level L0 a L7.',
      taskType: 'IMPLEMENTATION',
      status: 'TODO',
      priority: 'HIGH',
      assignedAgentId: createdAgents['implementer'].id,
      acceptanceCriteria: 'Permitir alternar entre WBS hierárquico e Kanban de Levels L0-L7.',
    },
  });

  // 11. Subtasks
  await prisma.subtask.createMany({
    data: [
      { taskId: task1.id, title: 'Definir model Portfolio e Project', completed: true },
      { taskId: task1.id, title: 'Definir model Phase e Epic', completed: true },
      { taskId: task2.id, title: 'Criar rota GET /api/wbs', completed: true },
      { taskId: task2.id, title: 'Criar rota GET /api/development-levels', completed: false },
    ],
  });

  // 12. Evidências
  await prisma.evidence.create({
    data: {
      taskId: task1.id,
      type: 'PRISMA_VALIDATION',
      summary: 'Schema validado e sincronizado com o SQLite com 100% de sucesso.',
      details: 'Comando prisma db push executado sem conflitos referenciais.',
      verified: true,
    },
  });

  // 13. Violações de Auditoria Ativas (para demonstração do motor de compliance)
  await prisma.auditViolation.createMany({
    data: [
      {
        featureId: featAudit.id,
        violation: 'REQUIREMENT_WITHOUT_SPEC',
        severity: 'HIGH',
        source: 'FEAT-024',
        details: 'Feature em L1 possui objetivo mas não possui Spec SDD aprovada.',
        resolved: false,
      },
      {
        featureId: featMultiTenant.id,
        violation: 'UNRESOLVED_HYPOTHESIS',
        severity: 'LOW',
        source: 'FEAT-025',
        details: 'Ideia em L0 requer validação de viabilidade técnica no L1.',
        resolved: false,
      },
    ],
  });

  // 14. Eventos de Auditoria
  await prisma.auditEvent.create({
    data: {
      featureId: featWbs.id,
      actor: 'Athena Prime (Orchestrator)',
      action: 'GATE_PROMOTED_TO_L4',
      details: 'Feature FEAT-020 promovida de L3 para L4 após aprovação de Spec, Plan e Tasks.',
    },
  });

  console.log('Seed do Athena Agentic PMO Operating System concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
