const $ = (id) => document.getElementById(id);
$("year").textContent = new Date().getFullYear();

const memes = [
  {title:"СЕРВЕР РАБОТАЕТ", sub:"но это не точно", face:"🗿"},
  {title:"ВСЁ ПОД КОНТРОЛЕМ", sub:"контроль покинул чат", face:"🫡"},
  {title:"ОШИБКА 418", sub:"я чайник. буквально.", face:"🫖"},
  {title:"ПЛАН НА ДЕНЬ", sub:"не сломать прод", face:"🐈"},
  {title:"ПРОБЛЕМА НАЙДЕНА", sub:"теперь осталось понять какая", face:"🧠"},
  {title:"ОНО САМО", sub:"я вообще ничего не трогал", face:"🤨"},
  {title:"99% ГОТОВО", sub:"последний процент займёт три года", face:"💀"},
  {title:"БЭКАП ЕСТЬ", sub:"где-то. наверное.", face:"🗿"},
  {title:"ПИНГ ЕСТЬ", sub:"а смысла уже нет", face:"📡"},
  {title:"СИСТЕМА СТАБИЛЬНА", sub:"если не смотреть", face:"🤡"}
];
const captions = [
  "я перданул и обосрал свои шорты",
  "инфраструктура уровня «мама, я айтишник»",
  "работает? не трогай.",
  "настроено методом научного тыка",
  "всё автоматизировано, кроме меня",
  "серверы есть. понимания нет.",
  "сайт безопасен. наверное."
];
const oracleLines = [
  "Выключи и включи. Если не поможет — назови это миграцией.",
  "Сделай бэкап. Нет, второй бэкап. И ещё один на флешку.",
  "Сегодня хороший день, чтобы ничего не обновлять.",
  "Если работает — не трогай. Если не работает — тоже не трогай, вдруг само.",
  "Ответ внутри тебя. Но сначала проверь логи.",
  "Попробуй перезагрузить роутер. Даже если вопрос был не про интернет.",
  "Спроси у ИИ. Потом спроси у другого ИИ, можно ли верить первому.",
  "Тебе нужен кофе и ещё один сервер. Сервер не решит проблему.",
  "Переименуй ошибку в фичу и двигайся дальше.",
  "Не делай сегодня ничего, что нельзя откатить."
];
const ranks = [
  [0,"НУЛЁВЫЙ","пока что никто"],
  [5,"КЛИКЕР-СТАЖЁР","уже что-то подозрительно"],
  [15,"МЕМНЫЙ ИНЖЕНЕР","сертификат распечатай сам"],
  [35,"СИСАДМИН НА МАКСИМАЛКАХ","sudo вошёл в чат"],
  [70,"ПОВЕЛИТЕЛЬ ПИНГА","пакеты боятся тебя"],
  [120,"БОГ ХОСТИНГА","теперь ты обязан чинить всем Wi-Fi"]
];
const popWords = ["АХУЕТЬ","ОЙ","404 МОЗГ","+1 ХУЙНЯ","НЕ ТРОГАЙ","СЕРВЕР ЖИВ","КТО ЭТО СДЕЛАЛ","ПИНГ???","ВЫЗОВ ПРИНЯТ","ПОЧЕМУ РАБОТАЕТ"];
let memeIndex = 0, clicks = 0, charge = 0, chargeTimer = null, toastTimer = null, soundOn = false, audioCtx = null;

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2500);
}
function randomItem(list) { return list[Math.floor(Math.random() * list.length)]; }
function changeMeme() {
  let next = Math.floor(Math.random() * memes.length);
  if (next === memeIndex) next = (next + 1) % memes.length;
  memeIndex = next;
  const m = memes[memeIndex];
  $("meme-text").textContent = m.title;
  $("meme-subtext").textContent = m.sub;
  $("meme-face").textContent = m.face;
  $("meme-index").textContent = "№ " + String(memeIndex + 1).padStart(3, "0");
  playTone(380, .045);
}
function popWord(x, y, word = randomItem(popWords)) {
  const el = document.createElement("span");
  el.className = "pop-word";
  el.textContent = word;
  el.style.left = x + "px";
  el.style.top = y + "px";
  $("chaos-overlay").appendChild(el);
  setTimeout(() => el.remove(), 1300);
}
function playTone(freq = 440, duration = .06) {
  if (!soundOn) return;
  try {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.type = "square"; osc.frequency.value = freq;
    gain.gain.setValueAtTime(.035, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + duration);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + duration);
  } catch (_) {}
}
$("meme-card").addEventListener("click", changeMeme);
$("meme-card").addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); changeMeme(); } });
$("hero-title").addEventListener("click", e => { popWord(e.clientX, e.clientY, "ЗАЧЕМ"); toast("Логотип не несёт ответственности за ваши действия."); });
$("randomize").addEventListener("click", () => {
  $("hero-caption").textContent = randomItem(captions);
  changeMeme();
  document.body.classList.add("chaos-mode");
  setTimeout(() => document.body.classList.remove("chaos-mode"), 800);
  popWord(window.innerWidth / 2, window.innerHeight / 2);
  toast(randomItem(["Случайная хуйня успешно доставлена.", "План выполнен на сомнительные 3%.", "Система делает вид, что так и задумано.", "Ошибка? Нет, спецэффект."]));
  playTone(680, .1);
});
$("oracle-button").addEventListener("click", () => {
  $("oracle-answer").textContent = randomItem(oracleLines);
  $("oracle-answer").animate([{transform:"scale(.96)",opacity:.3},{transform:"scale(1)",opacity:1}], {duration:260,easing:"ease-out"});
  playTone(540, .08);
});
function updateRank() {
  let rank = ranks[0];
  for (const r of ranks) if (clicks >= r[0]) rank = r;
  $("rank").textContent = rank[1];
  $("rank-caption").textContent = rank[2];
}
$("clicker").addEventListener("click", e => {
  clicks++;
  $("click-count").textContent = clicks.toLocaleString("ru-RU");
  updateRank();
  if (clicks % 5 === 0) {
    const r = $("clicker").getBoundingClientRect();
    popWord(e.clientX || r.left + r.width/2, e.clientY || r.top + r.height/2, randomItem(popWords));
    toast(randomItem(["+1 к карме. -2 к продуктивности.", "Продолжай. Это точно важно.", "HR уже заметил твою эффективность.", "Ещё немного и откроется ничего."]));
  }
  playTone(240 + Math.min(clicks, 30) * 13, .035);
});
let nonsense = 22484;
setInterval(() => {
  nonsense += Math.floor(Math.random() * 13) - 4;
  $("nonsense-counter").textContent = Math.max(0,nonsense).toLocaleString("ru-RU");
}, 1200);

