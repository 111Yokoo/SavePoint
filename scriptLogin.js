const form = document.getElementById("formLogin");
const inputEmail = document.getElementById("email");
const inputSenha = document.getElementById("senha");
const erroGeral = document.getElementById("erroGeral");
const btnMostrarSenha = document.getElementById("btnMostrarSenha");

// Mostrar / ocultar senha
btnMostrarSenha.addEventListener("click", () => {
  inputSenha.type = inputSenha.type === "password" ? "text" : "password";
});

// Login de protótipo: só confere se os campos foram preenchidos
form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!inputEmail.value.trim() || !inputSenha.value) {
    erroGeral.textContent = "Preencha e-mail e senha.";
    return;
  }

  window.location.href = "index.html";
});