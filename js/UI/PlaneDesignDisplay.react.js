const React = require('react');
const {Button, Divider} = require('bens_ui_components');
const {useEffect, useState, useMemo} = React;

const PlaneDesignDisplay = (props) => {
  const {planeDesign} = props;

  return (
    <div
      style={{
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
        <div>Speed: mach {planeDesign.speed}</div>
        <div>Range: {planeDesign.fuel} miles</div>
        <div>Vision: {planeDesign.vision} miles</div>
        <div>Ammo: {planeDesign.ammo}</div>
      </div>
    </div>
  );
};

module.exports = PlaneDesignDisplay;

