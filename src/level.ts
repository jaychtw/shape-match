import { createGame, type Config } from '@jaychtw/match3-core';
import { shapes } from './pieces.ts';
export const ENGINE = '9863f8e023a227540a58491282e87d9f11a0cf79';
export const level = {
 id: 'g2-bright-beginning', seed: 'shape-match-g2-bright', chapter: 1, number: 1,
 config: { rows: 8, cols: 8, pieceTypes: [...shapes], objectives: [{kind:'score',target:1800}], moveLimit:18 } satisfies Config,
 mechanic: 'Swap adjacent shapes; create and activate specials; score through cascades.',
 difficulty: 'Introductory vertical slice; human balance review pending.',
};
export const newGame = () => createGame(level.config, level.seed);
