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
const PlaneDesignDisplay = require('./PlaneDesignDisplay.react');
const {useEffect, useState, useMemo} = React;

const LeftHandSideBar = (props) => {
  const {state, dispatch} = props;
  const {game} = state;

  // selectionCard
  let selectionContent = null;
  let shouldShowPlaneDetail = null;
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
      if (entity) {
        selections[entity.name] += 1;
      }
    }
    const planesSelected = [];
    for (const name in selections) {
      if (selections[name] > 0) {
        planesSelected.push(<div key={"plane_" + name}>
          {name}: {selections[name]}
        </div>)
      }
    }
    if (planesSelected.length > 0) {
      selectionContent = (<div>
        <div style={{textAlign: 'center'}}><b>Aircraft</b></div>
        {planesSelected}
      </div>);
    }
    if (selections.AIRBASE > 0) {
      const airbase = game.entities[game.selectedIDs[0]];
      const airbasePlanes = [];
      for (const name in airbase.planes) {
        airbasePlanes.push(<div key={"airbase_plane_" + name}>
          {name}: {airbase.planes[name]}
        </div>);
      }
      shouldShowPlaneDetail = state.game.launchName;
      selectionContent = (
         <div>
           <div style={{textAlign: 'center'}}><b>Airbase</b></div>
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
  }

  return (
    <div
      style={{
        visibility: game.selectedIDs.length > 0 ? 'visible' : 'hidden',
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        top: 0,
        left: 0,
        margin: 4,
        minWidth: 150,
        color: '#6ce989',
      }}
    >
      <div
        style={{
          // border: '1px solid black',
          padding: 8,
          // backgroundColor: 'white',
        }}
      >
        {selectionContent}
      </div>
      <PlaneDetail name={shouldShowPlaneDetail}
        planeDesigns={state.game.planeDesigns[1]}
      />
    </div>
  );
};

const PlaneDetail = (props) => {
  const {name, planeDesigns} = props;
  if (!name) return null;

  return (
    <div
      style={{
        // border: '1px solid black',
        padding: 8,
        // backgroundColor: 'white',
    }}
    >
      <PlaneDesignDisplay planeDesign={planeDesigns[name]} />
    </div>
  );
};


module.exports = LeftHandSideBar;

