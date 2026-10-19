(() => {
  const img = document.getElementById("memeImage");
  const empty = document.getElementById("memeEmpty");
  const stage = document.getElementById("memeStage");
  const button = document.getElementById("nextMeme");
  const counter = document.getElementById("memeCounter");
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
      counter.textContent = "MEME 000";
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
    counter.textContent = "MEME " + String(current + 1).padStart(3, "0");
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
        if (clickerStatus) clickerStatus.textContent = "СЧЁТЧИК ОБЩИЙ · ОБНОВЛЯЕТСЯ В РЕАЛЬНОМ ВРЕМЕНИ";
      } catch (e) {
        globalCount.textContent = "НЕТ СВЯЗИ";
        globalCount.classList.add("count-error");
        if (clickerStatus) clickerStatus.textContent = "НУЖЕН PHP API: ПРОВЕРЬ /api/click.php";
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
        if (clickerStatus) clickerStatus.textContent = "ЗАСЧИТАНО. ХУЙНЯ СТАНОВИТСЯ БОЛЬШЕ.";
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