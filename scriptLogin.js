const form = document.getElementById("formLogin");
const inputEmail = document.getElementById("email");
const inputSenha = document.getElementById("senha");
const erroEmail = document.getElementById("erroEmail");
const erroSenha = document.getElementById("erroSenha");
const erroGeral = document.getElementById("erroGeral");
const btnEntrar = document.getElementById("btnEntrar");
const btnMostrarSenha = document.getElementById("btnMostrarSenha");
const lembrar = document.getElementById("lembrar");

// Preenche o e-mail se o usuário marcou "Lembrar de mim" antes
const emailSalvo = localStorage.getItem("savepoint_email");
if (emailSalvo) {
  inputEmail.value = emailSalvo;
  lembrar.checked = true;
}

// Mostrar / ocultar senha
btnMostrarSenha.addEventListener("click", () => {
  const mostrando = inputSenha.type === "text";
  inputSenha.type = mostrando ? "password" : "text";
  btnMostrarSenha.setAttribute("aria-label", mostrando ? "Mostrar senha" : "Ocultar senha");
  btnMostrarSenha.title = mostrando ? "Mostrar senha" : "Ocultar senha";
});

function marcarErro(input, spanErro, mensagem) {
  input.closest(".campo").classList.add("invalido");
  spanErro.textContent = mensagem;
}

function limparErro(input, spanErro) {
  input.closest(".campo").classList.remove("invalido");
  spanErro.textContent = "";
}

function validar() {
  let valido = true;
  const email = inputEmail.value.trim();
  const senha = inputSenha.value;

  limparErro(inputEmail, erroEmail);
  limparErro(inputSenha, erroSenha);
  erroGeral.textContent = "";

  if (!email) {
    marcarErro(inputEmail, erroEmail, "Digite seu e-mail.");
    valido = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    marcarErro(inputEmail, erroEmail, "Digite um e-mail válido, como voce@email.com.");
    valido = false;
  }

  if (!senha) {
    marcarErro(inputSenha, erroSenha, "Digite sua senha.");
    valido = false;
  } else if (senha.length < 6) {
    marcarErro(inputSenha, erroSenha, "A senha precisa ter pelo menos 6 caracteres.");
    valido = false;
  }

  return valido;
}

// Limpa o erro do campo enquanto a pessoa corrige
inputEmail.addEventListener("input", () => limparErro(inputEmail, erroEmail));
inputSenha.addEventListener("input", () => limparErro(inputSenha, erroSenha));

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  if (!validar()) return;

  const email = inputEmail.value.trim();
  const senha = inputSenha.value;

  btnEntrar.disabled = true;
  btnEntrar.textContent = "Entrando...";

  try {
    // TODO: troque este trecho pela chamada ao seu backend / Supabase.
    // Exemplo com Supabase:
    //   const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    //   if (error) throw error;
    await new Promise((resolve) => setTimeout(resolve, 600)); // simulação

    if (lembrar.checked) {
      localStorage.setItem("savepoint_email", email);
    } else {
      localStorage.removeItem("savepoint_email");
    }

    window.location.href = "index.html";
  } catch (erro) {
    erroGeral.textContent = "E-mail ou senha incorretos. Confira os dados e tente de novo.";
  } finally {
    btnEntrar.disabled = false;
    btnEntrar.textContent = "Entrar";
  }
});