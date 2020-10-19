import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import StatBlock from './Statblock.js';
import xmlData from './MMBestiary.xml';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dom: [],
      monsterList: [],
      isLoaded: false,
    };
  }

  // Read XML data of monsters,
  componentDidMount() {
    fetch(xmlData)
    .then(response => response.text())
    .then(res => structureData(res))
    .then(data => {
      this.setState({
        dom: data.dom,
        monsterList: data.nameList,
        search: "Ancient Red Dragon",
        isLoaded: true,
      })}
    );
  }


  render() {
    if (!this.state.isLoaded) {
      return (<div>Loading...</div>);
    } else {
      return (
        <div>
          <StatBlock monster={getMonster(this.state.dom, this.state.monsterList, this.state.search)}/>
        </div>
      );
    }
  }
}


// ========================================

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);

// Create JS friendly dom, and include a list of all names of monsters
function structureData(d) {
  d = (new window.DOMParser()).parseFromString(d, "text/xml");
  d = Array.from(d.getElementsByTagName("monster"));
  var monsterNames = {};
  // Search for given monster
  for (var i = 0; i < d.length; i++) {
    monsterNames[d[i].getElementsByTagName("name")[0].childNodes[0].nodeValue] = i;
  }
  return {dom: d, nameList: monsterNames};
}

// Given the DOM, nameList (map) and a name, get all data of the monster (in XML DOM format)
function getMonster(d, nl, m) {
  return d[nl[m]];
}
