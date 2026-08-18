const fs = require('fs');
let txt = fs.readFileSync('src/components/project/GanttChart.tsx', 'utf8');

// 1. imports
txt = txt.replace('import { useState, useRef, useCallback, useEffect } from "react";',
\`import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";\`);

// 2. Add useTheme inside component
txt = txt.replace('  const [zoomIdx, setZoomIdx] = useState(2);',
\`  const [zoomIdx, setZoomIdx] = useState(2);
  const { theme } = useTheme();\`);

// 3. Update the wrap style
const oldWrap = \`// ── Layout ────────────────────────────────────────────────────────────────
  const wrap = fullscreen
    ? { position: "fixed", inset: 0, zIndex: 9999, background: "var(--bg-app, #070d1a)", display: "flex", flexDirection: "column", fontFamily: "'DM Mono','Courier New',monospace" }
    : { background: "var(--bg-app, #070d1a)", minHeight: "100vh", color: "var(--text-main, #e2e8f0)", fontFamily: "'DM Mono','Courier New',monospace" };\`;

const newWrap = \`// ── Layout ────────────────────────────────────────────────────────────────
  const activeTheme = theme === "dark" || theme === "light" ? theme : "dark";
  const wrap = fullscreen
    ? { ...(THEMES[activeTheme] as any), position: "fixed", inset: 0, zIndex: 9999, background: "var(--bg-app, #070d1a)", display: "flex", flexDirection: "column", fontFamily: "'DM Mono','Courier New',monospace" }
    : { ...(THEMES[activeTheme] as any), background: "var(--bg-app, #070d1a)", minHeight: "100vh", color: "var(--text-main, #e2e8f0)", fontFamily: "'DM Mono','Courier New',monospace" };\`;

txt = txt.replace(oldWrap, newWrap);

// 4. Also remove the old theme toggle button in GanttChart top bar since it's global now
// Look for "{/* Tema */}" if it's there
txt = txt.replace(\`{/* Tema */}
          <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")} style={{
            padding: "7px 12px", borderRadius: 8, border: "1px solid var(--border-main, #1e2d40)",
            background: "transparent", color: "var(--text-muted, #64748b)", fontSize: 14, cursor: "pointer",
          }}>{theme === "dark" ? "☀️" : "🌙"}</button>\`, '');

fs.writeFileSync('src/components/project/GanttChart.tsx', txt);
console.log('patched3');
