// =============================================================
// DADOS DE DEMONSTRAÇÃO (preços inventados, mas realistas)
// =============================================================
// Este arquivo imita o formato que viria das lojas de verdade
// (APIs de afiliados). Quando ligarmos nos preços reais, só este
// arquivo é trocado; as telas continuam iguais. Ver PLANO.md.
//
// Formato de uma oferta:
//   produtoId     qual produto
//   loja          id da loja (lista "lojas" abaixo)
//   preco         preço de vitrine em reais (o que aparece no anúncio)
//   frete         frete em reais (0 = grátis)
//   prazoDias     prazo de entrega estimado
//   internacional true = vem de fora do Brasil (paga imposto de importação)
//   remessaConforme true = a loja participa do programa da Receita
//   atualizadoEm  quando o preço foi lido

window.DADOS = (function () {
  const lojas = [
    { id: "amazon",      nome: "Amazon",          sigla: "AM", busca: "https://www.amazon.com.br/s?k={q}" },
    { id: "mercadolivre",nome: "Mercado Livre",   sigla: "ML", busca: "https://lista.mercadolivre.com.br/{q}" },
    { id: "shopee",      nome: "Shopee",          sigla: "SP", busca: "https://shopee.com.br/search?keyword={q}" },
    { id: "aliexpress",  nome: "AliExpress",      sigla: "AE", busca: "https://pt.aliexpress.com/w/wholesale-{q}.html" },
    { id: "shein",       nome: "Shein",           sigla: "SH", busca: "https://br.shein.com/pdsearch/{q}/" },
    { id: "temu",        nome: "Temu",            sigla: "TM", busca: "https://www.temu.com/search_result.html?search_key={q}" },
    { id: "magalu",      nome: "Magalu",          sigla: "MG", busca: "https://www.magazineluiza.com.br/busca/{q}/" },
    { id: "casasbahia",  nome: "Casas Bahia",     sigla: "CB", busca: "https://www.casasbahia.com.br/{q}/b" },
    { id: "americanas",  nome: "Americanas",      sigla: "AC", busca: "https://www.americanas.com.br/busca/{q}" },
    { id: "kabum",       nome: "Kabum",           sigla: "KB", busca: "https://www.kabum.com.br/busca/{q}" }
  ];

  // perfilHistorico só existe na demonstração: diz como inventar o
  // gráfico dos últimos 6 meses ("baixa" = agora é o menor preço,
  // "alta" = agora está caro, "normal" = no meio do caminho).
  const produtos = [
    { id: "fone-pulse-t3",   nome: "Fone Bluetooth Pulse Buds T3",   marca: "Vexo",   categoria: "Fones",        sigla: "FON", termoBusca: "fone bluetooth tws",          specs: ["Bluetooth 5.3", "Bateria 30 h com estojo", "Resistente a suor"], perfilHistorico: "baixa" },
    { id: "fone-aurora-max", nome: "Fone Over-ear ANC Aurora Max",   marca: "Sonell", categoria: "Fones",        sigla: "FON", termoBusca: "fone over-ear cancelamento de ruído", specs: ["Cancelamento de ruído ativo", "Bateria 40 h", "Dobrável"], perfilHistorico: "alta" },
    { id: "celular-nova-12", nome: "Smartphone Nova 12 128 GB",      marca: "Lumo",   categoria: "Celulares",    sigla: "CEL", termoBusca: "smartphone 128gb",            specs: ["Tela 6,6\" 120 Hz", "128 GB / 8 GB RAM", "Câmera 50 MP"], perfilHistorico: "normal" },
    { id: "carregador-gan65",nome: "Carregador GaN 65 W 3 portas",   marca: "Voltix", categoria: "Carregadores", sigla: "CAR", termoBusca: "carregador gan 65w",          specs: ["2 USB-C + 1 USB-A", "Carga rápida PD 3.0", "Plugue dobrável"], perfilHistorico: "baixa" },
    { id: "powerbank-20k",   nome: "Power Bank 20.000 mAh 22,5 W",   marca: "Voltix", categoria: "Carregadores", sigla: "PWB", termoBusca: "power bank 20000mah",         specs: ["20.000 mAh", "Saída 22,5 W", "Visor de carga"], perfilHistorico: "normal" },
    { id: "watch-fit-s3",    nome: "Smartwatch Fit S3",              marca: "Lumo",   categoria: "Smartwatches", sigla: "WCH", termoBusca: "smartwatch",                  specs: ["Tela AMOLED 1,8\"", "GPS integrado", "Bateria 10 dias"], perfilHistorico: "baixa" },
    { id: "caixa-boom-mini", nome: "Caixa de Som Bluetooth Boom Mini",marca: "Sonell",categoria: "Caixas de som",sigla: "SOM", termoBusca: "caixa de som bluetooth",      specs: ["20 W RMS", "À prova d'água IPX7", "Bateria 12 h"], perfilHistorico: "alta" },
    { id: "mouse-orbit-m2",  nome: "Mouse sem Fio Orbit M2",         marca: "Keyra",  categoria: "Mouse e teclado", sigla: "MOU", termoBusca: "mouse sem fio",            specs: ["Bluetooth + receptor USB", "Silencioso", "Até 4.000 DPI"], perfilHistorico: "normal" },
    { id: "teclado-k68",     nome: "Teclado Mecânico K68 Compacto",  marca: "Keyra",  categoria: "Mouse e teclado", sigla: "TEC", termoBusca: "teclado mecânico 65%",     specs: ["Layout 65% ABNT2", "Switch trocável", "Luz RGB"], perfilHistorico: "baixa" },
    { id: "cabo-usbc-2m",    nome: "Cabo USB-C 2 m 100 W",           marca: "Voltix", categoria: "Carregadores", sigla: "CAB", termoBusca: "cabo usb-c 100w",             specs: ["2 metros", "Até 100 W", "Trançado em nylon"], perfilHistorico: "normal" },
    { id: "webcam-vista-c2", nome: "Webcam Full HD Vista C2",        marca: "Lumo",   categoria: "Acessórios",   sigla: "CAM", termoBusca: "webcam full hd",              specs: ["1080p 30 fps", "Microfone duplo", "Tampa de privacidade"], perfilHistorico: "alta" },
    { id: "hub-usbc-7em1",   nome: "Hub USB-C 7 em 1",               marca: "Keyra",  categoria: "Acessórios",   sigla: "HUB", termoBusca: "hub usb-c 7 em 1",            specs: ["HDMI 4K", "3 USB-A + leitor SD", "Carga 100 W"], perfilHistorico: "normal" }
  ];

  const hoje = "2026-11-18";
  const o = (produtoId, loja, preco, frete, prazoDias, internacional, remessaConforme) =>
    ({ produtoId, loja, preco, frete, prazoDias, internacional, remessaConforme, atualizadoEm: hoje });

  const ofertas = [
    o("fone-pulse-t3", "amazon", 189.90, 0, 2, false, false),
    o("fone-pulse-t3", "mercadolivre", 179.00, 0, 3, false, false),
    o("fone-pulse-t3", "magalu", 199.90, 12.90, 5, false, false),
    o("fone-pulse-t3", "shopee", 164.90, 9.90, 7, false, false),
    o("fone-pulse-t3", "aliexpress", 98.00, 14.00, 15, true, true),
    o("fone-pulse-t3", "temu", 89.90, 0, 12, true, true),

    o("fone-aurora-max", "amazon", 899.00, 0, 2, false, false),
    o("fone-aurora-max", "mercadolivre", 869.00, 0, 3, false, false),
    o("fone-aurora-max", "kabum", 849.90, 0, 4, false, false),
    o("fone-aurora-max", "casasbahia", 929.00, 0, 6, false, false),
    o("fone-aurora-max", "americanas", 919.00, 19.90, 6, false, false),
    o("fone-aurora-max", "aliexpress", 529.00, 0, 18, true, true),

    o("celular-nova-12", "amazon", 1599.00, 0, 2, false, false),
    o("celular-nova-12", "mercadolivre", 1549.00, 0, 3, false, false),
    o("celular-nova-12", "magalu", 1499.00, 0, 4, false, false),
    o("celular-nova-12", "casasbahia", 1529.00, 0, 5, false, false),
    o("celular-nova-12", "americanas", 1579.00, 0, 6, false, false),
    o("celular-nova-12", "kabum", 1619.00, 0, 4, false, false),
    o("celular-nova-12", "aliexpress", 1099.00, 39.00, 20, true, true),

    o("carregador-gan65", "amazon", 219.90, 0, 2, false, false),
    o("carregador-gan65", "mercadolivre", 199.90, 0, 3, false, false),
    o("carregador-gan65", "kabum", 189.90, 15.00, 4, false, false),
    o("carregador-gan65", "shopee", 149.90, 0, 6, false, false),
    o("carregador-gan65", "aliexpress", 89.90, 0, 14, true, true),
    o("carregador-gan65", "temu", 79.00, 0, 11, true, true),
    o("carregador-gan65", "shein", 94.90, 0, 10, true, true),

    o("powerbank-20k", "amazon", 159.90, 0, 2, false, false),
    o("powerbank-20k", "mercadolivre", 149.00, 0, 2, false, false),
    o("powerbank-20k", "magalu", 169.90, 0, 5, false, false),
    o("powerbank-20k", "americanas", 174.90, 9.90, 6, false, false),
    o("powerbank-20k", "shopee", 119.90, 12.00, 8, false, false),
    o("powerbank-20k", "aliexpress", 72.00, 18.00, 16, true, true),
    o("powerbank-20k", "temu", 69.90, 0, 12, true, true),

    o("watch-fit-s3", "amazon", 449.00, 0, 2, false, false),
    o("watch-fit-s3", "mercadolivre", 429.00, 0, 3, false, false),
    o("watch-fit-s3", "magalu", 469.00, 0, 5, false, false),
    o("watch-fit-s3", "casasbahia", 479.00, 0, 6, false, false),
    o("watch-fit-s3", "kabum", 439.00, 14.90, 4, false, false),
    o("watch-fit-s3", "aliexpress", 239.00, 0, 15, true, true),
    o("watch-fit-s3", "shein", 259.00, 0, 11, true, true),

    o("caixa-boom-mini", "amazon", 279.00, 0, 2, false, false),
    o("caixa-boom-mini", "mercadolivre", 259.00, 0, 3, false, false),
    o("caixa-boom-mini", "magalu", 289.90, 0, 5, false, false),
    o("caixa-boom-mini", "americanas", 299.00, 0, 6, false, false),
    o("caixa-boom-mini", "shopee", 219.00, 15.00, 7, false, false),
    o("caixa-boom-mini", "aliexpress", 149.00, 25.00, 17, true, true),
    o("caixa-boom-mini", "temu", 139.00, 0, 13, true, true),

    o("mouse-orbit-m2", "amazon", 129.90, 0, 2, false, false),
    o("mouse-orbit-m2", "mercadolivre", 119.90, 0, 2, false, false),
    o("mouse-orbit-m2", "kabum", 109.90, 14.90, 4, false, false),
    o("mouse-orbit-m2", "magalu", 134.90, 0, 5, false, false),
    o("mouse-orbit-m2", "shopee", 89.90, 0, 6, false, false),
    o("mouse-orbit-m2", "aliexpress", 54.00, 0, 14, true, true),
    o("mouse-orbit-m2", "temu", 49.90, 0, 12, true, true),

    o("teclado-k68", "amazon", 349.00, 0, 2, false, false),
    o("teclado-k68", "mercadolivre", 329.00, 0, 3, false, false),
    o("teclado-k68", "kabum", 319.90, 0, 3, false, false),
    o("teclado-k68", "americanas", 369.00, 0, 6, false, false),
    o("teclado-k68", "aliexpress", 219.00, 45.00, 22, true, true),

    o("cabo-usbc-2m", "amazon", 59.90, 0, 2, false, false),
    o("cabo-usbc-2m", "mercadolivre", 49.90, 0, 2, false, false),
    o("cabo-usbc-2m", "magalu", 64.90, 0, 5, false, false),
    o("cabo-usbc-2m", "shopee", 29.90, 9.90, 6, false, false),
    o("cabo-usbc-2m", "aliexpress", 19.90, 0, 14, true, true),
    o("cabo-usbc-2m", "temu", 14.90, 0, 12, true, true),
    o("cabo-usbc-2m", "shein", 17.90, 0, 10, true, true),

    o("webcam-vista-c2", "amazon", 239.00, 0, 2, false, false),
    o("webcam-vista-c2", "mercadolivre", 219.00, 0, 3, false, false),
    o("webcam-vista-c2", "kabum", 209.90, 12.90, 4, false, false),
    o("webcam-vista-c2", "casasbahia", 249.00, 0, 6, false, false),
    o("webcam-vista-c2", "aliexpress", 129.00, 19.00, 16, true, true),

    o("hub-usbc-7em1", "amazon", 189.00, 0, 2, false, false),
    o("hub-usbc-7em1", "mercadolivre", 174.00, 0, 3, false, false),
    o("hub-usbc-7em1", "kabum", 169.90, 0, 4, false, false),
    o("hub-usbc-7em1", "americanas", 199.00, 0, 6, false, false),
    o("hub-usbc-7em1", "aliexpress", 99.00, 0, 15, true, true),
    o("hub-usbc-7em1", "temu", 89.00, 0, 12, true, true),
    o("hub-usbc-7em1", "shein", 95.00, 0, 11, true, true)
  ];

  // ---------- Histórico inventado (26 semanas por loja) ----------
  // Com dados reais, isto viria salvo de leituras diárias dos preços.
  function semente(texto) {
    let h = 2166136261;
    for (const c of texto) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function aleatorio(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const faixas = { baixa: [1.06, 1.24], alta: [0.84, 0.97], normal: [0.93, 1.08] };

  function historico(oferta, perfil) {
    const rnd = aleatorio(semente(oferta.produtoId + oferta.loja));
    const [min, max] = faixas[perfil] || faixas.normal;
    const pontos = [];
    const fim = new Date(hoje + "T12:00:00");
    let nivel = min + (max - min) * rnd();
    for (let i = 25; i >= 0; i--) {
      const d = new Date(fim); d.setDate(d.getDate() - i * 7);
      let preco;
      if (i === 0) preco = oferta.preco;
      else {
        nivel += (rnd() - 0.5) * 0.06;
        nivel = Math.min(max, Math.max(min, nivel));
        preco = oferta.preco * nivel;
        if (rnd() < 0.08) preco *= 0.9; // promoção relâmpago
        if (perfil === "baixa") preco = Math.max(preco, oferta.preco * 1.01);
      }
      pontos.push({ data: d.toISOString().slice(0, 10), preco: Math.round(preco * 100) / 100 });
    }
    return pontos;
  }

  ofertas.forEach(of => {
    const p = produtos.find(x => x.id === of.produtoId);
    of.historico = historico(of, p.perfilHistorico);
  });

  return { lojas, produtos, ofertas, atualizadoEm: hoje, demonstracao: true };
})();
