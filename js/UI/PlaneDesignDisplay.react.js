const React = require('react');
const {Button, Divider} = require('bens_ui_components');
const {useEffect, useState, useMemo} = React;

const PlaneDesignDisplay = (props) => {
  const {planeDesign, dispatch, money} = props;

  return (
    <div
      style={{
        width: '50%',
      }}
    >
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <b>{planeDesign.name} {planeDesign.type}</b>
      </div>
      <div
        style={{
          width: '100%',
          padding: 5,
        }}
      >
        <div>Speed: Mach {planeDesign.speed}</div>
        <div>Range: {planeDesign.fuel} miles</div>
        <div>Vision: {planeDesign.vision} miles</div>
      </div>
      <Divider style={{marginTop: 4, marginBottom: 4}} />
    </div>
  );
};

module.exports = PlaneDesignDisplay;

