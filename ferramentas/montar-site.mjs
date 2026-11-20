// Monta a pasta docs/ que o GitHub Pages publica.
// As páginas do projeto são escritas sem <!doctype>/<head> (o Artifact do Claude
// completa isso sozinho). Aqui cada página ganha o documento completo.
// Rodar a partir da raiz do repo:  node ferramentas/montar-site.mjs
import { readFile, writeFile, mkdir, rm, cp } from "node:fs/promises";

const DOCS = "docs";
await rm(DOCS, { recursive: true, force: true });
await mkdir(DOCS + "/versoes", { recursive: true });

const reset = `<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>`;
function documento(conteudo, raiz) {
  let c = conteudo.replace(/<meta name="viewport"[^>]*>\s*/g, "");
  if (raiz) {
    c = c.replace(/(src|href)="(config\.js|nucleo\.js|dados\/|assets\/)/g, `$1="${raiz}$2`);
    c = c.replace('<script src="' + raiz + 'config.js">', `<script>window.RAIZ = "${raiz}";</script>\n<script src="${raiz}config.js">`);
  }
  return `<!doctype html>\n<html lang="pt-BR">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n${reset}\n${c}\n</html>\n`;
}

// v3 na página inicial
await writeFile(`${DOCS}/index.html`, documento(await readFile("corrida.html", "utf8"), ""));
// tela do agente (v7): aberta pelo botão da entrada ou ao tocar num produto
await writeFile(`${DOCS}/agente.html`, documento(await readFile("agente.html", "utf8"), ""));
// v2 guardadas em /versoes/
for (const nome of ["podio", "placar", "feed"]) {
  const html = await readFile(`${nome}.html`, "utf8");
  await writeFile(`${DOCS}/versoes/${nome}.html`, documento(html.replace("</title>", "</title>\n<link rel=\"icon\" type=\"image/svg+xml\" href=\"assets/marca/favicon.svg\">"), "../"));
}
await writeFile(`${DOCS}/versoes/index.html`, `<!doctype html>
<html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>AchaAI · versões anteriores</title><link rel="icon" type="image/svg+xml" href="../assets/marca/favicon.svg">
<style>body{margin:0;min-height:100vh;display:grid;place-content:center;gap:14px;background:#07070a;color:#f3f1ec;font:16px/1.5 system-ui,sans-serif;padding:24px}a{display:block;padding:16px 20px;border:1px solid rgba(255,255,255,.12);border-radius:14px;color:inherit;text-decoration:none;max-width:460px}a:hover{border-color:#ff5b1f}b{display:block}span{color:#8d8b95;font-size:14px}</style>
<h1 style="margin:0">Versões anteriores do AchaAI</h1>
<p style="margin:0;color:#8d8b95">Preços de demonstração · projeto de estudo.</p>
<a href="../"><b>v3 · A Corrida do Preço (atual)</b><span>A versão escolhida.</span></a>
<a href="podio.html"><b>v2 · Pódio</b><span>Foto grande com brilho e pódio das 3 lojas.</span></a>
<a href="placar.html"><b>v2 · Placar ao vivo</b><span>Quadro de aeroporto com letreiro que vira.</span></a>
<a href="feed.html"><b>v2 · Feed visual</b><span>Mural de fotos e barras empilhadas.</span></a>
</html>
`);
// arquivos comuns
for (const f of ["config.js", "nucleo.js"]) await cp(f, `${DOCS}/${f}`);
await cp("dados", `${DOCS}/dados`, { recursive: true });
await cp("assets", `${DOCS}/assets`, { recursive: true });
await writeFile(`${DOCS}/.nojekyll`, "");
console.log("docs/ pronto");
