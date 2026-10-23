import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {freshSession} from '../src/session.ts';
import {ENGINE,level} from '../src/level.ts';
import {rankMoves} from '../tests/fixtures.mjs';
const evidence={engine:ENGINE,level,method:'Greedy one-turn engine simulations. Feasibility witness, not an exhaustive proof or human difficulty review.',routes:[]};
for(const maximize of [true,false]) {
 const game=freshSession().game,actions=[];
 while(game.state.status==='playing'){
  const choice=rankMoves(game,maximize)[0];assert.ok(choice);actions.push(choice.move);assert.equal(game.applyMove(choice.move).ok,true);
 }
 assert.equal(game.state.status,maximize?'won':'lost');
 evidence.routes.push({policy:maximize?'maximize immediate score':'minimize immediate score',status:game.state.status,moves:game.state.moves,score:game.state.score,actions});
}
writeFileSync('docs/evidence/g2-level-validation.json',JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify(evidence.routes.map(({actions,...route})=>route),null,2));
