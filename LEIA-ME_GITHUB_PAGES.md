# A Bíblia Cronológica em 365 Dias (12 Fases) — Kit Completo PWA para GitHub Pages

Este pacote contém todos os arquivos necessários para que o GitHub Pages permita a **instalação nativa como Aplicativo (PWA / WebAPK)** com **ícone próprio na tela inicial** e **funcionamento 100% offline**.

## Por que o arquivo `.html` isolado criava apenas um atalho do navegador?
Por segurança, os navegadores modernos (Chrome, Edge, Samsung Internet e Safari) bloqueiam Service Workers carregados via `blob:`/`data:` e exigem que:
1. Exista um arquivo físico **`sw.js`** na mesma pasta HTTPS para salvar o aplicativo em cache e abrir sem internet;
2. Exista um arquivo **`manifest.json`** físico apontando para ícones PNG reais (**`192x192`** e **`512x512`**, incluindo versões `maskable` para Android);
3. O arquivo principal responda na raiz **`index.html`** (incluímos também `Biblia_Cronologica_365_Dias_PWA.html` na mesma pasta para que qualquer link antigo continue funcionando).

## Duas Formas de Publicar no GitHub Pages

### Opção 1 — Subir os arquivos deste `.zip` (Recomendado, funciona com qualquer workflow `static`)
1. Extraia os arquivos deste `.zip` na raiz do seu repositório no GitHub:
   - `index.html` (e `Biblia_Cronologica_365_Dias_PWA.html`)
   - `manifest.json`
   - `sw.js`
   - `icon-192.png`, `icon-512.png`, `icon-maskable-192.png`, `icon-maskable-512.png`, `apple-touch-icon.png`, `favicon.png`
   - `.nojekyll`
2. Faça o *commit* e *push*.

### Opção 2 — Manter apenas o `.html` único no repositório + `static.yml` automático
Se você preferir deixar apenas o arquivo `.html` no seu repositório, basta substituir o conteúdo de `.github/workflows/static.yml` pelo arquivo `.github/workflows/static.yml` incluído neste pacote: durante o deploy no GitHub Actions, ele extrai automaticamente o `manifest.json`, o `sw.js`, o `index.html` e todos os ícones `.png` de dentro do próprio HTML!
