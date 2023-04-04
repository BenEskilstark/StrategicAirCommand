const React = require('react');
const {
  Button, InfoCard, Divider,
  Plot, plotReducer,
  Canvas, RadioPicker,
  Modal, Indicator,
  useMouseHandler,
  useHotKeyHandler,
  useEnhancedReducer,
} = require('bens_ui_components');
const {render} = require('../render');
const {useState, useMemo, useEffect, useReducer} = React;
const {initAI} = require('../daemons/aiControl');

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
        for (const entityID of state.game.selectedIDs) {
          const entity = state.game.entities[entityID];
          if (entity.type == 'AIRBASE' && state.game.clickMode == 'LAUNCH') {
            dispatch({
              type: 'LAUNCH_PLANE', targetPos: pos, airbaseID: entityID,
              name: state.game.launchName, clientID: state.game.clientID,
            });
          } else {
            dispatch({type: 'SET_TARGET', targetPos: pos, entityID});
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


  // selectionCard
  let selectionCard = null;
  const planeNames = Object.keys(game.planeDesigns[state.clientID]);
  if (game.selectedIDs.length > 0) {
    const selections = {
      'AIRBASE': 0,
    };
    for (const name of planeNames) {
      selections[name] = 0;
    }
    for (const entityID of game.selectedIDs) {
      const entity = game.entities[entityID];
      selections[entity.name] += 1;
    }
    const planesSelected = [];
    for (const name in selections) {
      if (selections[name] > 0) {
        planesSelected.push(<div key={"plane_" + name}>
          {name}: {selections[name]}
        </div>)
      }
    }
    let selectionContent = (<div>{planesSelected}</div>);
    if (selections.AIRBASE > 0) {
      const airbase = game.entities[game.selectedIDs[0]];
      const airbasePlanes = [];
      for (const name in airbase.planes) {
        airbasePlanes.push(<div key={"airbase_plane_" + name}>
          {name}: {airbase.planes[name]}
        </div>);
      }
      selectionContent = (
         <div>
           Airbase
           {state.game.clickMode == 'LAUNCH' ? (
             <div>
               <div>Launch Type: </div>
               <RadioPicker
                 options={planeNames}
                 displayOptions={planeNames.map(name => {
                   const planeType = game.planeDesigns[state.clientID][name].type;
                   return `${name} (${planeType}): ${airbase.planes[name]}`;
                 })}
                 selected={state.game.launchName}
                 onChange={(launchName) => dispatch({type: 'SET', launchName})}
               />
             </div>
           ) : null}
         </div>
       );
    }
    selectionCard = (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          border: '1px solid black',
          padding: 8,
          margin: 4,
          minWidth: 150,
          backgroundColor: 'white',
        }}
      >
        {selectionContent}
      </div>
    );
  }


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
      {selectionCard}
    </div>
  );
}

module.exports = Game;
