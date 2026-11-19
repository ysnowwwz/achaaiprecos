# Comparador (nome provisório)

Protótipo de site que compara o preço do mesmo eletrônico em várias lojas
(Amazon, Mercado Livre, Shopee, AliExpress, Shein, Temu, Magalu, Casas Bahia,
Americanas, Kabum) e ordena pelo **preço final na sua casa**: produto + frete +
imposto de importação + ICMS, com a conta aberta.

Projeto de estudo e portfólio. **Todos os preços são de demonstração.**

## O que tem

- Busca com sugestões e filtro por categoria
- Página do produto: tabela de lojas pelo preço final, conta dos impostos,
  aviso quando a vitrine engana, prazo de entrega, botão para a loja
- Histórico de 6 meses por loja, com selo "menor preço em 90 dias" ou
  "agora está caro, espere"
- Alertas de queda de preço (guardados no navegador, com botão de simular queda)

## Arquivos

- `index.html` — visual (cores, fontes, layout)
- `app.js` — as telas e a conta do preço final
- `config.js` — nome do site, cotação do dólar e regras de imposto (mude aqui)
- `dados/ofertas-exemplo.js` — produtos e preços inventados, no formato das lojas
- `PLANO.md` — como ligar em preços reais

Para abrir: dois cliques no `index.html`.
