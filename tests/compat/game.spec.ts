import {test,expect} from '@playwright/test';
import {loadGame} from '@jaychtw/match3-core';
for(const width of [390,1440])test(`keyboard gameplay, persistence, localization, Free Play and menus at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');
 const read=async()=>JSON.parse((await page.evaluate(()=>localStorage.getItem('shape-match-session-v1')))!);
 const original=await read(),game=loadGame(original.state),action=game.listLegalMoves()[0];game.applyMove(action);
 const from=action.from.row*8+action.from.col,to=action.to.row*8+action.to.col;await page.locator(`[data-cell="${from}"]`).focus();await page.keyboard.press('Enter');await page.keyboard.press(to>from?(to-from===1?'ArrowRight':'ArrowDown'):(from-to===1?'ArrowLeft':'ArrowUp'));await page.keyboard.press('Space');
 await expect(page.locator('.board')).toHaveAttribute('data-moves','1');await expect(page.locator('.board')).toHaveAttribute('data-reconciled','true');expect(JSON.parse((await read()).state)).toEqual(game.state);
 const saved=await read();await page.reload();expect(await read()).toEqual(saved);await page.locator('#free').click();await expect(page.locator('#moves')).toHaveText('∞');await page.locator('#journey').click();expect(await read()).toEqual(saved);
 await page.locator('#settings').click();await page.locator('[data-preference=muted]').check();await page.locator('[data-preference=music]').check();await page.keyboard.press('Escape');await page.locator('#language').click();await expect(page.locator('html')).toHaveAttribute('lang','zh-TW');await page.locator('#tutorial').click();await expect(page.getByRole('dialog')).toContainText('稜鏡');await page.keyboard.press('Escape');await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','zh-TW');expect(await read()).toEqual(saved);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:`test-results/compat-${test.info().project.name}-${width}.png`,fullPage:true});
});
