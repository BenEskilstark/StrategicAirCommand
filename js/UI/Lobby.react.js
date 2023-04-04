const React = require('react');
const {
  Button, InfoCard, Divider,
  Plot, plotReducer,
  Modal, Indicator,
  Board, SpriteSheet, TextField,
  Slider, Checkbox,
} = require('bens_ui_components');
const {useEffect, useState, useMemo} = React;

const Lobby = (props) => {
  const {dispatch, state, getState} = props;

  return (
    <div
      style={{
        width: 600,
        margin: 'auto',
        marginTop: 100,
      }}
    >
      <CreateGameCard />
    </div>
  );
};

const CreateGameCard = (props) => {
  return (
    <InfoCard
      style={{
        width: 300,
        marginLeft: '25%',
      }}
    >
      <Button
        label="Start"
        style={{
          width: '100%',
          height: 30,
          marginTop: 8,
        }}
        onClick={() => {
          dispatch({type: "START"});
        }}
      />
    </InfoCard>
  );
}


module.exports = Lobby;
