import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import StatBlock from './Statblock.js';

class Main extends React.Component {
  render() {
    return (
      <StatBlock name="Ancient Red Dragon"/>
    );
  }
}

// ========================================

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
