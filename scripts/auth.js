// Autenticação de protótipo: usuário de teste fixo + dados salvos no localStorage
const CHAVE_USUARIO = "savepoint_usuario";
const CHAVE_SESSAO = "savepoint_logado";

// Usuário de teste (entre com teste@savepoint.com / 123456)
const USUARIO_TESTE = {
  nome: "Matheus Dozono Yokoo",
  rg: "00.000.000-0",
  cpf: "000.000.000-00",
  nascimento: "2000-01-01",
  telefone: "(16) 90000-0000",
  email: "teste@savepoint.com",
  senha: "123456"
};

// Se nada foi salvo ainda, usa o usuário de teste
function getUsuario() {
  const salvo = localStorage.getItem(CHAVE_USUARIO);
  return salvo ? JSON.parse(salvo) : USUARIO_TESTE;
}

function salvarUsuario(usuario) {
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
}

function estaLogado() {
  return localStorage.getItem(CHAVE_SESSAO) === "1";
}

function entrar() {
  localStorage.setItem(CHAVE_SESSAO, "1");
}

function sair() {
  localStorage.removeItem(CHAVE_SESSAO);
}

// No header, troca "Logar" pelo nome do usuário (e leva para a página de usuário)
function atualizarHeader() {
  const link = document.querySelector('nav a[href="login.html"], nav a[href="usuario.html"]');
  if (!link) return;
  if (estaLogado()) {
    const usuario = getUsuario();
    link.href = "usuario.html";
    link.title = usuario.nome;
    link.querySelector("li").textContent = usuario.nome.split(" ")[0];
  } else {
    link.href = "login.html";
    link.querySelector("li").textContent = "Logar";
  }
}

atualizarHeader();
