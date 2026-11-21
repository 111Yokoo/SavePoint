const form = document.getElementById("formCadastro");
const erroGeral = document.getElementById("erroGeral");

// Cadastro de protótipo: só confere os campos e vai para o login
form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmar = document.getElementById("confirmarSenha").value;

  if (!nome || !email || !telefone || !senha) {
    erroGeral.textContent = "Preencha todos os campos.";
    return;
  }

  if (senha !== confirmar) {
    erroGeral.textContent = "As senhas não são iguais.";
    return;
  }

  window.location.href = "login.html";
});