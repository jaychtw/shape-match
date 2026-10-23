import './style.css';
import { type GameEvent, type Move, type Special } from '@jaychtw/match3-core';
import { messages, format, type Lang, type Messages } from './i18n.ts';
import { piece, shapes, type Shape } from './pieces.ts';
import { level } from './level.ts';
import { TurnController } from './controller.ts';
import { playEvent, rejectSwap } from './animation.ts';
import { diagnostic, freshSession, persist, readSession, type StorageLike } from './session.ts';
import type { View } from './projection.ts';

const storage:StorageLike={getItem:key=>localStorage.getItem(key),setItem:(key,value)=>localStorage.setItem(key,value)};
const restored=readSession(storage);
let controller=new TurnController(restored.session??freshSession());
let lang:Lang='en', reduced=matchMedia('(prefers-reduced-motion: reduce)').matches, large=false;
let storageFailed=restored.issue==='storage', corrupt=restored.issue==='corrupt';
try {
 const prefs=JSON.parse(storage.getItem('shape-match-preferences')||'{}');
 if(prefs.lang==='en'||prefs.lang==='zh-TW')lang=prefs.lang;
 if(typeof prefs.reduced==='boolean')reduced=prefs.reduced;
 if(typeof prefs.large==='boolean')large=prefs.large;
}catch {storageFailed=true;}
if(!restored.session&&!restored.issue)storageFailed=!persist(storage,controller.session);
let selected=-1, focusCell=0, uiBusy=false;
let feedback:{key:keyof Messages;values:Record<string,string|number>}={key:'readyPlay',values:{}};
let errorCode:string|null=null, resultDismissed=false;
const app=document.querySelector<HTMLDivElement>('#app')!;
const specials:Special[]=['horizontal','vertical','bomb','color'];
const t=()=>messages[lang];
const number=(n:number)=>new Intl.NumberFormat(lang).format(n);
function preferences() {try{storage.setItem('shape-match-preferences',JSON.stringify({lang,reduced,large}));}catch{storageFailed=true;}}
function say(key:keyof Messages,values:Record<string,string|number>={}) {
 feedback={key,values}; const status=document.querySelector('.feedback');if(status)status.textContent=format(t()[key],values);
}
function draw(view=controller.view) {
 const cells=[...document.querySelectorAll<HTMLButtonElement>('[data-cell]')];
 view.board.flat().forEach((p,i)=>{
  const el=cells[i];if(!el)return;
  const shape=(p?.type??'circle') as Shape;
  el.dataset.id=p?String(p.id):'';el.dataset.type=p?.type??'';el.dataset.special=p?.special??'';
  el.innerHTML=p?piece(shape,p.special):'';
  el.classList.toggle('selected',selected===i);
  el.setAttribute('aria-pressed',String(selected===i));
  el.setAttribute('aria-label',`${t().row} ${Math.floor(i/8)+1}, ${t().col} ${i%8+1}: ${p?(p.special==='color'?t().color:t()[shape]+(p.special?', '+t()[p.special]:'')):t().resolving}`);
  el.disabled=uiBusy;el.tabIndex=i===focusCell?0:-1;
  el.setAttribute('aria-disabled',String(view.status!=='playing'||corrupt));
 });
 const remaining=(controller.session.game.state.config.moveLimit??0)-view.moves;
 document.querySelector('#moves')!.textContent=number(remaining);
 document.querySelector('#score')!.textContent=number(view.score);
 const progress=view.progress[0];
 const current=progress?.current??0, target=level.config.objectives[0].target;
 document.querySelector('#objective-current')!.textContent=format(t().progressScore,{current:number(current),target:number(target)});
 (document.querySelector('.progress-track span') as HTMLElement).style.width=`${Math.min(100,current/target*100)}%`;
 const board=document.querySelector<HTMLElement>('.board')!;
 board.dataset.reconciled=uiBusy?'false':'true';
 board.dataset.score=String(view.score);board.dataset.moves=String(view.moves);board.dataset.status=view.status;
 board.setAttribute('aria-busy',String(uiBusy));
}
function render() {
 const oldScroll=document.querySelector('.board-scroll')?.scrollLeft??0;
 const m=t(); document.documentElement.lang=lang;document.documentElement.dataset.motion=reduced?'reduced':'full';
 app.innerHTML=`<header class="header"><a class="brand" href="#" aria-label="${m.brand}"><span class="brand-mark">${piece('pentagon')}</span>${m.brand}<span class="brand-dot" aria-hidden="true">✦</span></a><nav aria-label="${m.journey}"><span class="nav-active">${m.journey}</span><button class="future" disabled title="${m.unavailable}">${m.free}<span aria-hidden="true">→</span></button></nav><button id="language" class="language" aria-label="${m.language}">${lang==='en'?'繁體中文':'English'} <span aria-hidden="true">⇄</span></button></header>
 <main><section class="intro"><div class="eyebrow">${m.chapter}</div><h1>${m.title}<span class="title-spark" aria-hidden="true">✳︎</span></h1><p>${m.subtitle}</p></section>
 <div class="game-layout"><aside class="journey-card"><div class="level-badge">01<span aria-hidden="true">✦</span></div><div class="level-copy"><span class="eyebrow">${m.level}</span><h2>${m.levelName}</h2></div><div class="goal-card"><span class="eyebrow">${m.goal}</span><div class="goal-line"><div class="mini-shape">${piece('star')}</div><strong>${format(m.goalScore,{target:number(level.config.objectives[0].target)})}</strong></div><div class="progress-track"><span></span></div><small id="objective-current"></small></div><p class="aside-note">${m.hint}</p><span class="aside-flower" aria-hidden="true">✳︎</span></aside>
 <section class="game-card" aria-label="${m.savedLevel}"><div class="hud"><div><span>${m.moves}</span><strong id="moves"></strong></div><span class="hud-divider"></span><div><span>${m.score}</span><strong id="score"></strong></div><span class="hud-star" aria-hidden="true">✧</span></div><div class="board-wrap"><div class="board-scroll ${large?'enlarged':''}"><div class="board" role="group" aria-label="${m.board}" aria-describedby="board-help">${Array.from({length:64},(_,i)=>`<button class="cell" data-cell="${i}"></button>`).join('')}</div></div><div class="effect-overlay" aria-hidden="true"></div></div>${large?`<div class="pan-controls"><button id="pan-left" aria-label="${m.panLeft}">←</button><small>${m.largeHelp}</small><button id="pan-right" aria-label="${m.panRight}">→</button></div>`:''}<div class="board-foot"><span aria-hidden="true">✧</span>${m.note}<span aria-hidden="true">✧</span></div></section>
 <aside class="demo-card controls"><span class="demo-icon" aria-hidden="true">✦</span><h2>${m.controls}</h2><p id="board-help">${m.controlsSub}</p><p class="keyboard-help">${m.keyboardHelp}</p><div class="direction-pad" role="group" aria-label="${m.swapHint}"><button data-direction="up" aria-label="${m.up}">↑</button><button data-direction="left" aria-label="${m.left}">←</button><span aria-hidden="true">✦</span><button data-direction="right" aria-label="${m.right}">→</button><button data-direction="down" aria-label="${m.down}">↓</button></div><p class="feedback" role="status" aria-live="polite">${format(m[feedback.key],feedback.values)}</p><button id="restart" class="action-button">${m.restart}</button><button id="large" class="action-button secondary" aria-pressed="${large}">${large?m.compact:m.large}</button><label class="motion-control"><input type="checkbox" id="motion" ${reduced?'checked':''}>${m.motion}</label><p class="input-help">${large?m.largeHelp:m.dragHelp}</p></aside></div>
 <p class="save-notice ${storageFailed?'warning':''}" ${storageFailed?'role="alert"':''}>${storageFailed?m.storageWarning:m.saved}</p>
 <section class="collection"><div class="section-heading"><span class="eyebrow">01 / ${m.shapeLabel}</span><h2>${m.pieces}</h2><p>${m.piecesSub}</p></div><div class="shape-gallery">${shapes.map(s=>`<div class="specimen"><div>${piece(s)}</div><span>${m[s]}</span></div>`).join('')}</div></section>
 <section class="collection special-collection"><div class="section-heading"><span class="eyebrow">02 / ${m.effectLabel}</span><h2>${m.powers}</h2><p>${m.powersSub}</p></div><div class="special-gallery">${specials.map((s,i)=>`<div class="special-specimen"><div>${piece((['square','rectangle','pentagon','circle'] as Shape[])[i],s)}</div><span>${m[s]}</span></div>`).join('')}</div></section>
 </main><footer><span>${m.footer}</span><span>${m.study}</span></footer><dialog aria-labelledby="dialog-title" aria-describedby="dialog-body"><h2 id="dialog-title"></h2><p id="dialog-body"></p><div class="dialog-actions"></div></dialog>`;
 draw();document.querySelector('.board-scroll')!.scrollLeft=oldScroll;
 document.querySelector('#language')!.addEventListener('click',()=>{if(uiBusy)return;lang=lang==='en'?'zh-TW':'en';preferences();render();document.querySelector<HTMLButtonElement>('#language')!.focus();showNeededDialog();});
 document.querySelector('#motion')!.addEventListener('change',e=>{reduced=(e.target as HTMLInputElement).checked;preferences();document.documentElement.dataset.motion=reduced?'reduced':'full';});
 document.querySelector('#large')!.addEventListener('click',()=>{if(uiBusy)return;large=!large;preferences();render();document.querySelector<HTMLButtonElement>('#large')!.focus();});
 document.querySelector('#restart')!.addEventListener('click',()=>confirmRestart());
 document.querySelectorAll<HTMLButtonElement>('[data-direction]').forEach(el=>el.addEventListener('click',()=>{if(selected>=0)void directional(selected,el.dataset.direction!);}));
 document.querySelector('#pan-left')?.addEventListener('click',()=>document.querySelector('.board-scroll')!.scrollBy({left:-200,behavior:reduced?'instant':'smooth'}));
 document.querySelector('#pan-right')?.addEventListener('click',()=>document.querySelector('.board-scroll')!.scrollBy({left:200,behavior:reduced?'instant':'smooth'}));
 bindBoard();
}
function focus(index:number,scroll=false) {
 focusCell=index;document.querySelectorAll<HTMLButtonElement>('[data-cell]').forEach(el=>el.tabIndex=Number(el.dataset.cell)===index?0:-1);
 const el=document.querySelector<HTMLButtonElement>(`[data-cell="${index}"]`)!;el.focus({preventScroll:true});if(scroll)el.scrollIntoView({block:'nearest',inline:'nearest'});
}
function locked(){return uiBusy||corrupt||controller.session.game.state.status!=='playing'||!!document.querySelector('dialog[open]');}
function choose(index:number) {
 if(locked())return;
 focusCell=index;
 if(selected===index){selected=-1;say('readyPlay');draw();focus(index);return;}
 if(selected>=0) {
  const from={row:Math.floor(selected/8),col:selected%8},to={row:Math.floor(index/8),col:index%8};
  if(Math.abs(from.row-to.row)+Math.abs(from.col-to.col)===1){void submit({from,to});return;}
 }
 selected=index;say('selectedPlay');draw();focus(index);
}
function neighbor(index:number,direction:string):number|null {
 const r=Math.floor(index/8),c=index%8;
 if(direction==='up'&&r>0)return index-8;if(direction==='down'&&r<7)return index+8;
 if(direction==='left'&&c>0)return index-1;if(direction==='right'&&c<7)return index+1;return null;
}
async function directional(index:number,direction:string) {
 if(locked())return;
 const next=neighbor(index,direction);if(next===null){say('edge');return;}
 await submit({from:{row:Math.floor(index/8),col:index%8},to:{row:Math.floor(next/8),col:next%8}});
}
function bindBoard() {
 const board=document.querySelector<HTMLElement>('.board')!;
 let start:{id:number;index:number;x:number;y:number;width:number}|null=null;
 board.addEventListener('pointerdown',e=>{
  if(locked()||e.button!==0||start)return;
  const cell=(e.target as Element).closest<HTMLElement>('[data-cell]');if(!cell)return;
  start={id:e.pointerId,index:Number(cell.dataset.cell),x:e.clientX,y:e.clientY,width:cell.getBoundingClientRect().width};
  board.setPointerCapture(e.pointerId);
 });
 board.addEventListener('pointerup',e=>{
  if(!start||start.id!==e.pointerId)return;
  const origin=start;start=null;
  const dx=e.clientX-origin.x,dy=e.clientY-origin.y,threshold=Math.max(12,Math.min(22,origin.width*.3));
  if(Math.hypot(dx,dy)<threshold){choose(origin.index);return;}
  // Ambiguous diagonal movement does not accidentally spend a move.
  if(Math.max(Math.abs(dx),Math.abs(dy))<Math.min(Math.abs(dx),Math.abs(dy))*1.2)return;
  const direction=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
  void directional(origin.index,direction);
 });
 board.addEventListener('pointercancel',()=>{start=null;});
 board.addEventListener('lostpointercapture',()=>{start=null;});
 board.addEventListener('click',e=>{if(e.detail!==0)return;const cell=(e.target as Element).closest<HTMLElement>('[data-cell]');if(cell)choose(Number(cell.dataset.cell));});
 board.addEventListener('keydown',e=>{
  if(locked())return;const cell=(e.target as Element).closest<HTMLElement>('[data-cell]');if(!cell)return;
  const directions:Record<string,string>={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};
  if(directions[e.key]){e.preventDefault();const next=neighbor(Number(cell.dataset.cell),directions[e.key]);if(next!==null)focus(next,true);}
  if(e.key==='Escape'){selected=-1;draw();say('readyPlay');}
 });
}
function busy(value:boolean) {
 uiBusy=value;document.querySelectorAll<HTMLButtonElement>('#language,#restart,#large,#pan-left,#pan-right,[data-direction]').forEach(el=>el.disabled=value);
 document.querySelector<HTMLElement>('.board')!.dataset.reconciled=value?'false':'true';draw();
}
function sparkle(label:string,at?:{row:number;col:number}) {
 const overlay=document.querySelector<HTMLElement>('.effect-overlay')!;
 overlay.innerHTML='';
 const text=document.createElement('span');text.className='effect-message';text.textContent=label;overlay.append(text);
 const wrap=document.querySelector('.board-wrap')!.getBoundingClientRect();
 const cell=at?document.querySelector(`[data-cell="${at.row*8+at.col}"]`)?.getBoundingClientRect():null;
 for(let i=0;i<8;i++){
  const spark=document.createElement('i');spark.textContent='✦';
  spark.style.setProperty('--x',`${cell?cell.x-wrap.x+cell.width/2:wrap.width/2}px`);
  spark.style.setProperty('--y',`${cell?cell.y-wrap.y+cell.height/2:wrap.height/2}px`);
  spark.style.setProperty('--turn',`${i*45}deg`);spark.style.setProperty('--spread',`${i*45}deg`);overlay.append(spark);
 }
 overlay.classList.add('show');setTimeout(()=>overlay.classList.remove('show'),650);
}
function announce(event:GameEvent) {
 if(event.type==='specialCreated')sparkle(t().specialMade,event.at);
 if(event.type==='combined')sparkle(t().combination,event.pieces[0]);
 if(event.type==='activated')sparkle(t().specialActive,event.at);
 if(event.type==='matched'&&event.wave>0)sparkle(format(t().cascadeCount,{count:event.wave+1}));
 if(event.type==='matched')say(event.wave>0?'cascadeCount':'matchActive',{count:event.wave+1});
 if(event.type==='specialCreated')say('specialMade');
 if(event.type==='activated')say('specialActive');
 if(event.type==='combined')say('combination');
 if(event.type==='reshuffled')say('shuffle');
}
function domMatches(view:View) {
 return [...document.querySelectorAll<HTMLElement>('[data-cell]')].every((el,i)=>{
  const p=view.board[Math.floor(i/8)][i%8];return el.dataset.id===(p?String(p.id):'')&&el.dataset.type===(p?.type??'')&&el.dataset.special===(p?.special??'');
 })&&document.querySelector('#score')!.textContent===number(view.score)&&document.querySelector('#moves')!.textContent===number(level.config.moveLimit-view.moves)&&document.querySelector<HTMLElement>('.board')!.dataset.status===view.status;
}
async function submit(action:Move) {
 if(locked())return;
 selected=-1;focusCell=action.to.row*8+action.to.col;say('resolving');busy(true);
 const outcome=await controller.attempt(action,(view,event,eventCount)=>playEvent(view,event,{scale:Math.min(1,16/eventCount),draw:()=>draw(view),reduced:()=>reduced||matchMedia('(prefers-reduced-motion: reduce)').matches,announce}));
 if(outcome.kind==='committed') {
  if(!domMatches(controller.view)) {
   const report=diagnostic(outcome.previous,action,'DOM_RECONCILIATION');controller=new TurnController(outcome.previous);controller.lastDiagnostic=report;errorCode='DOM_RECONCILIATION';
  }else {
   storageFailed=!persist(storage,controller.session,outcome.previous)||storageFailed;
   say('movesAnnouncement',{moves:(level.config.moveLimit-controller.view.moves),score:number(controller.view.score)});
   resultDismissed=false;
  }
 }else if(outcome.kind==='invalid') {say('invalid');await rejectSwap(action,reduced||matchMedia('(prefers-reduced-motion: reduce)').matches);}
 else if(outcome.kind==='error')errorCode=outcome.code;
 if(errorCode&&controller.lastDiagnostic)try{storage.setItem('shape-match-diagnostic-v1',JSON.stringify(controller.lastDiagnostic));}catch{/* diagnostic remains downloadable in memory */}
 busy(false);render();focus(focusCell);showNeededDialog();
}
function dialog(title:string,body:string,actions:{label:string;run:()=>void}[],onCancel?:()=>void) {
 const el=document.querySelector<HTMLDialogElement>('dialog')!;
 document.querySelector('#dialog-title')!.textContent=title;document.querySelector('#dialog-body')!.textContent=body;
 const row=document.querySelector('.dialog-actions')!;row.innerHTML='';
 for(const {label,run} of actions){const b=document.createElement('button');b.className='action-button';b.textContent=label;b.addEventListener('click',()=>{el.close();run();});row.append(b);}
 el.oncancel=e=>{if(!onCancel)e.preventDefault();else onCancel();};
 el.showModal();
}
function restart() {
 const previous=controller.session;controller=new TurnController(freshSession());selected=-1;focusCell=0;resultDismissed=false;corrupt=false;errorCode=null;
 storageFailed=!persist(storage,controller.session,previous);say('readyPlay');render();focus(0);
}
function confirmRestart() {
 if(uiBusy||corrupt)return;
 dialog(t().restartTitle,t().restartBody,[{label:t().cancel,run:()=>focus(focusCell)},{label:t().confirm,run:restart}],()=>focus(focusCell));
}
function showNeededDialog() {
 if(corrupt) {
  const actions=[];
  if(restored.backup)actions.push({label:t().restoreBackup,run:()=>{controller=new TurnController(restored.backup!);corrupt=false;storageFailed=!persist(storage,controller.session);render();focus(0);showNeededDialog();}});
  actions.push({label:t().recoverNew,run:restart});dialog(t().recoveryTitle,t().corrupt,actions);return;
 }
 if(errorCode) {
  dialog(t().errorTitle,format(t().engineError,{code:errorCode}),[{label:t().dismiss,run:()=>{errorCode=null;focus(focusCell);}},{label:t().diagnostic,run:()=>{download();showNeededDialog();}},{label:t().restart,run:()=>{errorCode=null;confirmRestart();}}]);return;
 }
 if(controller.view.status!=='playing'&&!resultDismissed) {
  const won=controller.view.status==='won';
  dialog(won?t().won:t().lost,won?t().wonBody:t().lostBody,[{label:t().retry,run:restart},{label:t().closeResult,run:()=>{resultDismissed=true;focus(focusCell);}}],()=>{resultDismissed=true;focus(focusCell);});
 }
}
function download() {
 const url=URL.createObjectURL(new Blob([JSON.stringify(controller.lastDiagnostic,null,2)],{type:'application/json'}));
 const a=document.createElement('a');a.href=url;a.download='shape-match-diagnostic.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
render();showNeededDialog();
