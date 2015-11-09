import React from 'react';
import ReactDOM from 'react-dom';
import Forest from './components/Forest.jsx';


function main() {
  const mount = window.document.body.appendChild(
    document.createElement('div')
  );

  const dimensions = {
    'width': window.innerWidth,
    'height': window.innerHeight,
  };

  ReactDOM.render(
    <Forest
      dimensions={dimensions}
      background={'black'}
    />,
    mount
  );
}

main();
