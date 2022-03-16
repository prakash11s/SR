import React from 'react';
import ReactDOM from 'react-dom';
import MainApp from "./MainApp";
const rootEl = document.getElementById('app-site');

// Create a reusable render method that we can call more than once
let render = (mainApp: any, rootEl: HTMLElement | null) => {
  // Dynamically import our main App component, and render it
  ReactDOM.render(
    <MainApp/>,
    rootEl
  );
};

if ((module as any).hot) {
  (module as any).hot.accept('./MainApp', () => {
    const MainApp = require('./MainApp').default;
    render(
      <MainApp/>,
      rootEl
    );
  });
}

render(<MainApp/>, rootEl);
