const {subtract, vectorTheta} = require('bens_utils').vectors;

const render = (state) => {
  const game = state.game;
  const canvas = document.getElementById('canvas');
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, game.worldSize.width, game.worldSize.height);

  // fog
  for (const loc of game.fogLocations) {
    ctx.fillStyle = "steelblue";
    ctx.beginPath();
    ctx.arc(loc.position.x, loc.position.y, loc.vision, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = 'rgba(100,100,100, 0.75)';
  ctx.fillRect(0, 0, game.worldSize.width, game.worldSize.height);
  for (const entityID in game.entities) {
    const entity = game.entities[entityID];
    if (entity.clientID != state.clientID) continue;
    ctx.fillStyle = "steelblue";
    ctx.beginPath();
    ctx.arc(entity.position.x, entity.position.y, entity.vision, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
  }

  for (const entityID in game.visibleEntities) {
    const entity = game.entities[entityID];
    ctx.fillStyle = "blue";
    if (entity.clientID != state.clientID) {
      ctx.fillStyle = "red";
    }

    let width = 4;
    let height = 4;
    let shape = 'square'; // default shape is square
    if (entity.type === 'AIRBASE') {
      width = 16;
      height = 8;
    } else if (entity.type === 'BOMBER') {
      height = 8;
    } else if (entity.type === 'RECON') {
      shape = 'circle'; // change shape to circle
      width = 6;
    } else if (entity.type === 'FIGHTER') {
      shape = 'triangle'; // change shape to triangle
      width = 7;
      height = 7;
    }

    // rotate
    ctx.save();
    ctx.translate(entity.position.x, entity.position.y);
    if (entity.targetEnemy != null && game.entities[entity.targetEnemy]) {
      const target = game.entities[entity.targetEnemy];
      ctx.rotate(vectorTheta(subtract(target.position, entity.position)));
    } else if (entity.targetPos != null) {
      ctx.rotate(vectorTheta(subtract(entity.targetPos, entity.position)));
    }
    ctx.translate(-1 * entity.position.x, -1 * entity.position.y);

    if (game.selectedIDs.includes(entityID)) {
      // fuel remaining
      if (entity.fuel && entity.clientID == state.clientID) {
        ctx.strokeStyle = "#7CFC00";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(entity.position.x, entity.position.y, entity.fuel, 0, 2*Math.PI);
        ctx.closePath();
        ctx.stroke();
      }
      // selection outline
      ctx.lineWidth = 2;
      ctx.strokeStyle = "gold";
      ctx.beginPath();
      if (shape === 'square') {
        ctx.rect(entity.position.x - width / 2, entity.position.y - height / 2, width, height);
      } else if (shape === 'circle') {
        ctx.arc(entity.position.x, entity.position.y, width / 2, 0, 2*Math.PI);
      } else if (shape === 'triangle') { // add triangle shape
        // rotate an additional 90 degrees
        ctx.translate(entity.position.x, entity.position.y);
        ctx.rotate(Math.PI / 2);
        ctx.translate(-1 * entity.position.x, -1 * entity.position.y);

        ctx.moveTo(entity.position.x, entity.position.y - height / 2);
        ctx.lineTo(entity.position.x + width / 2, entity.position.y + height / 2);
        ctx.lineTo(entity.position.x - width / 2, entity.position.y + height / 2);
        ctx.closePath();
        // unrotate
        ctx.translate(entity.position.x, entity.position.y);
        ctx.rotate(-Math.PI / 2);
        ctx.translate(-1 * entity.position.x, -1 * entity.position.y);
      }
      ctx.stroke();
    }
    if (shape === 'square') {
      ctx.fillRect(entity.position.x - width / 2, entity.position.y - height / 2, width, height);
    } else if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(entity.position.x, entity.position.y, width / 2, 0, 2*Math.PI);
      ctx.closePath();
      ctx.fill();
    } else if (shape === 'triangle') { // add triangle shape
      // rotate an additional 90 degrees
      ctx.translate(entity.position.x, entity.position.y);
      ctx.rotate(Math.PI / 2);
      ctx.translate(-1 * entity.position.x, -1 * entity.position.y);

      ctx.beginPath();
      ctx.moveTo(entity.position.x, entity.position.y - height / 2);
      ctx.lineTo(entity.position.x + width / 2, entity.position.y + height / 2);
      ctx.lineTo(entity.position.x - width / 2, entity.position.y + height / 2);
      ctx.closePath();
      ctx.fill();
    }


    ctx.restore(); // unrotate

    // add condition to render plane name
    if (state.game.showStats) {
      ctx.fillStyle = "white";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(entity.name, entity.position.x, entity.position.y + height / 2 + 10);
    }

    // Target
    if (entity.targetEnemy != null && entity.clientID == state.clientID) {
      const target = game.entities[entity.targetEnemy];
      if (target) {
        ctx.strokeStyle = "gold";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(entity.position.x, entity.position.y);
        ctx.lineTo(target.position.x, target.position.y);
        ctx.closePath();
        ctx.stroke();
      }
    } else if (
      entity.targetPos != null &&
      entity.clientID == state.clientID
      // && game.selectedIDs.includes(entityID)
    ) {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(entity.position.x, entity.position.y);
      ctx.lineTo(entity.targetPos.x, entity.targetPos.y);
      ctx.closePath();
      ctx.stroke();
    }
  }

  // render marquee:
  if (state.game.marquee != null) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "gold";
    ctx.beginPath();
    const {x, y, width, height} = state.game.marquee;
    ctx.rect(x, y, width, height);
    ctx.closePath();
    ctx.stroke();
  }

}

module.exports = {
  render,
};
