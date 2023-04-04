import Main from './UI/Main.react';
import React from 'react';
import ReactDOM from 'react-dom/client';

function renderUI(root) {
  root.render(
    <Main />
  );
}


const root = ReactDOM.createRoot(document.getElementById('container'));
renderUI(root);

