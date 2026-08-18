// @ts-nocheck
import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";

// ─── Utilitários ───────────────────────────────────────────────────────────────
function d(y, m, day) { return new Date(y, m, day); }
function addDays(dt, n) { const r = new Date(dt); r.setDate(r.getDate() + n); return r; }
function diffDays(a, b) { return Math.round((b - a) / 86400000); }
function fmtBr(dt) { return dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }); }
function fmtFull(dt) { return dt.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }); }

const HOJE = new Date(2026, 2, 7);

// ─── Dados iniciais ────────────────────────────────────────────────────────────
let _nextId = 10;
const newId = () => ++_nextId;

const FASES_INIT = [
  {
    id: 1, nome: "Levantamento", resp: "Andreia", cor: "#22c55e",
    status: "concluido", progresso: 100,
    inicio: d(2026, 0, 5), fim: d(2026, 0, 30),
    baseInicio: d(2026, 0, 5), baseFim: d(2026, 0, 30),
    deps: [],
    tarefas: [
      { id: 101, nome: "Mapeamento de processos", status: "concluido", progresso: 100 },
      { id: 102, nome: "Entrevistas stakeholders", status: "concluido", progresso: 100 },
      { id: 103, nome: "Documento de requisitos", status: "concluido", progresso: 100 },
    ],
  },
  {
    id: 2, nome: "Configuração", resp: "Felipe", cor: "#22c55e",
    status: "concluido", progresso: 100,
    inicio: d(2026, 1, 2), fim: d(2026, 1, 27),
    baseInicio: d(2026, 1, 2), baseFim: d(2026, 1, 27),
    deps: [1],
    tarefas: [
      { id: 201, nome: "Setup do ambiente", status: "concluido", progresso: 100 },
      { id: 202, nome: "Configuração de fluxos BPM", status: "concluido", progresso: 100 },
      { id: 203, nome: "Integrações Jira/SCCD", status: "concluido", progresso: 100 },
    ],
  },
  {
    id: 3, nome: "Desenvolvimento", resp: "Nathan", cor: "#f59e0b",
    status: "em_andamento", progresso: 42,
    inicio: d(2026, 2, 2), fim: d(2026, 3, 11),
    baseInicio: d(2026, 2, 2), baseFim: d(2026, 3, 4),
    deps: [2],
    tarefas: [
      { id: 301, nome: "Módulo de comprobatórios", status: "concluido", progresso: 100 },
      { id: 302, nome: "Painel ESG", status: "em_andamento", progresso: 65 },
      { id: 303, nome: "Painel de incidentes", status: "em_andamento", progresso: 30 },
      { id: 304, nome: "Integração Power BI", status: "nao_iniciado", progresso: 0 },
    ],
  },
  {
    id: 4, nome: "Homologação", resp: "Luana", cor: "#3b82f6",
    status: "nao_iniciado", progresso: 0,
    inicio: d(2026, 3, 13), fim: d(2026, 4, 1),
    baseInicio: d(2026, 3, 7), baseFim: d(2026, 3, 25),
    deps: [3],
    tarefas: [
      { id: 401, nome: "Testes com usuários-chave", status: "nao_iniciado", progresso: 0 },
      { id: 402, nome: "Ajustes pós-homologação", status: "nao_iniciado", progresso: 0 },
    ],
  },
  {
    id: 5, nome: "Go-live", resp: "Ronaldo", cor: "#a855f7",
    status: "nao_iniciado", progresso: 0,
    inicio: d(2026, 4, 4), fim: d(2026, 4, 30),
    baseInicio: d(2026, 3, 28), baseFim: d(2026, 4, 24),
    deps: [4],
    tarefas: [
      { id: 501, nome: "Deploy produção", status: "nao_iniciado", progresso: 0 },
      { id: 502, nome: "Treinamento equipe", status: "nao_iniciado", progresso: 0 },
      { id: 503, nome: "Documentação final", status: "nao_iniciado", progresso: 0 },
    ],
  },
];

const STATUS_MAP = {
  concluido: { label: "Concluído", color: "#22c55e" },
  em_andamento: { label: "Em andamento", color: "#f59e0b" },
  nao_iniciado: { label: "Não iniciado", color: "#475569" },
  atrasado: { label: "Atrasado", color: "#ef4444" },
};

const ZOOM_LEVELS = [
  { label: "Semana", cellPx: 54, unit: "day", fmt: (d) => `${d.getDate()}/${d.getMonth() + 1}` },
  { label: "Mês", cellPx: 26, unit: "week", fmt: (d) => `S${getWeek(d)}` },
  { label: "Trimestre", cellPx: 13, unit: "bi", fmt: (d) => `${d.getDate()}/${d.getMonth() + 1}` },
  { label: "Projeto", cellPx: 7, unit: "month", fmt: (d) => d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }) },
];
function getWeek(d) {
  const s = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - s) / 86400000 + s.getDay() + 1) / 7);
}
function buildHeader(start, end, zoom) {
  const cells = []; let cur = new Date(start);
  while (cur <= end) {
    cells.push(new Date(cur));
    if (zoom.unit === "day") cur = addDays(cur, 1);
    else if (zoom.unit === "week") cur = addDays(cur, 7);
    else if (zoom.unit === "bi") cur = addDays(cur, 15);
    else cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
  }
  return cells;
}

