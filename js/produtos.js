const PRODUTOS = [
    {
        id: "mini-sol",
        nome: "Mini Sol de Bolso",
        categoria: "Miniaturas",
        regra: "Cabe no bolso",
        descricao: "Um sol de verdade, só que do tamanho de uma bola de pingue-pongue.",
        detalhes: [
            "Ilumina e aquece um cômodo de até 20 m²",
            "Acompanha estojo térmico à prova de fusão nuclear",
            "Não olhe diretamente (sério)"
        ],
        preco: 89.9,
        precoAntigo: 129.9,
        imagem: "img/produtos/sol.png"
    },
    {
        id: "botas-orbitais",
        nome: "Botas Orbitais Antigravidade",
        categoria: "Espaço e Tempo",
        regra: "Uso no espaço",
        descricao: "Caminhe pela estação espacial sem sair voando pelo teto.",
        detalhes: [
            "Solado magnético com 3 níveis de aderência",
            "Testadas em gravidade zero e em tapetes escorregadios",
            "Tamanhos do 34 ao 46"
        ],
        preco: 349,
        precoAntigo: 499,
        imagem: "img/produtos/botas.jpg"
    },
    {
        id: "abraco-em-lata",
        nome: "Abraço em Lata",
        categoria: "Bem-estar",
        regra: "Uso único",
        descricao: "Abriu, abraçou. Sem refil, sem arrependimento.",
        detalhes: [
            "Um abraço apertado de 8 segundos",
            "Embalagem 100% reciclável",
            "Validade: até alguém precisar"
        ],
        preco: 24.9,
        precoAntigo: 34.9,
        imagem: "img/produtos/abraco.jpg",
        foco: "50% 75%"
    },
    {
        id: "baoba-xxl",
        nome: "Baobá de Estimação XXL",
        categoria: "Gigantes",
        regra: "Não cabe em avião",
        descricao: "Um baobá adulto de 7 metros para quem sonha grande.",
        detalhes: [
            "Entregue já plantado, com raiz e tudo",
            "Rega recomendada: uma piscina por mês",
            "Coleira não inclusa"
        ],
        preco: 1899,
        precoAntigo: 2499,
        imagem: "img/produtos/baoba.jpg"
    },
    {
        id: "tenis-formiga",
        nome: "Tênis de Corrida para Formiga",
        categoria: "Miniaturas",
        regra: "Serve em uma formiga",
        descricao: "Kit com seis pés de tênis com amortecimento para trilhas de açúcar.",
        detalhes: [
            "Seis pés, porque formiga não é bípede",
            "Cadarço que se amarra sozinho",
            "Tamanho único: 0,3 mm"
        ],
        preco: 22.9,
        precoAntigo: 29.9,
        imagem: "img/produtos/formiga.png"
    },
    {
        id: "ziper-dimensional",
        nome: "Zíper Dimensional",
        categoria: "Espaço e Tempo",
        regra: "Começa com Z",
        descricao: "Abra o zíper em qualquer parede e saia em outro lugar do mundo.",
        detalhes: [
            "Alcance de até 20 mil km",
            "Fecha sozinho depois de 10 segundos",
            "Não use para fugir de reuniões"
        ],
        preco: 159.9,
        precoAntigo: 219.9,
        imagem: "img/produtos/ziper.jpg"
    },
    {
        id: "baleia-inflavel",
        nome: "Baleia Inflável Tamanho Real",
        categoria: "Gigantes",
        regra: "Não cabe em avião",
        descricao: "Uma baleia-azul de 30 metros para a piscina mais animada do bairro.",
        detalhes: [
            "Infla em 4 horas com o compressor incluso",
            "Aguenta até 200 pessoas em cima",
            "Canta músicas de baleia de verdade"
        ],
        preco: 499,
        precoAntigo: 689,
        imagem: "img/produtos/baleia.jpg"
    },
    {
        id: "garrafa-de-silencio",
        nome: "Garrafa de Silêncio",
        categoria: "Bem-estar",
        regra: "Uso único",
        descricao: "Destampe e ganhe 1 hora de silêncio absoluto, até no meio da obra.",
        detalhes: [
            "Silencia um raio de 15 metros",
            "Funciona com vizinhos, buzinas e furadeiras",
            "Não funciona com o próprio pensamento"
        ],
        preco: 39.9,
        precoAntigo: 54.9,
        imagem: "img/produtos/garrafa.jpg"
    }
];

const RAIZ = location.pathname.includes("/pages/") ? "../" : "";
PRODUTOS.forEach(function (produto) {
    produto.imagem = RAIZ + produto.imagem;
});

const CATEGORIAS = {
    "Todos":          { icone: "✨", cor: "#f06010" },
    "Miniaturas":     { icone: "🐜", cor: "#e09400" },
    "Espaço e Tempo": { icone: "🚀", cor: "#2f7de1" },
    "Bem-estar":      { icone: "💗", cor: "#ff4d8d" },
    "Gigantes":       { icone: "🐳", cor: "#16a974" }
};


function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function buscarProduto(id) {
    return PRODUTOS.find(function (produto) {
        return produto.id === id;
    });
}

function criarCard(produto, caminhoProduto) {
    const link = caminhoProduto + "?id=" + produto.id;
    const desconto = Math.round((1 - produto.preco / produto.precoAntigo) * 100);
    const cor = CATEGORIAS[produto.categoria].cor;

    return `
        <article class="card" style="--cor: ${cor}">
            <a class="card-imagem" href="${link}">
                <img src="${produto.imagem}" alt="${produto.nome}" style="object-position: ${produto.foco || "center"}">
                <span class="card-selo">-${desconto}%</span>
            </a>
            <p class="card-categoria">${produto.categoria}</p>
            <h3 class="card-titulo"><a href="${link}">${produto.nome}</a></h3>
            <p class="card-descricao">${produto.descricao}</p>
            <div class="card-compra">
                <p class="card-preco">
                    <strong>${formatarPreco(produto.preco)}</strong>
                    <s>${formatarPreco(produto.precoAntigo)}</s>
                </p>
                <button class="card-botao" type="button" data-id="${produto.id}" aria-label="Adicionar ${produto.nome} ao carrinho">+ Carrinho</button>
            </div>
        </article>
    `;
}

function ativarBotoesDosCards(lista) {
    lista.addEventListener("click", function (evento) {
        const botao = evento.target.closest(".card-botao");
        if (!botao) return;

        adicionarAoCarrinho(botao.dataset.id, 1);
        botao.textContent = "Adicionado ✓";
        botao.disabled = true;

        setTimeout(function () {
            botao.textContent = "+ Carrinho";
            botao.disabled = false;
        }, 1500);
    });
}
