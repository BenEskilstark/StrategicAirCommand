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

const getEntitiesByType = (game, type, clientID) => {
  const entities = [];
  for (const entityID in game.entities) {
    const entity = game.entities[entityID];
    if ((entity.clientID == clientID || !clientID) && entity.type == type) {
      entities.push(entity);
    }
  }
  return entities;
}

const normalizePos = (pos, worldSize, canvasSize) => {
  return {
    x: pos.x * worldSize.width / canvasSize.width,
    y: pos.y * worldSize.height / canvasSize.height,
  };
}

const getCanvasSize = () => {
  if (window.innerWidth > window.innerHeight) {
    return {
      width: window.innerHeight,
      height: window.innerHeight,
    };
  } else {
    return {
      width: window.innerWidth,
      height: window.innerWidth,
    };
  }
}

module.exports = {
  getNearestAirbase,
  getEntitiesByPlayer,
  getOtherClientID,
  getNumAirbases,
  isHost,
  getEntitiesByType,
  normalizePos,
  getCanvasSize,
};
