function lerPedido() {
    try {
        return JSON.parse(sessionStorage.getItem("pedido"));
    } catch (erro) {
        return null;
    }
}

const pedido = lerPedido();
const [areaPedido, areaVazia] = document.querySelectorAll(".sucesso");

function texto(seletor, valor) {
    areaPedido.querySelector(seletor).textContent = valor;
}

function mostrarPagamento() {
    const area = areaPedido.querySelector(".sucesso-pagamento");

    if (pedido.pagamento === "pix") {
        area.innerHTML = `
            <p><strong>Pague com Pix</strong> — copie o código abaixo no app do seu banco:</p>
            <code>00020126IMPOSSIVEL${pedido.numero.replace("-", "")}5204000053039865802BR</code>
        `;
    } else if (pedido.pagamento === "boleto") {
        area.innerHTML = `
            <p><strong>Boleto gerado</strong> — vence em 3 dias úteis:</p>
            <code>34191.79001 01043.510047 91020.150008 1 ${pedido.numero.slice(-6)}0000</code>
        `;
    } else {
        area.innerHTML = `<p><strong>Pago no cartão</strong> final ${pedido.finalCartao}. Aprovado!</p>`;
    }
}

if (pedido) {
    texto(".sucesso-nome", pedido.nome.split(" ")[0]);
    texto(".sucesso-email", pedido.email);
    texto(".sucesso-numero", pedido.numero);
    texto(".sucesso-data", new Date(pedido.data).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    }));
    texto(".sucesso-entrega", pedido.entrega);
    texto(".sucesso-endereco", pedido.endereco);

    mostrarPagamento();

    areaPedido.querySelector(".resumo-itens").innerHTML = pedido.itens
        .map(function (item) {
            return `
                <li class="resumo-item">
                    <img src="${item.imagem}" alt="">
                    <div class="resumo-item-info">
                        <span>${item.nome}</span>
                        <small>Quantidade: ${item.qtd}</small>
                    </div>
                    <div class="resumo-item-lado">
                        <strong>${formatarPreco(item.total)}</strong>
                    </div>
                </li>
            `;
        })
        .join("");

    texto(".total-subtotal", formatarPreco(pedido.subtotal));
    texto(".total-desconto", pedido.desconto > 0 ? "− " + formatarPreco(pedido.desconto) : formatarPreco(0));
    texto(".total-frete", pedido.frete === 0 ? "Grátis" : formatarPreco(pedido.frete));
    texto(".total-geral", formatarPreco(pedido.total));
} else {
    areaPedido.hidden = true;
    areaVazia.hidden = false;
}
