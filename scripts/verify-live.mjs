import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {chromium,expect} from '@playwright/test';
import {loadGame} from '@jaychtw/match3-core';
const url='https://jaychtw.github.io/shape-match/';
const commit=process.env.GITHUB_SHA||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const output='test-results/live';mkdirSync(output,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined)});
const reports=[];
try {
 for(const mobile of [false,true]){
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1100},isMobile:mobile,hasTouch:mobile});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(`${url}?build=${commit}`);assert.equal(response.status(),200);
  await expect(page.locator('.cell')).toHaveCount(64);
  const entry=await page.locator('script[type=module]').getAttribute('src');
  const localIndex=readFileSync('dist/index.html','utf8');assert.ok(localIndex.includes(entry),'Hosted entry differs from the tested local build');
  const scriptResponse=await context.request.get(new URL(entry,url).href);assert.equal(scriptResponse.status(),200);
  const localBytes=readFileSync('dist/'+entry.replace('/shape-match/',''));
  const scriptHash=createHash('sha256').update(await scriptResponse.body()).digest('hex');assert.equal(scriptHash,createHash('sha256').update(localBytes).digest('hex'));
  await page.getByLabel('Reduce motion').check();
  const read=async()=>JSON.parse(await page.evaluate(()=>localStorage.getItem('shape-match-session-v1')));
  for(let turn=0;turn<2;turn++){
   const before=await read(),game=loadGame(before.state),move=game.listLegalMoves()[0];assert.ok(move);
   const expected=game.applyMove(move);assert.ok(expected.ok);
   const from=page.locator(`[data-cell="${move.from.row*8+move.from.col}"]`),to=page.locator(`[data-cell="${move.to.row*8+move.to.col}"]`);
   if(mobile){await from.tap();await to.tap();}else{await from.click();await to.click();}
   await expect(page.locator('.board')).toHaveAttribute('data-moves',String(turn+1));await expect(page.locator('.board')).toHaveAttribute('data-reconciled','true',{timeout:15000});
   const saved=await read();assert.deepEqual(JSON.parse(saved.state),expected.state);
   const rendered=await page.locator('.cell').evaluateAll(cells=>cells.map(el=>({id:Number(el.dataset.id),type:el.dataset.type||null,special:el.dataset.special||null})));
   assert.deepEqual(rendered,expected.state.board.flat());
   await page.reload();assert.deepEqual(await read(),saved);
   await expect(page.locator('.cell')).toHaveCount(64);
  }
  await page.getByRole('button',{name:'Switch to Traditional Chinese'}).click();await expect(page.locator('html')).toHaveAttribute('lang','zh-TW');
  const beforeSwitch=await read();await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','zh-TW');assert.deepEqual(await read(),beforeSwitch);
  await page.screenshot({path:`${output}/live-${mobile?'mobile':'desktop'}-zh-TW.png`,fullPage:true});
  assert.deepEqual(errors,[]);
  reports.push({viewport:mobile?'390×844 touch-emulated':'1440×1100 desktop',httpStatus:200,entry,scriptSha256:scriptHash,gameplayTurns:2,engineDOMEquality:'passed',saveReloadAndDeterministicContinuation:'passed',languageReload:'zh-TW passed',pageErrors:0});
  await context.close();
 }
 const report={commit,url,reports};
 writeFileSync(`${output}/live-verification.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
