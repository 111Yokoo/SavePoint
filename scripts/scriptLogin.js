const form = document.getElementById("formLogin");
const inputEmail = document.getElementById("email");
const inputSenha = document.getElementById("senha");
const erroGeral = document.getElementById("erroGeral");
const btnMostrarSenha = document.getElementById("btnMostrarSenha");

// Mostrar / ocultar senha
btnMostrarSenha.addEventListener("click", () => {
  inputSenha.type = inputSenha.type === "password" ? "text" : "password";
});

// Login de protótipo: confere com o usuário de teste (ou o que foi salvo)
form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const email = inputEmail.value.trim().toLowerCase();
  const senha = inputSenha.value;

  if (!email || !senha) {
    erroGeral.textContent = "Preencha e-mail e senha.";
    return;
  }

  const usuario = getUsuario();
  if (email !== usuario.email.toLowerCase() || senha !== usuario.senha) {
    erroGeral.textContent = "E-mail ou senha incorretos.";
    return;
  }

  entrar();
  window.location.href = "index.html";
});