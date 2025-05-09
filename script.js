const numcolunas = 3;
const numlinhas = 3;
const somselecionar = new Audio("./assets/ui/selectsound.mp3");
const somterminar = new Audio("./assets/ui/completesound.mp3");

function getRandomImageUrl() {
  return `https://picsum.photos/3000/3000?random=${Math.floor(
    Math.random() * 1000
  )}`;
}

function carregarcortar(url, fallbackSet = "a") {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = url;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    let index = 1;
    const piecewidth = img.width / numcolunas;
    const pieceheight = img.height / numlinhas;

    for (let linha = 0; linha < numlinhas; linha++) {
      for (let coluna = 0; coluna < numcolunas; coluna++) {
        const pieceCanvas = document.createElement("canvas");
        pieceCanvas.width = piecewidth;
        pieceCanvas.height = pieceheight;
        const pieceCtx = pieceCanvas.getContext("2d");
        pieceCtx.drawImage(
          canvas,
          coluna * piecewidth,
          linha * pieceheight,
          piecewidth,
          pieceheight,
          0,
          0,
          piecewidth,
          pieceheight
        );

        const dataurl = pieceCanvas.toDataURL();
        const bloco = document.getElementById(`bloco${index}`);
        bloco.style.setProperty("--img", `url(${dataurl})`);
        index++;
      }
    }
  };

  img.onerror = () => {
    console.warn("Não foi possível carregar imagem da url");

    for (let i = 1; i <= 9; i++) {
      const bloco = document.getElementById(`bloco${i}`);
      bloco.style.setProperty(
        "--img",
        `url(assets/blocks/bloco${i}${fallbackSet}.png)`
      );
    }
  };
}

function resetgame() {
  const imagemaleatoria = getRandomImageUrl();
  const sets = ["a", "b", "c"];
  const ordemaleatoria = sets[Math.floor(Math.random() * sets.length)];
  carregarcortar(imagemaleatoria, ordemaleatoria);
}

document
  .querySelector(".resetbutton")
  .addEventListener("click", resetgame);

resetgame();

function pegar(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function permitircair(event) {
  event.preventDefault();
}

function soltar(event) {
  event.preventDefault();
  let data = event.dataTransfer.getData("text");

  let dropTarget = event.target.closest(".puxarbloco");

  if (!dropTarget) return;

  if (dropTarget.querySelector(".images")) {
    alert("Espaço ocupado");
    return;
  }

  dropTarget.appendChild(document.getElementById(data));

  somselecionar.currentTime = 0;
  somselecionar.play();

  checarordemblocos();
}

onload = function () {
  let parent = document.getElementById("pegar");
  let frag = document.createDocumentFragment();

  while (parent.children.length) {
    frag.appendChild(
      parent.children[Math.floor(Math.random() * parent.children.length)]
    );
  }
  parent.appendChild(frag);
};

function checarordemblocos() {
  const board = document.querySelector(".board");
  const blocos = board.querySelectorAll(".images");

  if (blocos.length !== 9) return;

  for (let i = 0; i < 9; i++) {
    const id = `bloco${i + 1}`;
    if (blocos[i].id !== id) {
      return;
    }
  }

  somterminar.play();
}

// Touchscreen
let tocando = false;
let blocoselecionado = null;

document.querySelectorAll(".images").forEach((el) => {
  el.addEventListener("touchstart", (e) => {
    e.preventDefault();
    blocoselecionado = e.target;
    tocando = true;
  });

  el.addEventListener("touchmove", (e) => {
    e.preventDefault();
  });

  el.addEventListener("touchend", (e) => {
    e.preventDefault();
    tocando = false;

    let touch = e.changedTouches[0];
    let destino = document.elementFromPoint(touch.clientX, touch.clientY);
    let containerdestino = destino.closest(".puxarbloco");

    if (!containerdestino || containerdestino.querySelector(".images")) {
      alert("Espaço ocupado");
      return;
    }

    containerdestino.appendChild(blocoselecionado);

    somselecionar.currentTime = 0;
    somselecionar.play();

    checarordemblocos();
  });
});
