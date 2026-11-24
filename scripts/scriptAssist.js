/* ===================== Configuração ===================== */

const HORA_ABRE = 8;
const HORA_FECHA = 18; // último horário começa às 17h
const CHAVE_STORAGE = "savepoint_agendamentos";

// Serviços que o cliente escolhe ao agendar a assistência técnica
const SERVICOS = {
  celulares: "Celulares",
  computadores: "Computadores",
  videogames: "Videogames"
};

// Seg a sex: 8h às 18h | Sáb: 8h às 12h | Dom: fechado
function horasDoDia(data) {
  const dia = data.getDay();
  if (dia === 0) return [];
  const fim = dia === 6 ? 12 : HORA_FECHA;
  const horas = [];
  for (let h = HORA_ABRE; h < fim; h++) horas.push(h);
  return horas;
}

/*
  TODO (backend): hoje os horários já ocupados por outros clientes são
  simulados (veja horarioOcupadoPorOutros) e os agendamentos do usuário ficam
  no localStorage. Para produção, troque por uma consulta ao Supabase:
  uma tabela "agendamentos" (data, hora, servico, nome, telefone, descricao)
  e carregue as linhas da semana exibida em vez de usar estas funções.
*/
function horarioOcupadoPorOutros(chave) {
  let hash = 0;
  for (let i = 0; i < chave.length; i++) {
    hash = (hash * 31 + chave.charCodeAt(i)) >>> 0;
  }
  return hash % 5 === 0;
}

/* ===================== Estado ===================== */

const estado = {
  inicioSemana: inicioDaSemana(new Date()),
  filtro: "todos", // todos | livre | ocupado
  agendamentos: carregarAgendamentos(),
  slotAberto: null
};

function carregarAgendamentos() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_STORAGE)) || {};
  } catch (e) {
    return {};
  }
}

function salvarAgendamentos() {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(estado.agendamentos));
  } catch (e) {
    /* storage indisponível: segue só em memória */
  }
}

/* ===================== Utilidades de data ===================== */

function inicioDaSemana(data) {
  const d = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  const diff = (d.getDay() + 6) % 7; // segunda = 0
  d.setDate(d.getDate() - diff);
  return d;
}

function somarDias(data, dias) {
  const d = new Date(data);
  d.setDate(d.getDate() + dias);
  return d;
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function ymd(data) {
  return `${data.getFullYear()}-${pad(data.getMonth() + 1)}-${pad(data.getDate())}`;
}

function chaveSlot(data, hora) {
  return `${ymd(data)}|${hora}`;
}

function mesmoDia(a, b) {
  return ymd(a) === ymd(b);
}

function dataHoraSlot(data, hora) {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate(), hora, 0, 0);
}

function rotuloHora(hora) {
  return `${pad(hora)}:00 – ${pad(hora + 1)}:00`;
}

function tituloPeriodo(inicio) {
  const fim = somarDias(inicio, 6);
  const mesAno = (d) => d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  if (inicio.getMonth() === fim.getMonth()) return mesAno(inicio);
  const mesCurto = inicio.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
  const mesCurtoFim = fim.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
  if (inicio.getFullYear() === fim.getFullYear()) {
    return `${mesCurto} – ${mesCurtoFim} de ${fim.getFullYear()}`;
  }
  return `${mesCurto} de ${inicio.getFullYear()} – ${mesCurtoFim} de ${fim.getFullYear()}`;
}

/* ===================== Elementos ===================== */

const cabecalhoDias = document.getElementById("cabecalhoDias");
const corpoCalendario = document.getElementById("corpoCalendario");
const tituloEl = document.getElementById("tituloPeriodo");
const resumoEl = document.getElementById("resumoSemana");
const toastEl = document.getElementById("toast");

const dialog = document.getElementById("dialogAgendamento");
const formAg = document.getElementById("formAgendamento");
const dialogTitulo = document.getElementById("dialogTitulo");
const dialogHorario = document.getElementById("dialogHorario");
const blocoNovo = document.getElementById("blocoNovo");
const blocoMeu = document.getElementById("blocoMeu");
const meuResumo = document.getElementById("meuResumo");
const agServico = document.getElementById("agServico");
const agNome = document.getElementById("agNome");
const agTelefone = document.getElementById("agTelefone");
const agDescricao = document.getElementById("agDescricao");
const agDescricaoLabel = document.getElementById("agDescricaoLabel");
const erroAg = document.getElementById("erroAg");
const btnConfirmar = document.getElementById("btnConfirmar");
const btnCancelar = document.getElementById("btnCancelar");
const btnFechar = document.getElementById("btnFechar");

