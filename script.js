const $ = (id) => document.getElementById(id);
$("year").textContent = new Date().getFullYear();
const randomItem = list => list[Math.floor(Math.random() * list.length)];
let clicks = 0, toastTimer;
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2200)}
function popWord(x,y,word="+1"){const el=document.createElement("span");el.className="pop-word";el.textContent=word;el.style.left=x+"px";el.style.top=y+"px";$("chaos-overlay").appendChild(el);setTimeout(()=>el.remove(),1300)}
// Load all image files placed in img/memes/; no captions or external dependencies.
const memeFiles = ["jpg","jpeg","png","webp","gif","avif"].flatMap(ext=>Array.from({length:0},()=>ext));
async function loadMemes(){
  // A manifest keeps this compatible with ordinary static hosting (no directory listing required).
  try{const res=await fetch("img/memes/list.json",{cache:"no-store"});if(res.ok){const data=await res.json();return Array.isArray(data)?data.filter(x=>typeof x==="string"):[]}}catch(_){}
  return [];
}
let memes=[], currentMeme=-1;
function changeMeme(){if(!memes.length){toast("Закинь картинки в img/memes/ и перечисли их в list.json");return}let n=Math.floor(Math.random()*memes.length);if(memes.length>1&&n===currentMeme)n=(n+1)%memes.length;currentMeme=n;const img=$("meme-image");img.src="img/memes/"+memes[n];img.hidden=false;$("meme-empty").hidden=true;$("meme-index").textContent=String(n+1).padStart(2,"0")+" / "+String(memes.length).padStart(2,"0")}
loadMemes().then(list=>{memes=list;if(memes.length)changeMeme()});
$("meme-card").addEventListener("click",changeMeme);$("meme-card").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();changeMeme()}});
$("randomize").addEventListener("click",()=>{changeMeme();document.body.classList.add("chaos-mode");setTimeout(()=>document.body.classList.remove("chaos-mode"),450)});
const ranks=[[0,"USER","вход выполнен"],[5,"SUDO USER","права повышены"],[15,"SYSADMIN","служба запущена"],[35,"ROOT","доступ разрешён"],[70,"DEVOPS","деплой пережит"],[120,"KERNEL PANIC","это уже личное"]];
function updateRank(){let rank=ranks[0];for(const r of ranks)if(clicks>=r[0])rank=r;$("rank").textContent=rank[1];$("rank-caption").textContent=rank[2]}
$("clicker").addEventListener("click",e=>{clicks++;$("click-count").textContent=clicks.toLocaleString("ru-RU");updateRank();if(clicks%5===0){const r=$("clicker").getBoundingClientRect();popWord(e.clientX||r.left+r.width/2,e.clientY||r.top+r.height/2,"sudo +1")} });
let nonsense=22484;setInterval(()=>{nonsense+=Math.floor(Math.random()*13)-4;$("nonsense-counter").textContent=Math.max(0,nonsense).toLocaleString("ru-RU")},1200);
// User-provided decorative images: every file listed in img/stickers/list.json is positioned around the viewport.
fetch("img/stickers/list.json").then(r=>r.ok?r.json():[]).then(files=>{if(!Array.isArray(files))return;const layer=$("sticker-layer");files.forEach((file,i)=>{if(typeof file!=="string")return;const img=document.createElement("img");img.className="sticker";img.src="img/stickers/"+file;img.alt="";img.style.left=(5+(i*23)%85)+"%";img.style.top=(8+(i*31)%78)+"%";img.style.width=(42+(i%3)*22)+"px";img.style.setProperty("--duration",(9+(i%8)*2)+"s");layer.appendChild(img)})}).catch(()=>{});
// Tiny floating editor, not a separate page section.
const editor=$("editor-window");$("editor-toggle").addEventListener("click",()=>{editor.hidden=!editor.hidden;$("editor-toggle").setAttribute("aria-expanded",String(!editor.hidden))});$("editor-close").addEventListener("click",()=>{editor.hidden=true;$("editor-toggle").setAttribute("aria-expanded","false")});$("accent-picker").addEventListener("input",e=>document.documentElement.style.setProperty("--pink",e.target.value));$("tilt-picker").addEventListener("input",e=>$("hero-title").style.transform=`rotate(${e.target.value}deg)`);$("editor-reset").addEventListener("click",()=>{document.documentElement.style.setProperty("--pink","#ff0090");$("accent-picker").value="#ff0090";$("tilt-picker").value=-3;$("hero-title").style.transform="rotate(-3deg)"});
$("hero-title").addEventListener("click",e=>popWord(e.clientX,e.clientY,"root?"));
