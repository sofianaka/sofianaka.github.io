// Desenha a rede neural do topo e anima um "sinal" passando por ela,
// da camada de entrada até a de saída.

const NEURONIOS_POR_CAMADA = [3, 5, 5, 2];
const LARGURA = 420;
const ALTURA = 360;
const SVG = "http://www.w3.org/2000/svg";

const rede = document.getElementById("rede");

// 1) Calcula a posição de cada neurônio
const camadas = NEURONIOS_POR_CAMADA.map((quantidade, c) => {
    const x = 40 + c * ((LARGURA - 80) / (NEURONIOS_POR_CAMADA.length - 1));
    const espaco = ALTURA / (quantidade + 1);
    return Array.from({ length: quantidade }, (_, n) => ({ x, y: espaco * (n + 1) }));
});

// 2) Desenha as ligações entre cada camada e a seguinte
//    ligacoes[c][a][b] = linha do neurônio "a" da camada "c" até o "b" da próxima
const ligacoes = [];
for (let c = 0; c < camadas.length - 1; c++) {
    ligacoes.push(
        camadas[c].map((origem) =>
            camadas[c + 1].map((destino) => {
                const linha = document.createElementNS(SVG, "line");
                linha.setAttribute("x1", origem.x);
                linha.setAttribute("y1", origem.y);
                linha.setAttribute("x2", destino.x);
                linha.setAttribute("y2", destino.y);
                linha.setAttribute("class", "ligacao");
                rede.appendChild(linha);
                return linha;
            })
        )
    );
}

// 3) Desenha os neurônios por cima das linhas
const circulos = camadas.map((camada, c) =>
    camada.map((neuronio) => {
        const circulo = document.createElementNS(SVG, "circle");
        circulo.setAttribute("cx", neuronio.x);
        circulo.setAttribute("cy", neuronio.y);
        circulo.setAttribute("r", 13);
        circulo.setAttribute("class", `neuronio camada-${c}`);
        rede.appendChild(circulo);
        return circulo;
    })
);

// 4) Animação: sorteia um neurônio por camada e acende o caminho entre eles
function sortear(maximo) {
    return Math.floor(Math.random() * maximo);
}

function passarSinal(tempoEntreCamadas) {
    const caminho = NEURONIOS_POR_CAMADA.map((quantidade) => sortear(quantidade));

    caminho.forEach((neuronio, c) => {
        setTimeout(() => {
            circulos[c][neuronio].classList.add("ativo");
            if (c > 0) ligacoes[c - 1][caminho[c - 1]][neuronio].classList.add("ativa");
        }, c * tempoEntreCamadas);
    });

    // Depois de um tempo, apaga o caminho
    setTimeout(() => {
        caminho.forEach((neuronio, c) => {
            circulos[c][neuronio].classList.remove("ativo");
            if (c > 0) ligacoes[c - 1][caminho[c - 1]][neuronio].classList.remove("ativa");
        });
    }, NEURONIOS_POR_CAMADA.length * tempoEntreCamadas + 900);
}

// Quem pediu menos animação no sistema vê só um caminho aceso, parado
const semAnimacao = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (semAnimacao) {
    NEURONIOS_POR_CAMADA.forEach((_, c) => {
        circulos[c][0].classList.add("ativo");
        if (c > 0) ligacoes[c - 1][0][0].classList.add("ativa");
    });
} else {
    passarSinal(220);
    setInterval(() => passarSinal(220), 1400);
}
