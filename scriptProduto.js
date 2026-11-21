// Dados de exemplo (os mesmos produtos da home)
const produtos = [
    { nome: "Notebook Gamer Acer Nitro V15", valor: 4599.90, imagem: "https://exemplo.com", descricao: "Notebook com processador Intel Core i5, 16GB RAM, SSD 512GB e placa de vídeo RTX 3050." },
    { nome: "Monitor Gamer LG UltraGear 24\"", valor: 899.00, imagem: "https://exemplo.com", descricao: "Tela IPS Full HD de 24 polegadas, taxa de atualização de 144Hz e tempo de resposta de 1ms." },
    { nome: "Teclado Mecânico Redragon Kumara", valor: 219.90, imagem: "https://exemplo.com", descricao: "Teclado mecânico compacto (TKL), switches Outemu Blue, iluminação RGB e padrão ABNT2." },
    { nome: "Mouse Sem Fio Logitech G Pro X Superlight", valor: 649.00, imagem: "https://exemplo.com", descricao: "Mouse gamer ultraleve (menos de 63g) com sensor HERO 25K de alta precisão." },
    { nome: "Headset Gamer HyperX Cloud II", valor: 449.90, imagem: "https://exemplo.com", descricao: "Fone de ouvido com som surround virtual 7.1, microfone removível com cancelamento de ruído." },
    { nome: "SSD Kingston NV2 1TB NVMe", valor: 389.00, imagem: "https://exemplo.com", descricao: "Armazenamento interno M.2 PCIe 4.0 com velocidades de leitura de até 3500MB/s." },
    { nome: "Placa de Vídeo RTX 4060 8GB", valor: 1999.00, imagem: "https://exemplo.com", descricao: "GPU NVIDIA GeForce com arquitetura Ada Lovelace, suporte a DLSS 3 e Ray Tracing." },
    { nome: "Webcam Logitech C920s Pro HD", valor: 399.90, imagem: "https://exemplo.com", descricao: "Câmera Full HD 1080p com correção automática de luz e tampa de privacidade integrada." }
  ];
  
  // Escolhe o produto pela URL: produto.html?id=2 (padrão: o primeiro)
  const id = Number(new URLSearchParams(window.location.search).get("id")) || 0;
  const produto = produtos[id] || produtos[0];
  
  const moeda = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  
  document.title = "SavePoint - " + produto.nome;
  document.getElementById("caminhoNome").textContent = produto.nome;
  document.getElementById("nomeProduto").textContent = produto.nome;
  document.getElementById("precoProduto").textContent = moeda(produto.valor);
  document.getElementById("parcelaProduto").textContent = "ou 10x de " + moeda(produto.valor / 10) + " sem juros";
  document.getElementById("descProduto").textContent = produto.descricao;
  
  const img = document.getElementById("imgProduto");
  img.src = produto.imagem;
  img.alt = produto.nome;
  img.onerror = () => img.remove(); // sem imagem, aparece o espaço reservado
  
  // Quantidade
  let qtd = 1;
  const qtdEl = document.getElementById("qtd");
  document.getElementById("btnMais").addEventListener("click", () => { qtd++; qtdEl.textContent = qtd; });
  document.getElementById("btnMenos").addEventListener("click", () => {
    if (qtd > 1) { qtd--; qtdEl.textContent = qtd; }
  });
  
  // Botões (protótipo)
  const btnAdicionar = document.getElementById("btnAdicionar");
  btnAdicionar.addEventListener("click", () => {
    btnAdicionar.textContent = "Adicionado!";
    setTimeout(() => { btnAdicionar.textContent = "Adicionar ao carrinho"; }, 1500);
  });
  document.getElementById("btnComprar").addEventListener("click", () => {
    window.location.href = "login.html";
  });