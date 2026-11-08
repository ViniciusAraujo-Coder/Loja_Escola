const CUPOM_VALIDO = "IMPOSSIVEL10";
const DESCONTO_CUPOM = 0.10;
const FRETE_GRATIS_A_PARTIR = 99;
const FRETES = {
    padrao: { nome: "Padrão (5 a 7 dias úteis)", valor: 14.9 },
    teletransporte: { nome: "Teletransporte (em até 1 hora)", valor: 29.9 }
};

const areaCheckout = document.querySelector(".checkout");
const carrinhoVazio = document.querySelector(".carrinho-vazio");
const listaItens = document.querySelector(".resumo-itens");
const formCheckout = document.querySelector(".checkout-form");
const formCupom = document.querySelector(".cupom");
const campoCupom = document.querySelector("#cupom");
const mensagemCupom = document.querySelector(".cupom-mensagem");
const camposCartao = document.querySelector(".cartao-campos");

let cupomAplicado = false;


function freteEscolhido() {
    return formCheckout.querySelector('input[name="frete"]:checked').value;
}

function valorDoFrete(tipo, subtotal) {
    if (tipo === "padrao" && subtotal >= FRETE_GRATIS_A_PARTIR) return 0;
    return FRETES[tipo].valor;
}

function calcularTotais() {
    const itens = itensDoCarrinho();
    const subtotal = itens.reduce(function (soma, item) { return soma + item.total; }, 0);
    const desconto = cupomAplicado ? subtotal * DESCONTO_CUPOM : 0;
    const tipoFrete = freteEscolhido();
    const frete = valorDoFrete(tipoFrete, subtotal);

    return {
        itens: itens,
        subtotal: subtotal,
        desconto: desconto,
        tipoFrete: tipoFrete,
        frete: frete,
        total: subtotal - desconto + frete
    };
}


function mostrarItens(itens) {
    listaItens.innerHTML = itens
        .map(function (item) {
            const p = item.produto;
            return `
                <li class="resumo-item">
                    <img src="${p.imagem}" alt="">
                    <div class="resumo-item-info">
                        <a href="produto.html?id=${p.id}">${p.nome}</a>
                        <div class="quantidade" aria-label="Quantidade de ${p.nome}">
                            <button type="button" data-id="${p.id}" data-mudar="-1" aria-label="Diminuir">−</button>
                            <span>${item.qtd}</span>
                            <button type="button" data-id="${p.id}" data-mudar="1" aria-label="Aumentar">+</button>
                        </div>
                    </div>
                    <div class="resumo-item-lado">
                        <strong>${formatarPreco(item.total)}</strong>
                        <button type="button" class="resumo-remover" data-id="${p.id}">Remover</button>
                    </div>
                </li>
            `;
        })
        .join("");
}

function atualizarTela() {
    const totais = calcularTotais();

    if (totais.itens.length === 0) {
        areaCheckout.hidden = true;
        carrinhoVazio.hidden = false;
        return;
    }

    mostrarItens(totais.itens);

    document.querySelector(".total-subtotal").textContent = formatarPreco(totais.subtotal);
    document.querySelector(".total-desconto").textContent =
        totais.desconto > 0 ? "− " + formatarPreco(totais.desconto) : formatarPreco(0);
    document.querySelector(".total-frete").textContent =
        totais.frete === 0 ? "Grátis" : formatarPreco(totais.frete);
    document.querySelector(".total-geral").textContent = formatarPreco(totais.total);

    Object.keys(FRETES).forEach(function (tipo) {
        const valor = valorDoFrete(tipo, totais.subtotal);
        document.querySelector('[data-frete="' + tipo + '"]').textContent =
            valor === 0 ? "Grátis" : formatarPreco(valor);
    });
}


listaItens.addEventListener("click", function (evento) {
    const botao = evento.target.closest("button");
    if (!botao) return;

    const id = botao.dataset.id;
    const item = lerCarrinho().find(function (i) { return i.id === id; });
    if (!item) return;

    if (botao.dataset.mudar) {
        alterarQuantidade(id, Math.min(item.qtd + Number(botao.dataset.mudar), 10));
    } else {
        alterarQuantidade(id, 0);
    }

    atualizarTela();
});


