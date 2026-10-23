import type { Special } from '@jaychtw/match3-core';
export const shapes = ['circle','triangle','square','rectangle','pentagon','star'] as const;
export type Shape = typeof shapes[number];
const paths: Record<Shape,string> = {
 circle: 'M50 13 A34 34 0 1 1 49.99 13Z',
 triangle: 'M45 14 Q50 6 55 14 L88 73 Q93 83 82 83 H18 Q7 83 12 73Z',
 square: 'M27 16 H73 Q85 16 85 28 V72 Q85 84 73 84 H27 Q15 84 15 72 V28 Q15 16 27 16Z',
 rectangle: 'M17 28 H83 Q94 28 94 39 V62 Q94 73 83 73 H17 Q6 73 6 62 V39 Q6 28 17 28Z',
 pentagon: 'M45 10 Q50 6 55 10 L87 34 Q91 37 89 43 L77 81 Q75 87 69 87 H31 Q25 87 23 81 L11 43 Q9 37 13 34Z',
 star: 'M50 8 L63 33 L91 37 L71 58 L75 87 L50 74 L25 87 L29 58 L9 37 L37 33Z'
};
const palettes: Record<Shape,string[]> = {circle:['#ffaba2','#f46769','#bd354a'],triangle:['#ffeaa0','#f8c853','#c48b20'],square:['#a1e5ff','#5cb5ed','#2b76bd'],rectangle:['#b2f0d1','#65cdaa','#25866e'],pentagon:['#d6b4ff','#a881e4','#7350ad'],star:['#ffcd90','#f6a452','#c66c29']};
let count = 0;
export function piece(shape: Shape, special: Special | null = null): string {
 const id = `p${count++}`, colors = palettes[shape];
 const prism = special === 'color';
 const marker = special === 'horizontal' ? '<path d="M20 44H80M20 55H80"/>' : special === 'vertical' ? '<path d="M44 24V78M56 24V78"/>' : special === 'bomb' ? '<circle cx="50" cy="50" r="17"/><path d="M50 25V19M50 81V75M25 50H19M81 50H75M32 32L28 28M72 72L68 68M32 68L28 72M72 28L68 32"/>' : prism ? '<path d="M50 23L66 49L50 76L34 49Z"/><path d="M34 49H66M50 23V76"/>' : '';
 return `<svg viewBox="0 0 100 104" aria-hidden="true" focusable="false" class="piece ${special || ''}"><defs><linearGradient id="${id}" x1=".2" y1="0" x2=".8" y2="1" gradientUnits="objectBoundingBox">${(prism?['#f5c8ff','#a4ddfa','#b7edcc','#ffe89a','#ffb4b1']:colors).map((c,i,a)=>`<stop offset="${i/(a.length-1)}" stop-color="${c}"/>`).join('')}</linearGradient><linearGradient id="${id}h" x2="0.3" y2="1"><stop stop-color="#fff" stop-opacity=".8"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><path d="${paths[shape]}" transform="translate(0 5)" fill="${prism?'#697b96':colors[2]}"/><path d="${paths[shape]}" fill="url(#${id})" stroke="${prism?'#fff':colors[2]}" stroke-width="1.5"/><path d="${paths[shape]}" transform="translate(7 3) scale(.86 .82)" fill="none" stroke="url(#${id}h)" stroke-width="2.5"/><ellipse cx="38" cy="28" rx="12" ry="5" fill="#fff" opacity=".3" transform="rotate(-23 38 28)"/><g fill="none" stroke="#284c58" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".45">${marker}</g><g fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${marker}</g></svg>`;
}
