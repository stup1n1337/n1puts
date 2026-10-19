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
})();