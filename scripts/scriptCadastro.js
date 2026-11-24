const form = document.getElementById("formCadastro");
const erroGeral = document.getElementById("erroGeral");

// Cadastro de protótipo: confere os campos, salva o usuário e vai para o login
form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const usuario = {
    nome: document.getElementById("nome").value.trim(),
    rg: document.getElementById("rg").value.trim(),
    cpf: document.getElementById("cpf").value.trim(),
    nascimento: document.getElementById("nascimento").value,
    telefone: document.getElementById("telefone").value.trim(),
    email: document.getElementById("email").value.trim(),
    senha: document.getElementById("senha").value
  };
  const confirmar = document.getElementById("confirmarSenha").value;

  if (Object.values(usuario).some((valor) => !valor)) {
    erroGeral.textContent = "Preencha todos os campos.";
    return;
  }

  if (usuario.senha !== confirmar) {
    erroGeral.textContent = "As senhas não são iguais.";
    return;
  }

  salvarUsuario(usuario);
  sair();
  window.location.href = "login.html";
});