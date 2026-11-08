const id = new URLSearchParams(location.search).get("id");
const produto = buscarProduto(id);

const areaProduto = document.querySelector(".produto");
const naoEncontrado = document.querySelector(".produto-nao-encontrado");
const formCompra = document.querySelector(".produto-compra");
const campoQuantidade = document.querySelector("#quantidade");
const aviso = document.querySelector(".produto-aviso");
const listaRelacionados = document.querySelector(".relacionados .produtos");

function preencherProduto() {
    document.title = produto.nome + " | Loja Impossível";

    const imagem = document.querySelector(".produto-imagem");
    imagem.src = produto.imagem;
    imagem.alt = produto.nome;
    imagem.style.objectPosition = produto.foco || "center";

    areaProduto.style.setProperty("--cor", CATEGORIAS[produto.categoria].cor);
    document.querySelector(".trilha-atual").textContent = produto.nome;
    document.querySelector(".produto-categoria").textContent = produto.categoria;
    document.querySelector(".produto-nome").textContent = produto.nome;
    document.querySelector(".produto-regra strong").textContent = produto.regra;
    document.querySelector(".produto-descricao").textContent = produto.descricao;

    const desconto = Math.round((1 - produto.preco / produto.precoAntigo) * 100);
    document.querySelector(".produto-preco strong").textContent = formatarPreco(produto.preco);
    document.querySelector(".produto-preco s").textContent = formatarPreco(produto.precoAntigo);
    document.querySelector(".produto-economia").textContent = desconto + "% OFF";
    document.querySelector(".produto-parcelas").textContent =
        "ou 10x de " + formatarPreco(produto.preco / 10) + " sem juros";

    document.querySelector(".produto-detalhes").innerHTML = produto.detalhes
        .map(function (detalhe) { return "<li>" + detalhe + "</li>"; })
        .join("");
}

function lerQuantidade() {
    const qtd = parseInt(campoQuantidade.value, 10);
    if (isNaN(qtd) || qtd < 1) return 1;
    return Math.min(qtd, 10);
}

function mostrarRelacionados() {
    const outros = PRODUTOS.filter(function (p) { return p.id !== id; });
    outros.sort(function (a, b) {
        const aMesma = produto && a.categoria === produto.categoria ? 0 : 1;
        const bMesma = produto && b.categoria === produto.categoria ? 0 : 1;
        return aMesma - bMesma;
    });

    listaRelacionados.innerHTML = outros
        .slice(0, 4)
        .map(function (p) { return criarCard(p, "produto.html"); })
        .join("");

    ativarBotoesDosCards(listaRelacionados);
}

if (produto) {
    preencherProduto();

    formCompra.addEventListener("submit", function (evento) {
        evento.preventDefault();
        const qtd = lerQuantidade();
        adicionarAoCarrinho(produto.id, qtd);
        aviso.innerHTML = qtd + (qtd === 1 ? " item adicionado" : " itens adicionados") +
            ' ao carrinho. <a href="checkout.html">Ir para o carrinho</a>';
    });

    document.querySelector('[data-acao="comprar"]').addEventListener("click", function () {
        adicionarAoCarrinho(produto.id, lerQuantidade());
        location.href = "checkout.html";
    });
} else {
    areaProduto.hidden = true;
    naoEncontrado.hidden = false;
    document.querySelector(".trilha-atual").textContent = "Não encontrado";
}

mostrarRelacionados();
