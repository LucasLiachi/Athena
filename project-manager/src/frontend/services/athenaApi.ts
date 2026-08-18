// Serviço de integração do Athena Agentic PMO Operating System

const API_BASE = 'http://localhost:3001/api';

export interface OverviewData {
  portfoliosCount: number;
  projectsCount: number;
  epicsCount: number;
  totalFeatures: number;
  featuresByLevel: Record<string, number>;
  featuresByStatus: Record<string, number>;
  totalTasks: number;
  completedTasks: number;
  taskProgress: number;
  totalAgents: number;
  activeAgents: number;
  adrsCount: number;
  risksCount: number;
  highRisksCount: number;
  decisionsCount: number;
  unresolvedViolationsCount: number;
  totalTokens: number;
  totalCostUsd: number;
  recentAudits: Array<{
    id: string;
    actor: string;
    action: string;
    details: string;
    timestamp: string;
  }>;
  activeViolations: Array<{
    id: string;
    violation: string;
    severity: string;
    source: string;
    details: string;
    resolved: boolean;
  }>;
}

export interface WbsPortfolio {
  id: string;
  code: string;
  name: string;
  description: string;
  status: string;
  projects: Array<{
    id: string;
    code: string;
    name: string;
    description: string;
    status: string;
    phases: Array<{
      id: string;
      code: string;
      name: string;
      order: number;
      epics: Array<{
        id: string;
        code: string;
        title: string;
        description: string;
        status: string;
        features: Array<FeatureItem>;
      }>;
    }>;
  }>;
}

export interface FeatureItem {
  id: string;
  code: string;
  title: string;
  objective: string;
  problem?: string;
  businessValue?: string;
  context?: string;
  developmentLevel: 'L0_IDEA' | 'L1_DISCOVERY' | 'L2_SPECIFICATION' | 'L3_READY_FOR_DEV' | 'L4_DEVELOPMENT' | 'L5_VALIDATION' | 'L6_RELEASE' | 'L7_OPERATE';
  operationalStatus: 'PLANNED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  architecturalImpact?: 'LOW' | 'MEDIUM' | 'HIGH';
  adrRequired: boolean;
  owner?: string;
  epic?: { id: string; code: string; title: string; phase?: { name: string; project?: { name: string } } };
  questions?: Array<{ id: string; question: string; answer?: string; resolved: boolean }>;
  assumptions?: Array<{ id: string; assumption: string; validated: boolean }>;
  risks?: Array<{ id: string; title: string; probability: string; impact: string; mitigation: string; status: string }>;
  decisions?: Array<{ id: string; title: string; rationale: string; author: string; status: string }>;
  architectureReviews?: Array<{ id: string; reviewer: string; verdict: string; notes: string; createdAt: string }>;
  adrs?: Array<{ id: string; code: string; title: string; status: string; decision: string }>;
  specs?: Array<{ id: string; title: string; specDoc: string; designDoc?: string; version: number; status: string }>;
  plans?: Array<{
    id: string;
    title: string;
    strategy: string;
    tasks?: Array<TaskItem>;
  }>;
  stories?: Array<{
    id: string;
    code: string;
    title: string;
    userPersona: string;
    wantTo: string;
    soThat: string;
    status: string;
    tasks: Array<TaskItem>;
  }>;
  tasks?: Array<TaskItem>;
  agentRuns?: Array<{
    id: string;
    agent: { id: string; name: string; avatar: string };
    status: string;
    inputPrompt: string;
    outputResult?: string;
    tokensUsed: number;
    costUsd: number;
    startedAt: string;
    toolCalls?: Array<{
      id: string;
      toolName: string;
      arguments: string;
      result?: string;
      latencyMs?: number;
      status: string;
    }>;
  }>;
  auditEvents?: Array<{
    id: string;
    actor: string;
    action: string;
    details: string;
    timestamp: string;
  }>;
  auditViolations?: Array<{
    id: string;
    violation: string;
    severity: string;
    details: string;
    resolved: boolean;
  }>;
}

