let quantidadeBombas;
let vidas1, vidas2;
let tempo = 0;
let timerId;
let modo = "single";

let nomeJogador1, nomeJogador2;
let pontuacao1 = 0, pontuacao2 = 0;
let navios1 = 0, navios2 = 0;
let totalJogadas = 0;

let jogo1 = [], jogo2 = [];

let painelVidas, painelCronometro, painelPontuacao, painelJogadas, musicaFundo;

const config = {
    facil: { vidas: 5, bombas: 15 },
    medio: { vidas: 4, bombas: 25 },
    dificil: { vidas: 3, bombas: 40 }
};

window.onload = function () {
    painelVidas = document.getElementById("painelVidas");
    painelCronometro = document.getElementById("cronometro");
    painelPontuacao = document.getElementById("painelPontuacao");
    painelJogadas = document.getElementById("painelJogadas");
    musicaFundo = document.getElementById("musicaFundo");

    document.querySelectorAll("input[name='modo']").forEach(radio => {
        radio.addEventListener("change", e => {
            modo = e.target.value;

            document.getElementById("cadastroSingle").style.display =
                modo === "single" ? "block" : "none";

            document.getElementById("cadastroMulti").style.display =
                modo === "multi" ? "block" : "none";

            document.getElementById("tituloJogador2Container").style.display =
                modo === "multi" ? "block" : "none";
        });
    });
};

function confirmarCadastro() {
    musicaFundo.volume = 0.05;
    musicaFundo.play().catch(() => {});

    let dificuldade = document.getElementById("dificuldade").value;

    if (modo === "single") {
        nomeJogador1 =
            document.getElementById("jogador1").value || "Jogador";

        document.getElementById("tituloJogador1").textContent =
            nomeJogador1;
    } else {
        nomeJogador1 =
            document.getElementById("jogador1multi").value || "Jogador 1";

        nomeJogador2 =
            document.getElementById("jogador2multi").value || "Jogador 2";

        document.getElementById("tituloJogador1").textContent =
            nomeJogador1;

        document.getElementById("tituloJogador2").textContent =
            nomeJogador2;
    }

    document.getElementById("telaCadastro").style.display = "none";
    document.getElementById("jogo").style.display = "block";

    iniciarJogo(dificuldade);
}

function iniciarJogo(dificuldade) {
    let vidasBase = config[dificuldade].vidas;
    quantidadeBombas = config[dificuldade].bombas;

    vidas1 = vidasBase;
    vidas2 = vidasBase;

    pontuacao1 = 0;
    pontuacao2 = 0;

    navios1 = 0;
    navios2 = 0;

    tempo = 0;
    totalJogadas = 0;

    clearInterval(timerId);

    timerId = setInterval(() => {
        painelCronometro.textContent = 'Tempo:' + ++tempo + 's';

        if (tempo >= 120)
            desativarCliques("O tempo acabou!");
    }, 1000);

    jogo1 = montarArrayDoJogo();
    criarTabela("tabuleiro1", jogo1, 1);

    if (modo === "multi") {
        jogo2 = montarArrayDoJogo();
        criarTabela("tabuleiro2", jogo2, 2);
    }

    atualizarPaineis();
}

function montarArrayDoJogo() {
    let a = [];

    for (let i = 0; i < 10; i++) a.push("img/Navio1..png");
    for (let i = 0; i < 10; i++) a.push("img/Navio2..png");
    for (let i = 0; i < 10; i++) a.push("img/Navio3..png");

    for (let i = 0; i < quantidadeBombas; i++)
        a.push("img/bomba.png");

    while (a.length < 100)
        a.push("img/mar.jpg");

    return a.sort(() => Math.random() - 0.5);
}

