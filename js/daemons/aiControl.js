
const {getEntitiesByType} = require('../selectors/selectors');
const {oneOf, randomIn, normalIn} = require('bens_utils').stochastic;

const aiID = 2;

const initAI = (getState, dispatch) => {
  const launchInterval = 400;

  const ai = setInterval(() => {
    const state = getState();
    if (!state.game || !state.game.tickInterval) {
      console.log("clearing interval");
      clearInterval(ai);
    }
    const {config, game} = state;

    const airbases = getEntitiesByType(game, aiID, 'AIRBASE');
    const airbase = oneOf(airbases);

    const planeDesign = game.planeDesigns[aiID][oneOf(Object.keys(game.planeDesigns[aiID]))];
    const targetPos = {
      x: normalIn(
        airbase.position.x - planeDesign.fuel / 2,
        airbase.position.x,
      ),
      y: normalIn(200, game.worldSize.height - 200),
    };

    dispatch({
      type: 'LAUNCH_PLANE', clientID: aiID,
      airbaseID: airbase.id, targetPos, name: planeDesign.name,
    });

  }, launchInterval);


}

module.exports = {initAI};
