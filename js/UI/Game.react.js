const React = require('react');
const {
  Canvas,
  useMouseHandler,
  useHotKeyHandler,
} = require('bens_ui_components');
const {render} = require('../render');
const {useState, useMemo, useEffect, useReducer} = React;
const {initAI} = require('../daemons/aiControl');
const {dist, subtract, add} = require('bens_utils').vectors;
const LeftHandSideBar = require('./LeftHandSideBar.react');
const {normalizePos, getCanvasSize} = require('../selectors/selectors');


function Game(props) {
  const {state, dispatch, getState} = props;
  const game = state.game;

  useEffect(() => {
    initAI(getState, dispatch);
  }, []);

  // rendering
  useEffect(() => {
    render(state);
  }, [game.entities, game.selectedIDs, game.marquee]);

  // mouse
  useMouseHandler(
    "canvas", {dispatch, getState},
    {
      leftDown: (state, dispatch, p) => {
        const pos = normalizePos(p, state.game.worldSize, getCanvasSize());
        dispatch({type: 'SET', marquee: {...pos, width: 0, height: 0}});
      },
      mouseMove: (state, dispatch, p) => {
        const pos = normalizePos(p, state.game.worldSize, getCanvasSize());
        if (!state?.mouse?.isLeftDown) return;
        dispatch({type: 'SET', marquee: {...state.game.marquee,
          width: pos.x - state.game.marquee.x,
          height: pos.y - state.game.marquee.y,
        }});
      },
      leftUp: (state, dispatch, p) => {
        const pos = normalizePos(p, state.game.worldSize, getCanvasSize());
        let square = {...state.game.marquee};
        if (square.width < 0) {
          square.x += square.width;
          square.width *= -1;
        }
        if (square.height < 0) {
          square.y += square.height;
          square.height *= -1;
        }
        dispatch({type: 'SELECT_ENTITIES', square});
        dispatch({type: 'SET', marquee: null});
      },
      rightDown: (state, dispatch, p) => {
        const pos = normalizePos(p, state.game.worldSize, getCanvasSize());
        const leadPlaneID = state.game.selectedIDs[0];
        for (const entityID of state.game.selectedIDs) {
          const entity = state.game.entities[entityID];
          if (entity.type == 'AIRBASE' && state.game.clickMode == 'LAUNCH') {
            dispatch({
              type: 'LAUNCH_PLANE', targetPos: pos, airbaseID: entityID,
              name: state.game.launchName, clientID: state.game.clientID,
            });
          } else {
            const leadPlane = state.game.entities[leadPlaneID];
            let adjustedPos = pos;
            if (dist(entity.position, leadPlane.position) < state.config.formationRadius) {
              const diff = subtract(leadPlane.position, entity.position);
              adjustedPos = subtract(pos, diff);
            }
            dispatch({type: 'SET_TARGET', targetPos: adjustedPos, entityID});
          }
        }
      },
    },
  );

  // hotKeys
  useHotKeyHandler({dispatch, getState: () => getState().game.hotKeys});
  useEffect(() => {
    const planeNames = Object.keys(game.planeDesigns[state.clientID]);
    for (let i = 0; i < planeNames.length; i++) {
      const name = planeNames[i];
      dispatch({type: 'SET_HOTKEY', key: ""+(i+1), press: 'onKeyDown',
        fn: () => {
          dispatch({type: 'SET', launchName: name});
          dispatch({type: 'SET', clickMode: 'LAUNCH'});
        }
      });
    }
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgb(35,36,38)',
      }}
    >
      <img
        style={{
          position: 'absolute',
        }}
        src="./img/polar_world_map_2.png"
        width={getCanvasSize().width}
        height={getCanvasSize().height}
      />
      <Canvas
        style={{
          opacity: 0.7,
          borderRadius: '49%',
        }}
        view={game.worldSize}
        onResize={(width, height) => {
          dispatch({type: 'SET', canvasSize: {width, height}});
        }}
        width={getCanvasSize().width}
        height={getCanvasSize().height}
      />
      <LeftHandSideBar state={state} dispatch={dispatch} />
    </div>
  );
}

module.exports = Game;
