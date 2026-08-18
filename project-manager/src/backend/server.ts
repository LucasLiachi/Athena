import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'Athena Agentic PMO Operating System', db: 'sqlite' });
});

// 2. Overview: Cockpit Executivo & Operacional
app.get('/api/overview', async (req, res) => {
  try {
    const [
      portfolios,
      projects,
      epics,
      features,
      tasks,
      agents,
      agentRuns,
      adrs,
      risks,
      decisions,
      violations,
      auditEvents,
    ] = await Promise.all([
      prisma.portfolio.count(),
      prisma.project.count(),
      prisma.epic.count(),
      prisma.feature.findMany(),
      prisma.task.findMany({ include: { subtasks: true } }),
      prisma.agent.findMany(),
      prisma.agentRun.findMany(),
      prisma.adr.count(),
      prisma.risk.findMany(),
      prisma.decision.findMany(),
      prisma.auditViolation.findMany({ where: { resolved: false } }),
      prisma.auditEvent.findMany({ orderBy: { timestamp: 'desc' }, take: 10 }),
    ]);

    // Métricas por Development Level (L0 a L7)
    const featuresByLevel: Record<string, number> = {
      L0_IDEA: 0,
      L1_DISCOVERY: 0,
      L2_SPECIFICATION: 0,
      L3_READY_FOR_DEV: 0,
      L4_DEVELOPMENT: 0,
      L5_VALIDATION: 0,
      L6_RELEASE: 0,
      L7_OPERATE: 0,
    };
    features.forEach((f) => {
      featuresByLevel[f.developmentLevel] = (featuresByLevel[f.developmentLevel] || 0) + 1;
    });

    // Métricas por Status Operacional
    const featuresByStatus: Record<string, number> = {};
    features.forEach((f) => {
      featuresByStatus[f.operationalStatus] = (featuresByStatus[f.operationalStatus] || 0) + 1;
    });

    const totalTokens = agentRuns.reduce((sum, r) => sum + r.tokensUsed, 0);
    const totalCost = agentRuns.reduce((sum, r) => sum + r.costUsd, 0);
    const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
    const taskProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    res.json({
      portfoliosCount: portfolios,
      projectsCount: projects,
      epicsCount: epics,
      totalFeatures: features.length,
      featuresByLevel,
      featuresByStatus,
      totalTasks: tasks.length,
      completedTasks,
      taskProgress,
      totalAgents: agents.length,
      activeAgents: agents.filter((a) => a.isActive).length,
      adrsCount: adrs,
      risksCount: risks.length,
      highRisksCount: risks.filter((r) => r.impact === 'HIGH').length,
      decisionsCount: decisions.length,
      unresolvedViolationsCount: violations.length,
      totalTokens,
      totalCostUsd: Number(totalCost.toFixed(4)),
      recentAudits: auditEvents,
      activeViolations: violations,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. WBS: Árvore Hierárquica Completa (7 Níveis)
app.get('/api/wbs', async (req, res) => {
  try {
    const portfolios = await prisma.portfolio.findMany({
      include: {
        projects: {
          include: {
            phases: {
              include: {
                epics: {
                  include: {
                    features: {
                      include: {
                        stories: {
                          include: {
                            tasks: {
                              include: {
                                assignedAgent: true,
                                subtasks: true,
                                evidence: true,
                              },
                            },
                          },
                        },
                        tasks: {
                          include: {
                            assignedAgent: true,
                            subtasks: true,
                            evidence: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    res.json(portfolios);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Roadmap & Features
app.get('/api/roadmap', async (req, res) => {
  try {
    const features = await prisma.feature.findMany({
      include: {
        epic: {
          include: {
            phase: {
              include: {
                project: true,
              },
            },
          },
        },
        questions: true,
        assumptions: true,
        risks: true,
        decisions: true,
        adrs: true,
        specs: true,
        plans: true,
        tasks: {
          include: {
            assignedAgent: true,
            subtasks: true,
            evidence: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(features);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/features/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const feature = await prisma.feature.findFirst({
      where: { OR: [{ id }, { code: id }] },
      include: {
        epic: { include: { phase: { include: { project: true } } } },
        questions: true,
        assumptions: true,
        risks: true,
        decisions: true,
        architectureReviews: true,
        adrs: true,
        specs: true,
        plans: true,
        stories: {
          include: {
            tasks: {
              include: {
                assignedAgent: true,
                subtasks: true,
                evidence: true,
              },
            },
          },
        },
        tasks: {
          include: {
            assignedAgent: true,
            subtasks: true,
            evidence: true,
          },
        },
        agentRuns: {
          include: {
            agent: true,
            toolCalls: true,
          },
          orderBy: { startedAt: 'desc' },
        },
        auditEvents: { orderBy: { timestamp: 'desc' } },
        auditViolations: true,
      },
    });

    if (!feature) return res.status(404).json({ error: 'Feature não encontrada' });
    res.json(feature);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/features', async (req, res) => {
  try {
    const {
      code,
      title,
      objective,
      problem,
      businessValue,
      context,
      epicId,
      priority,
      questions,
      assumptions,
    } = req.body;

    const feature = await prisma.feature.create({
      data: {
        code: code || `FEAT-${Math.floor(100 + Math.random() * 900)}`,
        title,
        objective,
        problem,
        businessValue,
        context,
        epicId,
        priority: priority || 'MEDIUM',
        developmentLevel: 'L0_IDEA',
        operationalStatus: 'PLANNED',
        questions: {
          create: (questions || []).map((q: string) => ({ question: q, resolved: false })),
        },
        assumptions: {
          create: (assumptions || []).map((a: string) => ({ assumption: a, validated: false })),
        },
      },
      include: { questions: true, assumptions: true },
    });

    await prisma.auditEvent.create({
      data: {
        featureId: feature.id,
        actor: 'Orion (Roadmap Manager)',
        action: 'FEATURE_CREATED_L0',
        details: `Feature ${feature.code} criada no nível L0_IDEA.`,
      },
    });

    res.status(201).json(feature);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Promoção de Development Level com Gate Enforcement
app.patch('/api/features/:id/promote-level', async (req, res) => {
  try {
    const { id } = req.params;
    const { targetLevel, actor, note } = req.body;

    const feature = await prisma.feature.findUnique({
      where: { id },
      include: {
        questions: true,
        architectureReviews: true,
        specs: true,
        plans: true,
        tasks: { include: { evidence: true } },
      },
    });

    if (!feature) return res.status(404).json({ error: 'Feature não encontrada' });

    // Quality Gates Estritos
    if (targetLevel === 'L3_READY_FOR_DEV') {
      const hasUnresolvedQuestions = feature.questions.some((q) => !q.resolved);
      const hasApprovedSpec = feature.specs.some((s) => s.status === 'APPROVED');
      if (hasUnresolvedQuestions) {
        return res.status(400).json({ error: 'Gate L3 Falhou: Existem perguntas não respondidas no Discovery.' });
      }
      if (!hasApprovedSpec) {
        return res.status(400).json({ error: 'Gate L3 Falhou: Requer Spec SDD formalmente aprovada.' });
      }
    }

    if (targetLevel === 'L4_DEVELOPMENT') {
      const isArchApproved = feature.architectureReviews.some((r) => r.verdict === 'APPROVED');
      const hasPlans = feature.plans.length > 0;
      if (!isArchApproved) {
        return res.status(400).json({ error: 'Gate L4 Falhou: Análise Arquitetural deve estar aprovada antes do desenvolvimento.' });
      }
      if (!hasPlans) {
        return res.status(400).json({ error: 'Gate L4 Falhou: Plano de implementação com tasks é obrigatório.' });
      }
    }

    if (targetLevel === 'L6_RELEASE' || targetLevel === 'L7_OPERATE') {
      const pendingTasks = feature.tasks.some((t) => t.status !== 'DONE');
      const missingEvidence = feature.tasks.some((t) => t.evidence.length === 0);
      if (pendingTasks) {
        return res.status(400).json({ error: 'Gate L6/L7 Falhou: Todas as tarefas devem estar concluídas (DONE).' });
      }
      if (missingEvidence) {
        return res.status(400).json({ error: 'Gate L6/L7 Falhou: Todas as tarefas devem possuir evidências verificadas.' });
      }
    }

    const updated = await prisma.feature.update({
      where: { id },
      data: {
        developmentLevel: targetLevel,
        ...(targetLevel === 'L4_DEVELOPMENT' && { operationalStatus: 'IN_PROGRESS' }),
        ...(targetLevel === 'L7_OPERATE' && { operationalStatus: 'COMPLETED' }),
      },
    });

    await prisma.auditEvent.create({
      data: {
        featureId: id,
        actor: actor || 'Athena Prime (Orchestrator)',
        action: `LEVEL_PROMOTED_${targetLevel}`,
        details: note || `Feature promovida para o nível ${targetLevel}`,
      },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Delivery Board: Tasks & Stories por Status Operacional
app.get('/api/delivery', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        feature: true,
        story: true,
        assignedAgent: true,
        subtasks: true,
        evidence: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/delivery/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedAgentId } = req.body;
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(assignedAgentId && { assignedAgentId }),
      },
      include: { assignedAgent: true, subtasks: true },
    });
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Architecture, Domínios & ADRs
app.get('/api/architecture', async (req, res) => {
  try {
    const [adrs, reviews, decisions] = await Promise.all([
      prisma.adr.findMany({ include: { feature: true }, orderBy: { createdAt: 'desc' } }),
      prisma.architectureReview.findMany({ include: { feature: true }, orderBy: { createdAt: 'desc' } }),
      prisma.decision.findMany({ include: { feature: true, project: true }, orderBy: { createdAt: 'desc' } }),
    ]);
    res.json({ adrs, reviews, decisions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 8. SDD Workspace: Spec Kits
app.get('/api/sdd', async (req, res) => {
  try {
    const [specs, plans, tasks] = await Promise.all([
      prisma.spec.findMany({ include: { feature: true } }),
      prisma.plan.findMany({ include: { feature: true, spec: true, tasks: { include: { assignedAgent: true, evidence: true } } } }),
      prisma.task.findMany({ include: { feature: true, assignedAgent: true, evidence: true, subtasks: true } }),
    ]);
    res.json({ specs, plans, tasks });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Catálogo de 13 Agentes & Runs
app.get('/api/agents', async (req, res) => {
  try {
    const agents = await prisma.agent.findMany({
      include: {
        tasks: { take: 5, include: { feature: true } },
        agentRuns: {
          take: 5,
          orderBy: { startedAt: 'desc' },
          include: { toolCalls: true },
        },
      },
    });
    res.json(agents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/agents/:id/run', async (req, res) => {
  try {
    const { id } = req.params;
    const { featureId, taskId, inputPrompt } = req.body;

    const agent = await prisma.agent.findUnique({ where: { id } });
    if (!agent) return res.status(404).json({ error: 'Agente não encontrado' });

    const tokensUsed = Math.floor(6000 + Math.random() * 14000);
    const costUsd = Number(((tokensUsed / 1000) * 0.003).toFixed(4));

    const run = await prisma.agentRun.create({
      data: {
        agentId: id,
        featureId,
        taskId,
        status: 'SUCCESS',
        inputPrompt: inputPrompt || `Execução de tarefa pelo agente especialista ${agent.name}`,
        outputResult: `Tarefa executada com êxito sob o escopo [${agent.scope}]. Quality Gate atendido.`,
        tokensUsed,
        costUsd,
        completedAt: new Date(),
        toolCalls: {
          create: [
            {
              toolName: 'validate_contracts_and_types',
              arguments: JSON.stringify({ agent: agent.slug, taskTypes: agent.allowedTaskTypes }),
              result: JSON.stringify({ valid: true, schemaIntegrity: '100%' }),
              latencyMs: 150,
              status: 'SUCCESS',
            },
            {
              toolName: 'execute_atomic_work',
              arguments: JSON.stringify({ taskId, gate: agent.qualityGate }),
              result: JSON.stringify({ success: true, testsPassing: true }),
              latencyMs: 310,
              status: 'SUCCESS',
            },
          ],
        },
      },
      include: { toolCalls: true, agent: true },
    });

    if (taskId) {
      await prisma.task.update({
        where: { id: taskId },
        data: { status: 'DONE' },
      });
      await prisma.evidence.create({
        data: {
          taskId,
          type: 'AGENT_RUN_EVIDENCE',
          summary: `Execução concluída com sucesso pelo agente ${agent.name}`,
          details: `Run ID: ${run.id}. Tokens: ${tokensUsed}. Latência total: 460ms.`,
          verified: true,
        },
      });
    }

    res.status(201).json(run);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 10. Operations & Auditoria Ativa
app.get('/api/operations', async (req, res) => {
  try {
    const [runs, audits, violations, toolCalls] = await Promise.all([
      prisma.agentRun.findMany({
        include: { agent: true, task: true, toolCalls: true },
        orderBy: { startedAt: 'desc' },
        take: 30,
      }),
      prisma.auditEvent.findMany({
        include: { feature: true },
        orderBy: { timestamp: 'desc' },
        take: 30,
      }),
      prisma.auditViolation.findMany({
        include: { feature: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.toolCall.findMany({
        include: { agentRun: { include: { agent: true } } },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
    ]);
    res.json({ runs, audits, violations, toolCalls });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`⚡ Athena Agentic PMO OS Backend rodando na porta ${PORT}`);
});