formCupom.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const codigo = campoCupom.value.trim().toUpperCase();

    if (codigo === CUPOM_VALIDO) {
        cupomAplicado = true;
        mensagemCupom.textContent = "Cupom aplicado: 10% de desconto!";
        mensagemCupom.className = "cupom-mensagem cupom-ok";
    } else {
        cupomAplicado = false;
        mensagemCupom.textContent = codigo ? "Cupom inválido." : "Digite um cupom.";
        mensagemCupom.className = "cupom-mensagem cupom-erro";
    }

    atualizarTela();
});


formCheckout.addEventListener("change", function (evento) {
    if (evento.target.name === "frete") atualizarTela();
    if (evento.target.name === "pagamento") {
        camposCartao.hidden = evento.target.value !== "cartao";
    }
});


function soNumeros(texto) {
    return texto.replace(/\D/g, "");
}

function mascarar(seletor, formatar) {
    const campo = document.querySelector(seletor);
    campo.addEventListener("input", function () {
        campo.value = formatar(soNumeros(campo.value));
    });
}

mascarar("#cep", function (n) {
    n = n.slice(0, 8);
    return n.length > 5 ? n.slice(0, 5) + "-" + n.slice(5) : n;
});

mascarar("#telefone", function (n) {
    n = n.slice(0, 11);
    if (n.length <= 2) return n;
    if (n.length <= 7) return "(" + n.slice(0, 2) + ") " + n.slice(2);
    return "(" + n.slice(0, 2) + ") " + n.slice(2, 7) + "-" + n.slice(7);
});

mascarar("#cartao-numero", function (n) {
    return n.slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
});

mascarar("#cartao-validade", function (n) {
    n = n.slice(0, 4);
    return n.length > 2 ? n.slice(0, 2) + "/" + n.slice(2) : n;
});

mascarar("#cartao-cvv", function (n) {
    return n.slice(0, 3);
});


const campoCep = document.querySelector("#cep");
const infoCep = campoCep.parentElement.querySelector(".campo-info");
let cepConsultado = "";
let cepNaoEncontrado = false;

async function buscarCep(cep) {
    cepConsultado = cep;
    cepNaoEncontrado = false;
    infoCep.textContent = "Buscando endereço...";

    try {
        const resposta = await fetch("https://viacep.com.br/ws/" + cep + "/json/");
        const dados = await resposta.json();

        if (cep !== cepConsultado) return;

        if (dados.erro) {
            cepNaoEncontrado = true;
            infoCep.textContent = "";
            validarCampo(campoCep);
            return;
        }

        const endereco = document.querySelector("#endereco");
        const cidade = document.querySelector("#cidade");

        endereco.value = [dados.logradouro, dados.bairro].filter(Boolean).join(", ");
        cidade.value = dados.localidade + " / " + dados.uf;
        infoCep.textContent = "Endereço encontrado ✓";

        validarCampo(campoCep);
        validarCampo(cidade);
        if (endereco.value) {
            validarCampo(endereco);
            document.querySelector("#numero").focus();
        } else {
            endereco.focus();
        }
    } catch (erro) {
        infoCep.textContent = "Não foi possível buscar o CEP agora. Preencha o endereço manualmente.";
    }
}

campoCep.addEventListener("input", function () {
    const cep = soNumeros(campoCep.value);

    if (cep.length === 8 && cep !== cepConsultado) {
        buscarCep(cep);
    } else if (cep.length < 8) {
        cepConsultado = "";
        cepNaoEncontrado = false;
        infoCep.textContent = "";
    }
});


