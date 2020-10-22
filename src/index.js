import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import StatBlock from './Statblock.js';
import Autocomplete from "./Autocomplete.js";
const Bestiary = 'https://raw.githubusercontent.com/TheGiddyLimit/TheGiddyLimit.github.io/master/data/bestiary/bestiary-mm.json';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      search: "",
      isLoaded: false,
    };

    updateSearch = updateSearch.bind(this);
  }

  // Read JSON data of monsters from given bestiary
  componentDidMount() {
    fetch(Bestiary)
    .then(response => response.json())
    .then(res => addID(res))
    .then(data => {
      this.setState({
        data: data,
        search: "",
        isLoaded: true,
      })
    });

  }

  render() {
    if (!this.state.isLoaded) {
      return (<div>Loading...</div>);
    } else {
      return (
        <div>
          <Search monsterList={createMonsterList(this.state.data)} />
          <StatBlock monster={getMonsterByName(this.state.data, this.state.search)}/>
        </div>
      );
    }
  }
}

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      monsterList: this.props.monsterList,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(v) {
    this.setState({value: v});
    updateSearch(v);
  }

  handleSubmit(event) {
    // alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <div className="Search">
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <div className="autocomplete">
            <Autocomplete suggestions={this.state.monsterList} placeholder="Monster" onChange={this.handleChange} value={this.state.value} />
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

// Middleman function
function updateSearch(search) {
  this.setState({search});
}

// Add an index to all monsters
function addID(d) {
  d = d.monster;
  // Search for given monster
  for (var i = 0; i < d.length; i++) {
    d[i].id = i;
  }
  console.log(d);
  return d;
}

// Given the data and a name, get all data of the monster
function getMonsterByName(d, m) {
  var monster;
  for (var i = 0; i < d.length; i++) {
    if (d[i].name === m) {
      monster = d[i];
    }
  }
  return monster;
}

// Given the data and an id, get all data of the monster
function getMonsterById(d, id) {
  return d[id];
}

// Creates an array of the monster names
function createMonsterList(d) {
  return d.map(m => m.name);
}


// ========================================

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
