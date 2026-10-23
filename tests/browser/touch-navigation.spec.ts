import {test,expect} from '@playwright/test';
import {loadGame} from '@jaychtw/match3-core';
test('touch navigation activates each control once across DOM replacement and mode restoration',async({browser})=>{
 const context=await browser.newContext({baseURL:'http://127.0.0.1:4173/shape-match/',viewport:{width:390,height:844},hasTouch:true,isMobile:true});const page=await context.newPage();await page.goto('./');await page.getByLabel('Reduce motion').check();
 const read=async()=>JSON.parse((await page.evaluate(()=>localStorage.getItem('shape-match-session-v1')))!);
 const turn=async()=>{const game=loadGame((await read()).state),action=game.listLegalMoves()[0];game.applyMove(action);await page.locator(`[data-cell="${action.from.row*8+action.from.col}"]`).tap();await page.locator(`[data-cell="${action.to.row*8+action.to.col}"]`).tap();await expect(page.locator('.board')).toHaveAttribute('data-moves',String(game.state.moves));await expect(page.locator('.board')).toHaveAttribute('data-reconciled','true');expect(JSON.parse((await read()).state)).toEqual(game.state);};
 for(let i=0;i<2;i++){await turn();await page.reload();}
 const journey=await read();await page.locator('#free').tap();expect((await read()).level).toBe('free-play');await turn();const free=await read();await page.reload();
 await page.locator('#journey').tap();expect(await read()).toEqual(journey);await expect(page.getByRole('dialog')).not.toBeVisible();
 await page.locator('#settings').tap();await expect(page.getByRole('dialog')).toContainText('Settings');await page.locator('[data-preference=music]').tap();await expect(page.locator('[data-preference=music]')).toBeChecked();await page.getByRole('button',{name:'Back to game',exact:true}).tap();await expect(page.getByRole('dialog')).not.toBeVisible();
 await page.locator('#free').tap();expect(await read()).toEqual(free);await expect(page.getByRole('dialog')).not.toBeVisible();
 await page.locator('#journey').tap();expect(await read()).toEqual(journey);await expect(page.getByRole('dialog')).not.toBeVisible();
 await page.locator('#language').tap();await expect(page.locator('html')).toHaveAttribute('lang','zh-TW');await page.locator('#language').tap();await expect(page.locator('html')).toHaveAttribute('lang','en');expect(await read()).toEqual(journey);
 // Real mouse and keyboard controls still work immediately after touch.
 await page.locator('#settings').click();await expect(page.getByRole('dialog')).toContainText('Settings');await page.keyboard.press('Escape');await page.locator('#home').focus();await page.keyboard.press('Enter');await expect(page.getByRole('dialog')).toContainText('Continue playing');await context.close();
});
