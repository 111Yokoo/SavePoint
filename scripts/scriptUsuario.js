// Só entra quem estiver logado
if (!estaLogado()) {
    window.location.href = "login.html";
  }
  
  const campos = ["nome", "email", "rg", "cpf", "nascimento", "telefone"];
  const msgDados = document.getElementById("msgDados");
  const msgSenha = document.getElementById("msgSenha");
  
  function mostrarMsg(elemento, texto, ok) {
    if (!elemento) {
        console.error("Elemento da mensagem não encontrado!");
        return;
    }

    elemento.textContent = texto;
    elemento.className = "msg " + (ok ? "ok" : "erro");
}
  
  // Preenche formulário e topo da página com os dados salvos
  function preencher() {
    const usuario = getUsuario();
    campos.forEach((campo) => {
      document.getElementById(campo).value = usuario[campo];
    });
    document.getElementById("avatar").textContent = usuario.nome.charAt(0).toUpperCase();
    document.getElementById("topoNome").textContent = usuario.nome;
    document.getElementById("topoEmail").textContent = usuario.email;
  }
  preencher();
  
  // Salvar dados
  document.getElementById("formDados").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const usuario = getUsuario();
    campos.forEach((campo) => {
      usuario[campo] = document.getElementById(campo).value.trim();
    });
  
    if (campos.some((campo) => !usuario[campo])) {
      mostrarMsg(msgDados, "Preencha todos os campos.", false);
      return;
    }
  
    salvarUsuario(usuario);
    preencher();
    atualizarHeader(); // o nome no header muda na hora
    mostrarMsg(msgDados, "Dados atualizados.", true);
  });
  
  // Alterar senha
  document.getElementById("formSenha").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const usuario = getUsuario();
    const atual = document.getElementById("senhaAtual").value;
    const nova = document.getElementById("novaSenha").value;
    const confirmar = document.getElementById("confirmarNova").value;
  
    if (atual !== usuario.senha) {
      mostrarMsg(msgSenha, "A senha atual está incorreta.", false);
    } else if (nova.length < 6) {
      mostrarMsg(msgSenha, "A nova senha precisa ter pelo menos 6 caracteres.", false);
    } else if (nova !== confirmar) {
      mostrarMsg(msgSenha, "As senhas não são iguais.", false);
    } else {
      usuario.senha = nova;
      salvarUsuario(usuario);
      evento.target.reset();
      mostrarMsg(msgSenha, "Senha alterada.", true);
    }
  });
  
  // Sair
  document.getElementById("btnSair").addEventListener("click", () => {
    sair();
    window.location.href = "index.html";
  });
  
  // Excluir conta (volta para o usuário de teste)
  document.getElementById("btnExcluir").addEventListener("click", () => {
    if (confirm("Tem certeza que deseja excluir sua conta?")) {
      localStorage.removeItem(CHAVE_USUARIO);
      sair();
      window.location.href = "index.html";
    }
  });