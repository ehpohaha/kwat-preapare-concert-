const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const backpack = document.getElementById("backpack");
const subtitle = document.getElementById("subtitle");
const centerMessage = document.getElementById("centerMessage");
const clearScreen = document.getElementById("clearScreen");
const memoScreen = document.getElementById("memoScreen");

const bgm = new Audio("assets/sounds/backmusic.mp3");
const pop = new Audio("assets/sounds/pop.mp3");
const success = new Audio("assets/sounds/success.mp3");
const coin = new Audio("assets/sounds/coin.mp3");

const baseItems = [
  { img: "ticket.png" },
  { img: "iden.png", desc: "주민등록증, 여권, 청소년증 등 [본인 인증이 가능한] 신분증을 챙기자" },
  { img: "water.png" },
  { img: "candy.png", desc: "당이 떨어질 수 있으니 간단히 먹을 수 있는 간식을 챙기자" },
  { img: "supbattery.png" },
  { img: "fanlight.png" },
  { img: "battery.png" },
  { img: "drug.png" },
  { img: "tissue.png" }
];

const extraItems = [
  { img: "t.png", desc: "종이슬로건을 잘 보관 할 수 있을것이다!" },
  { img: "hotpack.png", desc: "추위를 잘 보낼 수 있을 것이다!" },
  { img: "chair.png", desc: "장시간 의자에 앉아있을 수 있을 것이다!" },
  { img: "umbrella.png", desc: "갑작스러운 비를 대처할 수 있을것이다!" },
  { img: "eclipse.png" },
  { img: "goods.png", desc: "굿즈 보관에 용이할 것 이다" },
  { img: "binder.png", desc: "포토카드 보관에 용이할 것 이다" },
  { img: "hair.png" }
];

let currentItems = [];
let phase = 1;

startScreen.addEventListener("click", startGame);
startScreen.addEventListener("touchstart", startGame);

function startGame() {
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  bgm.loop = true;
  bgm.play();

  showCenter(
    "모든 아이템을 가방에 넣어 괒이 콘서트 준비하는 것을 도와주세요!",
    "#1a2a4a"
  );

  spawnItems(baseItems);
}

function spawnItems(list) {
  currentItems = [];
  list.forEach(item => {
    const el = document.createElement("img");
    el.src = `assets/images/${item.img}`;
    el.className = "item";
    el.style.left = Math.random() * 60 + "vw";
    el.style.top = Math.random() * 60 + "vh";
    gameScreen.appendChild(el);

    if (item.desc) {
      el.addEventListener("click", () => {
        subtitle.textContent = item.desc;
        subtitle.style.display = "block";
        setTimeout(() => subtitle.style.display = "none", 2500);
      });
    }

    enableDrag(el);
    currentItems.push(el);
  });
}

function enableDrag(el) {
  let dragging = false;

  function move(x, y) {
    el.style.left = x - el.offsetWidth / 2 + "px";
    el.style.top = y - el.offsetHeight / 2 + "px";
  }

  el.addEventListener("mousedown", () => dragging = true);
  document.addEventListener("mousemove", e => dragging && move(e.clientX, e.clientY));
  document.addEventListener("mouseup", () => dragging && drop(el));

  el.addEventListener("touchstart", e => {
    e.preventDefault();
    dragging = true;
  });
  document.addEventListener("touchmove", e => {
    if (!dragging) return;
    const t = e.touches[0];
    move(t.clientX, t.clientY);
  }, { passive: false });
  document.addEventListener("touchend", () => dragging && drop(el));
}

function drop(el) {
  const a = el.getBoundingClientRect();
  const b = backpack.getBoundingClientRect();
  if (a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom) {
    pop.play();
    el.remove();
    currentItems = currentItems.filter(i => i !== el);
    if (currentItems.length === 0) nextPhase();
  }
}

function nextPhase() {
  if (phase === 1) {
    showCenter("추가 아이템 등장!", "gold");
    phase = 2;
    setTimeout(() => spawnItems(extraItems), 2000);
  } else {
    bgm.pause();
    success.play();
    clearScreen.style.display = "flex";
    clearScreen.addEventListener("click", () => {
      coin.play();
      clearScreen.style.display = "none";
      memoScreen.style.display = "flex";
    }, { once: true });
  }
}

function showCenter(text, color) {
  centerMessage.textContent = text;
  centerMessage.style.color = color;
  centerMessage.style.display = "block";
  setTimeout(() => centerMessage.style.display = "none", 3000);
}

