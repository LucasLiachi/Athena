---
step: gather_assets
agent: asset_gatherer
execution: inline
label: Coletar ativos
---

**Objetivo**: Baixar e organizar todos os recursos de mídia necessários (vídeos, imagens, arquivos) para o projeto.

**Entradas**: Uma lista de fontes (URLs ou IDs) fornecida pelo usuário ou por configuração padrão.

**Saídas**:
- `assets/assetsManifest.json` – JSON contendo os caminhos localizados de cada recurso baixado.
- Arquivos de mídia organizados em `assets/videos/` e `assets/images/`.

**Instruções**:
1. Percorra a lista `sources`.
2. Para URLs de vídeo, faça download usando `ffmpeg` ou a API apropriada e salve em `assets/videos/`.
3. Para URLs de imagem, faça download e salve em `assets/images/`.
4. Gere `assets/assetsManifest.json` no formato:
   ```json
   {
     "videos": ["assets/videos/video1.mp4", ...],
     "images": ["assets/images/img1.png", ...]
   }
   ```
5. Confirme a conclusão e retorne o caminho do manifest.

> **Checkpoint**: Revise o `assetsManifest.json` e confirme se todos os arquivos necessários foram baixados.
