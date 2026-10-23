import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {loadGame,type Move} from '@jaychtw/match3-core';
import {freshSession,encode,SAVE_KEY,BACKUP_KEY} from '../../src/session.ts';
import {pairSession,pairMove,specialPairs,rankMoves,creationFixture} from '../fixtures.mjs';

async function open(page:Page,session=freshSession(),lang='en',reduced=true){
 await page.addInitScript(({save,key,lang,reduced})=>{
  if(!sessionStorage.getItem('prepared')){localStorage.setItem(key,save);localStorage.setItem('shape-match-preferences',JSON.stringify({lang,reduced}));sessionStorage.setItem('prepared','yes');}
 },{save:encode(session),key:SAVE_KEY,lang,reduced});
 await page.goto('./');await expect(page.locator('.cell')).toHaveCount(64);
}
async function saved(page:Page){return JSON.parse((await page.evaluate(key=>localStorage.getItem(key),SAVE_KEY))!);}
async function assertBoard(page:Page,state:any){
 const actual=await page.locator('.cell').evaluateAll(cells=>cells.map(el=>({id:Number((el as HTMLElement).dataset.id),type:(el as HTMLElement).dataset.type||null,special:(el as HTMLElement).dataset.special||null})));
 expect(actual).toEqual(state.board.flat());
 await expect(page.locator('.board')).toHaveAttribute('data-score',String(state.score));await expect(page.locator('.board')).toHaveAttribute('data-moves',String(state.moves));await expect(page.locator('.board')).toHaveAttribute('data-status',state.status);await expect(page.locator('.board')).toHaveAttribute('data-reconciled','true',{timeout:15000});
}
async function move(page:Page,action:Move){
 const previous=loadGame((await saved(page)).state);const result=previous.applyMove(action);expect(result.ok).toBeTruthy();
 await page.locator(`[data-cell="${action.from.row*8+action.from.col}"]`).click();
 await page.locator(`[data-cell="${action.to.row*8+action.to.col}"]`).click();
 await expect(page.locator('.board')).toHaveAttribute('data-moves',String(result.state.moves));
 await expect(page.locator('.board')).toHaveAttribute('data-reconciled','true',{timeout:15000});
 expect(JSON.parse((await saved(page)).state)).toEqual(result.state);await assertBoard(page,result.state);
 return result;
}
for(const width of [320,390,768,1440])test(`gameplay, bilingual layout, keyboard and accessibility at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await open(page);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 const session=freshSession(),action=session.game.listLegalMoves()[0];
 const from=action.from.row*8+action.from.col,to=action.to.row*8+action.to.col;
 await page.locator(`[data-cell="${from}"]`).focus();await page.keyboard.press('Enter');
 const key=to===from+1?'ArrowRight':to===from-1?'ArrowLeft':to>from?'ArrowDown':'ArrowUp';
 await page.keyboard.press(key);await expect(page.locator(`[data-cell="${to}"]`)).toBeFocused();await page.keyboard.press('Space');
 const result=session.game.applyMove(action);await expect(page.locator('.board')).toHaveAttribute('data-moves','1');await expect(page.locator('.board')).toHaveAttribute('data-reconciled','true',{timeout:15000});await assertBoard(page,result.state);
 for(const lang of ['zh-TW','en']){
  await page.getByRole('button',{name:lang==='zh-TW'?'Switch to Traditional Chinese':'Switch to English'}).click();await expect(page.locator('html')).toHaveAttribute('lang',lang);
  await assertBoard(page,result.state);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(audit.violations).toEqual([]);
 }
 await page.reload();await assertBoard(page,result.state);
});
for(const [a,b]of specialPairs)test(`browser ${a}+${b}: ordered animations and saved/rendered state agree`,async({page})=>{
 await open(page,pairSession(a,b));const result=await move(page,pairMove);expect(result.events.some(e=>e.type==='combined')).toBeTruthy();
});
for(const special of ['horizontal','vertical','bomb','color'])test(`browser ${special} creation and reduced-motion reconciliation`,async({page})=>{
 const {session,move:action}=creationFixture(special);await open(page,session);const result=await move(page,action);expect(result.events.some(e=>e.type==='specialCreated'&&e.piece.special===special)).toBeTruthy();
});
test('invalid swap animates a return, consumes nothing, and duplicate pointer input is locked',async({page})=>{
 await open(page,freshSession(),'en',false);const original=await saved(page),game=loadGame(original.state);
 let invalid:Move|undefined;
 for(let r=0;r<8&&!invalid;r++)for(let c=0;c<7;c++){const m={from:{row:r,col:c},to:{row:r,col:c+1}};if(!game.isLegalMove(m)){invalid=m;break;}}
 await page.locator(`[data-cell="${invalid!.from.row*8+invalid!.from.col}"]`).click();await page.locator(`[data-cell="${invalid!.to.row*8+invalid!.to.col}"]`).click();
 await expect(page.getByRole('status')).toContainText('No move used');await expect(page.locator('.board')).toHaveAttribute('data-reconciled','true',{timeout:15000});expect(await saved(page)).toEqual(original);await assertBoard(page,game.state);
 const action=game.listLegalMoves()[0],expected=game.applyMove(action);
 // Dispatch simultaneous keyboard-generated clicks while the first animation owns the input lock.
 await page.evaluate(({from,to})=>{for(let i=0;i<4;i++){(document.querySelector(`[data-cell="${from}"]`)as HTMLButtonElement).click();(document.querySelector(`[data-cell="${to}"]`)as HTMLButtonElement).click();}},{from:action.from.row*8+action.from.col,to:action.to.row*8+action.to.col});
 await expect(page.locator('.board')).toHaveAttribute('data-reconciled','true',{timeout:15000});await assertBoard(page,expected.state);expect(JSON.parse((await saved(page)).state)).toEqual(expected.state);
});
for(const maximize of [true,false])test(`complete actual level → ${maximize?'victory':'defeat'} and replay`,async({page})=>{
 test.setTimeout(90000);await open(page,freshSession(),maximize?'en':'zh-TW');
 let game=loadGame((await saved(page)).state);
 while(game.state.status==='playing'){
  const action=rankMoves(game,maximize)[0].move;const result=await move(page,action);game=loadGame(result.state);
 }
 expect(game.state.status).toBe(maximize?'won':'lost');await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('dialog')).toContainText(maximize?'Wonderfully connected':'再試一次');
 await page.reload();await expect(page.getByRole('dialog')).toBeVisible();await assertBoard(page,game.state);
 await page.getByRole('button',{name:maximize?'Play again':'再玩一次',exact:true}).click();await assertBoard(page,freshSession().game.state);
});
test('save, reload and next action preserve exact deterministic future, including special metadata',async({page})=>{
 await open(page,pairSession('horizontal','bomb'));await move(page,pairMove);const before=await saved(page);await page.reload();expect(await saved(page)).toEqual(before);await assertBoard(page,JSON.parse(before.state));
 const game=loadGame(before.state);if(game.state.status!=='playing')throw Error('Fixture ended too early');await move(page,game.listLegalMoves()[0]);
});
test('restart requires confirmation and cancel keeps session',async({page})=>{
 await open(page);await move(page,freshSession().game.listLegalMoves()[0]);const before=await saved(page);
 await page.getByRole('button',{name:'Restart level',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'Keep playing',exact:true}).click();expect(await saved(page)).toEqual(before);
 await page.getByRole('button',{name:'Restart level',exact:true}).click();await page.getByRole('button',{name:'Restart',exact:true}).click();await assertBoard(page,freshSession().game.state);
});
test('corrupt save is retained until explicit backup recovery',async({page})=>{
 await open(page);const current=await saved(page);await page.evaluate(({key,backup,raw})=>{localStorage.setItem(backup,raw);localStorage.setItem(key,'{broken');},{key:SAVE_KEY,backup:BACKUP_KEY,raw:JSON.stringify(current)});await page.reload();
 await expect(page.getByRole('dialog')).toContainText('could not be restored');expect(await page.evaluate(key=>localStorage.getItem(key),SAVE_KEY)).toBe('{broken');
 await page.getByRole('button',{name:'Restore backup',exact:true}).click();await assertBoard(page,JSON.parse(current.state));expect(await saved(page)).toEqual(current);
});
test('blocked storage has a clear fallback and gameplay still works',async({page})=>{
 await page.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('blocked');};Storage.prototype.setItem=()=>{throw Error('blocked');};});await page.goto('./');
 await expect(page.getByRole('alert')).toContainText('Storage is unavailable');const game=freshSession().game,action=game.listLegalMoves()[0],result=game.applyMove(action);
 await page.getByLabel('Reduce motion').check();await page.locator(`[data-cell="${action.from.row*8+action.from.col}"]`).click();await page.locator(`[data-cell="${action.to.row*8+action.to.col}"]`).click();await expect(page.locator('.board')).toHaveAttribute('data-reconciled','true',{timeout:15000});await assertBoard(page,result.state);
});
test('mouse drag submits exactly one directional swap',async({page})=>{
 await open(page);const game=freshSession().game,action=game.listLegalMoves()[0],result=game.applyMove(action);
 const from=await page.locator(`[data-cell="${action.from.row*8+action.from.col}"]`).boundingBox(),to=await page.locator(`[data-cell="${action.to.row*8+action.to.col}"]`).boundingBox();
 await page.mouse.move(from!.x+from!.width/2,from!.y+from!.height/2);await page.mouse.down();await page.mouse.move(to!.x+to!.width/2,to!.y+to!.height/2,{steps:6});await page.mouse.up();await expect(page.locator('.board')).toHaveAttribute('data-moves','1');await expect(page.locator('.board')).toHaveAttribute('data-reconciled','true',{timeout:15000});await assertBoard(page,result.state);
});
test('mobile touch tap, swipe, enlarged targets and pan controls',async({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:4173/shape-match/',viewport:{width:320,height:844},hasTouch:true,isMobile:true});const page=await context.newPage();await open(page);
 const game=freshSession().game,action=game.listLegalMoves()[0];const result=game.applyMove(action);
 const from=await page.locator(`[data-cell="${action.from.row*8+action.from.col}"]`).boundingBox(),to=await page.locator(`[data-cell="${action.to.row*8+action.to.col}"]`).boundingBox();
 const cdp=await context.newCDPSession(page);const x=from!.x+from!.width/2,y=from!.y+from!.height/2;
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:to!.x+to!.width/2,y:to!.y+to!.height/2}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await expect(page.locator('.board')).toHaveAttribute('data-moves','1');await expect(page.locator('.board')).toHaveAttribute('data-reconciled','true',{timeout:15000});await assertBoard(page,result.state);
 await page.evaluate(()=>{
  (window as any).__touchLog=[];
  for(const kind of ['pointerdown','pointerup','touchstart','touchend','mousedown','mouseup','click'])document.addEventListener(kind,e=>{
   const p=e as PointerEvent,el=(e.target as Element).closest('button');(window as any).__touchLog.push({kind,target:el?.id||el?.dataset.cell||null,x:p.clientX,y:p.clientY,time:performance.now()});
  },true);
 });
 await page.getByRole('button',{name:'Larger pieces',exact:true}).tap();
 try{await expect(page.getByRole('button',{name:'Compact board',exact:true})).toBeVisible();}catch(error){throw new Error(String(error)+'\nTouch diagnostics: '+JSON.stringify(await page.evaluate(()=>({events:(window as any).__touchLog,scrollY,large:document.querySelector('#large')?.outerHTML,focus:document.activeElement?.id||document.activeElement?.getAttribute('data-cell')}))));}
 expect((await page.locator('.cell').first().boundingBox())!.width).toBeGreaterThanOrEqual(44);
 await page.getByRole('button',{name:'Show right side of board'}).tap();await expect.poll(()=>page.locator('.board-scroll').evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.getByRole('button',{name:'Show left side of board'}).tap();await expect.poll(()=>page.locator('.board-scroll').evaluate(el=>el.scrollLeft)).toBe(0);
 await page.locator('[data-cell="0"]').tap();await expect(page.locator('[data-cell="0"]')).toHaveAttribute('aria-pressed','true');await context.close();
});
test('large direction controls swap from a small tapped cell',async({page})=>{
 await page.setViewportSize({width:320,height:844});await open(page);const game=freshSession().game,action=game.listLegalMoves()[0],result=game.applyMove(action);
 await page.locator(`[data-cell="${action.from.row*8+action.from.col}"]`).click();const d=action.to.row>action.from.row?'down':action.to.row<action.from.row?'up':action.to.col>action.from.col?'right':'left';
 await page.getByRole('button',{name:`Swap ${d}`,exact:true}).click();await expect(page.locator('.board')).toHaveAttribute('data-moves','1');await expect(page.locator('.board')).toHaveAttribute('data-reconciled','true',{timeout:15000});await assertBoard(page,result.state);
});
test('system reduced motion remains respected',async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');await expect(page.getByLabel('Reduce motion')).toBeChecked();});
test('capture G2 desktop/mobile and real engine animation evidence',async({page})=>{
 await page.setViewportSize({width:1440,height:1100});const fixture=creationFixture('horizontal');await open(page,fixture.session,'en',false);
 await page.screenshot({path:'docs/evidence/g2-desktop.png',fullPage:true});
 const matched=page.waitForFunction(()=>!!document.querySelector('.event-match'));
 await page.locator(`[data-cell="${fixture.move.from.row*8+fixture.move.from.col}"]`).click();await page.locator(`[data-cell="${fixture.move.to.row*8+fixture.move.to.col}"]`).click();await matched;await page.screenshot({path:'docs/evidence/g2-match-feedback.png',fullPage:true});await expect(page.locator('.board')).toHaveAttribute('data-reconciled','true',{timeout:15000});
 await page.screenshot({path:'docs/evidence/g2-special-created.png',fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'docs/evidence/g2-mobile.png',fullPage:true});await page.getByRole('button',{name:'Switch to Traditional Chinese'}).click();await page.screenshot({path:'docs/evidence/g2-mobile-zh-TW.png',fullPage:true});
});
test('typed engine failure keeps exact save and offers a localized reproducible diagnostic',async({page})=>{
 const session=freshSession(),state=session.game.state;state.cleared.circle=Number.MAX_SAFE_INTEGER;session.game=loadGame(state);session.initial=session.game.serialize();
 const action=session.game.listLegalMoves().find(move=>{const r=loadGame(state).applyMove(move);return !r.ok&&r.error.code==='RESOLUTION_LIMIT';})!;expect(action).toBeTruthy();
 await open(page,session,'zh-TW');const original=await saved(page);
 await page.locator(`[data-cell="${action.from.row*8+action.from.col}"]`).click();await page.locator(`[data-cell="${action.to.row*8+action.to.col}"]`).click();
 await expect(page.getByRole('dialog')).toContainText('RESOLUTION_LIMIT');await expect(page.getByRole('dialog')).toContainText('已保留上次有效');expect(await saved(page)).toEqual(original);await assertBoard(page,state);
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'下載診斷資料',exact:true}).click();const file=await download;expect(file.suggestedFilename()).toBe('shape-match-diagnostic.json');
 const report=JSON.parse(await page.evaluate(()=>localStorage.getItem('shape-match-diagnostic-v1')) as string);expect(report.code).toBe('RESOLUTION_LIMIT');const result=loadGame(report.state).applyMove(report.attemptedAction);expect(result.ok).toBeFalsy();if(!result.ok)expect(result.error.code).toBe('RESOLUTION_LIMIT');
 await page.getByRole('button',{name:'選擇其他交換',exact:true}).click();await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('normal-motion special combination finishes and reconciles before accepting the next move',async({page})=>{
 test.setTimeout(60000);await open(page,pairSession('horizontal','bomb'),'en',false);await move(page,pairMove);
 const state=JSON.parse((await saved(page)).state);expect(state.moves).toBe(1);await assertBoard(page,state);
});
