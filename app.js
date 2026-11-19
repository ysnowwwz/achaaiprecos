// =============================================================
// TELAS DO COMPARADOR
// Lê window.CONFIG (config.js) e window.DADOS (dados/ofertas-exemplo.js).
// =============================================================
(function () {
  const C = window.CONFIG, D = window.DADOS, T = C.impostos;
  const $app = document.getElementById("app");
  const estado = { q: "", categoria: "", ordem: "final", lojaGrafico: null, formAberto: false };

  document.getElementById("nome-site").textContent = C.nomeDoSite;

  // ---------- utilidades ----------
  const brl = n => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const loja = id => D.lojas.find(l => l.id === id);
  const produto = id => D.produtos.find(p => p.id === id);
  const categorias = [...new Set(D.produtos.map(p => p.categoria))];
  const dataBR = iso => iso.split("-").reverse().join("/");

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
  const alertas = () => ler("comparador.alertas", []);
  const simulados = () => ler("comparador.simulacao", {}, true); // { produtoId: fator }

  // ---------- a conta do preço final ----------
  function calcular(of) {
    const fator = simulados()[of.produtoId] || 1;
    const preco = Math.round(of.preco * fator * 100) / 100;
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
    return { ...of, preco, base, ii, icms, impostos: ii + icms, total: Math.round((base + ii + icms) * 100) / 100 };
  }
  function ofertasDe(pid) {
    return D.ofertas.filter(o => o.produtoId === pid).map(calcular).sort((a, b) => a.total - b.total);
  }
  function resumo(p) {
    const lista = ofertasDe(p.id);
    const melhor = lista[0];
    const maisCara = lista[lista.length - 1];
    return { lista, melhor, economia: maisCara.total - melhor.total, selo: selo(melhor) };
  }
  // Selo: compara o preço de agora com os últimos 90 dias (13 semanas) da loja vencedora.
  function selo(of) {
    const ant = of.historico.slice(-14, -1).map(h => h.preco);
    const min = Math.min(...ant), media = ant.reduce((a, b) => a + b, 0) / ant.length;
    if (of.preco <= min) return { tipo: "baixa", texto: "Menor preço em 90 dias", min, media };
    if (of.preco > media * 1.06) return { tipo: "alta", texto: "Agora está caro, espere", min, media };
    return { tipo: "normal", texto: "Preço dentro do normal", min, media };
  }
  const seloHTML = s => `<span class="selo selo-${s.tipo}">${s.texto}</span>`;
  const linkLoja = (of, p) => loja(of.loja).busca.replace("{q}", encodeURIComponent(p.termoBusca));

  // ---------- busca com sugestões ----------
  function buscar(q, cat) {
    const n = norm(q.trim());
    return D.produtos.filter(p => {
      if (cat && p.categoria !== cat) return false;
      if (!n) return true;
      const alvo = norm([p.nome, p.marca, p.categoria, p.termoBusca].join(" "));
      return n.split(/\s+/).every(t => alvo.includes(t));
    });
  }
  function caixaBusca(valor) {
    return `<div class="busca">
      <form id="form-busca" role="search" autocomplete="off">
        <input id="busca-campo" type="search" placeholder="Procure um eletrônico: fone, carregador, smartwatch..." value="${esc(valor)}" aria-label="Buscar produto">
        <button class="btn btn-neon" type="submit">Comparar</button>
      </form>
      <div class="sugestoes" id="sugestoes" hidden></div>
    </div>`;
  }
  function ligarBusca() {
    const form = document.getElementById("form-busca"), campo = document.getElementById("busca-campo"), caixa = document.getElementById("sugestoes");
    if (!form) return;
    let itens = [], sel = -1;
    const marcar = (texto, q) => {
      const n = norm(q.trim()); if (!n) return esc(texto);
      const i = norm(texto).indexOf(n);
      return i < 0 ? esc(texto) : esc(texto.slice(0, i)) + "<mark>" + esc(texto.slice(i, i + n.length)) + "</mark>" + esc(texto.slice(i + n.length));
    };
    function mostrar() {
      const q = campo.value;
      if (!q.trim()) { caixa.hidden = true; return; }
      const cats = categorias.filter(c => norm(c).includes(norm(q.trim()))).map(c => ({ tipo: "cat", c }));
      const prods = buscar(q, "").slice(0, 6).map(p => ({ tipo: "prod", p }));
      itens = [...cats.slice(0, 2), ...prods];
      sel = -1;
      if (!itens.length) { caixa.innerHTML = `<button type="button" disabled><span>Nenhum produto com esse nome na demonstração</span></button>`; caixa.hidden = false; return; }
      caixa.innerHTML = itens.map((it, i) => it.tipo === "cat"
        ? `<button type="button" data-i="${i}"><span>Ver tudo em <b>${marcar(it.c, q)}</b></span><small>categoria</small></button>`
        : `<button type="button" data-i="${i}"><span>${marcar(it.p.nome, q)}</span><small class="num">${brl(resumo(it.p).melhor.total)}</small></button>`).join("");
      caixa.hidden = false;
    }
    function escolher(it) {
      caixa.hidden = true;
      if (it.tipo === "cat") { estado.q = ""; estado.categoria = it.c; ir("busca"); }
      else ir("produto-" + it.p.id);
    }
    campo.addEventListener("input", mostrar);
    campo.addEventListener("keydown", e => {
      if (caixa.hidden || !itens.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + itens.length) % itens.length;
        caixa.querySelectorAll("button").forEach((b, i) => b.classList.toggle("sel", i === sel));
      } else if (e.key === "Enter" && sel >= 0) { e.preventDefault(); escolher(itens[sel]); }
      else if (e.key === "Escape") caixa.hidden = true;
    });
    caixa.addEventListener("click", e => { const b = e.target.closest("button[data-i]"); if (b) escolher(itens[+b.dataset.i]); });
    document.addEventListener("click", e => { if (!e.target.closest(".busca")) caixa.hidden = true; });
    form.addEventListener("submit", e => { e.preventDefault(); estado.q = campo.value; estado.categoria = ""; ir("busca"); });
  }

  // ---------- cartão de produto ----------
  function cartao(p) {
    const r = resumo(p);
    return `<a class="card" href="#produto-${p.id}">
      <div class="card-topo"><span class="glifo">${p.sigla}</span><div><div class="card-cat">${esc(p.categoria)} · ${esc(p.marca)}</div></div></div>
      <h3>${esc(p.nome)}</h3>
      <div class="card-preco"><small>menor preço final, já com frete e impostos</small><strong>${brl(r.melhor.total)}</strong><small>na ${esc(loja(r.melhor.loja).nome)} · ${r.lista.length} lojas comparadas</small></div>
      <div class="card-rodape">${seloHTML(r.selo)}<span class="num">−${brl(r.economia)}</span></div>
    </a>`;
  }

  // ---------- tela: início ----------
  function telaInicio() {
    const achados = D.produtos.filter(p => resumo(p).selo.tipo === "baixa");
    return `<section class="hero">
        <span class="eyebrow">Eletrônicos · ${D.lojas.length} lojas</span>
        <h1>O preço que <em>chega na sua casa</em>, lado a lado.</h1>
        <p class="lead">Comparamos o mesmo produto em lojas nacionais e importadas, somando frete e imposto de importação. A lista sai ordenada pelo preço final, não pelo preço da vitrine.</p>
        ${caixaBusca("")}
        <div class="chips">${categorias.map(c => `<button class="chip" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}</div>
      </section>
      <section class="trio">
        <div><h3>Preço final de verdade</h3><p>Importado mostra a conta aberta: produto + frete + imposto + ICMS. Às vezes o barato da vitrine sai mais caro.</p></div>
        <div><h3>Histórico de 6 meses</h3><p>Gráfico por loja e um selo que diz se agora é o menor preço em 90 dias ou se vale esperar.</p></div>
        <div><h3>Alerta de queda</h3><p>Escolha um preço-alvo e o site avisa quando chegar lá.</p></div>
      </section>
      <section>
        <div class="secao-topo"><div><h2>Menor preço em 90 dias</h2><p>Produtos que estão no ponto mais baixo agora.</p></div><button class="btn btn-linha btn-peq" data-todos>Ver os ${D.produtos.length} produtos</button></div>
        <div class="grade" style="margin-top:14px">${achados.map(cartao).join("")}</div>
      </section>`;
  }

  // ---------- tela: resultados ----------
  function telaBusca() {
    let lista = buscar(estado.q, estado.categoria);
    const ordens = {
      final: (a, b) => resumo(a).melhor.total - resumo(b).melhor.total,
      economia: (a, b) => resumo(b).economia - resumo(a).economia,
      nome: (a, b) => a.nome.localeCompare(b.nome)
    };
    lista.sort(ordens[estado.ordem]);
    const titulo = estado.q.trim() ? `Resultados para “${esc(estado.q.trim())}”` : estado.categoria ? esc(estado.categoria) : "Todos os eletrônicos";
    return `${caixaBusca(estado.q)}
      <section>
        <div class="secao-topo">
          <div><h2>${titulo}</h2><p>${lista.length} ${lista.length === 1 ? "produto" : "produtos"} · preço final com frete e impostos</p></div>
          <label style="display:flex;gap:8px;align-items:center;color:var(--muted);font-size:14px">Ordenar
            <select id="ordem" style="background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:7px 10px">
              <option value="final"${estado.ordem === "final" ? " selected" : ""}>Menor preço final</option>
              <option value="economia"${estado.ordem === "economia" ? " selected" : ""}>Maior diferença entre lojas</option>
              <option value="nome"${estado.ordem === "nome" ? " selected" : ""}>Nome</option>
            </select></label>
        </div>
        <div class="chips" style="margin-top:14px"><button class="chip${!estado.categoria ? " ativo" : ""}" data-cat="">Todas</button>${categorias.map(c => `<button class="chip${estado.categoria === c ? " ativo" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("")}</div>
        ${lista.length ? `<div class="grade" style="margin-top:16px">${lista.map(cartao).join("")}</div>`
          : `<div class="vazio" style="margin-top:16px"><h3>Nada encontrado</h3><p>Esta demonstração tem só ${D.produtos.length} eletrônicos. Tente “fone”, “carregador” ou “smartwatch”.</p><button class="btn btn-linha" data-todos>Ver todos</button></div>`}
      </section>`;
  }

  // ---------- tela: produto ----------
  function telaProduto(id) {
    const p = produto(id);
    if (!p) return `<div class="vazio"><h3>Produto não encontrado</h3><a class="btn btn-linha" href="#inicio">Voltar para a busca</a></div>`;
    const r = resumo(p), m = r.melhor, lm = loja(m.loja);
    const porVitrine = [...r.lista].sort((a, b) => a.preco - b.preco)[0];
    const posVitrine = r.lista.indexOf(porVitrine) + 1;
    const alerta = alertas().find(a => a.produtoId === p.id);
    if (!estado.lojaGrafico || !r.lista.some(o => o.loja === estado.lojaGrafico)) estado.lojaGrafico = m.loja;

    const avisoVitrine = porVitrine !== m
      ? `<p>Na vitrine, a <strong>${esc(loja(porVitrine.loja).nome)}</strong> parece a mais barata: <strong class="num">${brl(porVitrine.preco)}</strong>. Somando frete e impostos, fica <strong class="num">${brl(porVitrine.total)}</strong> e cai para o <strong>${posVitrine}º lugar</strong>.</p>`
      : `<p>Aqui a vitrine não engana: a <strong>${esc(lm.nome)}</strong> é a mais barata antes e depois de frete e impostos.</p>`;

    const linhas = r.lista.map((o, i) => {
      const l = loja(o.loja);
      const freteTxt = o.frete ? brl(o.frete) : "grátis";
      const conta = `${brl(o.preco)} + frete ${freteTxt}${o.internacional ? ` <span class="imp">+ imposto ${brl(o.ii)} + ICMS ${brl(o.icms)}</span>` : ""} = <b>${brl(o.total)}</b> na sua casa`;
      return `<tr class="${i === 0 ? "primeiro" : ""}">
        <td data-r="Posição"><span class="posicao">${i + 1}º</span></td>
        <td data-r="Loja"><div class="loja"><span class="loja-sigla">${l.sigla}</span>${esc(l.nome)} <span class="tag ${o.internacional ? "" : "nac"}">${o.internacional ? "importado" : "nacional"}</span></div></td>
        <td class="d num" data-r="Vitrine">${brl(o.preco)}</td>
        <td class="d num" data-r="Frete">${freteTxt}</td>
        <td class="d num" data-r="Impostos">${o.internacional ? brl(o.impostos) : "—"}</td>
        <td class="col-final"><div class="final">${brl(o.total)}</div><div class="conta">${conta}</div></td>
        <td data-r="Prazo" class="num">${o.prazoDias} ${o.prazoDias === 1 ? "dia" : "dias"}</td>
        <td><a class="btn ${i === 0 ? "btn-neon" : "btn-linha"} btn-peq" href="${linkLoja(o, p)}" target="_blank" rel="noopener">Ir para a loja ↗</a></td>
      </tr>`;
    }).join("");

    return `<a class="voltar" href="#busca">← Voltar aos resultados</a>
      <section class="prod-topo">
        <span class="glifo grande">${p.sigla}</span>
        <div><div class="card-cat">${esc(p.categoria)} · ${esc(p.marca)}</div><h1 style="font-size:clamp(26px,4vw,38px);max-width:none">${esc(p.nome)}</h1><ul>${p.specs.map(s => `<li>${esc(s)}</li>`).join("")}</ul></div>
      </section>
      <section class="resumo">
        <div class="painel melhor">
          <span class="rotulo">Melhor preço final na sua casa</span>
          <span class="valor num">${brl(m.total)}</span>
          <span class="onde">na <b>${esc(lm.nome)}</b> · chega em ${m.prazoDias} dias · frete ${m.frete ? brl(m.frete) : "grátis"}${m.internacional ? " · já com impostos" : ""}</span>
          <div>${seloHTML(r.selo)}</div>
          <div class="acoes">
            <a class="btn btn-neon" href="${linkLoja(m, p)}" target="_blank" rel="noopener">Ir para a ${esc(lm.nome)} ↗</a>
            <button class="btn btn-linha" id="abrir-alerta">${alerta ? `Alerta ativo: ${brl(alerta.alvo)}` : "Me avise quando baixar"}</button>
          </div>
          <form class="form-alerta" id="form-alerta" ${estado.formAberto ? "" : "hidden"}>
            <label for="alvo">Avisar quando o preço final chegar a</label>
            <span class="campo-preco"><span class="num">R$</span><input id="alvo" inputmode="decimal" value="${(alerta ? alerta.alvo : Math.floor(m.total * 0.9)).toFixed(2).replace(".", ",")}"></span>
            <button class="btn btn-neon btn-peq" type="submit">${alerta ? "Atualizar" : "Criar alerta"}</button>
            ${alerta ? `<button class="btn btn-linha btn-peq" type="button" id="remover-alerta">Remover</button>` : ""}
          </form>
        </div>
        <div class="painel aviso-vitrine">
          <span class="rotulo">Vitrine × preço final</span>
          ${avisoVitrine}
          <p style="font-size:13px">Importados pagam imposto federal de ${Math.round(T.aliquotaFaixa1 * 100)}% até US$ ${T.limiteFaixa1USD} e ${Math.round(T.aliquotaFaixa2 * 100)}% menos US$ ${T.deducaoFaixa2USD} acima disso, mais ICMS de ${Math.round(T.icms * 100)}%. Regra em vigor desde ${T.vigenteDesde}. Dólar a ${brl(C.cotacaoDolar)}.</p>
        </div>
      </section>
      <section class="painel" style="padding:0">
        <div style="padding:18px 18px 4px"><h2>Lojas, do menor para o maior preço final</h2><p style="margin:4px 0 8px;color:var(--muted);font-size:14px">Preços de demonstração lidos em ${dataBR(D.atualizadoEm)}.</p></div>
        <div class="tabela-wrap" style="padding:0 6px 6px"><table>
          <thead><tr><th>#</th><th>Loja</th><th class="d">Vitrine</th><th class="d">Frete</th><th class="d">Impostos</th><th>Preço final</th><th>Prazo</th><th></th></tr></thead>
          <tbody>${linhas}</tbody>
        </table></div>
      </section>
      <section class="painel">
        <div class="grafico-topo">
          <div><h2>Histórico de preço</h2><p>Preço de vitrine nos últimos 6 meses. Toque numa loja para destacar.</p></div>
          ${seloHTML(selo(r.lista.find(o => o.loja === estado.lojaGrafico)))}
        </div>
        <div class="legenda">${r.lista.map(o => `<button class="chip${o.loja === estado.lojaGrafico ? " ativo" : ""}" data-loja="${o.loja}">${esc(loja(o.loja).nome)}</button>`).join("")}</div>
        <div class="grafico-caixa" id="grafico-caixa" style="margin-top:12px">${grafico(r.lista, estado.lojaGrafico)}</div>
      </section>`;
  }

  // ---------- gráfico (SVG desenhado à mão) ----------
  function grafico(lista, destaque) {
    const W = 900, H = 290, pl = 70, pr = 18, pt = 14, pb = 30;
    const todos = lista.flatMap(o => o.historico.map(h => h.preco));
    let min = Math.min(...todos), max = Math.max(...todos);
    const passo = (() => { const bruto = (max - min) / 4; const pot = Math.pow(10, Math.floor(Math.log10(bruto))); return [1, 2, 2.5, 5, 10].map(m => m * pot).find(v => v >= bruto); })();
    min = Math.floor(min / passo) * passo; max = Math.ceil(max / passo) * passo;
    const n = lista[0].historico.length;
    const x = i => pl + (i / (n - 1)) * (W - pl - pr);
    const y = v => pt + (1 - (v - min) / (max - min)) * (H - pt - pb);
    let g = "";
    for (let v = min; v <= max + 0.001; v += passo) g += `<line class="grade-l" x1="${pl}" x2="${W - pr}" y1="${y(v)}" y2="${y(v)}"/><text x="${pl - 8}" y="${y(v) + 4}" text-anchor="end">${brl(v).replace(",00", "")}</text>`;
    const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
    let ultimoMes = -1;
    lista[0].historico.forEach((h, i) => { const mm = +h.data.slice(5, 7) - 1; if (mm !== ultimoMes && i > 0) { g += `<text x="${x(i)}" y="${H - 8}" text-anchor="middle">${meses[mm]}</text>`; } ultimoMes = mm; });
    const caminho = o => o.historico.map((h, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(h.preco).toFixed(1)}`).join("");
    const outros = lista.filter(o => o.loja !== destaque).map(o => `<path d="${caminho(o)}" fill="none" stroke="#2c3b5c" stroke-width="1.5"/>`).join("");
    const d = lista.find(o => o.loja === destaque);
    const area = `${caminho(d)}L${x(n - 1)},${H - pb}L${x(0)},${H - pb}Z`;
    const fimY = y(d.historico[n - 1].preco);
    return `<svg class="grafico" viewBox="0 0 ${W} ${H}" role="img" aria-label="Histórico de preço da ${esc(loja(destaque).nome)}">
      <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2ee6ff" stop-opacity=".28"/><stop offset="1" stop-color="#2ee6ff" stop-opacity="0"/></linearGradient></defs>
      ${g}${outros}
      <path d="${area}" fill="url(#ga)"/>
      <path d="${caminho(d)}" fill="none" stroke="#2ee6ff" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="${x(n - 1)}" cy="${fimY}" r="5" fill="#2ee6ff"/><circle cx="${x(n - 1)}" cy="${fimY}" r="10" fill="#2ee6ff" fill-opacity=".2"/>
      <line id="g-cursor" x1="0" x2="0" y1="${pt}" y2="${H - pb}" stroke="#2ee6ff" stroke-dasharray="3 3" opacity="0"/>
      <rect id="g-area" x="${pl}" y="${pt}" width="${W - pl - pr}" height="${H - pt - pb}" fill="transparent"/>
    </svg><div class="dica" id="g-dica" hidden></div>`;
  }
  function ligarGrafico(lista) {
    const area = document.getElementById("g-area"); if (!area) return;
    const svg = area.ownerSVGElement, dica = document.getElementById("g-dica"), cursor = document.getElementById("g-cursor");
    const d = lista.find(o => o.loja === estado.lojaGrafico), n = d.historico.length;
    const W = 900, pl = 70, pr = 18;
    function mover(ev) {
      const r = svg.getBoundingClientRect();
      const px = (ev.clientX - r.left) * (W / r.width);
      const i = Math.max(0, Math.min(n - 1, Math.round((px - pl) / (W - pl - pr) * (n - 1))));
      const cx = pl + (i / (n - 1)) * (W - pl - pr);
      cursor.setAttribute("x1", cx); cursor.setAttribute("x2", cx); cursor.setAttribute("opacity", "1");
      const h = d.historico[i];
      dica.innerHTML = `${dataBR(h.data)} · <b>${brl(h.preco)}</b>`;
      dica.style.left = (cx / W * r.width) + "px"; dica.style.top = "30px"; dica.hidden = false;
    }
    area.addEventListener("pointermove", mover);
    area.addEventListener("pointerleave", () => { dica.hidden = true; cursor.setAttribute("opacity", "0"); });
  }

  // ---------- tela: meus alertas ----------
  function telaAlertas() {
    const lista = alertas();
    const sim = simulados();
    if (!lista.length) return `<section class="secao-topo"><div><h2>Meus alertas</h2><p>Os alertas ficam guardados neste navegador.</p></div></section>
      <div class="vazio"><h3>Nenhum alerta ainda</h3><p>Abra um produto e toque em “Me avise quando baixar” para escolher um preço-alvo.</p><a class="btn btn-neon" href="#produto-fone-aurora-max">Experimentar com um fone</a></div>`;
    const itens = lista.map(a => {
      const p = produto(a.produtoId); if (!p) return "";
      const m = resumo(p).melhor, bateu = m.total <= a.alvo, falta = m.total - a.alvo;
      return `<div class="alerta ${bateu ? "disparou" : ""}">
        <span class="glifo">${p.sigla}</span>
        <div><a href="#produto-${p.id}">${esc(p.nome)}</a><div class="meta">${bateu ? `<span class="selo selo-baixa">Baixou!</span>` : `<span class="selo selo-normal">Esperando</span>`} criado em ${dataBR(a.criadoEm)}${sim[p.id] ? " · queda simulada" : ""}</div></div>
        <div class="numeros"><span>agora <b>${brl(m.total)}</b></span><span>seu alvo <b>${brl(a.alvo)}</b></span><span>${bateu ? `na ${esc(loja(m.loja).nome)}` : `faltam ${brl(falta)}`}</span></div>
        <div class="botoes">${sim[p.id] ? `<button class="btn btn-linha btn-peq" data-desfazer="${p.id}">Desfazer simulação</button>` : `<button class="btn btn-linha btn-peq" data-simular="${p.id}">Simular queda</button>`}<button class="btn btn-linha btn-peq" data-remover="${p.id}">Remover</button></div>
      </div>`;
    }).join("");
    return `<section class="secao-topo"><div><h2>Meus alertas</h2><p>No protótipo os alertas ficam neste navegador e o aviso aparece aqui na tela. Use “Simular queda” para ver como seria.</p></div></section>
      <div class="lista-alertas">${itens}</div>`;
  }

  // ---------- avisos na tela ----------
  const avisados = new Set();
  function toast(titulo, texto) {
    const t = document.getElementById("toast"), el = document.createElement("div");
    el.innerHTML = `<b>${titulo}</b>${texto}`;
    t.appendChild(el); setTimeout(() => el.remove(), 6500);
  }
  function verificarAlertas() {
    alertas().forEach(a => {
      const p = produto(a.produtoId); if (!p) return;
      const m = resumo(p).melhor, chave = a.produtoId + m.total;
      if (m.total <= a.alvo && !avisados.has(chave)) {
        avisados.add(chave);
        toast("Baixou!", `${esc(p.nome)} chegou a <span class="num">${brl(m.total)}</span> na ${esc(loja(m.loja).nome)} (seu alvo: ${brl(a.alvo)}).`);
      }
    });
    const qtd = alertas().length, c = document.getElementById("contador");
    c.textContent = qtd; if (qtd) c.removeAttribute("data-zero"); else c.setAttribute("data-zero", "");
  }
  function simularQueda(pid) {
    const a = alertas().find(x => x.produtoId === pid); if (!a) return;
    const s = simulados();
    for (let f = 0.96; f >= 0.3; f -= 0.02) { s[pid] = f; gravar("comparador.simulacao", s, true); if (resumo(produto(pid)).melhor.total <= a.alvo) break; }
  }

  // ---------- navegação ----------
  function ir(rota) { if (location.hash === "#" + rota) render(); else location.hash = rota; }
  function render() {
    const rota = location.hash.slice(1) || "inicio";
    document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("ativo", a.dataset.nav === rota || (rota !== "alertas" && a.dataset.nav === "inicio")));
    let html, pid = null;
    if (rota.startsWith("produto-")) { pid = rota.slice(8); html = telaProduto(pid); }
    else if (rota === "busca") html = telaBusca();
    else if (rota === "alertas") html = telaAlertas();
    else html = telaInicio();
    $app.innerHTML = html + `<footer class="rodape">Protótipo de estudo. Preços de demonstração, inventados. Nomes de lojas aparecem só como texto. Regras de imposto conferidas em 18/11/2026 (${esc(T.fonte)}).</footer>`;
    ligarBusca();
    if (pid && produto(pid)) ligarGrafico(ofertasDe(pid));
    verificarAlertas();
  }

  $app.addEventListener("click", e => {
    const alvo = e.target.closest("button"); if (!alvo) return;
    if (alvo.dataset.cat !== undefined && !alvo.dataset.loja) { estado.categoria = alvo.dataset.cat; estado.q = ""; ir("busca"); }
    else if (alvo.hasAttribute("data-todos")) { estado.categoria = ""; estado.q = ""; ir("busca"); }
    else if (alvo.dataset.loja) { estado.lojaGrafico = alvo.dataset.loja; render(); }
    else if (alvo.id === "abrir-alerta") { estado.formAberto = !estado.formAberto; document.getElementById("form-alerta").hidden = !estado.formAberto; if (estado.formAberto) document.getElementById("alvo").focus(); }
    else if (alvo.id === "remover-alerta" || alvo.dataset.remover) {
      const pid = alvo.dataset.remover || location.hash.slice(9);
      gravar("comparador.alertas", alertas().filter(a => a.produtoId !== pid));
      const s = simulados(); delete s[pid]; gravar("comparador.simulacao", s, true);
      estado.formAberto = false; toast("Alerta removido", ""); render();
    }
    else if (alvo.dataset.simular) { simularQueda(alvo.dataset.simular); render(); }
    else if (alvo.dataset.desfazer) { const s = simulados(); delete s[alvo.dataset.desfazer]; gravar("comparador.simulacao", s, true); avisados.clear(); render(); }
  });
  $app.addEventListener("submit", e => {
    if (e.target.id !== "form-alerta") return;
    e.preventDefault();
    const bruto = document.getElementById("alvo").value.trim();
    const valor = parseFloat(bruto.includes(",") ? bruto.replace(/\./g, "").replace(",", ".") : bruto);
    if (!(valor > 0)) { toast("Valor inválido", "Digite um preço, por exemplo 199,90."); return; }
    const pid = location.hash.slice(9);
    const lista = alertas().filter(a => a.produtoId !== pid);
    lista.push({ produtoId: pid, alvo: Math.round(valor * 100) / 100, criadoEm: new Date().toISOString().slice(0, 10) });
    gravar("comparador.alertas", lista);
    estado.formAberto = false;
    toast("Alerta criado", `Avisamos aqui na tela quando o preço final chegar a ${brl(valor)}.`);
    render();
  });
  $app.addEventListener("change", e => { if (e.target.id === "ordem") { estado.ordem = e.target.value; render(); } });
  window.addEventListener("hashchange", () => { estado.formAberto = false; estado.lojaGrafico = null; render(); window.scrollTo(0, 0); });

  // Exemplo de partida: se a pessoa nunca usou, já começa com um alerta de demonstração.
  if (!ler("comparador.iniciado", false)) {
    gravar("comparador.alertas", [{ produtoId: "watch-fit-s3", alvo: 260, criadoEm: "2026-11-10" }]);
    gravar("comparador.iniciado", true);
  }
  render();
})();
