const React = require('react');
const PlaneDesignDisplay = require('./PlaneDesignDisplay.react');
const {useEffect, useState, useMemo} = React;

const RightHandSideBar = (props) => {
  const {state, dispatch} = props;
  const {game} = state;

  const planeDetails = [];
  for (const name in game.planeTypesSeen) {
    planeDetails.push(<PlaneDesignDisplay key={"planeSeen_" + name}
      planeDesign={game.planeDesigns[2][name]}
    />);
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
        left: window.innerWidth - 205,
        margin: 4,
        minWidth: 200,
        color: '#6ce989',
      }}
    >
      <div
        style={{
          padding: 8,
        }}
      >
        {planeDetails}
      </div>
    </div>
  );
};

module.exports = RightHandSideBar;

