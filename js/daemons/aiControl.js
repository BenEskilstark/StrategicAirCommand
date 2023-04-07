
const {getEntitiesByType} = require('../selectors/selectors');
const {oneOf, randomIn, normalIn} = require('bens_utils').stochastic;

const aiID = 2;

const initAI = (getState, dispatch) => {
  const launchInterval = 800;

  const ai = setInterval(() => {
    const state = getState();
    if (!state.game || !state.game.tickInterval) {
      console.log("clearing interval");
      clearInterval(ai);
    }
    const {config, game} = state;

    const airbases = getEntitiesByType(game, 'AIRBASE', aiID);
    const airbase = oneOf(airbases);

    // prefer to launch IL's
    let planeDesign = game.planeDesigns[aiID][oneOf(Object.keys(game.planeDesigns[aiID]))];
    let range = planeDesign.fuel / 2;
    let maxRangeDiv = 1;
    let yFn = normalIn;
    if (airbase.planes['IL-28'] > 0) {
      planeDesign = game.planeDesigns[aiID]['IL-28'];
      range = airbase.position.x;
      maxRangeDiv = 2;
    }
    if (planeDesign.name == 'MIG-21') {
      yFn = randomIn;
      range = planeDesign.fuel / 4;
    }

    const targetPos = {
      x: normalIn(
        airbase.position.x - range,
        airbase.position.x / maxRangeDiv,
      ),
      y: yFn(100, game.worldSize.height - 100),
    };

    dispatch({
      type: 'LAUNCH_PLANE', clientID: aiID,
      airbaseID: airbase.id, targetPos, name: planeDesign.name,
    });

  }, launchInterval);


}

module.exports = {initAI};
