# Create Flow Scenes Step

---
step: create_flow_scenes
agent: google_flow_connector
execution: inline
label: Criar cenas no Google Flow
---

**Objetivo**: Enviar ao Google Flow a configuração das cenas a serem criadas no projeto especificado.

**Entradas**:
- `google_flow_config.json` (contém `apiKey` e `projectId`).
- `sceneConfig.json` – JSON com a definição das cenas (texto, imagens, timing, transições).

**Saídas**:
- `assets/flow/flowManifest.json` – descrição das cenas criadas e seus IDs.

**Instruções**:
1. Leia `google_flow_config.json` para obter a API key e o `projectId`.
2. Leia `sceneConfig.json` que o usuário fornecerá (verifique se o arquivo existe, caso contrário apresente um checkpoint solicitando o JSON).
3. Realize a chamada HTTP POST para a endpoint do Google Flow:
   ```http
   POST https://flow.googleapis.com/v1/projects/{projectId}/scenes
   Authorization: Bearer {apiKey}
   Content-Type: application/json
   ```
   Corpo: o conteúdo de `sceneConfig.json`.
4. Salve a resposta (JSON) em `assets/flow/flowManifest.json`.
5. Retorne o caminho do manifest.

> **Checkpoint**: Se `sceneConfig.json` não existir, peça ao usuário que forneça o JSON de configuração das cenas.
