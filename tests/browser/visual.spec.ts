import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const width of [320,390,768,1440]) {
 test(`G1 responsive controls, localization and accessibility at ${width}px`, async({page})=>{
  await page.setViewportSize({width,height:width===1440?1100:844});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('./');
  await expect(page.locator('.cell')).toHaveCount(64);
  await expect(page.locator('.shape-gallery .piece')).toHaveCount(6);
  await expect(page.locator('.special-gallery .piece')).toHaveCount(4);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.locator('[data-cell="0"]').focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('[data-cell="1"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-cell="1"]')).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Switch to Traditional Chinese'}).click();
  await expect(page.locator('html')).toHaveAttribute('lang','zh-TW');
  await expect(page.locator('h1')).toContainText('找到你的快樂形狀');
  await expect(page.locator('[data-cell="1"]')).toHaveAttribute('aria-pressed','true');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  const zhAudit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(zhAudit.violations).toEqual([]);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang','zh-TW');
  await page.getByRole('button',{name:'Switch to English'}).click();
  await page.getByLabel('Reduce motion').check();
  await page.getByRole('button',{name:'Match',exact:true}).click();
  await expect(page.getByRole('status')).toHaveText('A perfect little match!');
  await expect(page.locator('.effect-overlay')).not.toHaveClass(/show/);
  await page.getByRole('button',{name:'Cascade',exact:true}).click();
  await expect(page.getByRole('status')).toHaveText('Keep the good things falling.');
  await expect(page.locator('.effect-overlay')).not.toHaveClass(/show/);
  await page.getByRole('button',{name:'Special',exact:true}).click();
  await expect(page.getByRole('status')).toHaveText('Make a little magic!');
  await expect(page.locator('.effect-overlay')).not.toHaveClass(/show/);
  await page.reload();
  await expect(page.getByLabel('Reduce motion')).toBeChecked();
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(audit.violations).toEqual([]); expect(errors).toEqual([]);
 });
}
test('touch sample selection and effect preview',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await context.newPage();await page.goto('http://127.0.0.1:4173/shape-match/');
 await page.locator('[data-cell="10"]').tap();await expect(page.locator('[data-cell="10"]')).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Special',exact:true}).tap();await expect(page.locator('.effect-overlay')).toHaveClass(/show/);
 await context.close();
});
test('system reduced motion and malformed preference recovery',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');
 await expect(page.getByLabel('Reduce motion')).toBeChecked();
 await page.evaluate(()=>localStorage.setItem('shape-match-preferences','{bad'));await page.reload();
 await expect(page.getByRole('alert')).toContainText('Preferences could not be saved');
 await expect(page.locator('.cell')).toHaveCount(64);
});
test('capture G1 review artifacts',async({page})=>{
 await page.setViewportSize({width:1440,height:1100});await page.goto('./');
 await page.screenshot({path:'docs/evidence/g1-desktop.png',fullPage:true});
 await page.locator('.collection').first().screenshot({path:'docs/evidence/g1-ordinary-pieces.png'});
 await page.locator('.special-collection').screenshot({path:'docs/evidence/g1-special-pieces.png'});
 await page.getByRole('button',{name:'Special',exact:true}).click();await page.waitForTimeout(300);
 await page.screenshot({path:'docs/evidence/g1-special-feedback.png',fullPage:true});
 await expect(page.locator('.effect-overlay')).not.toHaveClass(/show/);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'docs/evidence/g1-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'Switch to Traditional Chinese'}).click();
 await page.screenshot({path:'docs/evidence/g1-mobile-zh-TW.png',fullPage:true});
});
