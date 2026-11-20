// =============================================================
// DADOS DE DEMONSTRAÇÃO (produtos reais, preços inventados)
// =============================================================
// Os produtos existem de verdade; os PREÇOS são de demonstração.
// Este arquivo imita o formato que viria das lojas (APIs de
// afiliados). Quando ligarmos nos preços reais, só este arquivo
// é trocado; as telas continuam iguais. Ver PLANO.md.
//
// Formato de uma oferta:
//   produtoId, loja, preco (vitrine, em reais), frete, prazoDias,
//   internacional (paga imposto de importação), remessaConforme,
//   atualizadoEm
// Fotos: assets/fotos/<id>.jpg (créditos em CREDITOS.md)

window.DADOS = (function () {
  const lojas = [
    { id: "amazon",       nome: "Amazon",        sigla: "AMZ", busca: "https://www.amazon.com.br/s?k={q}" },
    { id: "mercadolivre", nome: "Mercado Livre", sigla: "MLV", busca: "https://lista.mercadolivre.com.br/{q}" },
    { id: "shopee",       nome: "Shopee",        sigla: "SHP", busca: "https://shopee.com.br/search?keyword={q}" },
    { id: "aliexpress",   nome: "AliExpress",    sigla: "ALI", busca: "https://pt.aliexpress.com/w/wholesale-{q}.html" },
    { id: "shein",        nome: "Shein",         sigla: "SHN", busca: "https://br.shein.com/pdsearch/{q}/" },
    { id: "temu",         nome: "Temu",          sigla: "TMU", busca: "https://www.temu.com/search_result.html?search_key={q}" },
    { id: "magalu",       nome: "Magalu",        sigla: "MGL", busca: "https://www.magazineluiza.com.br/busca/{q}/" },
    { id: "casasbahia",   nome: "Casas Bahia",   sigla: "CSB", busca: "https://www.casasbahia.com.br/{q}/b" },
    { id: "americanas",   nome: "Americanas",    sigla: "AMR", busca: "https://www.americanas.com.br/s?q={q}" },
    { id: "kabum",        nome: "Kabum",         sigla: "KBM", busca: "https://www.kabum.com.br/busca/{q}" },
    { id: "pichau",       nome: "Pichau",        sigla: "PCH", busca: "https://www.pichau.com.br/search?q={q}" },
    { id: "terabyte",     nome: "Terabyte",      sigla: "TBT", busca: "https://www.terabyteshop.com.br/busca?str={q}" }
  ];

  const credito = (autor, licenca) => ({ autor, licenca, fonte: "Wikimedia Commons" });

  // cor = tom principal do produto (usado no brilho atrás da foto).
  // perfilHistorico só existe na demonstração (como inventar o gráfico).
  const produtos = [
    { id: "airpods-pro-2",        nome: "AirPods Pro (2ª geração)",   marca: "Apple",    categoria: "Fones",        cor: "#e9e4da", termoBusca: "airpods pro 2",            specs: ["Cancelamento de ruído", "Estojo USB-C", "Até 30 h com estojo"], credito: credito("Hajoon0102", "CC BY-SA 4.0"), perfilHistorico: "alta" },
    { id: "galaxy-buds-plus",     nome: "Galaxy Buds+",               marca: "Samsung",  categoria: "Fones",        cor: "#a9cdf0", termoBusca: "galaxy buds plus",         specs: ["Som AKG", "Bateria 22 h com estojo", "Carga sem fio"], credito: credito("Dinkun Chen", "CC BY-SA 4.0"), perfilHistorico: "baixa" },
    { id: "sony-wh-1000xm3",      nome: "WH-1000XM3",                 marca: "Sony",     categoria: "Fones",        cor: "#8b8f98", termoBusca: "sony wh-1000xm3",          specs: ["Over-ear com cancelamento", "30 h de bateria", "Dobrável"], credito: credito("www.digitalpush.net", "CC BY 4.0"), perfilHistorico: "normal" },
    { id: "iphone-15",            nome: "iPhone 15 128 GB",           marca: "Apple",    categoria: "Celulares",    cor: "#f3c9d3", termoBusca: "iphone 15 128gb",          specs: ["Tela 6,1\"", "Câmera 48 MP", "USB-C"], credito: credito("Ka Kit Pang", "Domínio público"), perfilHistorico: "baixa" },
    { id: "galaxy-s24-ultra",     nome: "Galaxy S24 Ultra 256 GB",    marca: "Samsung",  categoria: "Celulares",    cor: "#b7b0a2", termoBusca: "galaxy s24 ultra 256gb",   specs: ["Tela 6,8\" 120 Hz", "Câmera 200 MP", "Caneta S Pen"], credito: credito("webtekno", "CC BY 3.0"), perfilHistorico: "alta" },
    { id: "redmi-note-12",        nome: "Redmi Note 12 128 GB",       marca: "Xiaomi",   categoria: "Celulares",    cor: "#7cc7f2", termoBusca: "redmi note 12 128gb",      specs: ["Tela AMOLED 6,67\"", "Bateria 5.000 mAh", "Carga 33 W"], credito: credito("Maksdroider", "CC BY-SA 4.0"), perfilHistorico: "normal" },
    { id: "jbl-flip-4",           nome: "Flip 4",                     marca: "JBL",      categoria: "Caixas de som",cor: "#e0cfae", termoBusca: "jbl flip 4",               specs: ["16 W", "À prova d'água IPX7", "12 h de bateria"], credito: credito("Freekhou5", "CC BY-SA 4.0"), perfilHistorico: "baixa" },
    { id: "jbl-go",               nome: "Go",                         marca: "JBL",      categoria: "Caixas de som",cor: "#ff4b4b", termoBusca: "jbl go",                   specs: ["3 W", "Bluetooth", "5 h de bateria"], credito: credito("Apiiroja", "CC BY-SA 4.0"), perfilHistorico: "normal" },
    { id: "apple-watch-se",       nome: "Apple Watch SE 40 mm",       marca: "Apple",    categoria: "Relógios",     cor: "#a7a9b0", termoBusca: "apple watch se 40mm",      specs: ["GPS", "Detecção de queda", "Resistente à água"], credito: credito("aconcagua", "CC BY-SA 4.0"), perfilHistorico: "normal" },
    { id: "mi-band-4",            nome: "Mi Band 4",                  marca: "Xiaomi",   categoria: "Relógios",     cor: "#3d7bff", termoBusca: "mi band",                  specs: ["Tela AMOLED colorida", "Batimentos e sono", "20 dias de bateria"], credito: credito("Justinkcire", "CC BY-SA 4.0"), perfilHistorico: "baixa" },
    { id: "anker-powerport-40w",  nome: "Carregador PowerPort 40 W",  marca: "Anker",    categoria: "Energia",      cor: "#dfe3e8", termoBusca: "carregador anker 5 portas",specs: ["5 portas USB", "40 W no total", "Cabo de força"], credito: credito("www.digitalpush.net", "CC BY 4.0"), perfilHistorico: "normal" },
    { id: "anker-powercore-5000", nome: "Power bank PowerCore 5.000", marca: "Anker",    categoria: "Energia",      cor: "#ff4d4d", termoBusca: "power bank anker 5000",    specs: ["5.000 mAh", "Tamanho de batom", "Micro-USB"], credito: credito("Jacek Halicki", "CC BY-SA 4.0"), perfilHistorico: "alta" },
    { id: "logitech-mx-master",   nome: "MX Master",                  marca: "Logitech", categoria: "Periféricos",  cor: "#9a8fb0", termoBusca: "logitech mx master",       specs: ["Sem fio + Bluetooth", "Roda rápida", "Até 3 aparelhos"], credito: credito("Jacek Halicki", "CC BY-SA 4.0"), perfilHistorico: "baixa" },
    { id: "kindle-paperwhite",    nome: "Kindle Paperwhite",          marca: "Amazon",   categoria: "Leitores",     cor: "#c9ccd2", termoBusca: "kindle paperwhite",        specs: ["Tela 6,8\" sem reflexo", "Luz ajustável", "À prova d'água"], credito: credito("Jacek Halicki", "CC BY-SA 4.0"), perfilHistorico: "normal" },
    // peças de computador e mais eletrônicos (20/11)
    { id: "asus-rtx-4090",        nome: "ROG Strix RTX 4090 24 GB",   marca: "Asus",     categoria: "Placas de vídeo", cor: "#d9473d", termoBusca: "rog strix rtx 4090",   specs: ["24 GB GDDR6X", "3 ventoinhas", "DLSS 3"], credito: credito("Benlisquare", "CC BY-SA 4.0"), perfilHistorico: "alta" },
    { id: "msi-rtx-3070",         nome: "RTX 3070 Ventus 3X OC 8 GB", marca: "MSI",      categoria: "Placas de vídeo", cor: "#8b8f98", termoBusca: "rtx 3070 ventus 3x",   specs: ["8 GB GDDR6", "3 ventoinhas", "Ray tracing"], credito: credito("TheStriker", "CC BY 4.0"), perfilHistorico: "baixa" },
    { id: "intel-i5-12400f",      nome: "Core i5-12400F",             marca: "Intel",    categoria: "Processadores", cor: "#7cc4ff", termoBusca: "core i5 12400f",       specs: ["6 núcleos, 12 threads", "Até 4,4 GHz", "Soquete LGA 1700"], credito: credito("Fritzchens Fritz", "CC0"), perfilHistorico: "normal" },
    { id: "ryzen-5-9600x",        nome: "Ryzen 5 9600X",              marca: "AMD",      categoria: "Processadores", cor: "#c9ccd2", termoBusca: "ryzen 5 9600x",        specs: ["6 núcleos, 12 threads", "Até 5,4 GHz", "Soquete AM5"], credito: credito("FritzchensFritz", "CC0"), perfilHistorico: "baixa" },
    { id: "samsung-980-pro",      nome: "SSD 980 PRO 1 TB",           marca: "Samsung",  categoria: "Armazenamento", cor: "#7c8aa8", termoBusca: "ssd samsung 980 pro 1tb", specs: ["NVMe PCIe 4.0", "Até 7.000 MB/s", "M.2 2280"], credito: credito("D-Kuru", "CC BY-SA 4.0"), perfilHistorico: "normal" },
    { id: "kingston-nv2",         nome: "SSD NV2 2 TB",               marca: "Kingston", categoria: "Armazenamento", cor: "#5aa9e6", termoBusca: "ssd kingston nv2 2tb", specs: ["NVMe PCIe 4.0", "Até 3.500 MB/s", "M.2 2280"], credito: credito("Jacek Halicki", "CC BY-SA 4.0"), perfilHistorico: "baixa" },
    { id: "samsung-970-evo",      nome: "SSD 970 EVO Plus 250 GB",    marca: "Samsung",  categoria: "Armazenamento", cor: "#9fb3d1", termoBusca: "ssd samsung 970 evo plus 250gb", specs: ["NVMe PCIe 3.0", "Até 3.500 MB/s", "M.2 2280"], credito: credito("Jacek Halicki", "CC BY-SA 4.0"), perfilHistorico: "normal" },
    { id: "corsair-vengeance-rgb",nome: "Memória Vengeance DDR5",     marca: "Corsair",  categoria: "Memória RAM", cor: "#e9e4da", termoBusca: "memoria corsair vengeance ddr5", specs: ["DDR5", "Kit com 2 pentes", "Dissipador branco"], credito: credito("Jacek Halicki", "CC BY-SA 4.0"), perfilHistorico: "alta" },
    { id: "corsair-cx600m",       nome: "Fonte CX600M 600 W",         marca: "Corsair",  categoria: "Fontes", cor: "#9a8fb0", termoBusca: "fonte corsair cx600m",  specs: ["600 W", "80 Plus Bronze", "Semimodular"], credito: credito("FASTILY", "CC BY-SA 4.0"), perfilHistorico: "normal" },
    { id: "asus-proart-pa246q",   nome: "Monitor ProArt PA246Q 24\"", marca: "Asus",     categoria: "Monitores", cor: "#a7a9b0", termoBusca: "monitor asus proart 24", specs: ["24\" 1920 x 1200", "Painel IPS", "Cores calibradas"], credito: credito("MKFI", "Domínio público"), perfilHistorico: "normal" },
    { id: "avell-fusion",         nome: "Headset sem fio Fusion",     marca: "Avell",    categoria: "Fones", cor: "#8b8f98", termoBusca: "headset avell fusion", specs: ["Sem fio", "Bluetooth", "Marca brasileira"], credito: credito("Marketing Avell", "CC BY 4.0"), perfilHistorico: "baixa" }
  ];
  // foto = foto original (v2); recorte = mesma peça sem fundo, em WebP transparente (v3).
  // Na v3 três recortes vêm de fotos diferentes e mais limpas (crédito trocado abaixo).
  const creditoRecorte = {
    "airpods-pro-2": credito("aconcagua", "CC BY-SA 4.0"),
    "iphone-15": credito("ThePhotoGraphIc", "CC BY-SA 4.0"),
    "apple-watch-se": credito("Dnkography", "CC BY-SA 4.0")
  };
  const raiz = window.RAIZ || ""; // páginas em subpastas (versoes/) definem RAIZ = "../"
  produtos.forEach(p => {
    p.foto = raiz + "assets/fotos/" + p.id + ".jpg";
    p.recorte = raiz + "assets/recortes/" + p.id + ".webp";
    p.creditoRecorte = creditoRecorte[p.id] || p.credito;
  });

  const hoje = "2026-11-18";
  // o(produto, loja, preço, frete, prazo, internacional, remessaConforme)
  const o = (produtoId, loja, preco, frete, prazoDias, internacional, remessaConforme) =>
    ({ produtoId, loja, preco, frete, prazoDias, internacional, remessaConforme, atualizadoEm: hoje });
  const N = false, I = true; // nacional / importado

  const ofertas = [
    o("airpods-pro-2", "amazon", 1699, 0, 2, N, N), o("airpods-pro-2", "mercadolivre", 1749, 0, 2, N, N),
    o("airpods-pro-2", "magalu", 1899, 0, 4, N, N), o("airpods-pro-2", "casasbahia", 1849, 0, 5, N, N),
    o("airpods-pro-2", "kabum", 1729, 0, 3, N, N), o("airpods-pro-2", "shopee", 1599, 19.9, 6, N, N),
    o("airpods-pro-2", "aliexpress", 1249, 0, 18, I, I),

    o("galaxy-buds-plus", "amazon", 499, 0, 2, N, N), o("galaxy-buds-plus", "mercadolivre", 459, 0, 3, N, N),
    o("galaxy-buds-plus", "magalu", 529, 0, 5, N, N), o("galaxy-buds-plus", "shopee", 389, 15, 7, N, N),
    o("galaxy-buds-plus", "aliexpress", 229, 0, 16, I, I),

    o("sony-wh-1000xm3", "amazon", 1299, 0, 2, N, N), o("sony-wh-1000xm3", "mercadolivre", 1199, 0, 3, N, N),
    o("sony-wh-1000xm3", "kabum", 1149, 0, 4, N, N), o("sony-wh-1000xm3", "casasbahia", 1349, 0, 6, N, N),
    o("sony-wh-1000xm3", "aliexpress", 799, 0, 20, I, I),

    o("iphone-15", "amazon", 4599, 0, 2, N, N), o("iphone-15", "mercadolivre", 4499, 0, 2, N, N),
    o("iphone-15", "magalu", 4399, 0, 4, N, N), o("iphone-15", "casasbahia", 4449, 0, 5, N, N),
    o("iphone-15", "americanas", 4699, 0, 6, N, N), o("iphone-15", "kabum", 4549, 0, 3, N, N),
    o("iphone-15", "shopee", 4299, 29.9, 7, N, N),

    o("galaxy-s24-ultra", "amazon", 6299, 0, 2, N, N), o("galaxy-s24-ultra", "mercadolivre", 6099, 0, 3, N, N),
    o("galaxy-s24-ultra", "magalu", 5999, 0, 4, N, N), o("galaxy-s24-ultra", "casasbahia", 6199, 0, 5, N, N),
    o("galaxy-s24-ultra", "kabum", 6149, 0, 3, N, N), o("galaxy-s24-ultra", "aliexpress", 4899, 0, 21, I, I),

    o("redmi-note-12", "amazon", 1199, 0, 2, N, N), o("redmi-note-12", "mercadolivre", 1099, 0, 3, N, N),
    o("redmi-note-12", "magalu", 1249, 0, 5, N, N), o("redmi-note-12", "kabum", 1149, 0, 4, N, N),
    o("redmi-note-12", "shopee", 999, 0, 6, N, N), o("redmi-note-12", "aliexpress", 749, 0, 17, I, I),

    o("jbl-flip-4", "amazon", 599, 0, 2, N, N), o("jbl-flip-4", "mercadolivre", 569, 0, 3, N, N),
    o("jbl-flip-4", "magalu", 629, 0, 5, N, N), o("jbl-flip-4", "americanas", 649, 0, 6, N, N),
    o("jbl-flip-4", "casasbahia", 619, 0, 5, N, N), o("jbl-flip-4", "shopee", 479, 19, 7, N, N),
    o("jbl-flip-4", "aliexpress", 329, 25, 18, I, I),

    o("jbl-go", "amazon", 229, 0, 2, N, N), o("jbl-go", "mercadolivre", 199, 0, 2, N, N),
    o("jbl-go", "magalu", 239, 0, 5, N, N), o("jbl-go", "americanas", 249, 0, 6, N, N),
    o("jbl-go", "shopee", 169, 12, 6, N, N), o("jbl-go", "aliexpress", 109, 15, 15, I, I),
    o("jbl-go", "temu", 99, 0, 12, I, I),

    o("apple-watch-se", "amazon", 2199, 0, 2, N, N), o("apple-watch-se", "mercadolivre", 2099, 0, 3, N, N),
    o("apple-watch-se", "magalu", 2299, 0, 4, N, N), o("apple-watch-se", "casasbahia", 2249, 0, 5, N, N),
    o("apple-watch-se", "kabum", 2149, 0, 3, N, N), o("apple-watch-se", "aliexpress", 1399, 0, 19, I, I),

    o("mi-band-4", "amazon", 229, 0, 2, N, N), o("mi-band-4", "mercadolivre", 199, 0, 3, N, N),
    o("mi-band-4", "magalu", 249, 0, 5, N, N), o("mi-band-4", "shopee", 159, 12, 7, N, N),
    o("mi-band-4", "aliexpress", 119, 0, 14, I, I), o("mi-band-4", "temu", 109, 0, 11, I, I),
    o("mi-band-4", "shein", 125, 0, 10, I, I),

    o("anker-powerport-40w", "amazon", 249, 0, 2, N, N), o("anker-powerport-40w", "mercadolivre", 229, 0, 3, N, N),
    o("anker-powerport-40w", "kabum", 219, 15, 4, N, N), o("anker-powerport-40w", "shopee", 189, 0, 6, N, N),
    o("anker-powerport-40w", "aliexpress", 139, 0, 15, I, I), o("anker-powerport-40w", "temu", 129, 0, 12, I, I),

    o("anker-powercore-5000", "amazon", 129, 0, 2, N, N), o("anker-powercore-5000", "mercadolivre", 119, 0, 2, N, N),
    o("anker-powercore-5000", "magalu", 149, 0, 5, N, N), o("anker-powercore-5000", "americanas", 139, 0, 6, N, N),
    o("anker-powercore-5000", "shopee", 99, 10, 6, N, N), o("anker-powercore-5000", "aliexpress", 69, 9, 14, I, I),
    o("anker-powercore-5000", "temu", 64, 0, 11, I, I), o("anker-powercore-5000", "shein", 72, 0, 10, I, I),

    o("logitech-mx-master", "amazon", 549, 0, 2, N, N), o("logitech-mx-master", "mercadolivre", 519, 0, 3, N, N),
    o("logitech-mx-master", "kabum", 499, 0, 3, N, N), o("logitech-mx-master", "magalu", 579, 0, 5, N, N),
    o("logitech-mx-master", "casasbahia", 569, 0, 5, N, N), o("logitech-mx-master", "aliexpress", 349, 0, 18, I, I),

    o("kindle-paperwhite", "amazon", 899, 0, 1, N, N), o("kindle-paperwhite", "mercadolivre", 949, 0, 3, N, N),
    o("kindle-paperwhite", "magalu", 979, 0, 5, N, N), o("kindle-paperwhite", "casasbahia", 959, 0, 5, N, N),
    o("kindle-paperwhite", "americanas", 929, 0, 6, N, N), o("kindle-paperwhite", "aliexpress", 699, 0, 19, I, I),
    o("kindle-paperwhite", "pichau", 919, 19.9, 4, N, N),
    o("logitech-mx-master", "pichau", 489, 14.9, 4, N, N), o("logitech-mx-master", "terabyte", 509, 0, 5, N, N),
    o("sony-wh-1000xm3", "pichau", 1169, 0, 4, N, N), o("galaxy-s24-ultra", "pichau", 6099, 0, 4, N, N), o("iphone-15", "terabyte", 4589, 0, 5, N, N),

    o("asus-rtx-4090", "amazon", 14999, 0, 2, N, N), o("asus-rtx-4090", "mercadolivre", 14499, 0, 3, N, N), o("asus-rtx-4090", "kabum", 13999, 0, 3, N, N),
    o("asus-rtx-4090", "pichau", 13899, 49.9, 4, N, N), o("asus-rtx-4090", "terabyte", 14199, 0, 5, N, N), o("asus-rtx-4090", "aliexpress", 10999, 0, 22, I, I),

    o("msi-rtx-3070", "amazon", 2499, 0, 2, N, N), o("msi-rtx-3070", "mercadolivre", 2399, 0, 3, N, N), o("msi-rtx-3070", "kabum", 2299, 0, 3, N, N),
    o("msi-rtx-3070", "pichau", 2249, 29.9, 4, N, N), o("msi-rtx-3070", "terabyte", 2349, 0, 5, N, N), o("msi-rtx-3070", "aliexpress", 1699, 0, 20, I, I),

    o("intel-i5-12400f", "amazon", 749, 0, 2, N, N), o("intel-i5-12400f", "mercadolivre", 719, 0, 3, N, N), o("intel-i5-12400f", "kabum", 699, 0, 3, N, N),
    o("intel-i5-12400f", "pichau", 689, 19.9, 4, N, N), o("intel-i5-12400f", "terabyte", 709, 0, 5, N, N), o("intel-i5-12400f", "magalu", 799, 0, 5, N, N),
    o("intel-i5-12400f", "aliexpress", 499, 0, 18, I, I),

    o("ryzen-5-9600x", "amazon", 1699, 0, 2, N, N), o("ryzen-5-9600x", "mercadolivre", 1649, 0, 3, N, N), o("ryzen-5-9600x", "kabum", 1599, 0, 3, N, N),
    o("ryzen-5-9600x", "pichau", 1579, 24.9, 4, N, N), o("ryzen-5-9600x", "terabyte", 1619, 0, 5, N, N), o("ryzen-5-9600x", "aliexpress", 1199, 0, 19, I, I),

    o("samsung-980-pro", "amazon", 649, 0, 2, N, N), o("samsung-980-pro", "mercadolivre", 619, 0, 3, N, N), o("samsung-980-pro", "kabum", 599, 0, 3, N, N),
    o("samsung-980-pro", "pichau", 589, 15, 4, N, N), o("samsung-980-pro", "terabyte", 609, 0, 5, N, N), o("samsung-980-pro", "aliexpress", 429, 0, 17, I, I),

    o("kingston-nv2", "amazon", 799, 0, 2, N, N), o("kingston-nv2", "mercadolivre", 769, 0, 3, N, N), o("kingston-nv2", "kabum", 749, 0, 3, N, N),
    o("kingston-nv2", "pichau", 739, 15, 4, N, N), o("kingston-nv2", "terabyte", 759, 0, 5, N, N), o("kingston-nv2", "shopee", 699, 19.9, 7, N, N),
    o("kingston-nv2", "aliexpress", 529, 0, 18, I, I),

    o("samsung-970-evo", "amazon", 239, 0, 2, N, N), o("samsung-970-evo", "mercadolivre", 229, 0, 3, N, N), o("samsung-970-evo", "kabum", 219, 0, 3, N, N),
    o("samsung-970-evo", "pichau", 215, 12, 4, N, N), o("samsung-970-evo", "terabyte", 225, 0, 5, N, N), o("samsung-970-evo", "shopee", 199, 12, 7, N, N),
    o("samsung-970-evo", "aliexpress", 149, 9, 16, I, I),

    o("corsair-vengeance-rgb", "amazon", 899, 0, 2, N, N), o("corsair-vengeance-rgb", "mercadolivre", 869, 0, 3, N, N), o("corsair-vengeance-rgb", "kabum", 849, 0, 3, N, N),
    o("corsair-vengeance-rgb", "pichau", 829, 19.9, 4, N, N), o("corsair-vengeance-rgb", "terabyte", 859, 0, 5, N, N), o("corsair-vengeance-rgb", "aliexpress", 599, 0, 19, I, I),

    o("corsair-cx600m", "amazon", 479, 0, 2, N, N), o("corsair-cx600m", "mercadolivre", 459, 0, 3, N, N), o("corsair-cx600m", "kabum", 449, 0, 3, N, N),
    o("corsair-cx600m", "pichau", 439, 24.9, 4, N, N), o("corsair-cx600m", "terabyte", 455, 0, 5, N, N), o("corsair-cx600m", "magalu", 499, 0, 5, N, N),

    o("asus-proart-pa246q", "amazon", 1899, 0, 2, N, N), o("asus-proart-pa246q", "mercadolivre", 1849, 0, 3, N, N), o("asus-proart-pa246q", "kabum", 1799, 0, 3, N, N),
    o("asus-proart-pa246q", "pichau", 1779, 39.9, 4, N, N), o("asus-proart-pa246q", "terabyte", 1819, 0, 5, N, N), o("asus-proart-pa246q", "magalu", 1999, 0, 6, N, N),

    o("avell-fusion", "amazon", 499, 0, 2, N, N), o("avell-fusion", "mercadolivre", 479, 0, 3, N, N), o("avell-fusion", "kabum", 459, 0, 3, N, N),
    o("avell-fusion", "magalu", 529, 0, 5, N, N), o("avell-fusion", "shopee", 429, 15, 7, N, N), o("avell-fusion", "americanas", 549, 0, 6, N, N)
  ];

  // ---------- Histórico inventado (26 semanas por loja) ----------
  // Com dados reais, isto viria de leituras diárias dos preços.
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
