// =============================================================
// NÚCLEO — a lógica que os 3 layouts usam (preço final, selos,
// histórico, alertas, busca). Os layouts só cuidam da aparência.
// Lê window.CONFIG (config.js) e window.DADOS (dados/ofertas-exemplo.js).
// =============================================================
window.N = (function () {
  const C = window.CONFIG, D = window.DADOS, T = C.impostos;

  // ---------- utilidades ----------
  const brl = n => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const brlCurto = n => "R$ " + Math.round(n).toLocaleString("pt-BR");
  const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const loja = id => D.lojas.find(l => l.id === id);
  const produto = id => D.produtos.find(p => p.id === id);
  const categorias = [...new Set(D.produtos.map(p => p.categoria))];
  const dataBR = iso => iso.split("-").reverse().join("/");
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const dataCurta = iso => +iso.slice(8, 10) + " " + meses[+iso.slice(5, 7) - 1];
  const nomeCompleto = p => p.nome.startsWith(p.marca) ? p.nome : p.marca + " " + p.nome;

  // ---------- guardar no navegador (pode falhar em janela anônima) ----------
  const memoria = {};
  function ler(chave, padrao, sessao) {
    try { const v = (sessao ? sessionStorage : localStorage).getItem(chave); return v ? JSON.parse(v) : padrao; }
    catch (e) { return chave in memoria ? memoria[chave] : padrao; }
  }
  function gravar(chave, valor, sessao) {
    memoria[chave] = valor;
    try { (sessao ? sessionStorage : localStorage).setItem(chave, JSON.stringify(valor)); } catch (e) {}
  }
  const simulados = () => ler("comparador.simulacao", {}, true); // { produtoId: fator }

  // ---------- a conta do preço final ----------
  // contaPara: a conta para um preço de vitrine qualquer (usada também no histórico).
  function contaPara(of, preco) {
    const base = preco + of.frete;
    let ii = 0, icms = 0;
    if (of.internacional) {
      const baseUSD = base / C.cotacaoDolar;
      let iiUSD;
      if (!of.remessaConforme) iiUSD = baseUSD * T.aliquotaForaDoPrograma;
      else if (baseUSD <= T.limiteFaixa1USD) iiUSD = baseUSD * T.aliquotaFaixa1;
      else iiUSD = Math.max(0, baseUSD * T.aliquotaFaixa2 - T.deducaoFaixa2USD);
      ii = iiUSD * C.cotacaoDolar;
      icms = (base + ii) / (1 - T.icms) - (base + ii); // ICMS "por dentro"
    }
    ii = Math.round(ii * 100) / 100; icms = Math.round(icms * 100) / 100;
    return { base, ii, icms, total: Math.round((base + ii + icms) * 100) / 100 };
  }
  function calcular(of) {
    const fator = simulados()[of.produtoId] || 1;
    const preco = Math.round(of.preco * fator * 100) / 100;
    const { base, ii, icms } = contaPara(of, preco);
    const historico = fator === 1 ? of.historico : [...of.historico.slice(0, -1), { ...of.historico[of.historico.length - 1], preco }];
    return { ...of, preco, base, ii, icms, impostos: ii + icms, total: Math.round((base + ii + icms) * 100) / 100, historico };
  }
  const ofertasDe = pid => D.ofertas.filter(o => o.produtoId === pid).map(calcular).sort((a, b) => a.total - b.total);

  // Selo: preço de agora contra os últimos 90 dias (13 semanas).
  function selo(of) {
    const ant = of.historico.slice(-14, -1).map(h => h.preco);
    const min = Math.min(...ant), media = ant.reduce((a, b) => a + b, 0) / ant.length;
    if (of.preco <= min) return { tipo: "baixa", texto: "Menor preço em 90 dias", curto: "Menor em 90 dias", min, media };
    if (of.preco > media * 1.06) return { tipo: "alta", texto: "Agora está caro, espere", curto: "Caro agora", min, media };
    return { tipo: "normal", texto: "Preço dentro do normal", curto: "Preço normal", min, media };
  }
  // Variação da semana (preço de agora contra 7 dias atrás) na loja vencedora.
  function variacao(of) {
    const h = of.historico, antes = h[h.length - 2].preco;
    return { valor: of.preco - antes, pct: (of.preco - antes) / antes };
  }
  // Melhor momento: o ponto mais barato do histórico.
  function melhorMomento(of) {
    let i = 0; of.historico.forEach((h, k) => { if (h.preco < of.historico[i].preco) i = k; });
    return { indice: i, ...of.historico[i] };
  }
  function resumo(p) {
    const lista = ofertasDe(p.id);
    const melhor = lista[0], maisCara = lista[lista.length - 1];
    const porVitrine = [...lista].sort((a, b) => a.preco - b.preco)[0];
    return {
      lista, melhor, maisCara, economia: maisCara.total - melhor.total,
      selo: selo(melhor), variacao: variacao(melhor),
      porVitrine, posVitrine: lista.indexOf(porVitrine) + 1, vitrineEngana: porVitrine !== melhor
    };
  }
  const linkLoja = (of, p) => loja(of.loja).busca.replace("{q}", encodeURIComponent(p.termoBusca));

  // Textos prontos
  function conta(o) {
    const frete = o.frete ? brl(o.frete) : "grátis";
    return o.internacional
      ? `${brl(o.preco)} + frete ${frete} + imposto ${brl(o.ii)} + ICMS ${brl(o.icms)} = ${brl(o.total)} na sua casa`
      : `${brl(o.preco)} + frete ${frete} = ${brl(o.total)} na sua casa`;
  }
  const regra = () => `Importados: imposto federal de ${Math.round(T.aliquotaFaixa1 * 100)}% até US$ ${T.limiteFaixa1USD} e ${Math.round(T.aliquotaFaixa2 * 100)}% menos US$ ${T.deducaoFaixa2USD} acima disso, mais ICMS de ${Math.round(T.icms * 100)}%. Regra em vigor desde ${T.vigenteDesde}. Dólar a ${brl(C.cotacaoDolar)}.`;
  const credito = p => `Foto: ${p.credito.autor}, ${p.credito.licenca}, via ${p.credito.fonte}`;

  // ---------- busca ----------
  function buscar(q, cat) {
    const n = norm((q || "").trim());
    return D.produtos.filter(p => {
      if (cat && p.categoria !== cat) return false;
      if (!n) return true;
      const alvo = norm([p.nome, p.marca, p.categoria, p.termoBusca].join(" "));
      return n.split(/\s+/).every(t => alvo.includes(t));
    });
  }

  // ---------- alertas ----------
  const alertas = {
    lista: () => ler("comparador.alertas", []),
    de: pid => alertas.lista().find(a => a.produtoId === pid),
    salvar(pid, alvo) {
      const l = alertas.lista().filter(a => a.produtoId !== pid);
      l.push({ produtoId: pid, alvo: Math.round(alvo * 100) / 100, criadoEm: new Date().toISOString().slice(0, 10) });
      gravar("comparador.alertas", l);
    },
    remover(pid) {
      gravar("comparador.alertas", alertas.lista().filter(a => a.produtoId !== pid));
      alertas.desfazer(pid);
    },
    simulado: pid => !!simulados()[pid],
    // Simula uma queda até o preço final bater no alvo (só na demonstração).
    simular(pid) {
      const a = alertas.de(pid); if (!a) return;
      const s = simulados();
      for (let f = 0.96; f >= 0.3; f -= 0.02) { s[pid] = f; gravar("comparador.simulacao", s, true); if (resumo(produto(pid)).melhor.total <= a.alvo) break; }
    },
    desfazer(pid) { const s = simulados(); delete s[pid]; gravar("comparador.simulacao", s, true); avisados.clear(); },
    // Devolve os alertas que bateram e ainda não foram avisados nesta visita.
    novosDisparos() {
      const saida = [];
      alertas.lista().forEach(a => {
        const p = produto(a.produtoId); if (!p) return;
        const m = resumo(p).melhor, chave = a.produtoId + ":" + m.total;
        if (m.total <= a.alvo && !avisados.has(chave)) { avisados.add(chave); saida.push({ alerta: a, produto: p, melhor: m }); }
      });
      return saida;
    }
  };
  const avisados = new Set();
  const lerValor = bruto => { bruto = String(bruto).trim().replace(/^R\$\s*/, ""); return parseFloat(bruto.includes(",") ? bruto.replace(/\./g, "").replace(",", ".") : bruto); };

  // Primeira visita: começa com um alerta de exemplo.
  if (!ler("comparador.iniciado", false)) {
    gravar("comparador.alertas", [{ produtoId: "galaxy-buds-plus", alvo: 260, criadoEm: "2026-11-10" }]);
    gravar("comparador.iniciado", true);
  }

  return {
    C, D, T, brl, brlCurto, norm, esc, loja, produto, categorias, dataBR, dataCurta, meses, nomeCompleto,
    contaPara, calcular, ofertasDe, selo, variacao, melhorMomento, resumo, linkLoja, conta, regra, credito, buscar, alertas, lerValor
  };
})();
