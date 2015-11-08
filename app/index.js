import React from 'react';
import ReactDOM from 'react-dom';
import Forest from './components/Forest.jsx';


function main() {
  const mount = window.document.body.appendChild(
    document.createElement('div')
  );
  ReactDOM.render(
    <Forest/>,
    mount
  );
}

main();
