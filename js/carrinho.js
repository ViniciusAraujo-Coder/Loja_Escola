const CHAVE_CARRINHO = "carrinho";

function lerCarrinho() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];
    } catch (erro) {
        return [];
    }
}

function salvarCarrinho(carrinho) {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
    atualizarContador();
}

function adicionarAoCarrinho(id, qtd) {
    const carrinho = lerCarrinho();
    const item = carrinho.find(function (i) { return i.id === id; });

    if (item) {
        item.qtd += qtd;
    } else {
        carrinho.push({ id: id, qtd: qtd });
    }

    salvarCarrinho(carrinho);
}

function alterarQuantidade(id, qtd) {
    let carrinho = lerCarrinho();

    if (qtd <= 0) {
        carrinho = carrinho.filter(function (i) { return i.id !== id; });
    } else {
        const item = carrinho.find(function (i) { return i.id === id; });
        if (item) item.qtd = qtd;
    }

    salvarCarrinho(carrinho);
}

function esvaziarCarrinho() {
    localStorage.removeItem(CHAVE_CARRINHO);
    atualizarContador();
}

function itensDoCarrinho() {
    return lerCarrinho()
        .map(function (item) {
            const produto = buscarProduto(item.id);
            if (!produto) return null;
            return { produto: produto, qtd: item.qtd, total: produto.preco * item.qtd };
        })
        .filter(Boolean);
}

function atualizarContador() {
    const total = lerCarrinho().reduce(function (soma, item) {
        return soma + item.qtd;
    }, 0);

    document.querySelectorAll(".carrinho-contador").forEach(function (contador) {
        contador.textContent = total;
        contador.hidden = total === 0;
    });
}

atualizarContador();
