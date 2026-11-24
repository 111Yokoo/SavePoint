const produtos = [
  {
    nome: "Notebook Gamer Acer Nitro V15",
    valor: 4599.90,
    imagem: "./assets/notebookAcerV15.png",
    descricao: "Notebook com processador Intel Core i5, 16GB RAM, SSD 512GB e placa de vídeo RTX 3050."
  },
  {
    nome: "Monitor Gamer LG UltraGear 24\"",
    valor: 899.00,
    imagem: "./assets/monitor24.webp",
    descricao: "Tela IPS Full HD de 24 polegadas, taxa de atualização de 144Hz e tempo de resposta de 1ms."
  },
  {
    nome: "Teclado Mecânico Redragon Kumara",
    valor: 219.90,
    imagem: "./assets/tecladoKumara.webp",
    descricao: "Teclado mecânico compacto (TKL), switches Outemu Blue, iluminação RGB e padrão ABNT2."
  },
  {
    nome: "Mouse Sem Fio Logitech G Pro X Superlight",
    valor: 649.00,
    imagem: "./assets/mouseLog.avif",
    descricao: "Mouse gamer ultraleve (menos de 63g) com sensor HERO 25K de alta precisão."
  },
  {
    nome: "Headset Gamer HyperX Cloud II",
    valor: 449.90,
    imagem: "./assets/headsetHyperX.png",
    descricao: "Fone de ouvido com som surround virtual 7.1, microfone removível com cancelamento de ruído."
  },
  {
    nome: "SSD Kingston NV2 1TB NVMe",
    valor: 389.00,
    imagem: "./assets/ssdKingstone.jpg",
    descricao: "Armazenamento interno M.2 PCIe 4.0 com velocidades de leitura de até 3500MB/s."
  },
  {
    nome: "Placa de Vídeo RTX 4060 8GB",
    valor: 1999.00,
    imagem: "./assets/placaVideo.avif",
    descricao: "GPU NVIDIA GeForce com arquitetura Ada Lovelace, suporte a DLSS 3 e Ray Tracing."
  },
  {
    nome: "Webcam Logitech C920s Pro HD",
    valor: 399.90,
    imagem: "./assets/camLogitech.webp",
    descricao: "Câmera Full HD 1080p com correção automática de luz e tampa de privacidade integrada."
  }
];

const bannerCards = document.getElementById("bannerCard");
const cardPromo = document.getElementById("cardPromo");
const cardVend = document.getElementById("cardVend");

// Monta o card de um produto. Clicar no card abre produto.html?id=posição
function criarCard(produto, i) {
  const valorFormatado = produto.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const nome = produto.nome.replace(/"/g, "&quot;"); // evita quebrar os atributos HTML
  return `
    <section class="cardProduct" onclick="window.location.href='produto.html?id=${i}'">
      <img src="${produto.imagem}" alt="${nome}" />
      <h3>${produto.nome}</h3>
      <div class="cardFooter">
        <span>${valorFormatado}</span>
        <button class="btnCarrinho" onclick="event.stopPropagation()" aria-label="Adicionar ${nome} ao carrinho" title="Adicionar ao carrinho">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"></path>
          </svg>
        </button>
      </div>
    </section>
  `;
}

let html = "";
for (let i = 0; i < produtos.length; i++) {
  html += criarCard(produtos[i], i);
}
bannerCards.innerHTML = html;
cardPromo.innerHTML = html;
cardVend.innerHTML = html;

// Setas dos carrosséis
function ligarSetas(idVoltar, idAvancar, container) {
  document.getElementById(idVoltar).addEventListener("click", () => {
    container.scrollBy({ left: -270, behavior: "smooth" });
  });
  document.getElementById(idAvancar).addEventListener("click", () => {
    container.scrollBy({ left: 270, behavior: "smooth" });
  });
}

ligarSetas("btnVoltarBanner", "btnAvancarBanner", bannerCards);
ligarSetas("btnVoltarPromo", "btnAvancarPromo", cardPromo);
ligarSetas("btnVoltarVend", "btnAvancarVend", cardVend);