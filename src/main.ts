import './style.css';
import { createGame, loadGame, type Special } from '@jaychtw/match3-core';
import { messages, type Lang } from './i18n';
import { piece, shapes, type Shape } from './pieces';

// Engine-created stable board; presentation samples never mutate this session.
const game = createGame({pieceTypes: [...shapes]}, 'shape-match-g1');
const restored = loadGame(game.serialize());
if (JSON.stringify(restored.state) !== JSON.stringify(game.state)) throw new Error('Engine restore mismatch');
let lang: Lang = 'en';
let reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let storageFailed = false;
try { const preferences = JSON.parse(localStorage.getItem('shape-match-preferences') || '{}'); if (preferences.lang === 'en' || preferences.lang === 'zh-TW') lang = preferences.lang; if (typeof preferences.reduced === 'boolean') reduced = preferences.reduced; } catch { storageFailed = true; }
const app = document.querySelector<HTMLDivElement>('#app')!;
let selected = -1;
let busy = false;
let feedback: 'ready' | 'matchFeedback' | 'cascadeFeedback' | 'specialFeedback' | 'selectedNote' = 'ready';
const specials: Special[] = ['horizontal','vertical','bomb','color'];
function save() { try { localStorage.setItem('shape-match-preferences', JSON.stringify({lang, reduced})); } catch { storageFailed = true; } }
function render() {
 const t = messages[lang];
 document.documentElement.lang = lang;
 document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
 const cells = game.state.board.flat().map((p, i) => {
  const s = i === 10 ? 'horizontal' : i === 29 ? 'vertical' : i === 43 ? 'bomb' : i === 52 ? 'color' : null;
  const shape = p.type as Shape;
  const name = `${t.row} ${Math.floor(i/8)+1}, ${t.col} ${i%8+1}: ${t[shape]}${s ? ', '+t[s] : ''}`;
  return `<button class="cell ${selected === i ? 'selected' : ''}" tabindex="${i === (selected < 0 ? 0 : selected) ? 0 : -1}" aria-label="${name}" aria-pressed="${selected === i}" data-cell="${i}">${piece(shape,s)}</button>`;
 }).join('');
 app.innerHTML = `<header class="header"><a class="brand" href="#" aria-label="${t.brand}"><span class="brand-mark">${piece('pentagon')}</span>${t.brand}<span class="brand-dot">✦</span></a><nav aria-label="${t.journey}"><span class="nav-active">${t.journey}</span><button class="future" aria-disabled="true" title="${t.soon}">${t.free}<span>→</span></button></nav><button id="language" class="language" aria-label="${t.language}">${lang === 'en' ? '繁體中文' : 'English'} <span>⇄</span></button></header>
 <main><section class="intro"><div class="eyebrow">${t.chapter}</div><h1>${t.title}<span class="title-spark">✳︎</span></h1><p>${t.subtitle}</p></section>
 <div class="game-layout"><aside class="journey-card"><div class="level-badge">03<span>✦</span></div><div class="level-copy"><span class="eyebrow">${t.level}</span><h2>${t.levelName}</h2></div><div class="path" aria-hidden="true"><span class="done">✓</span><i></i><span class="done">✓</span><i></i><span class="current">3</span><i></i><span>4</span><i></i><span>5</span></div><div class="goal-card"><span class="eyebrow">${t.goal}</span><div class="goal-line"><div class="mini-shape">${piece('circle')}</div><strong>${t.collect}</strong></div><div class="progress-track"><span></span></div><small>${t.progress}</small></div><p class="aside-note">${t.hint}</p><span class="aside-flower" aria-hidden="true">✳︎</span></aside>
 <section class="game-card" aria-label="${t.board}"><div class="hud"><div><span>${t.moves}</span><strong>18</strong></div><span class="hud-divider"></span><div><span>${t.score}</span><strong>1,240</strong></div><span class="hud-star" aria-hidden="true">✧</span></div><div class="board-wrap"><div class="board" role="group" aria-label="${t.board}">${cells}</div><div class="effect-overlay" aria-hidden="true"></div></div><div class="board-foot"><span aria-hidden="true">✧</span>${t.note}<span aria-hidden="true">✧</span></div></section>
 <aside class="demo-card"><span class="demo-icon" aria-hidden="true">✦</span><h2>${t.demo}</h2><p>${t.demoSub}</p><div class="demo-buttons">${(['match','cascade','special'] as const).map((key,i)=>`<button data-effect="${key}"><span aria-hidden="true">${['✧','↓','✳︎'][i]}</span>${t[key]}<span aria-hidden="true">→</span></button>`).join('')}</div><p class="feedback" role="status">${t[feedback]}</p><label class="motion-control"><input type="checkbox" id="motion" ${reduced ? 'checked' : ''}>${t.motion}</label></aside></div>
 <section class="collection"><div class="section-heading"><span class="eyebrow">01 / ${t.shapeLabel}</span><h2>${t.pieces}</h2><p>${t.piecesSub}</p></div><div class="shape-gallery">${shapes.map(s=>`<div class="specimen"><div>${piece(s)}</div><span>${t[s]}</span></div>`).join('')}</div></section>
 <section class="collection special-collection"><div class="section-heading"><span class="eyebrow">02 / ${t.effectLabel}</span><h2>${t.powers}</h2><p>${t.powersSub}</p></div><div class="special-gallery">${specials.map((s,i)=>`<div class="special-specimen"><div>${piece((['square','rectangle','pentagon','circle'] as Shape[])[i],s)}</div><span>${t[s]}</span></div>`).join('')}</div></section>
 ${storageFailed ? `<p role="alert">${t.storageError}</p>` : ''}</main><footer><span>${t.footer}</span><span>${t.study}</span></footer>`;
 document.querySelector('#language')!.addEventListener('click', () => { lang = lang === 'en' ? 'zh-TW' : 'en'; save(); render(); document.querySelector<HTMLButtonElement>('#language')!.focus(); });
 document.querySelector('#motion')!.addEventListener('change', e => { reduced = (e.target as HTMLInputElement).checked; save(); document.documentElement.dataset.motion = reduced ? 'reduced' : 'full'; });
 document.querySelectorAll<HTMLButtonElement>('[data-cell]').forEach(button => {
  button.addEventListener('click', () => { if (busy) return; selected = Number(button.dataset.cell); feedback = 'selectedNote'; render(); document.querySelector<HTMLButtonElement>(`[data-cell="${selected}"]`)!.focus(); });
  button.addEventListener('keydown', e => { const delta: Record<string,number> = {ArrowLeft:-1,ArrowRight:1,ArrowUp:-8,ArrowDown:8}; if (!(e.key in delta) || busy) return; e.preventDefault(); const i = Number(button.dataset.cell); let next = i+delta[e.key]; if (next < 0 || next > 63 || (e.key === 'ArrowLeft' && i%8===0) || (e.key === 'ArrowRight' && i%8===7)) next=i; document.querySelectorAll<HTMLButtonElement>('[data-cell]').forEach(b=> b.tabIndex=-1); const target = document.querySelector<HTMLButtonElement>(`[data-cell="${next}"]`)!; target.tabIndex=0; target.focus(); });
 });
 document.querySelectorAll<HTMLButtonElement>('[data-effect]').forEach(b=>b.addEventListener('click',()=>void preview(b.dataset.effect!)));
}
async function preview(effect: string) {
 if (busy) return;
 busy = true;
 const board = document.querySelector<HTMLElement>('.board')!;
 const t = messages[lang];
 const key = effect === 'match' ? 'matchFeedback' : effect === 'cascade' ? 'cascadeFeedback' : 'specialFeedback';
 feedback = key;
 document.querySelector('.feedback')!.textContent = t[key];
 document.querySelectorAll<HTMLButtonElement>('[data-effect]').forEach(b=> b.disabled=true);
 const cells = [...document.querySelectorAll<HTMLElement>('.cell')];
 // Explicitly choreographed G1 effects, not simulated match-resolution logic.
 const targets = effect === 'match' ? [24,25,26] : effect === 'cascade' ? [2,10,18,26,34,42,50,58] : [40,41,42,43,44,45,46,47,3,11,19,27,35,51,59];
 targets.forEach((i,n)=> { cells[i].style.setProperty('--delay', `${n*35}ms`); cells[i].classList.add(effect === 'cascade' ? 'demo-fall' : 'demo-match'); });
 board.classList.add(`preview-${effect}`);
 const overlay = document.querySelector<HTMLElement>('.effect-overlay')!;
 overlay.innerHTML = `<span class="effect-message">${t[key]}</span>${Array.from({length:14},(_,i)=>`<i style="--x:${(i*37)%100}%;--y:${(i*23)%90}%;--turn:${i*47}deg">✦</i>`).join('')}`;
 overlay.classList.add('show');
 await new Promise(resolve=>setTimeout(resolve,reduced ? 350 : 1800));
 if (board.isConnected) { targets.forEach(i=>cells[i].classList.remove('demo-fall','demo-match')); board.className='board'; overlay.classList.remove('show'); overlay.innerHTML=''; }
 busy=false;
 document.querySelectorAll<HTMLButtonElement>('[data-effect]').forEach(b=>b.disabled=false);
}
render();
