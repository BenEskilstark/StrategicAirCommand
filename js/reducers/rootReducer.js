const React = require('react');
const {gameReducer} = require('./gameReducer');
const {modalReducer} = require('./modalReducer');
const GameOverModal = require('../UI/GameOverModal.react');
const {mouseReducer, hotKeyReducer} = require('bens_ui_components');
const {config} = require('../config');
const {deepCopy} = require('bens_utils').helpers;
const {initGameState} = require('../state');
const {tick} = require('./tick');

const rootReducer = (state, action) => {
  if (state === undefined) return initState();

  switch (action.type) {
    case 'START': {
      const game = {
        ...initGameState(state.clientIDs, state.config),
        tickInterval: setInterval(
          // HACK: dispatch is only available via window
          () => dispatch({type: 'TICK'}),
          state.config.msPerTick,
        ),
      };
      return {
        ...state,
        screen: "GAME",
        game,
      };
    }
    case 'GAME_OVER': {
      const {winner, stats} = action;
      return {
        ...state,
        modal: <GameOverModal {...action} />
      };
    }
    case 'SET_SCREEN': {
      const {screen} = action;
      const nextState = {...state, screen};
      if (screen == 'LOBBY') {
        nextState.game = null;
      }
      return nextState;
    }
    case 'SET_MOUSE_DOWN':
    case 'SET_MOUSE_POS':
      return {
        ...state,
        mouse: mouseReducer(state.mouse, action),
      };
    case 'SET_HOTKEY':
    case 'SET_KEY_PRESS': {
      if (!state.game) return state;
      return {
        ...state,
        game: {
          ...state.game,
          hotKeys: hotKeyReducer(state.game.hotKeys, action),
        }
      }
    }
    case 'SET_MODAL':
    case 'DISMISS_MODAL':
      return modalReducer(state, action);
    case 'TICK':
      return tick(state);
    case 'LAUNCH_PLANE':
    case 'SET':
    case 'SELECT_ENTITIES':
    case 'SET_TARGET':
    case 'SET_ENTITIES': {
      if (!state.game) return state;
      return {
        ...state,
        game: gameReducer(state.game, action),
      };
    }
  }
  return state;
};


//////////////////////////////////////
// Initializations
const initState = () => {
  return {
    screen: 'LOBBY',
    game: null,
    modal: null,
    clientID: 1,
    clientIDs: [1, 2],
    config: deepCopy(config),
  };
}

module.exports = {rootReducer, initState};
