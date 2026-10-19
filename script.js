(() => {
const phrases=["ХУЙНЯ","ДОЛБАЕБ","ПОШЕЛ НАХУЙ","ПИЗДЕЦ","ДА ЧТО ЗА ХУЙНЯ"];
const root=document.querySelector('[data-dc-tpl="5"]')||document.body;
let clicks=0, chargeTimer=null, charge=0;
const style=document.createElement('style');
style.textContent='@keyframes clonePop{0%{opacity:0;scale:.2}15%{opacity:1;scale:1.2}100%{opacity:0;translate:0 -100px;scale:.8}}';
document.head.append(style);
function pop(text){const el=document.createElement('div');el.textContent=text;Object.assign(el.style,{position:'fixed',left:(5+Math.random()*80)+'vw',top:(8+Math.random()*75)+'vh',zIndex:99999,font:'900 clamp(20px,4vw,56px) Impact,sans-serif',color:['#ff0090','#ffe600','#00ffe1','#00ff2f'][Math.floor(Math.random()*4)],textShadow:'4px 4px #000, 8px 8px #ff0090',pointerEvents:'none',transform:`rotate(${Math.random()*50-25}deg)`,animation:'clonePop .9s ease-out forwards'});document.body.append(el);setTimeout(()=>el.remove(),950)}
[...document.querySelectorAll('button')].forEach((b,i)=>{b.addEventListener('click',()=>{clicks++;pop(phrases[Math.floor(Math.random()*phrases.length)]);b.style.filter=`hue-rotate(${clicks*37%360}deg)`;root.style.transform=`rotate(${Math.random()*1.4-.7}deg)`;setTimeout(()=>root.style.transform='',300)});if(/ЗАЖМИ|РЕАКТОР|ЗАРЯД/i.test(b.parentElement?.innerText||'')){b.addEventListener('pointerdown',()=>{chargeTimer=setInterval(()=>{charge=Math.min(100,charge+3);b.textContent='ЗАРЯД: '+charge+'%';},80)});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>{clearInterval(chargeTimer);if(charge>=100)pop('ПИЗДЕЦ');charge=0}))}});
setInterval(()=>{if(Math.random()<.18){root.style.filter=`hue-rotate(${Math.random()*360}deg)`;setTimeout(()=>root.style.filter='',180)}},1400);
})();