<p align="center"><img src="assets/marca/logo.svg" alt="AchaAI" width="360"></p>

# AchaAI

**Site no ar:** https://ysnowwwz.github.io/achaaiprecos/

> **Preços de demonstração · projeto de estudo.** Os produtos são reais, mas os
> preços são inventados. Nenhuma loja foi consultada, e o AchaAI não tem ligação
> com as lojas ou marcas citadas. Os botões só abrem a busca do produto no site
> da loja, sem link de afiliado.

O AchaAI compara o preço do mesmo eletrônico em várias lojas (Amazon, Mercado
Livre, Shopee, AliExpress, Shein, Temu, Magalu, Casas Bahia, Americanas, Kabum)
e ordena pelo **preço final na sua casa**: produto + frete + imposto de
importação + ICMS, com a conta aberta. Projeto de estudo e portfólio.

![A corrida do preço](midia/corrida.gif)

## A Corrida do Preço (versão atual, `corrida.html`)

Os produtos recortados flutuam em profundidade e se reorganizam enquanto você
digita. Ao abrir um produto, as lojas largam pelo preço da vitrine, e o frete,
o imposto e o ICMS vão pesando ao vivo até o pódio 3D com confete. Tem também:
- raio-X do preço, com uma lente que você arrasta;
- foto que inclina com o mouse;
- linha do tempo com um preço-alvo que você arrasta;
- comparação arrastando um produto sobre o outro;
- cursor sutil e som opcional (começa desligado).

Usa GSAP pelo cdnjs e respeita a opção de reduzir movimento.

## Versões anteriores (`/versoes/` no site)

- `podio.html` — **Pódio**: foto enorme com brilho e as 3 lojas mais baratas num pódio.
- `placar.html` — **Placar ao vivo**: quadro de aeroporto, letreiro que vira, gráfico de velas.
- `feed.html` — **Feed visual**: mural de fotos e barras empilhadas de produto, frete e imposto.

## Arquivos

- `config.js` — nome do site, cotação do dólar e regras de imposto (mude aqui)
- `nucleo.js` — a lógica comum: preço final, selos, histórico, alertas, busca
- `dados/ofertas-exemplo.js` — produtos e preços de demonstração, no formato das lojas
- `assets/` — fotos, recortes sem fundo e a marca (créditos em `CREDITOS.md`)
- `PLANO.md` — como ligar em preços reais
- `ferramentas/montar-site.mjs` — gera a pasta `docs/`, que é o que o GitHub Pages publica

Para atualizar o site: mude os arquivos da raiz, rode `node ferramentas/montar-site.mjs`
e envie (`git push`). Para ver localmente: dois cliques no `index.html`.