const REGRAS = {
    nome: function (v) {
        return v.trim().split(/\s+/).length >= 2 ? "" : "Digite nome e sobrenome.";
    },
    email: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Digite um e-mail válido.";
    },
    telefone: function (v) {
        const n = soNumeros(v);
        return n.length === 0 || n.length >= 10 ? "" : "Celular incompleto.";
    },
    cep: function (v) {
        if (soNumeros(v).length !== 8) return "O CEP tem 8 números.";
        return cepNaoEncontrado ? "CEP não encontrado." : "";
    },
    cidade: function (v) {
        return v.trim().length >= 2 ? "" : "Informe a cidade.";
    },
    endereco: function (v) {
        return v.trim().length >= 3 ? "" : "Informe o endereço.";
    },
    numero: function (v) {
        return v.trim() ? "" : "Informe o número.";
    },
    "cartao-numero": function (v) {
        return soNumeros(v).length === 16 ? "" : "O cartão tem 16 números.";
    },
    "cartao-validade": function (v) {
        const partes = v.split("/");
        const mes = Number(partes[0]);
        const ano = 2000 + Number(partes[1]);
        if (!/^\d{2}\/\d{2}$/.test(v) || mes < 1 || mes > 12) return "Use o formato MM/AA.";
        const hoje = new Date();
        const vencido = ano < hoje.getFullYear() ||
            (ano === hoje.getFullYear() && mes < hoje.getMonth() + 1);
        return vencido ? "Cartão vencido." : "";
    },
    "cartao-cvv": function (v) {
        return soNumeros(v).length === 3 ? "" : "O CVV tem 3 números.";
    }
};

function validarCampo(campo) {
    const regra = REGRAS[campo.id];
    if (!regra) return true;

    const erro = regra(campo.value);
    const caixaErro = campo.parentElement.querySelector(".campo-erro");

    caixaErro.textContent = erro;
    if (erro) {
        campo.setAttribute("aria-invalid", "true");
    } else {
        campo.removeAttribute("aria-invalid");
    }
    return !erro;
}

function camposParaValidar() {
    const campos = ["nome", "email", "telefone", "cep", "cidade", "endereco", "numero"];
    if (!camposCartao.hidden) {
        campos.push("cartao-numero", "cartao-validade", "cartao-cvv");
    }
    return campos.map(function (id) { return document.getElementById(id); });
}

formCheckout.addEventListener("focusout", function (evento) {
    if (evento.target.matches("input:not([type=radio])")) validarCampo(evento.target);
});
formCheckout.addEventListener("input", function (evento) {
    if (evento.target.getAttribute("aria-invalid")) validarCampo(evento.target);
});


const NOMES_PAGAMENTO = { pix: "Pix", cartao: "Cartão de crédito", boleto: "Boleto" };

formCheckout.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const campos = camposParaValidar();
    const resultados = campos.map(validarCampo);
    const primeiroErro = campos[resultados.indexOf(false)];

    if (primeiroErro) {
        primeiroErro.focus();
        return;
    }

    const totais = calcularTotais();
    const dados = new FormData(formCheckout);
    const pagamento = dados.get("pagamento");

    const pedido = {
        numero: "LI-" + Date.now().toString().slice(-6),
        data: new Date().toISOString(),
        nome: dados.get("nome").trim(),
        email: dados.get("email").trim(),
        endereco: dados.get("endereco").trim() + ", " + dados.get("numero").trim() +
            " – " + dados.get("cidade").trim() + " – CEP " + dados.get("cep"),
        entrega: FRETES[totais.tipoFrete].nome,
        pagamento: pagamento,
        pagamentoNome: NOMES_PAGAMENTO[pagamento],
        finalCartao: pagamento === "cartao" ? soNumeros(dados.get("cartao-numero")).slice(-4) : "",
        itens: totais.itens.map(function (item) {
            return {
                nome: item.produto.nome,
                imagem: item.produto.imagem,
                qtd: item.qtd,
                total: item.total
            };
        }),
        subtotal: totais.subtotal,
        desconto: totais.desconto,
        frete: totais.frete,
        total: totais.total
    };

    sessionStorage.setItem("pedido", JSON.stringify(pedido));
    esvaziarCarrinho();
    location.href = "sucesso.html";
});


atualizarTela();