function criarTabela(containerId, jogoArray, jogador) {
    let tabuleiro = document.getElementById(containerId);

    tabuleiro.innerHTML = "";

    let tabela = document.createElement("table");
    let posicao = 0;

    for (let i = 0; i < 10; i++) {
        let linha = document.createElement("tr");

        for (let j = 0; j < 10; j++) {
            let coluna = document.createElement("td");
            let imagem = document.createElement("img");

            imagem.src = "img/chapeu.jpg";

            let atual = posicao;

            imagem.onclick = () =>
                trocar(imagem, atual, jogoArray, jogador);

            coluna.appendChild(imagem);
            linha.appendChild(coluna);

            posicao++;
        }

        tabela.appendChild(linha);
    }

    tabuleiro.appendChild(tabela);
}

function tocarSom(id) {
    let som = document.getElementById(id);

    if (!som) return;

    som.currentTime = 0;
    som.play().catch(() => {});
}

function trocar(img, posicao, jogoArray, jogador) {
    if (img.dataset.aberto) return;

    if (jogador === 1 && vidas1 <= 0) return;
    if (jogador === 2 && vidas2 <= 0) return;

    img.dataset.aberto = true;

    let imagemRevelada = jogoArray[posicao];

    img.src = imagemRevelada;

    totalJogadas++;

if (imagemRevelada === "img/bomba.png") {
    let audioBomba = document.getElementById("somBomba");
    audioBomba.volume = 0.05;
    tocarSom("somBomba"); 


        if (jogador === 1) {
            vidas1--;
            pontuacao1 -= 10;
        } else {
            vidas2--;
            pontuacao2 -= 10;
        }
    }

    else if (imagemRevelada.includes("Navio")) {
        let audioNavio = document.getElementById("somNavio");
        audioNavio.volume = 0.05;
        tocarSom("somNavio");

        let pontos = 0;

        if (imagemRevelada.includes("Navio1")) pontos = 10;
        else if (imagemRevelada.includes("Navio2")) pontos = 20;
        else pontos = 30;

        if (jogador === 1) {
            pontuacao1 += pontos;
            navios1++;
        } else {
            pontuacao2 += pontos;
            navios2++;
        }
    }

    else {
  
        let audioAgua = document.getElementById("somAgua");
        audioAgua.volume = 0.05;
        tocarSom("somAgua");
    }

    atualizarPaineis();
    verificarVitoria();
}

function atualizarPaineis() {
    painelJogadas.textContent = `Jogadas: ${totalJogadas}`;

    if (modo === "single") {
        painelVidas.textContent =
            `Vidas: ${"❤️".repeat(Math.max(0, vidas1))}`;

        painelPontuacao.textContent =
            `${nomeJogador1}: ${pontuacao1} pts`;
    }

    else {
        painelVidas.textContent =
            `V1: ${"❤️".repeat(Math.max(0, vidas1))} | V2: ${"❤️".repeat(Math.max(0, vidas2))}`;

        painelPontuacao.textContent =
            `${nomeJogador1}: ${pontuacao1} pts | ${nomeJogador2}: ${pontuacao2} pts`;
    }
}

function verificarVitoria() {
    if (modo === "single" && vidas1 <= 0)
        return desativarCliques(`☠️ GAME OVER ☠️ ${nomeJogador1} perdeu!`);

    if (modo === "multi" && vidas1 <= 0 && vidas2 <= 0)
        return desativarCliques("☠️ GAME OVER ☠️");

    if (navios1 === 30)
        return desativarCliques(`🏆 ${nomeJogador1} encontrou o One Piece!`);

    if (navios2 === 30)
        return desativarCliques(`🏆 ${nomeJogador2} encontrou o One Piece!`);
}

function desativarCliques(mensagem) {
    clearInterval(timerId);

    document
        .querySelectorAll("#tabuleiro1 img, #tabuleiro2 img")
        .forEach(img => img.style.pointerEvents = "none");

    setTimeout(() => alert(mensagem), 100);
}

function reiniciarJogo() {
    clearInterval(timerId);

    painelCronometro.textContent = "Tempo: 0s";
    painelJogadas.textContent = "Jogadas: 0";

    musicaFundo.pause();
    musicaFundo.currentTime = 0;

    document.getElementById("jogo").style.display = "none";
    document.getElementById("telaCadastro").style.display = "block";
}