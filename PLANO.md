# Plano do futuro: ligar o AchaAI nos preços reais

Hoje o protótipo usa **preços inventados** (arquivo `dados/ofertas-exemplo.js`).
As telas já esperam os dados no formato que as lojas entregam, então trocar
para preços reais é trocar só esse arquivo por um "buscador de preços".

## O caminho certo: programas de afiliados

Lojas grandes têm um jeito oficial de mostrar seus preços em outros sites:
o **programa de afiliados**. Você se cadastra, recebe uma chave de acesso
(como uma senha para pedir preços) e um link especial. Se alguém comprar
pelo seu link, você ganha uma pequena comissão. É assim que Buscapé, Zoom
e Google Shopping funcionam.

| Loja | Programa | O que costuma exigir |
|---|---|---|
| Amazon | Amazon Associados + PA-API (API de produtos) | Site no ar, CPF/CNPJ, e **vender algumas vezes nos primeiros meses** para liberar a API |
| Mercado Livre | API pública + Programa de Afiliados | Criar um "aplicativo" no portal de desenvolvedores; a busca de preços é aberta |
| Shopee | Shopee Afiliados (Open API) | Cadastro de afiliado aprovado; acesso à API é liberado depois |
| AliExpress | AliExpress Affiliate API (Portals) | Cadastro no AliExpress Portals; libera busca de produtos e links |
| Shein | Programa de afiliados | Normalmente só links e banners, sem API de preços aberta |
| Temu | Programa de afiliados | Links e códigos; API de preços não é pública |
| Magalu, Casas Bahia, Americanas, Kabum | Afiliados via redes (Awin, Lomadee, Rakuten, Afilio) | Cadastro na rede; muitas entregam um **feed** (lista de produtos e preços atualizada todo dia) |

Os nomes e regras dos programas mudam com frequência; confira cada um no dia
de se cadastrar.

## O que é proibido (ou arriscado)

- **Raspar o site** (um programa que entra na página da loja e copia o preço)
  quando os termos de uso proíbem. A maioria das lojas proíbe. Pode dar
  bloqueio, perda da conta de afiliado e até problema jurídico.
- **Usar logo e marca das lojas** como se fosse parceira oficial. O protótipo
  usa só o nome em texto e uma sigla neutra.
- **Mostrar preço velho como atual.** Sempre exibir "atualizado em".
- **Guardar dados de quem visita** sem aviso (LGPD). Alerta por e-mail exige
  consentimento claro.

## Impostos de importados

As regras ficam num lugar só: `config.js`. Em 18/11/2026:

- Até US$ 50 em loja do Remessa Conforme: **0%** de imposto federal (desde
  12/05/2026, MP 1.357/2026 + Portaria MF 1.342/2026). Continua o ICMS.
- Acima de US$ 50: o protótipo usa **60% menos US$ 20**. As fontes divergem
  (há quem fale em 30% ou em desconto de US$ 30) e a MP ainda estava em votação
  no Congresso. Conferir o texto final antes de ligar em preços reais.
- ICMS: 17% na maioria dos estados (alguns 20%), cobrado "por dentro".

## Etapas sugeridas

1. **Publicar o site** (GitHub Pages ou Vercel, de graça) — vários programas
   pedem um site no ar para aprovar o cadastro.
2. **Começar pelo Mercado Livre**, que tem a API mais aberta: trocar os
   preços inventados por preços reais de uma loja só.
3. **Cadastrar nos afiliados** de AliExpress, Shopee e Amazon, um de cada vez.
4. **Um "robô de preços" que roda 1 vez por dia** (servidor pequeno ou
   tarefa agendada) e guarda o preço de cada loja. Isso é o que forma o
   **histórico** de verdade, que hoje é inventado.
5. **Juntar o mesmo produto em lojas diferentes** (a parte mais difícil:
   cada loja escreve o nome de um jeito). Começar com uma lista pequena de
   produtos escolhidos à mão.
6. **Alertas por e-mail ou celular**, com login e consentimento (hoje o alerta
   fica só no navegador e aparece na tela).
7. **Selos com regra clara** ("menor em 90 dias") sempre explicando de onde
   vem o número.
