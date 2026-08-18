---
step: edit_video
agent: video_editor
execution: inline
label: Editar vídeo
---

**Objetivo**: Aplicar cortes, transições, legendas e exportar o vídeo final.

**Entradas**: `assets/assetsManifest.json` (gerado na etapa anterior) e `editInstructions` fornecidas pelo usuário.

**Saídas**:
- `output/video/final.mp4` – vídeo editado pronto para revisão.

**Instruções**:
1. Leia `assets/assetsManifest.json` e obtenha a lista de vídeos.
2. Use as instruções em `editInstructions` (ex.: cortes, duração, textos) para montar o comando `ffmpeg` adequado.
3. Execute o comando, salvando o resultado em `output/video/final.mp4`.
4. Verifique se o arquivo foi criado (`test -s`).
5. Retorne o caminho do vídeo final.

> **Checkpoint**: Visualizar o vídeo gerado e confirmar se atende ao briefing.
