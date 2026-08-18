---
step: edit_images
agent: image_editor
execution: inline
label: Editar imagens
---

**Objetivo**: Aplicar correções de cor e cortes nas imagens coletadas.

**Entradas**: `assets/assetsManifest.json`

**Saídas**:
- Imagens otimizadas em `output/images/`

**Instruções**:
1. Leia `assets/assetsManifest.json`.
2. Para cada imagem, aplique as correções necessárias.
3. Salve na pasta `output/images/`.
4. Retorne a mensagem de sucesso.

> **Checkpoint**: Revise as imagens tratadas.