agDescricaoLabel.textContent = "Descreva o problema do equipamento (opcional)";

/* ===================== Renderização ===================== */

function el(tag, classe, texto) {
  const e = document.createElement(tag);
  if (classe) e.className = classe;
  if (texto !== undefined) e.textContent = texto;
  return e;
}

// livre | ocupado (de outro cliente) | meu (agendado por você) | passado
function statusDoSlot(data, hora) {
  const chave = chaveSlot(data, hora);
  if (estado.agendamentos[chave]) return "meu";
  if (dataHoraSlot(data, hora) <= new Date()) return "passado";
  if (horarioOcupadoPorOutros(chave)) return "ocupado";
  return "livre";
}

// O filtro "Ocupados" inclui os horários que você mesmo agendou
function passaNoFiltro(status) {
  if (estado.filtro === "todos") return true;
  if (estado.filtro === "livre") return status === "livre";
  return status === "ocupado" || status === "meu";
}

function criarSlot(data, hora, status) {
  const botao = el("button", `slot ${status}`);
  botao.type = "button";
  botao.appendChild(el("span", "slotHora", rotuloHora(hora)));
  botao.appendChild(el("span", "slotTipo", "Assistência técnica"));

  let textoStatus = {
    livre: "Disponível",
    ocupado: "Ocupado",
    passado: "Encerrado",
    meu: "Seu agendamento"
  }[status];

  if (status === "meu") {
    const servico = SERVICOS[estado.agendamentos[chaveSlot(data, hora)].servico];
    if (servico) textoStatus += ` · ${servico}`;
  }
  botao.appendChild(el("span", "slotStatus", textoStatus));

  const dataTexto = data.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  botao.setAttribute("aria-label", `Assistência técnica, ${dataTexto}, ${rotuloHora(hora)}: ${textoStatus}`);

  if (status === "livre" || status === "meu") {
    botao.addEventListener("click", () => abrirDialog(data, hora, status));
  } else {
    botao.disabled = true;
  }
  return botao;
}

function renderizar() {
  const hoje = new Date();
  const dias = Array.from({ length: 7 }, (_, i) => somarDias(estado.inicioSemana, i));
  const totalHoras = HORA_FECHA - HORA_ABRE;

  tituloEl.textContent = tituloPeriodo(estado.inicioSemana);

  // Cabeçalho com os dias
  cabecalhoDias.replaceChildren(el("div"));
  dias.forEach((dia) => {
    const caixa = el("div", "diaTitulo" + (mesmoDia(dia, hoje) ? " hoje" : ""));
    caixa.appendChild(el("span", "diaSemana", dia.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "")));
    caixa.appendChild(el("span", "diaNumero", String(dia.getDate())));
    cabecalhoDias.appendChild(caixa);
  });

  // Corpo: coluna de horas + 7 dias
  corpoCalendario.replaceChildren();
  const colHoras = el("div", "colHoras");
  for (let h = HORA_ABRE; h < HORA_FECHA; h++) {
    colHoras.appendChild(el("div", "horaRotulo", h === HORA_ABRE ? "" : `${pad(h)}:00`));
  }
  corpoCalendario.appendChild(colHoras);

  let disponiveis = 0;
  let ocupados = 0;

  dias.forEach((dia) => {
    const horasAbertas = horasDoDia(dia);
    const col = el("div", "colDia" + (horasAbertas.length === 0 ? " fechado" : ""));

    for (let h = HORA_ABRE; h < HORA_FECHA; h++) {
      const celula = el("div", "celula");
      if (horasAbertas.includes(h)) {
        const status = statusDoSlot(dia, h);
        if (status === "livre") disponiveis++;
        if (status === "ocupado" || status === "meu") ocupados++;
        celula.appendChild(passaNoFiltro(status) ? criarSlot(dia, h, status) : el("div", "slotVazio"));
      }
      col.appendChild(celula);
    }

    // linha do horário atual
    if (mesmoDia(dia, hoje)) {
      const fracao = hoje.getHours() + hoje.getMinutes() / 60 - HORA_ABRE;
      if (fracao >= 0 && fracao <= totalHoras) {
        const linha = el("div", "linhaAgora");
        linha.style.top = `${(fracao / totalHoras) * 100}%`;
        col.appendChild(linha);
      }
    }
    corpoCalendario.appendChild(col);
  });

  resumoEl.textContent =
    `Nesta semana: ${disponiveis} horários disponíveis e ${ocupados} ocupados para assistência técnica.`;
}

