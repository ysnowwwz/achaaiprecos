// =============================================================
// CONFIGURAÇÃO — tudo que pode mudar sem mexer nas telas
// =============================================================
// Para trocar o nome do site, a cotação do dólar ou as regras de
// imposto, basta mudar os números aqui embaixo.

window.CONFIG = {
  // Nome provisório. Troque aqui e ele muda no site inteiro.
  nomeDoSite: "AchaAI",

  // Cotação usada para converter o preço em reais para dólar,
  // porque as faixas do imposto de importação são em dólar.
  cotacaoDolar: 5.40,

  // Regras de imposto para compras internacionais (pessoa física).
  // Conferidas em 18/11/2026.
  impostos: {
    vigenteDesde: "12/05/2026",
    fonte: "MP 1.357/2026 + Portaria MF 1.342/2026 (programa Remessa Conforme)",

    // Faixa 1: até US$ 50 (produto + frete) em loja do Remessa Conforme.
    limiteFaixa1USD: 50,
    aliquotaFaixa1: 0.0, // imposto federal zerado desde 12/05/2026

    // Faixa 2: de US$ 50,01 até US$ 3.000.
    // ATENÇÃO: as fontes divergem (algumas falam em 30%, outras em 60%
    // com desconto de US$ 30). Usamos a regra mais conservadora
    // (60% menos US$ 20) até sair o texto final da MP.
    aliquotaFaixa2: 0.60,
    deducaoFaixa2USD: 20,
    limiteMaximoUSD: 3000,

    // Loja que NÃO participa do Remessa Conforme: 60% sem desconto.
    aliquotaForaDoPrograma: 0.60,

    // ICMS estadual, cobrado "por dentro" (o imposto entra na própria base).
    // 17% na maioria dos estados; alguns cobram 20%.
    icms: 0.17
  }
};
