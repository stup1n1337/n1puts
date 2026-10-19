(() => {
  const $ = id => document.getElementById(id);
  const countEl = $("clickCount"), rankEl = $("clickRank"), descEl = $("rankDescription");
  const progressEl = $("clickProgress"), fill = $("progressFill");
  let count = Number(localStorage.getItem("n1putsHuynyaClicks") || 0);
  const ranks = [
    { at: 0, name: "USER", desc: "Хуйня только начинается." },
    { at: 10, name: "SUDO USER", desc: "У хуйни появились права." },
    { at: 50, name: "SYSADMIN", desc: "Хуйня теперь под контролем. Почти." },
    { at: 100, name: "ROOT", desc: "Полный доступ к хуйне." },
    { at: 250, name: "DEVOPS", desc: "Автоматизировал хуйню." },
    { at: 500, name: "KERNEL PANIC", desc: "Хуйня вышла на уровень ядра." },
    { at: 1000, name: "GODMODE", desc: "Хуйня стала инфраструктурой." }
  ];
  function render() {
    countEl.textContent = count.toLocaleString("ru-RU");
    const rank = [...ranks].reverse().find(r => count >= r.at) || ranks[0];
    rankEl.textContent = rank.name;
    descEl.textContent = rank.desc;
    const next = ranks.find(r => r.at > count);
    if (next) {
      const previous = rank.at;
      progressEl.textContent = `${count} / ${next.at}`;
      fill.style.width = `${Math.max(0, Math.min(100, (count - previous) / (next.at - previous) * 100))}%`;
    } else {
      progressEl.textContent = "ХУЙНЯ MAX";
      fill.style.width = "100%";
    }
    localStorage.setItem("n1putsHuynyaClicks", String(count));
  }
  $("clickerButton").addEventListener("click", () => {
    count++;
    render();
    const btn = $("clickerButton");
    btn.animate([{ transform: "scale(1) rotate(3deg)" }, { transform: "scale(.92) rotate(-5deg)" }, { transform: "scale(1) rotate(3deg)" }], { duration: 180 });
  });
  const range = $("chaosRange"), value = $("chaosValue");
  range.addEventListener("input", () => {
    value.textContent = range.value + "%";
    document.documentElement.style.setProperty("--chaos-intensity", range.value / 100);
    document.querySelectorAll(".float-sticker").forEach((el, i) => {
      el.style.animationDuration = Math.max(.5, 5 - Number(range.value) / 25 + i * .12) + "s";
      el.style.transform = `rotate(${(i % 2 ? 1 : -1) * (Number(range.value) / 4)}deg)`;
    });
  });
  $("glitchButton").addEventListener("click", () => {
    document.body.classList.toggle("glitch-mode");
    setTimeout(() => document.body.classList.remove("glitch-mode"), 1800);
  });
  $("spinButton").addEventListener("click", () => {
    document.querySelectorAll(".clicker-panel,.control-card,.wisdom-panel").forEach((el, i) => {
      el.animate([{ transform: "rotate(0deg)" }, { transform: `rotate(${i % 2 ? 4 : -4}deg)` }, { transform: "rotate(0deg)" }], { duration: 650, easing: "ease-in-out" });
    });
    document.querySelector(".chaos-intro h1").animate([{ transform: "rotate(0)" }, { transform: "rotate(360deg) scale(1.2)" }, { transform: "rotate(720deg)" }], { duration: 900 });
  });
  $("partyButton").addEventListener("click", () => {
    document.body.classList.add("party-mode");
    setTimeout(() => document.body.classList.remove("party-mode"), 1500);
  });
  const hue = $("hueRange"), preview = $("editorPreview");
  function setHue() {
    preview.style.background = `hsl(${hue.value} 95% 58%)`;
    preview.style.boxShadow = `4px 4px 0 hsl(${(Number(hue.value) + 140) % 360} 100% 55%)`;
  }
  hue.addEventListener("input", setHue);
  $("randomColor").addEventListener("click", () => { hue.value = Math.floor(Math.random() * 361); setHue(); });
  render();

  // Небольшая управляемая вакханалия: окна, случайные сообщения и тревожная кнопка.
  document.querySelectorAll(".popup-close").forEach(btn => btn.addEventListener("click", () => {
    const popup = btn.closest(".fake-popup");
    popup.classList.add("popup-dismissed");
    setTimeout(() => { popup.classList.remove("popup-dismissed"); popup.classList.add("popup-reappear"); }, 2600);
    setTimeout(() => popup.classList.remove("popup-reappear"), 3400);
  }));
  document.querySelectorAll(".popup-confirm").forEach(btn => btn.addEventListener("click", () => {
    btn.textContent = "ХУЙНЯ ПРИНЯТА";
    btn.closest(".fake-popup").classList.add("popup-shake");
    setTimeout(() => btn.closest(".fake-popup")?.classList.remove("popup-shake"), 600);
  }));
  const oracleAnswers = ["ХУЙНЯ БУДЕТ", "НЕ СЕГОДНЯ. ИЛИ СЕГОДНЯ", "СРОЧНО ДОБАВЬ ХУЙНИ", "ПРИЧИНА НЕИЗВЕСТНА", "ВСЁ ИДЁТ ПО ХУЙНЕ", "ОТВЕТ: ХУЙНЯ"];
  $("oracleButton")?.addEventListener("click", () => {
    $("oracleText").textContent = oracleAnswers[Math.floor(Math.random() * oracleAnswers.length)];
    $("oracleText").animate([{transform:"scale(1)"},{transform:"scale(1.15) rotate(-2deg)"},{transform:"scale(1)"}], {duration:350});
  });
  const messages = ["ХУЙНЯ ДИСПИК ХУЙНЯ", "146% ХУЙНИ", "НЕ ТРОГАЙ ХУЙНЮ", "ХУЙНЯ УЖЕ ЗДЕСЬ", "ОШИБКА: СЛИШКОМ МНОГО ХУЙНИ", "ВСЁ НОРМАЛЬНО (НЕТ)"];
  const popMessage = $("popMessage");
  function newMessage() {
    if (!popMessage) return;
    popMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
    popMessage.style.left = (8 + Math.random() * 55) + "%";
    popMessage.style.top = (10 + Math.random() * 75) + "%";
    popMessage.style.setProperty("--tilt", (Math.random() * 18 - 9) + "deg");
    popMessage.classList.remove("message-pop");
    void popMessage.offsetWidth;
    popMessage.classList.add("message-pop");
  }
  $("dontPress")?.addEventListener("click", () => {
    document.body.classList.add("party-mode", "glitch-mode");
    newMessage();
    setTimeout(() => document.body.classList.remove("party-mode", "glitch-mode"), 2200);
    $("dontPress").textContent = ["Я ЖЕ СКАЗАЛ НЕ НАЖИМАТЬ", "ХУЙНЯ АКТИВИРОВАНА", "ПОЗДРАВЛЯЮ, ТЫ НАЖАЛ"][Math.floor(Math.random()*3)];
  });
  setInterval(newMessage, 7000);
  setTimeout(() => {
    const popup = $("popupTwo");
    if (popup) popup.classList.add("popup-attention");
    setTimeout(() => popup?.classList.remove("popup-attention"), 1000);
  }, 5000);

})();