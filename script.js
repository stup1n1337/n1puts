(() => {
  const countEl = document.getElementById('clickCount');
  const clickButton = document.getElementById('clickButton');
  const musicFile = document.getElementById('musicFile');
  const audio = document.getElementById('backgroundMusic');
  const memeImage = document.getElementById('memeImage');
  const emptyMemes = document.getElementById('emptyMemes');
  const nextMeme = document.getElementById('nextMeme');
  let count = 0, memes = [], current = -1, objectUrl = null;

  clickButton.addEventListener('click', () => {
    count += 1;
    countEl.textContent = count.toLocaleString('ru-RU');
    clickButton.animate([{transform:'translate(5px,5px) scale(.96)'},{transform:'translate(0,0) scale(1)'}],{duration:120});
  });

  musicFile.addEventListener('change', () => {
    const file = musicFile.files && musicFile.files[0];
    if (!file) return;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);
    audio.src = objectUrl;
    audio.play().catch(() => {
      // Some browsers require a direct user gesture before playback.
    });
  });

  async function loadMemes() {
    // Static hosting can't list a directory, so use an optional manifest if present.
    try {
      const response = await fetch('img/memes/manifest.json', {cache:'no-store'});
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) memes = data.filter(x => typeof x === 'string');
      }
    } catch (_) {}
    if (!memes.length) {
      emptyMemes.hidden = false;
      memeImage.hidden = true;
      return;
    }
    showMeme(0);
  }
  function showMeme(index) {
    if (!memes.length) return;
    current = (index + memes.length) % memes.length;
    memeImage.src = 'img/memes/' + memes[current];
    memeImage.hidden = false;
    emptyMemes.hidden = true;
  }
  nextMeme.addEventListener('click', () => {
    if (!memes.length) { loadMemes(); return; }
    showMeme(current + 1);
  });
  loadMemes();
})();