// ─── Detecta alertas de atraso ─────────────────────────────────────────────────
function detectAlertas(fases) {
  return fases.flatMap(f => {
    const alerts = [];
    const atrasoDias = diffDays(f.baseFim, f.fim);
    if (atrasoDias > 0 && f.status !== "concluido")
      alerts.push({ faseId: f.id, tipo: "atraso", msg: `${f.nome} está ${atrasoDias}d além da baseline`, cor: "#ef4444" });
    if (f.status === "em_andamento" && f.progresso < 30 && diffDays(f.inicio, HOJE) > diffDays(f.inicio, f.fim) * 0.4)
      alerts.push({ faseId: f.id, tipo: "lento", msg: `${f.nome} com progresso baixo para o tempo decorrido`, cor: "#f59e0b" });
    if (f.status === "nao_iniciado" && HOJE > f.inicio)
      alerts.push({ faseId: f.id, tipo: "nao_iniciado", msg: `${f.nome} deveria ter iniciado em ${fmtBr(f.inicio)}`, cor: "#f97316" });
    return alerts;
  });
}

// ─── Modal genérico ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg-overlay, #00000088)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "var(--bg-modal, #0f1a2e)", border: "1px solid #1e2d40", borderRadius: 14, padding: 24, minWidth: 380, maxWidth: 520, width: "90%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-title, #f1f5f9)" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted, #64748b)", fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, color: "var(--text-dark, #475569)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}
const inputStyle = {
  width: "100%", background: "var(--bg-top, #0b1120)", border: "1px solid #1e2d40", borderRadius: 8,
  padding: "8px 10px", color: "var(--text-main, #e2e8f0)", fontSize: 13, boxSizing: "border-box",
};

// ═══════════════════════════════════════════════════════════════════════════════
function recalculateTimeline(fases) {
  let changed = true;
  let currentFases = [...fases];
  // Simple iteration to avoid infinite loops, max 100 passes
  let pass = 0;
  while (changed && pass < 100) {
    changed = false;
    pass++;
    currentFases = currentFases.map(f => {
      if (!f.deps || f.deps.length === 0) return f;
      const prevFases = currentFases.filter(pf => f.deps.includes(pf.id));
      if (prevFases.length === 0) return f;
      const maxDepFim = new Date(Math.max(...prevFases.map(pf => pf.fim)));
      // allow next phase to start on the next day
      const expectedInicio = addDays(maxDepFim, 1);
      if (f.inicio < expectedInicio) {
        const diff = diffDays(f.inicio, expectedInicio);
        if (diff > 0) {
          changed = true;
          const newTarefas = f.tarefas.map(t => ({ ...t, inicio: addDays(t.inicio, diff), fim: addDays(t.fim, diff) }));
          return { ...f, inicio: addDays(f.inicio, diff), fim: addDays(f.fim, diff), tarefas: newTarefas };
        }
      }
      return f;
    });
  }
  return currentFases;
}

const THEMES: any = {
  dark: {
    "--bg-app": "#070d1a",
    "--bg-top": "#0b1120",
    "--bg-row-alt": "#0d1528",
    "--bg-row-sel": "#0f1f35",
    "--bg-row-sel-tr": "#0f1f3533",
    "--bg-row-alt-tr": "#0d152811",
    "--bg-task": "#060c18",
    "--bg-task-tr": "#060c1888",
    "--bg-modal": "#0f1a2e",
    "--bg-overlay": "#00000088",
    "--text-main": "#e2e8f0",
    "--text-title": "#f1f5f9",
    "--text-muted": "#64748b",
    "--text-dark": "#475569",
    "--border-main": "#1e2d40",
    "--border-gantt": "#0f172a",
    "--border-grid": "#ffffff05",
    "--bg-alert": "#2d0a0a"
  },
  light: {
    "--bg-app": "#f8fafc",
    "--bg-top": "#ffffff",
    "--bg-row-alt": "#f1f5f9",
    "--bg-row-sel": "#e2e8f0",
    "--bg-row-sel-tr": "#e2e8f088",
    "--bg-row-alt-tr": "#f8fafc88",
    "--bg-task": "#ffffff",
    "--bg-task-tr": "#ffffff88",
    "--bg-modal": "#ffffff",
    "--bg-overlay": "#00000044",
    "--text-main": "#334155",
    "--text-title": "#0f172a",
    "--text-muted": "#64748b",
    "--text-dark": "#94a3b8",
    "--border-main": "#cbd5e1",
    "--border-gantt": "#e2e8f0",
    "--border-grid": "#0000000a",
    "--bg-alert": "#fee2e2"
  }
};

