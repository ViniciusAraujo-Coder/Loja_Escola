const listaProdutos = document.querySelector(".produtos");
const areaFiltros = document.querySelector(".filtros");
const mensagemVazia = document.querySelector(".catalogo-vazio");
const contagem = document.querySelector(".catalogo-contagem");
const formBusca = document.querySelector(".busca");
const campoBusca = document.querySelector("#busca");

let categoriaAtual = "Todos";

function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function mostrarProdutos() {
    const termo = normalizar(campoBusca.value.trim());

    const filtrados = PRODUTOS.filter(function (produto) {
        const naCategoria = categoriaAtual === "Todos" || produto.categoria === categoriaAtual;
        const textoDoProduto = normalizar(
            produto.nome + " " + produto.descricao + " " + produto.categoria + " " + produto.regra
        );
        return naCategoria && textoDoProduto.includes(termo);
    });

    listaProdutos.innerHTML = filtrados
        .map(function (produto) { return criarCard(produto, "pages/produto.html"); })
        .join("");

    mensagemVazia.hidden = filtrados.length > 0;
    contagem.textContent = filtrados.length === 1
        ? "1 produto"
        : filtrados.length + " produtos";
}

function criarFiltros() {
    const categorias = ["Todos"];
    PRODUTOS.forEach(function (produto) {
        if (!categorias.includes(produto.categoria)) categorias.push(produto.categoria);
    });

    areaFiltros.innerHTML = categorias
        .map(function (categoria) {
            const ativo = categoria === categoriaAtual;
            const info = CATEGORIAS[categoria];
            const qtd = categoria === "Todos"
                ? PRODUTOS.length
                : PRODUTOS.filter(function (p) { return p.categoria === categoria; }).length;

            return `
                <button type="button" class="filtro" data-categoria="${categoria}" aria-pressed="${ativo}" style="--cor: ${info.cor}">
                    <span class="filtro-icone" aria-hidden="true">${info.icone}</span>
                    <strong>${categoria}</strong>
                    <span class="filtro-qtd">${qtd} ${qtd === 1 ? "produto" : "produtos"}</span>
                </button>
            `;
        })
        .join("");
}

function escolherCategoria(categoria) {
    categoriaAtual = categoria;
    criarFiltros();
    mostrarProdutos();
}

areaFiltros.addEventListener("click", function (evento) {
    const botao = evento.target.closest(".filtro");
    if (!botao) return;
    escolherCategoria(botao.dataset.categoria);
});

const formNovidades = document.querySelector(".novidades-form");
formNovidades.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const email = formNovidades.querySelector("input");
    const mensagem = formNovidades.querySelector(".novidades-mensagem");

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        mensagem.textContent = "Pronto! Você vai receber nossas ofertas impossíveis.";
        email.value = "";
    } else {
        mensagem.textContent = "Digite um e-mail válido.";
    }
});

formBusca.addEventListener("submit", function (evento) {
    evento.preventDefault();
    mostrarProdutos();
    document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth" });
});

campoBusca.addEventListener("input", mostrarProdutos);

const buscaDaUrl = new URLSearchParams(location.search).get("busca");
if (buscaDaUrl) {
    campoBusca.value = buscaDaUrl;
}

criarFiltros();
mostrarProdutos();
ativarBotoesDosCards(listaProdutos);

if (buscaDaUrl) {
    document.querySelector("#catalogo").scrollIntoView();
}
