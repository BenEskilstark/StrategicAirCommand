const React = require('react');
const {Modal, Button} = require('bens_ui_components');
const {useEffect, useState, useMemo} = React;

const GameOverModal = (props) => {
  const {winner, stats} = props;
  const state = getState(); // HACK this comes from window;

  let title = winner == state.clientID ? 'You Win!' : 'You Lose!';
  let body = winner == state.clientID ? "You destroyed the enemy airbases" : "Your airbases were destroyed";

  let otherClientID = null;
  for (const id in stats) {
    if (id != state.clientID) otherClientID = id;
  }

  body = (
    <div>
      <div>{body}</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 70,
        }}
      >
        <PlayerStats clientID={state.clientID}
          otherID={otherClientID} isYou={true} stats={stats} />
        <PlayerStats clientID={otherClientID}
          otherID={state.clientID} isYou={false} stats={stats} />
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          backgroundColor: 'rgb(34,36,38)',
          color: '#6ce989',
          padding: 15,
          width: 650,
        }}
      >
        <div
          style={{
            fontSize: '1.2em',
          }}
        >
          <b>{title}</b>
        </div>
        {body}
        <Button
          label="BACK TO MENU"
          id="BACK"
          style={{
            marginTop: '12px',
          }}
          onClick={() => {
            dispatch({type: 'DISMISS_MODAL'});
            dispatch({type: 'SET_SCREEN', screen: 'LOBBY'});
          }}
        />
      </div>
    </div>
  );
};

const PlayerStats = (props) => {
  const {isYou, stats, otherID, clientID} = props;
  return (
    <div
      style={{

      }}
    >
      <div><b>{isYou ? 'You' : 'Opponent'}</b></div>
      <div>Fighter sorties flown: {stats[clientID].fighter_sorties}</div>
      <div>Bomber sorties flown: {stats[clientID].bomber_sorties}</div>
      <div>Enemy fighters shot down: {stats[otherID].fighters_shot_down}</div>
      <div>Enemy bombers shot down: {stats[otherID].bombers_shot_down}</div>
      <div>Fighter aces: {stats[clientID].fighter_aces}</div>
      <div>Planes lost to no fuel: {stats[clientID].planes_no_fuel}</div>
      <div>Enemy airbases destroyed: {stats[otherID].airbases_destroyed}</div>
    </div>
  );
}

module.exports = GameOverModal;
