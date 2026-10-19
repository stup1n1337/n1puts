(() => {
  const img = document.getElementById("memeImage");
  const empty = document.getElementById("memeEmpty");
  const stage = document.getElementById("memeStage");
  const button = document.getElementById("nextMeme");
  if (!img || !button) return;

  let memes = [];
  let current = -1;
  let sequence = [];

  fetch("/img/memes/list.json", { cache: "no-store" })
    .then(r => { if (!r.ok) throw new Error("list not found"); return r.json(); })
    .then(data => {
      memes = Array.isArray(data) ? data.filter(x => typeof x === "string" && x.trim()) : [];
      if (memes.length) showRandom();
    })
    .catch(() => {});

  function showRandom() {
    if (!memes.length) {
      empty.hidden = false;
      img.hidden = true;
      return;
    }
    if (memes.length === 1) current = 0;
    else {
      let next;
      do { next = Math.floor(Math.random() * memes.length); } while (next === current);
      current = next;
    }
    img.onload = () => { img.hidden = false; empty.hidden = true; };
    img.onerror = () => { img.hidden = true; empty.hidden = false; };
    img.src = "/img/memes/" + memes[current].split("/").map(encodeURIComponent).join("/");
    stage.classList.remove("meme-refresh");
    void stage.offsetWidth;
    stage.classList.add("meme-refresh");
  }
  button.addEventListener("click", showRandom);

  // Shared clicker: count lives on the server, not in this browser.
  const globalCount = document.getElementById("globalCount");
  const globalClick = document.getElementById("globalClick");
  const clickerStatus = document.getElementById("clickerStatus");
  if (globalCount && globalClick) {
    const endpoint = "/api/click.php";
    let busy = false;
    const fmt = n => Number(n || 0).toLocaleString("ru-RU");
    async function refreshCount() {
      try {
        const response = await fetch(endpoint, { cache: "no-store" });
        if (!response.ok) throw new Error("API unavailable");
        const data = await response.json();
        globalCount.textContent = fmt(data.count);
        globalCount.classList.remove("count-error");
        if (clickerStatus && !document.body.classList.contains("chaos-mode")) clickerStatus.textContent = "СЧЁТЧИК ОБЩИЙ · LIVE";
      } catch (e) {
        globalCount.textContent = "НЕТ СВЯЗИ";
        globalCount.classList.add("count-error");
        if (clickerStatus) clickerStatus.textContent = "НЕТ СВЯЗИ С ХУЙНЁЙ";
      }
    }
    globalClick.addEventListener("click", async () => {
      if (busy) return;
      busy = true;
      globalClick.disabled = true;
      globalClick.classList.add("is-clicking");
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
          cache: "no-store"
        });
        if (!response.ok) throw new Error("API unavailable");
        const data = await response.json();
        globalCount.textContent = fmt(data.count);
        globalCount.classList.remove("count-error");
        globalCount.animate([{transform:"scale(1)"},{transform:"scale(1.09) rotate(-1deg)"},{transform:"scale(1)"}], {duration:230});
        if (clickerStatus && !document.body.classList.contains("chaos-mode")) clickerStatus.textContent = "ЗАСЧИТАНО. ХУЙНЯ СТАНОВИТСЯ БОЛЬШЕ.";
      } catch (e) {
        if (clickerStatus) clickerStatus.textContent = "КЛИК НЕ ЗАСЧИТАН: API НЕ ОТВЕЧАЕТ";
      } finally {
        setTimeout(() => {
          busy = false;
          globalClick.disabled = false;
          globalClick.classList.remove("is-clicking");
        }, 180);
      }
    });
    refreshCount();
    setInterval(refreshCount, 2000);
  }

})();

// Вакханалия: включаем намеренно бессмысленные визуальные эффекты.
(() => {
  const toggle = document.getElementById("chaosToggle");
  const overlay = document.getElementById("chaosOverlay");
  const count = document.getElementById("globalCount");
  const status = document.getElementById("clickerStatus");
  if (!toggle || !overlay) return;
  const words = ["ДОЛБАЕБ", "ПОШЕЛ НАХУЙ", "ПИЗДЕЦ"];
  let interval = null;
  let spawnTimer = null;
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function spawnWord() {
    const el = document.createElement("div");
    el.className = "chaos-word";
    el.textContent = pick(words);
    el.style.left = Math.random() * 82 + 4 + "%";
    el.style.top = Math.random() * 78 + 5 + "%";
    el.style.setProperty("--rot", (Math.random() * 36 - 18) + "deg");
    el.style.setProperty("--hue", Math.floor(Math.random() * 360));
    overlay.appendChild(el);
    setTimeout(() => el.remove(), 1700 + Math.random() * 1200);
  }
  function setChaos(on) {
    document.body.classList.toggle("chaos-mode", on);
    toggle.setAttribute("aria-pressed", String(on));
    toggle.textContent = on ? "ВЫРУБИТЬ" : "ПИЗДЕЦ";
    overlay.setAttribute("aria-hidden", String(!on));
    if (on) {
      if (status) status.textContent = "ПОШЕЛ НАХУЙ · РЕЖИМ ВКЛЮЧЁН";
      spawnWord();
      interval = setInterval(() => {
        document.body.classList.toggle("chaos-flash");
        if (Math.random() > .28) spawnWord();
        if (count && Math.random() > .6) count.style.transform = `rotate(${Math.random()*8-4}deg) scale(${.9+Math.random()*.3})`;
      }, 330);
      spawnTimer = setInterval(spawnWord, 540);
    } else {
      clearInterval(interval); clearInterval(spawnTimer);
      interval = spawnTimer = null;
      document.body.classList.remove("chaos-flash");
      if (count) count.style.transform = "";
      overlay.replaceChildren();
      if (status) status.textContent = "СЧЁТЧИК ОБЩИЙ · LIVE";
    }
  }
  toggle.addEventListener("click", () => setChaos(!document.body.classList.contains("chaos-mode")));
  document.getElementById("globalClick")?.addEventListener("click", () => {
    if (document.body.classList.contains("chaos-mode")) {
      spawnWord();
      if (status) status.textContent = pick(words);
    }
  });
})();
