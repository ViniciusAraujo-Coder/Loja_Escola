# Loja Impossível — contexto do projeto

Projeto de estudo: uma loja fictícia de "produtos que não existem", feita do zero
em HTML, CSS e JavaScript puros (sem frameworks). Eu (Vinicius) estou aprendendo
enquanto construo.

## Como quero ser orientado

- Em português, passo a passo, **uma peça por vez**, em ordem linear
  (de fora para dentro e de cima para baixo, na ordem em que o código é escrito).
- Sempre explique **o porquê** de cada escolha, junto com o código.
  Quando passar código pronto, diga **o que mudou e por quê** (antes → depois).
- Não sou totalmente iniciante (sei o básico de HTML), mas tenho dificuldade com
  classes, ids e divs: só introduza uma classe/div quando ela tiver um motivo claro.
- Exemplos visuais e comparações "antes/depois" em ASCII me ajudam muito.
- Ordem do curso: primeiro HTML, depois CSS, depois JavaScript.
- Quando o trabalho for muito repetitivo (vários itens iguais), pode escrever pronto.

## Estrutura de pastas

```
loja-impossivel/
├── index.html
├── pages/        (produto.html, checkout.html, sucesso.html)
├── css/styles.css
├── js/           (produtos, carrinho, index, produto, checkout, sucesso)
├── docs/         (capturas de tela usadas no README.md)
└── img/
    ├── favicon.svg     (logo e ícone da aba, laranja)
    ├── sacola.png      (imagem do destaque, 1280x1229, fundo transparente)
    └── produtos/       (uma imagem por produto, nome curto: sol, botas, abraco,
                         baoba, formiga, ziper, baleia, garrafa; todas são fotos
                         enviadas pelo Vinicius (.png/.jpg).
                         O CSS recorta toda foto em quadrado: aspect-ratio + object-fit)
```

## Convenções combinadas

- Escolher a tag pelo **significado** (header, nav, main, section, article, footer,
  ul/li para listas). `<div>` só para agrupar por layout; `<span>` só para pedaços
  sem significado (ex.: emoji com `aria-hidden="true"`).
- **id não é usado para estilo**: só para âncoras (`#catalogo`, `#regras`) e para
  ligar `<label for>` ao input (`busca`).
- Classes nomeadas pelo que a coisa **é**, minúsculas com hífen. Peças de um
  componente usam o prefixo dele (`card-titulo`, `destaque-texto`); classes
  reutilizáveis têm nome geral (`container`, `botao`, `secao`, `sr-only`).
- Seletor de tag quando o elemento é único (`header`, `footer`, `main h2`).
- CSS organizado em blocos comentados na ordem da página
  (Base → Faixa → Cabeçalho → Destaque → Vantagens → Seções → Catálogo → Regras → Rodapé).
- **Sem comentários explicativos no código** (pedido do Vinicius). No CSS ficam só
  os títulos de seção `/* ========== Nome ========== */`.
- Reset: `* { margin: 0; padding: 0; box-sizing: border-box; }` +
  `img { display: block; max-width: 100%; }`.
- Padrão de faixa de ponta a ponta: elemento com o fundo + `<div class="container">` dentro.
- Rodapé claro: fundo `#ffeedd`, títulos `#241812`, texto/links `#6e6058`, hover laranja.
- Cores (tema laranja, sem roxo): texto/escuro `#241812` (hover `#3a2a1f`), fundo `#fff8f1`,
  creme `#ffeedd` / `#fff1e4`, laranja claro `#ffc9a3`, borda `#f3e4d7`, cinza texto `#6e6058`,
  amarelo `#ffc83d`, preço `#c8213f`, texto claro no escuro `#fff1e6` / `#e3d3c6`.
  Laranja principal `#f06010` (hover `#d44f08`; botões, menu, links de ação), degradê
  `#f06010 → #ff8a3d`, rosa `#ff4d8d` só no selo de desconto, verde `#16a974`.
  Cada categoria tem cor/ícone em `CATEGORIAS` (produtos.js), passada ao CSS via `--cor`:
  Todos laranja, Miniaturas `#e09400`, Espaço e Tempo `#2f7de1`, Bem-estar rosa, Gigantes verde.
- Fonte: Nunito (Google Fonts).

## Onde paramos

**Projeto concluído (2026-11-07)**, feito de uma vez a pedido do Vinicius (sem passo a passo).

- `index.html`: faixa, cabeçalho (com link Carrinho + contador), destaque, vantagens,
  catálogo gerado por JS (filtros por categoria, busca ao vivo e por `?busca=`),
  regras, rodapé. Depois ganhou: destaque com 2 botões + números, vantagens como
  barra branca sobreposta ao destaque, filtros do catálogo em blocos com ícone +
  quantidade (substituíram a seção separada "Navegue por categoria"), etiqueta
  colorida de categoria e selo de desconto nos cards, hover nos cards, faixa de newsletter
  (`.novidades`) e rótulo de seção (`.secao-rotulo` / `.secao-topo`).
- `pages/produto.html` (`?id=`), `pages/checkout.html`, `pages/sucesso.html`.
- Fonte: Nunito (Google Fonts). Responsividade: blocos `@media` 960/720/480px no fim do CSS.
- JS: `produtos.js` (dados + `formatarPreco`, `criarCard`), `carrinho.js`
  (localStorage `carrinho`), `index.js`, `produto.js`, `checkout.js`
  (cupom IMPOSSIVEL10 = 10%, frete padrão R$ 14,90 grátis ≥ R$ 99, teletransporte
  R$ 29,90, validação + máscaras, CEP preenche endereço/cidade via API ViaCEP
  `https://viacep.com.br/ws/<cep>/json/`), `sucesso.js` (lê `sessionStorage.pedido`).
- Ordem dos scripts em toda página: produtos.js → carrinho.js → script da página.

Ideias se quiser continuar: página "Sobre", favoritos.