export default function GanttPro() {
  const FASES_INIT_DATES = FASES_INIT.map(f => ({
  ...f,
  tarefas: f.tarefas.map(t => ({...t, inicio: new Date(f.inicio), fim: new Date(f.fim), baseInicio: new Date(f.baseInicio), baseFim: new Date(f.baseFim)}))
}));
  const [fases, setFases] = useState(FASES_INIT_DATES);
  const [zoomIdx, setZoomIdx] = useState(2);
  const [fullscreen, setFullscreen] = useState(false);
  const [showDeps, setShowDeps] = useState(true);
  const [showBase, setShowBase] = useState(true);
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [tooltip, setTooltip] = useState(null);

  // Filtros
  const [filterResp, setFilterResp] = useState("Todos");
  const [filterStatus, setFilterStatus] = useState("Todos");

  // Modais
  const [modalFase, setModalFase] = useState(null); // null | 'new' | fase-obj
  const [modalTarefa, setModalTarefa] = useState(null); // null | { faseId, tarefa|null }
  const [showAlertas, setShowAlertas] = useState(false);

  const zoom = ZOOM_LEVELS[zoomIdx];
  const alertas = detectAlertas(fases);

  const projetoInicio = new Date(Math.min(...fases.map(f => f.inicio)));
  const projetoFim = new Date(Math.max(...fases.map(f => f.fim), ...fases.map(f => f.baseFim)));
  const totalDias = diffDays(projetoInicio, projetoFim) + 1;
  const headerCells = buildHeader(projetoInicio, projetoFim, zoom);
  const canvasW = headerCells.length * zoom.cellPx;

  const dateToPx = useCallback((date) => diffDays(projetoInicio, date) * (canvasW / totalDias), [projetoInicio, canvasW, totalDias]);

  // ── Drag ──────────────────────────────────────────────────────────────────
  const dragging = useRef(null);
  const onMouseDown = (e, faseId, tipo) => {
    e.preventDefault(); e.stopPropagation();
    const f = fases.find(x => x.id === faseId);
    dragging.current = { faseId, tipo, startX: e.clientX, origInicio: new Date(f.inicio), origFim: new Date(f.fim) };
  };
  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const { faseId, tipo, startX, origInicio, origFim } = dragging.current;
      const dd = Math.round((e.clientX - startX) / (canvasW / totalDias));
      setFases(prev => prev.map(f => {
        if (f.id !== faseId) return f;
        if (tipo === "move") return { ...f, inicio: addDays(origInicio, dd), fim: addDays(origFim, dd) };
        if (tipo === "left") { const ni = addDays(origInicio, dd); return ni < f.fim ? { ...f, inicio: ni } : f; }
        if (tipo === "right") { const nf = addDays(origFim, dd); return nf > f.inicio ? { ...f, fim: nf } : f; }
        return f;
      }));
    };
    const onUp = () => { dragging.current = null; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [canvasW, totalDias]);

  // ── Fases filtradas ────────────────────────────────────────────────────────
  const fasesFiltradas = fases.filter(f => {
    if (filterResp !== "Todos" && f.resp !== filterResp) return false;
    if (filterStatus !== "Todos" && f.status !== filterStatus) return false;
    return true;
  });
  const resps = ["Todos", ...Array.from(new Set(fases.map(f => f.resp)))];
  const statuses = ["Todos", ...Object.keys(STATUS_MAP)];
  const progressoGeral = Math.round(fases.reduce((a, f) => a + f.progresso, 0) / fases.length);

  const ROW_H = 44;
  const BAR_Y_FASE = 8;
  const BAR_H_FASE = 18;
  const BAR_Y_BASE = 30;
  const BAR_H_BASE = 5;

  // ── SVG deps ──────────────────────────────────────────────────────────────
  function depArrows() {
    if (!showDeps) return null;
    return fasesFiltradas.flatMap(fase =>
      fase.deps.map(depId => {
        const dep = fasesFiltradas.find(f => f.id === depId);
        if (!dep) return null;
        const fi = fasesFiltradas.indexOf(dep);
        const ti = fasesFiltradas.indexOf(fase);
        const fx = dateToPx(dep.fim) + zoom.cellPx;
        const fy = fi * ROW_H + BAR_Y_FASE + BAR_H_FASE / 2;
        const tx = dateToPx(fase.inicio);
        const ty = ti * ROW_H + BAR_Y_FASE + BAR_H_FASE / 2;
        const mx = (fx + tx) / 2;
        return (
          <g key={`${depId}-${fase.id}`}>
            <path d={`M${fx},${fy} C${mx},${fy} ${mx},${ty} ${tx},${ty}`}
              fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3"
              opacity="0.55" markerEnd="url(#arr)" />
          </g>
        );
      })
    );
  }

  // ── CRUD helpers ─────────────────────────────────────────────────────────
  const saveFase = (data) => {
    if (data.id) {
      setFases(prev => prev.map(f => f.id === data.id ? { ...f, ...data } : f));
    } else {
      setFases(prev => [...prev, {
        ...data, id: newId(), progresso: 0, status: "nao_iniciado",
        baseInicio: new Date(data.inicio), baseFim: new Date(data.fim),
        deps: [], tarefas: [], cor: "#3b82f6",
      }]);
    }
    setModalFase(null);
  };

  const deleteFase = (id) => { setFases(prev => prev.filter(f => f.id !== id)); setModalFase(null); };

  const saveTarefa = (faseId, tarefa) => {
    setFases(prev => prev.map(f => {
      if (f.id !== faseId) return f;
      const exists = f.tarefas.find(t => t.id === tarefa.id);
      return {
        ...f,
        tarefas: exists
          ? f.tarefas.map(t => t.id === tarefa.id ? tarefa : t)
          : [...f.tarefas, { ...tarefa, id: newId() }],
      };
    }));
    setModalTarefa(null);
  };

  const deleteTarefa = (faseId, tarefaId) => {
    setFases(prev => prev.map(f => f.id === faseId ? { ...f, tarefas: f.tarefas.filter(t => t.id !== tarefaId) } : f));
  };

  const todayX = dateToPx(HOJE);

  // ── Layout ────────────────────────────────────────────────────────────────
  const { theme } = useTheme();
  const resolvedTheme = theme === "system"
    ? (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme;
  const themeVars = THEMES[resolvedTheme] || THEMES.dark;

  const wrap = fullscreen
    ? { ...themeVars, position: "fixed", inset: 0, zIndex: 9999, background: "var(--bg-app)", display: "flex", flexDirection: "column", fontFamily: "'DM Mono','Courier New',monospace" }
    : { ...themeVars, background: "var(--bg-app)", minHeight: "100vh", color: "var(--text-main)", fontFamily: "'DM Mono','Courier New',monospace" };

  const LEFT_W = 230;

  return (
    <div style={wrap}>


      {/* ── TOPBAR ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", background: "var(--bg-top, #0b1120)", borderBottom: "1px solid #1e2d40", flexShrink: 0, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontSize: 9, color: "#3b82f6", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>TIMELINE · GANTT PRO v2</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text-title, #f1f5f9)", letterSpacing: "-0.5px" }}>Mockup</div>
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          {/* Progresso */}
          <div style={{ textAlign: "right", marginRight: 4 }}>
            <div style={{ fontSize: 9, color: "var(--text-dark, #475569)" }}>Progresso geral</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#22c55e" }}>{progressoGeral}%</div>
          </div>

          {/* Alertas badge */}
          <button onClick={() => setShowAlertas(true)} style={{
            padding: "7px 12px", borderRadius: 8, border: `1px solid ${alertas.length ? "#ef444455" : "var(--border-main, #1e2d40)"}`,
            background: alertas.length ? "var(--bg-alert, #2d0a0a)" : "transparent",
            color: alertas.length ? "#ef4444" : "var(--text-dark, #475569)",
            fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
          }}>
            ⚠ {alertas.length} alerta{alertas.length !== 1 ? "s" : ""}
          </button>

          {/* Zoom */}
          <div style={{ display: "flex", gap: 2, background: "var(--bg-modal, #0f1a2e)", borderRadius: 8, padding: 3, border: "1px solid #1e2d40" }}>
            {ZOOM_LEVELS.map((z, i) => (
              <button key={z.label} onClick={() => setZoomIdx(i)} style={{
                padding: "5px 11px", borderRadius: 6, border: "none",
                background: i === zoomIdx ? "#1d4ed8" : "transparent",
                color: i === zoomIdx ? "#fff" : "var(--text-muted, #64748b)",
                fontSize: 11, fontWeight: 700, cursor: "pointer",
              }}>{z.label}</button>
            ))}
          </div>

          {/* Toggles */}
          {[
            { label: "⇢ Deps", val: showDeps, set: setShowDeps, color: "#f59e0b" },
            { label: "◫ Baseline", val: showBase, set: setShowBase, color: "#60a5fa" },
          ].map(t => (
            <button key={t.label} onClick={() => t.set(v => !v)} style={{
              padding: "7px 12px", borderRadius: 8, border: `1px solid ${t.val ? t.color + "55" : "var(--border-main, #1e2d40)"}`,
              background: t.val ? t.color + "11" : "transparent",
              color: t.val ? t.color : "var(--text-dark, #475569)",
              fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}>{t.label}</button>
          ))}

          {/* Nova fase */}
          <button onClick={() => setModalFase("new")} style={{
            padding: "7px 14px", borderRadius: 8, border: "1px solid #1d4ed888",
            background: "#1d4ed822", color: "#60a5fa", fontSize: 11, fontWeight: 700, cursor: "pointer",
          }}>+ Fase</button>

          {/* Fullscreen */}
          <button onClick={() => setFullscreen(v => !v)} style={{
            padding: "7px 12px", borderRadius: 8, border: "1px solid #1e2d40",
            background: "transparent", color: "var(--text-muted, #64748b)", fontSize: 14, cursor: "pointer",
          }}>{fullscreen ? "⊠" : "⛶"}</button>
        </div>
      </div>

      {/* ── FILTROS ── */}
      <div style={{ display: "flex", gap: 10, padding: "10px 20px", background: "var(--bg-top, #0b1120)", borderBottom: "1px solid #1e2d40", flexShrink: 0, alignItems: "center" }}>
        <span style={{ fontSize: 10, color: "var(--text-dark, #475569)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>Filtrar:</span>
        <select value={filterResp} onChange={e => setFilterResp(e.target.value)} style={{ ...inputStyle, width: "auto", padding: "5px 10px", fontSize: 11 }}>
          {resps.map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: "auto", padding: "5px 10px", fontSize: 11 }}>
          {statuses.map(s => <option key={s} value={s}>{s === "Todos" ? "Todos os status" : STATUS_MAP[s]?.label}</option>)}
        </select>
        {(filterResp !== "Todos" || filterStatus !== "Todos") && (
          <button onClick={() => { setFilterResp("Todos"); setFilterStatus("Todos"); }} style={{
            background: "none", border: "none", color: "#ef4444", fontSize: 11, cursor: "pointer", fontWeight: 700,
          }}>✕ Limpar</button>
        )}
        <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text-dark, #475569)" }}>{fasesFiltradas.length} fase{fasesFiltradas.length !== 1 ? "s" : ""} exibida{fasesFiltradas.length !== 1 ? "s" : ""}</span>
      </div>

      {/* ── GANTT BODY ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", margin: "12px 20px 16px" }}>

        {/* Coluna de nomes */}
        <div style={{ width: LEFT_W, flexShrink: 0, background: "var(--bg-top, #0b1120)", border: "1px solid #1e2d40", borderRight: "none", borderRadius: "10px 0 0 10px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ height: 34, borderBottom: "1px solid #1e2d40", flexShrink: 0 }} />
          {fasesFiltradas.map((f, i) => {
            const s = STATUS_MAP[f.status];
            const hasAlert = alertas.some(a => a.faseId === f.id);
            const isExp = expanded[f.id];
            return (
              <div key={f.id}>
                <div style={{
                  height: ROW_H, borderBottom: "1px solid #0f172a", display: "flex",
                  alignItems: "center", padding: "0 10px", gap: 6,
                  background: selected === f.id ? "var(--bg-row-sel, #0f1f35)" : i % 2 === 0 ? "var(--bg-top, #0b1120)" : "var(--bg-row-alt, #0d1528)",
                  cursor: "pointer",
                }} onClick={() => setSelected(f.id === selected ? null : f.id)}>
                  <button onClick={e => { e.stopPropagation(); setExpanded(p => ({ ...p, [f.id]: !p[f.id] })) }}
                    style={{ background: "none", border: "none", color: "var(--text-dark, #475569)", cursor: "pointer", fontSize: 9, padding: "2px 3px", flexShrink: 0 }}>
                    {isExp ? "▼" : "▶"}
                  </button>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: f.cor, flexShrink: 0 }} />
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-main, #e2e8f0)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {hasAlert && <span style={{ color: "#f59e0b", marginRight: 4 }}>⚠</span>}
                      {f.nome}
                    </div>
                    <div style={{ fontSize: 9, color: "var(--text-dark, #475569)" }}>{f.resp} · {f.progresso}%</div>
                  </div>
                  <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                    <button onClick={e => { e.stopPropagation(); setModalFase(f) }} style={{ background: "none", border: "none", color: "var(--text-dark, #475569)", cursor: "pointer", fontSize: 11, padding: "2px" }} title="Editar">✏</button>
                    <button onClick={e => { e.stopPropagation(); setModalTarefa({ faseId: f.id, tarefa: null }) }} style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: 12, padding: "2px" }} title="Nova tarefa">+</button>
                  </div>
                </div>

                {/* Tarefas expandidas */}
                {isExp && f.tarefas.map(t => {
                  const ts = STATUS_MAP[t.status] || STATUS_MAP.nao_iniciado;
                  return (
                    <div key={t.id} style={{
                      height: 32, borderBottom: "1px solid #070d1a", display: "flex",
                      alignItems: "center", padding: "0 10px 0 28px", gap: 6,
                      background: "var(--bg-task, #060c18)",
                    }}>
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ fontSize: 10, color: "var(--text-muted, #94a3b8)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>└ {t.nome}</div>
                      </div>
                      <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 4, background: ts.color + "22", color: ts.color, whiteSpace: "nowrap" }}>{ts.label}</span>
                      <button onClick={() => setModalTarefa({ faseId: f.id, tarefa: t })} style={{ background: "none", border: "none", color: "var(--text-dark, #475569)", cursor: "pointer", fontSize: 10 }}>✏</button>
                      <button onClick={() => deleteTarefa(f.id, t.id)} style={{ background: "none", border: "none", color: "#ef444488", cursor: "pointer", fontSize: 10 }}>✕</button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Área Gantt */}
        <div style={{ flex: 1, overflowX: "auto", overflowY: "auto", border: "1px solid #1e2d40", borderRadius: "0 10px 10px 0", position: "relative" }}>
          <div style={{ width: canvasW, minWidth: "100%", position: "relative" }}>

            {/* Header datas */}
            <div style={{ height: 34, display: "flex", borderBottom: "1px solid #1e2d40", background: "var(--bg-top, #0b1120)", position: "sticky", top: 0, zIndex: 10 }}>
              {headerCells.map((cell, i) => (
                <div key={i} style={{
                  width: zoom.cellPx, flexShrink: 0, borderRight: "1px solid #0f172a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 8, color: "var(--text-dark, #475569)", fontWeight: 700,
                }}>
                  {zoom.fmt(cell)}
                </div>
              ))}
            </div>

            {/* Grid + barras */}
            <div style={{ position: "relative" }}>
              {/* Grade vertical */}
              <div style={{ position: "absolute", inset: 0, display: "flex", pointerEvents: "none" }}>
                {headerCells.map((_, i) => (
                  <div key={i} style={{ width: zoom.cellPx, flexShrink: 0, borderRight: "1px solid #ffffff05", height: fasesFiltradas.reduce((a, f) => a + ROW_H + (expanded[f.id] ? f.tarefas.length * 32 : 0), 0) || 300 }} />
                ))}
              </div>

              {/* Linhas horizontais */}
              {fasesFiltradas.map((f, i) => (
                <div key={f.id}>
                  <div style={{
                    height: ROW_H, borderBottom: "1px solid #0f172a",
                    background: selected === f.id ? "var(--bg-row-sel-tr, #0f1f3533)" : i % 2 === 0 ? "transparent" : "var(--bg-row-alt-tr, #0d152811)",
                  }} />
                  {expanded[f.id] && f.tarefas.map(t => (
                    <div key={t.id} style={{ height: 32, borderBottom: "1px solid #070d1a", background: "var(--bg-task-tr, #060c1888)" }} />
                  ))}
                </div>
              ))}

              {/* SVG dependências */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible" }}>
                <defs>
                  <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" opacity="0.7" />
                  </marker>
                </defs>
                {depArrows()}
              </svg>

              {/* Barras de fase + baseline */}
              {fasesFiltradas.map((fase, i) => {
                const rowTop = fasesFiltradas.slice(0, i).reduce((a, f) => a + ROW_H + (expanded[f.id] ? f.tarefas.length * 32 : 0), 0);
                const x = dateToPx(fase.inicio);
                const w = Math.max(dateToPx(fase.fim) - x + zoom.cellPx, 10);
                const bx = dateToPx(fase.baseInicio);
                const bw = Math.max(dateToPx(fase.baseFim) - bx + zoom.cellPx, 6);
                const progW = w * fase.progresso / 100;
                const isSel = selected === fase.id;
                const atrasado = diffDays(fase.baseFim, fase.fim) > 0 && fase.status !== "concluido";

                return (
                  <div key={fase.id}>
                    {/* Barra principal */}
                    <div style={{ position: "absolute", top: rowTop + BAR_Y_FASE, left: x, width: w, height: BAR_H_FASE }}>
                      <div style={{
                        position: "absolute", inset: 0,
                        background: fase.cor + "22",
                        border: `1.5px solid ${fase.cor}${isSel ? "ff" : "66"}`,
                        borderRadius: 5,
                        boxShadow: isSel ? `0 0 14px ${fase.cor}44` : atrasado ? `0 0 8px #ef444444` : "none",
                      }} />
                      <div style={{ position: "absolute", left: 0, top: 0, width: progW, height: "100%", background: `linear-gradient(90deg,${fase.cor}99,${fase.cor}44)`, borderRadius: 5 }} />
                      {w > 32 && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", paddingLeft: 7, fontSize: 9, fontWeight: 700, color: "#fff", pointerEvents: "none", whiteSpace: "nowrap", overflow: "hidden" }}>
                          {fase.progresso}%
                        </div>
                      )}
                      {/* Handles */}
                      <div onMouseDown={e => onMouseDown(e, fase.id, "left")} style={{ position: "absolute", left: 0, top: 0, width: 7, height: "100%", cursor: "ew-resize", borderRadius: "5px 0 0 5px", background: fase.cor + "88", zIndex: 2 }} />
                      <div onMouseDown={e => onMouseDown(e, fase.id, "move")} onMouseEnter={e => setTooltip({ faseId: fase.id, x: e.clientX, y: e.clientY })} onMouseLeave={() => setTooltip(null)} style={{ position: "absolute", left: 7, right: 7, top: 0, bottom: 0, cursor: "grab", zIndex: 1 }} />
                      <div onMouseDown={e => onMouseDown(e, fase.id, "right")} style={{ position: "absolute", right: 0, top: 0, width: 7, height: "100%", cursor: "ew-resize", borderRadius: "0 5px 5px 0", background: fase.cor + "88", zIndex: 2 }} />
                    </div>

                    {/* Barra baseline */}
                    {showBase && (
                      <div style={{
                        position: "absolute", top: rowTop + BAR_Y_BASE, left: bx, width: bw, height: BAR_H_BASE,
                        background: "transparent", border: "1px dashed #60a5fa66", borderRadius: 3, pointerEvents: "none",
                      }} />
                    )}

                    {/* Tarefas expandidas — mini barras proporcionais */}
                    {expanded[fase.id] && fase.tarefas.map((t, j) => {
                      const tTop = rowTop + ROW_H + j * 32 + 10;
                      const ts = STATUS_MAP[t.status] || STATUS_MAP.nao_iniciado;
                      return (
                        <div key={t.id} style={{
                          position: "absolute", top: tTop, left: x, width: w, height: 12,
                          background: ts.color + "22", border: `1px solid ${ts.color}55`, borderRadius: 3,
                        }}>
                          <div style={{ width: `${t.progresso}%`, height: "100%", background: ts.color + "66", borderRadius: 3 }} />
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {/* Linha Hoje */}
              <div style={{
                position: "absolute", left: todayX, top: 0,
                height: "100%", width: 2,
                background: "linear-gradient(180deg,#f59e0b,#f59e0b33)",
                pointerEvents: "none", zIndex: 20,
              }}>
                <div style={{
                  position: "absolute", top: -17, left: "50%", transform: "translateX(-50%)",
                  fontSize: 8, color: "#f59e0b", fontWeight: 800, whiteSpace: "nowrap",
                  background: "#2d1a00", padding: "2px 6px", borderRadius: 3,
                }}>HOJE</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LEGENDA ── */}
      <div style={{ display: "flex", gap: 14, padding: "8px 20px 14px", borderTop: "1px solid #1e2d40", flexShrink: 0, flexWrap: "wrap", alignItems: "center" }}>
        {Object.entries(STATUS_MAP).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: v.color }} />
            <span style={{ fontSize: 9, color: "var(--text-dark, #475569)" }}>{v.label}</span>
          </div>
        ))}
        {showBase && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 16, height: 4, border: "1px dashed #60a5fa88", borderRadius: 2 }} />
            <span style={{ fontSize: 9, color: "var(--text-dark, #475569)" }}>Baseline</span>
          </div>
        )}
        <span style={{ fontSize: 9, color: "var(--border-main, #1e2d40)", marginLeft: "auto" }}>Arraste barras para mover · bordas para redimensionar</span>
      </div>

      {/* ── TOOLTIP ── */}
      {tooltip && (() => {
        const f = fases.find(x => x.id === tooltip.faseId); if (!f) return null;
        const atrasoDias = diffDays(f.baseFim, f.fim);
        return (
          <div style={{ position: "fixed", left: tooltip.x + 12, top: tooltip.y - 10, background: "var(--bg-modal, #0f1a2e)", border: `1px solid ${f.cor}55`, borderRadius: 8, padding: "8px 12px", pointerEvents: "none", zIndex: 9999 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: f.cor }}>{f.nome}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted, #94a3b8)", marginTop: 2 }}>{fmtFull(f.inicio)} → {fmtFull(f.fim)}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted, #64748b)" }}>{diffDays(f.inicio, f.fim) + 1} dias · {f.progresso}% · {f.resp}</div>
            {showBase && <div style={{ fontSize: 10, color: atrasoDias > 0 ? "#ef4444" : "#22c55e", marginTop: 2 }}>
              {atrasoDias > 0 ? `⚠ +${atrasoDias}d vs baseline` : "✓ Dentro da baseline"}
            </div>}
          </div>
        );
      })()}

      {/* ── MODAL ALERTAS ── */}
      {showAlertas && (
        <Modal title="Alertas do Projeto" onClose={() => setShowAlertas(false)}>
          {alertas.length === 0
            ? <div style={{ fontSize: 13, color: "#22c55e", textAlign: "center", padding: 20 }}>✓ Nenhum alerta detectado</div>
            : alertas.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 8, background: a.cor + "11", border: `1px solid ${a.cor}33`, marginBottom: 8 }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>⚠</span>
                <span style={{ fontSize: 12, color: a.cor, fontWeight: 600 }}>{a.msg}</span>
              </div>
            ))
          }
          <button onClick={() => setShowAlertas(false)} style={{ width: "100%", marginTop: 12, padding: "9px", borderRadius: 8, border: "1px solid #1e2d40", background: "var(--bg-top, #0b1120)", color: "var(--text-muted, #64748b)", cursor: "pointer", fontSize: 12 }}>Fechar</button>
        </Modal>
      )}

      {/* ── MODAL FASE ── */}
      {modalFase && <FaseModal fase={modalFase === "new" ? null : modalFase} fases={fases} onSave={saveFase} onDelete={deleteFase} onClose={() => setModalFase(null)} />}

      {/* ── MODAL TAREFA ── */}
      {modalTarefa && <TarefaModal faseId={modalTarefa.faseId} tarefa={modalTarefa.tarefa} onSave={saveTarefa} onClose={() => setModalTarefa(null)} />}
    </div>
  );
}

// ═══════════════ Modal de Fase ════════════════════════════════════════════════
function FaseModal({ fase, fases, onSave, onDelete, onClose }) {
  const [nome, setNome] = useState(fase?.nome || "");
  const [resp, setResp] = useState(fase?.resp || "");
  const [inicio, setInicio] = useState(fase ? toInputDate(fase.inicio) : "");
  const [fim, setFim] = useState(fase ? toInputDate(fase.fim) : "");
  const [status, setStatus] = useState(fase?.status || "nao_iniciado");
  const [progresso, setProgresso] = useState(fase?.progresso ?? 0);
  const [cor, setCor] = useState(fase?.cor || "#3b82f6");

  function toInputDate(d) { return d.toISOString().split("T")[0]; }
  function fromInput(s) { const [y, m, day] = s.split("-").map(Number); return new Date(y, m - 1, day); }

  const submit = () => {
    if (!nome || !inicio || !fim) return;
    onSave({ ...(fase || {}), nome, resp, inicio: fromInput(inicio), fim: fromInput(fim), status, progresso: Number(progresso), cor });
  };

  return (
    <Modal title={fase ? "Editar Fase" : "Nova Fase"} onClose={onClose}>
      <Field label="Nome da fase"><input value={nome} onChange={e => setNome(e.target.value)} style={inputStyle} placeholder="Ex: Desenvolvimento" /></Field>
      <Field label="Responsável"><input value={resp} onChange={e => setResp(e.target.value)} style={inputStyle} placeholder="Nome do responsável" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Início"><input type="date" value={inicio} onChange={e => setInicio(e.target.value)} style={inputStyle} /></Field>
        <Field label="Fim"><input type="date" value={fim} onChange={e => setFim(e.target.value)} style={inputStyle} /></Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Status">
          <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
            {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </Field>
        <Field label={`Progresso: ${progresso}%`}>
          <input type="range" min="0" max="100" value={progresso} onChange={e => setProgresso(e.target.value)} style={{ width: "100%", accentColor: cor, marginTop: 6 }} />
        </Field>
      </div>
      <Field label="Cor">
        <div style={{ display: "flex", gap: 8 }}>
          {["#22c55e", "#3b82f6", "#f59e0b", "#a855f7", "#ef4444", "#06b6d4"].map(c => (
            <div key={c} onClick={() => setCor(c)} style={{ width: 22, height: 22, borderRadius: "50%", background: c, cursor: "pointer", border: `2px solid ${cor === c ? "#fff" : "transparent"}` }} />
          ))}
          <input type="color" value={cor} onChange={e => setCor(e.target.value)} style={{ width: 22, height: 22, border: "none", background: "none", cursor: "pointer" }} />
        </div>
      </Field>
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button onClick={submit} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", background: "#1d4ed8", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
          {fase ? "Salvar" : "Criar Fase"}
        </button>
        {fase && <button onClick={() => onDelete(fase.id)} style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid #ef444455", background: "var(--bg-alert, #2d0a0a)", color: "#ef4444", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>Excluir</button>}
        <button onClick={onClose} style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid #1e2d40", background: "transparent", color: "var(--text-muted, #64748b)", cursor: "pointer", fontSize: 12 }}>Cancelar</button>
      </div>
    </Modal>
  );
}

// ═══════════════ Modal de Tarefa ══════════════════════════════════════════════
function TarefaModal({ faseId, tarefa, onSave, onClose }) {
  const [nome, setNome] = useState(tarefa?.nome || "");
  const [status, setStatus] = useState(tarefa?.status || "nao_iniciado");
  const [progresso, setProgresso] = useState(tarefa?.progresso ?? 0);

  const submit = () => {
    if (!nome) return;
    onSave(faseId, { ...(tarefa || {}), nome, status, progresso: Number(progresso) });
  };

  return (
    <Modal title={tarefa ? "Editar Tarefa" : "Nova Tarefa"} onClose={onClose}>
      <Field label="Nome da tarefa"><input value={nome} onChange={e => setNome(e.target.value)} style={inputStyle} placeholder="Ex: Configurar ambiente" /></Field>
      <Field label="Status">
        <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
          {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </Field>
      <Field label={`Progresso: ${progresso}%`}>
        <input type="range" min="0" max="100" value={progresso} onChange={e => setProgresso(e.target.value)} style={{ width: "100%", accentColor: "#3b82f6", marginTop: 6 }} />
      </Field>
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button onClick={submit} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", background: "#1d4ed8", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
          {tarefa ? "Salvar" : "Criar Tarefa"}
        </button>
        <button onClick={onClose} style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid #1e2d40", background: "transparent", color: "var(--text-muted, #64748b)", cursor: "pointer", fontSize: 12 }}>Cancelar</button>
      </div>
    </Modal>
  );
}