export interface TaskItem {
  id: string;
  code: string;
  title: string;
  description: string;
  taskType: 'DISCOVERY' | 'RESEARCH' | 'ARCHITECTURE' | 'SPECIFICATION' | 'DESIGN' | 'IMPLEMENTATION' | 'TEST' | 'VALIDATION' | 'MIGRATION' | 'DOCUMENTATION' | 'RELEASE';
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'BLOCKED';
  priority: string;
  estimatedEffort?: number;
  acceptanceCriteria?: string;
  testReference?: string;
  assignedAgent?: { id: string; name: string; avatar: string; role: string; slug: string };
  feature?: { id: string; code: string; title: string };
  story?: { id: string; code: string; title: string };
  subtasks?: Array<{ id: string; title: string; completed: boolean }>;
  evidence?: Array<{ id: string; type: string; summary: string; details: string; verified: boolean }>;
}

export interface AgentItem {
  id: string;
  slug: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  scope: string;
  modelPolicy: string;
  tokenBudget: number;
  allowedTools: string;
  forbiddenTools: string;
  allowedTaskTypes: string;
  inputContract?: string;
  outputContract?: string;
  qualityGate: string;
  version: string;
  isActive: boolean;
  tasks?: Array<{ id: string; code: string; title: string; status: string; feature?: { code: string } }>;
  agentRuns?: Array<{
    id: string;
    status: string;
    tokensUsed: number;
    costUsd: number;
    startedAt: string;
    toolCalls?: Array<{ id: string; toolName: string; status: string }>;
  }>;
}

export const athenaApi = {
  async getOverview(): Promise<OverviewData> {
    const res = await fetch(`${API_BASE}/overview`);
    if (!res.ok) throw new Error('API offline');
    return await res.json();
  },

  async getWbs(): Promise<WbsPortfolio[]> {
    const res = await fetch(`${API_BASE}/wbs`);
    if (!res.ok) throw new Error('API offline');
    return await res.json();
  },

  async getRoadmap(): Promise<FeatureItem[]> {
    const res = await fetch(`${API_BASE}/roadmap`);
    if (!res.ok) throw new Error('API offline');
    return await res.json();
  },

  async getFeature(id: string): Promise<FeatureItem> {
    const res = await fetch(`${API_BASE}/features/${id}`);
    if (!res.ok) throw new Error('API offline');
    return await res.json();
  },

  async createFeature(data: any): Promise<FeatureItem> {
    const res = await fetch(`${API_BASE}/features`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Falha ao criar feature');
    return await res.json();
  },

  async promoteFeatureLevel(id: string, targetLevel: string, note?: string): Promise<FeatureItem> {
    const res = await fetch(`${API_BASE}/features/${id}/promote-level`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetLevel, note }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gate de nível falhou');
    }
    return await res.json();
  },

  async getDeliveryTasks(): Promise<TaskItem[]> {
    const res = await fetch(`${API_BASE}/delivery`);
    if (!res.ok) throw new Error('API offline');
    return await res.json();
  },

  async updateTaskStatus(id: string, status: string, assignedAgentId?: string): Promise<TaskItem> {
    const res = await fetch(`${API_BASE}/delivery/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, assignedAgentId }),
    });
    if (!res.ok) throw new Error('Falha ao atualizar tarefa');
    return await res.json();
  },

  async getArchitecture(): Promise<{ adrs: any[]; reviews: any[]; decisions: any[] }> {
    const res = await fetch(`${API_BASE}/architecture`);
    if (!res.ok) throw new Error('API offline');
    return await res.json();
  },

  async getSdd(): Promise<{ specs: any[]; plans: any[]; tasks: any[] }> {
    const res = await fetch(`${API_BASE}/sdd`);
    if (!res.ok) throw new Error('API offline');
    return await res.json();
  },

  async getAgents(): Promise<AgentItem[]> {
    const res = await fetch(`${API_BASE}/agents`);
    if (!res.ok) throw new Error('API offline');
    return await res.json();
  },

  async triggerAgentRun(agentId: string, featureId?: string, taskId?: string, inputPrompt?: string) {
    const res = await fetch(`${API_BASE}/agents/${agentId}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featureId, taskId, inputPrompt }),
    });
    if (!res.ok) throw new Error('Falha ao disparar execução');
    return await res.json();
  },

  async getOperations(): Promise<any> {
    const res = await fetch(`${API_BASE}/operations`);
    if (!res.ok) throw new Error('API offline');
    return await res.json();
  },
};
