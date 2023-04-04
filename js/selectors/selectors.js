const {dist} = require('bens_utils').vectors;

const getNearestAirbase = (game, plane) => {
  let nearestAirbase = null;
  let nearestDist = Infinity;
  for (const entityID in game.entities) {
    const entity = game.entities[entityID];
    if (
      entity.type == 'AIRBASE' && entity.clientID == plane.clientID &&
      dist(entity.position, plane.position) < nearestDist
    ) {
      nearestDist = dist(entity.position, plane.position);
      nearestAirbase = entity;
    }
  }
  return nearestAirbase;
};

const getEntitiesByPlayer = (game, clientID) => {
  let entities = {};
  for (const entityID in game.entities) {
    const entity = game.entities[entityID];
    if (entity.clientID == clientID) {
      entities[entity.id] = entity;
    }
  }
  return entities;
}

const getNumAirbases = (game, clientID) => {
  let numAirbases = 0;
  for (const entityID in game.entities) {
    const entity = game.entities[entityID];
    if (entity.clientID == clientID && entity.type == 'AIRBASE') {
      numAirbases++;
    }
  }
  return numAirbases;
}

const getOtherClientID = (clientID) => {
  return clientID == 1 ? 2 : 1;
};

const isHost = (clientID) => {
  return clientID == 1;
}

const getEntitiesByType = (game, clientID, type) => {
  const entities = [];
  for (const entityID in game.entities) {
    const entity = game.entities[entityID];
    if (entity.clientID == clientID && entity.type == type) {
      entities.push(entity);
    }
  }
  return entities;
}

module.exports = {
  getNearestAirbase,
  getEntitiesByPlayer,
  getOtherClientID,
  getNumAirbases,
  isHost,
  getEntitiesByType,
};
