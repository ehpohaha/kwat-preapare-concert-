/*************************************************
 * GLOBAL
 *************************************************/
const ASSET = "assets/";
const IMG = ASSET + "images/";
const SND = ASSET + "sounds/";

let backMusic = null;
let bgmStarted = false;

let draggedItem = null;
let offsetX = 0;
let offsetY = 0;

let collectedCount = 0;
let phase = 1;

/*************************************************
 * ITEM DATA
 *************************************************/
const baseItems = [
  { name: "ticket", img: "ticket.png" },
  { name: "iden", img: "iden.png", desc: "주민등록증, 여권, 청소년증 등 [본인 인증이 가능한] 신분증을 챙기자" },
  { name: "water", img: "water.png" },
  { name: "candy", img: "candy.png", desc: "당이 떨어질 수 있으니 간단히 먹을 수 있는 간식을 챙기자" },
  { name: "supbattery", img: "supbattery.png" },
  { name: "fanlight", img: "fanlight.png" },
  { name: "battery", img: "battery.png" },
  { name: "drug", img: "drug.png" },
  { name: "tissue", img: "tissue.png" }
];

const extraItems = [
  { name: "t", img: "t.png", desc: "종이슬로건을 잘 보관 할 수 있을것이다!" },
  { name: "hotpack", img: "hotpack.png", desc: "추위를 잘 보낼 수 있을 것이다!" },
  { name: "chair", img: "chair.png", desc: "장시간 의자에 앉아있을 수 있을 것이다!" },
  { name: "umbrella", img: "umbrella.png", desc: "갑작스러운 비를 대처할 수 있을것이다!" },
  { name: "eclipse", img: "eclipse.png" },
  { name: "goods", img: "goods.png", desc: "굿즈 보관에 용이할 것 이다" },
  { name: "binder", img: "binder.png", desc: "포토카드 보관에 용이할 것 이다" },
  { name: "hair", img: "hair.png" }
];

/*************************************************
 * AUDIO (X / CHROME SAFE)
 *************************************************/
function unlockBGM() {
  if (bgmStarted) return;

  backMusic = new Audio(SND + "backmusic.mp3");
  backMusic.loop = true;
  backMusic.volume = 0.6;

  backMusic.play().then(() => {
    bgmStarted = true;
    document.getElementById("start-layer").style.display = "none";
    document.getElementById("intro-text").style.display = "block";
    setTimeout(() => {
      document.getElementById("intro-text").style.display = "none";
    }, 3000);
  }).catch(() => {});
}

document.addEventListener("touchstart", unlockBGM, { once: true });
document.addEventListener("mousedown", unlockBGM, { once: true });

function playEffect(file) {
  const s = new Audio(SND + file);
  s.volume = 0.9;
  s.play();
}

/*************************************************
 * INIT
 *************************************************/
window.onload = () => {
  spawnItems(baseItems);
};

/*************************************************
 * ITEM SPAWN
 *************************************************/
function spawnItems(list) {
  const board = document.getElementById("board");

  list.forEach(item => {
    const el = document.createElement("img");
    el.src = IMG + item.img;
    el.className = "item";
    el.dataset.desc = item.desc || "";

    el.style.left = Math.random() * 50 + "%";
    el.style.top = Math.random() * 60 + "%";

    el.addEventListener("mousedown", startDrag);
    el.addEventListener("touchstart", startDrag);

    el.addEventListener("click", () => {
      if (item.desc) showCaption(item.desc);
    });

    board.appendChild(el);
  });
}

/*************************************************
 * DRAG LOGIC
 *************************************************/
function startDrag(e) {
  e.preventDefault();
  draggedItem = e.target;

  const rect = draggedItem.getBoundingClientRect();
  const point = e.touches ? e.touches[0] : e;

  offsetX = point.clientX - rect.left;
  offsetY = point.clientY - rect.top;

  document.addEventListener("mousemove", dragMove);
  document.addEventListener("touchmove", dragMove, { passive: false });

  document.addEventListener("mouseup", endDrag);
  document.addEventListener("touchend", endDrag);
}

function dragMove(e) {
  if (!draggedItem) return;
  e.preventDefault();

  const point = e.touches ? e.touches[0] : e;

  draggedItem.style.left = point.clientX - offsetX + "px";
  draggedItem.style.top = point.clientY - offsetY + "px";
}

function endDrag() {
  if (!draggedItem) return;

  const bag = document.getElementById("backpack");
  const bagRect = bag.getBoundingClientRect();
  const itemRect = draggedItem.getBoundingClientRect();

  if (
    itemRect.left < bagRect.right &&
    itemRect.right > bagRect.left &&
    itemRect.top < bagRect.bottom &&
    itemRect.bottom > bagRect.top
  ) {
    draggedItem.remove();
    collectedCount++;
    playEffect("pop.mp3");
    checkProgress();
  }

  draggedItem = null;
  document.removeEventListener("mousemove", dragMove);
  document.removeEventListener("touchmove", dragMove);
  document.removeEventListener("mouseup", endDrag);
  document.removeEventListener("touchend", endDrag);
}

/*************************************************
 * UI TEXT
 *************************************************/
function showCaption(text) {
  const cap = document.getElementById("caption");
  cap.innerText = text;
  cap.style.display = "block";
  setTimeout(() => cap.style.display = "none", 2500);
}

function centerMessage(text, color) {
  const m = document.getElementById("center-msg");
  m.innerText = text;
  m.style.color = color;
  m.style.display = "block";
  setTimeout(() => m.style.display = "none", 2000);
}

/*************************************************
 * GAME FLOW
 *************************************************/
function checkProgress() {
  if (phase === 1 && collectedCount === baseItems.length) {
    phase = 2;
    collectedCount = 0;
    centerMessage("추가 아이템 등장!", "gold");
    spawnItems(extraItems);
  }

  if (phase === 2 && collectedCount === extraItems.length) {
    gameClear();
  }
}

function gameClear() {
  if (backMusic) backMusic.pause();
  playEffect("success.mp3");

  const m = document.getElementById("center-msg");
  m.innerText = "LEVEL CLEAR !";
  m.style.color = "orange";
  m.style.display = "block";

  document.addEventListener("click", showMemo, { once: true });
  document.addEventListener("touchstart", showMemo, { once: true });
}

function showMemo() {
  playEffect("coin.mp3");
  document.getElementById("memo").style.display = "block";
}

