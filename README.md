# Comparador (nome provisório)

Protótipo de site que compara o preço do mesmo eletrônico em várias lojas
(Amazon, Mercado Livre, Shopee, AliExpress, Shein, Temu, Magalu, Casas Bahia,
Americanas, Kabum) e ordena pelo **preço final na sua casa**: produto + frete +
imposto de importação + ICMS, com a conta aberta.

Projeto de estudo e portfólio. Os 14 produtos são reais (AirPods, iPhone 15,
Galaxy S24 Ultra, JBL, Kindle...), mas **todos os preços são de demonstração**.

## Três layouts (versão 2)

- `podio.html` — **A · Pódio**: página de lançamento, foto enorme com o brilho
  da cor do produto e as 3 lojas mais baratas num pódio.
- `placar.html` — **B · Placar ao vivo**: quadro de aeroporto/bolsa, preço em
  letreiro que vira, setas de subiu/caiu e gráfico de velas com o melhor momento.
- `feed.html` — **C · Feed visual**: mural de fotos; tocar abre barras empilhadas
  (produto + frete + imposto + ICMS) que mostram a vitrine enganando.

Os três têm a conta aberta do preço final, o selo dos 90 dias e o
"me avise quando baixar" (alertas guardados no navegador, com "simular queda").

## Arquivos

- `config.js` — nome do site, cotação do dólar e regras de imposto (mude aqui)
- `nucleo.js` — a lógica comum: preço final, selos, histórico, alertas, busca
- `dados/ofertas-exemplo.js` — produtos e preços de demonstração, no formato das lojas
- `assets/fotos/` — fotos dos produtos (Wikimedia Commons, ver `CREDITOS.md`)
- `PLANO.md` — como ligar em preços reais

Para abrir: dois cliques no `index.html` e escolha o layout.