/* ===================== Diálogo ===================== */

function abrirDialog(data, hora, status) {
  estado.slotAberto = { data, hora, chave: chaveSlot(data, hora) };
  erroAg.textContent = "";

  const dataTexto = data.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  dialogHorario.textContent = `${dataTexto}, ${rotuloHora(hora)}`;

  if (status === "meu") {
    const ag = estado.agendamentos[estado.slotAberto.chave];
    const servico = SERVICOS[ag.servico] || "serviço não informado";
    dialogTitulo.textContent = "Seu agendamento";
    meuResumo.textContent = `Assistência técnica (${servico}) em nome de ${ag.nome}. Contato: ${ag.telefone}.` +
      (ag.descricao ? ` Observação: ${ag.descricao}` : "");
    blocoNovo.hidden = true;
    blocoMeu.hidden = false;
    btnConfirmar.hidden = true;
    btnCancelar.hidden = false;
  } else {
    dialogTitulo.textContent = "Agendar assistência técnica";
    formAg.reset();
    blocoNovo.hidden = false;
    blocoMeu.hidden = true;
    btnConfirmar.hidden = false;
    btnCancelar.hidden = true;
  }
  dialog.showModal();
}

formAg.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const servico = agServico.value;
  const nome = agNome.value.trim();
  const telefone = agTelefone.value.trim();

  if (!servico) {
    erroAg.textContent = "Escolha o serviço: celulares, computadores ou videogames.";
    agServico.focus();
    return;
  }
  if (!nome) {
    erroAg.textContent = "Digite seu nome.";
    agNome.focus();
    return;
  }
  if (telefone.replace(/\D/g, "").length < 10) {
    erroAg.textContent = "Digite um telefone com DDD, como (16) 90000-0000.";
    agTelefone.focus();
    return;
  }

  estado.agendamentos[estado.slotAberto.chave] = {
    servico,
    nome,
    telefone,
    descricao: agDescricao.value.trim()
  };
  salvarAgendamentos();
  dialog.close();
  renderizar();
  mostrarAviso("Agendamento confirmado.");
});

btnCancelar.addEventListener("click", () => {
  delete estado.agendamentos[estado.slotAberto.chave];
  salvarAgendamentos();
  dialog.close();
  renderizar();
  mostrarAviso("Agendamento cancelado.");
});

btnFechar.addEventListener("click", () => dialog.close());

// fecha ao clicar no fundo escuro
dialog.addEventListener("click", (evento) => {
  if (evento.target === dialog) dialog.close();
});

let temporizadorAviso;
function mostrarAviso(texto) {
  toastEl.textContent = texto;
  toastEl.classList.add("visivel");
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => toastEl.classList.remove("visivel"), 2600);
}

/* ===================== Navegação e filtros ===================== */

document.getElementById("btnSemanaAnterior").addEventListener("click", () => {
  estado.inicioSemana = somarDias(estado.inicioSemana, -7);
  renderizar();
});

document.getElementById("btnSemanaSeguinte").addEventListener("click", () => {
  estado.inicioSemana = somarDias(estado.inicioSemana, 7);
  renderizar();
});

document.getElementById("btnHoje").addEventListener("click", () => {
  estado.inicioSemana = inicioDaSemana(new Date());
  renderizar();
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    estado.filtro = chip.dataset.filtro;
    document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("ativo", c === chip));
    renderizar();
  });
});

// atualiza a linha do horário atual e slots que já passaram
setInterval(renderizar, 60000);

renderizar();