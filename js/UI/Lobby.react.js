const React = require('react');
const {
  Button, InfoCard, Divider,
  Plot, plotReducer,
  Modal, Indicator,
  Board, SpriteSheet, TextField,
  Slider, Checkbox, Canvas,
} = require('bens_ui_components');
const {useEffect, useState, useMemo} = React;
const {getCanvasSize} = require('../selectors/selectors');

const Lobby = (props) => {
  const {dispatch, state, getState} = props;

  useEffect(() => {
    let d = 0;
    const radarInterval = setInterval(() => {
      const canvas = document.getElementById("radar");
      const ctx = canvas.getContext('2d');

      const {width, height} = getCanvasSize();
      ctx.color = 'rgb(35,36,38)';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#6ce989';
      const radians = d * Math.PI / 180;
      const x = width / 2;
      const y = height / 2;
      const lineLength = height / 2;
      const endX = x + lineLength * Math.sin(radians);
      const endY = y - lineLength * Math.cos(radians);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      d = (d + 1) % 360;
    }, 50);

    return () => clearInterval(radarInterval);
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
      <Canvas
        id="radar"
        style={{
          borderRadius: '50%',
          position: 'absolute',
        }}
        width={getCanvasSize().width}
        height={getCanvasSize().height}
      />
      <CreateGameCard />
    </div>
  );
};

const CreateGameCard = (props) => {
  return (
    <InfoCard
      style={{
        width: window.innerHeight / 2,
        height: window.innerHeight / 2,
        border: '2px solid #6ce989',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }}
    >
      <Button
        label="LAUNCH"
        id="PLAY"
        style={{
        }}
        onClick={() => {
          dispatch({type: "START"});
        }}
      />
    </InfoCard>
  );
}


module.exports = Lobby;