function setCharge(value) {
  charge = Math.max(0, Math.min(100, value));
  $("charge-fill").style.width = charge + "%";
  $("reactor-result").textContent = charge >= 100 ? "РЕАКТОР ВЗОРВАЛСЯ. ВИНОВАТЫ ВЫ." : `ЗАРЯД: ${charge}% — ${charge > 60 ? "НАЧИНАЕТ ПАХНУТЬ ЖАРЕНЫМ" : charge > 20 ? "ВСЁ ЕЩЁ ПЛОХАЯ ИДЕЯ" : "ВСЁ ПО ПЛАНУ"}`;
  $("reactor-core").style.transform = `rotate(${Math.random()*10-5}deg) scale(${1 + charge/180})`;
}
function startCharge(e) {
  e.preventDefault();
  if (chargeTimer) return;
  playTone(180, .08);
  chargeTimer = setInterval(() => {
    setCharge(charge + 4);
    if (charge >= 100) {
      clearInterval(chargeTimer); chargeTimer = null;
      document.body.classList.add("chaos-mode");
      for (let i=0;i<8;i++) setTimeout(() => popWord(Math.random()*window.innerWidth, Math.random()*window.innerHeight), i*90);
      toast("РЕАКТОР ВЗОРВАЛСЯ. СЕРВЕРЫ НЕ ПОСТРАДАЛИ (НАВЕРНОЕ).");
      playTone(90,.3);
      setTimeout(() => { document.body.classList.remove("chaos-mode"); setCharge(0); }, 1200);
    }
  }, 70);
}
function stopCharge() { if (chargeTimer) { clearInterval(chargeTimer); chargeTimer = null; if (charge < 100) setCharge(0); } }
$("reactor-button").addEventListener("pointerdown", startCharge);
["pointerup","pointerleave","pointercancel"].forEach(evt => $("reactor-button").addEventListener(evt, stopCharge));
$("sound-toggle").addEventListener("click", () => {
  soundOn = !soundOn;
  $("sound-toggle").textContent = soundOn ? "♫ ЗВУК: ВКЛ" : "♫ ЗВУК: ВЫКЛ";
  $("sound-toggle").setAttribute("aria-pressed", String(soundOn));
  if (soundOn) { playTone(660,.08); toast("Звук включён. Соседи не одобряют."); }
  else toast("Тишина. Почти как в серверной.");
});
$("footer-secret").addEventListener("click", () => {
  document.body.classList.add("chaos-mode");
  for (let i=0;i<12;i++) setTimeout(() => popWord(Math.random()*window.innerWidth, Math.random()*window.innerHeight), i*70);
  toast("СЕКРЕТНЫЙ РЕЖИМ АКТИВИРОВАН. ОТВЕТСТВЕННОСТЬ СНЯТА.");
  setTimeout(() => document.body.classList.remove("chaos-mode"), 900);
});
document.addEventListener("pointerdown", e => {
  if (e.target.closest("a,button,.meme-card")) return;
  if (Math.random() < .14) popWord(e.clientX, e.clientY);
});
const statuses = ["СИСТЕМА ВРОДЕ РАБОТАЕТ","ВСЁ ПОД КОНТРОЛЕМ (НЕТ)","ПИНГ ЕСТЬ, ВОПРОСЫ ЕСТЬ","АДМИН НЕ СПИТ","НЕ ТРОГАЙ ПРОД"];
setInterval(() => { $("system-status").textContent = randomItem(statuses); }, 6500);
$("hero-caption").textContent = randomItem(captions);
