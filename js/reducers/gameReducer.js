// @flow

const {clamp, subtractWithDeficit} = require('bens_utils').math;
const {equals, round} = require('bens_utils').vectors;
const {
  randomIn, normalIn, oneOf, weightedOneOf,
} = require('bens_utils').stochastic;
const {makePlane} = require('../state');


const gameReducer = (game, action) => {
  switch (action.type) {
    case 'SET': {
      for (const prop in action) {
        if (prop == 'type') continue;
        game[prop] = action[prop];
      }
      return {...game};
    }
    case 'SELECT_ENTITIES': {
      const {square} = action;
      let selectedIDs = [];
      for (const entityID in game.entities) {
        const entity = game.entities[entityID];
        if (entity.clientID != game.clientID) continue;
        if (
          entity.position.x >= square.x && entity.position.x <= square.x + square.width &&
          entity.position.y >= square.y && entity.position.y <= square.y + square.height
        ) {
          if (entity.type == 'AIRBASE') {
            selectedIDs = [entityID];
            break;
          }
          selectedIDs.push(entityID);
        }
      }
      return {
        ...game,
        selectedIDs,
      };
    }
    case 'LAUNCH_PLANE': {
      const {name, airbaseID, targetPos, clientID} = action;
      const airbase = game.entities[airbaseID];

      // check that this plane is launchable
      if (!airbase || airbase.planes[name] <= 0) break;
      airbase.planes[name]--;

      const plane = makePlane(
        clientID, {...airbase.position},
        game.planeDesigns[clientID][name].type,
        targetPos,
        {...game.planeDesigns[clientID][name]},
      );
      game.entities[plane.id] = plane;

      // update sorties stat
      if (plane.type === 'FIGHTER') {
        game.stats[clientID].fighter_sorties++;
      } else if (plane.type === 'BOMBER') {
        game.stats[clientID].bomber_sorties++;
      } else if (plane.type === 'RECON') {
        game.stats[clientID].recon_sorties++;
      }

      break;
    }
    case 'SET_TARGET': {
      const {entityID, targetPos} = action;
      const entity = game.entities[entityID];
      if (!entity) break;
      entity.targetPos = targetPos;

      break;
    }
  }
  return game;
}


module.exports = {gameReducer}
