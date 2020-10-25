import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import StatBlock from './Statblock.js';
import Autocomplete from "./Autocomplete.js";
import _ from 'lodash';
const Bestiary = 'https://raw.githubusercontent.com/TheGiddyLimit/TheGiddyLimit.github.io/master/data/bestiary/bestiary-mm.json';


class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoaded: false,
      StatblockInfo: "all",
      monsterToShow: {},
    };

    updateSearch = updateSearch.bind(this);
    updateStatblockInfo = updateStatblockInfo.bind(this);
  }

  // Read JSON data of monsters from given bestiary
  componentDidMount() {
    fetch(Bestiary)
    .then(response => response.json())
    .then(res => addID(res))
    .then(data => {
      this.setState({
        data: data,
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
          <Menu data={this.state.data} select={this.state.monsterToShow} />
          <StatBlock monster={this.state.monsterToShow} info={this.state.StatblockInfo} />
        </div>
      );
    }
  }
}

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      partyToAdd: "1",
      party: [],
      encounters: [],
    };

    this.handleChangeParty = this.handleChangeParty.bind(this);
    this.handleSubmitParty = this.handleSubmitParty.bind(this);
    this.newEncounter = this.newEncounter.bind(this);
    updateEncounter = updateEncounter.bind(this);
  }

  handleSubmitParty(event) {
    //this.state.party.push(parseInt(this.state.partyToAdd));
    var party = this.state.party;
    party.push(parseInt(this.state.partyToAdd));
    this.setState({party: party});
    event.preventDefault();
  }

  handleChangeParty(event) {
    this.setState({partyToAdd: event.target.value});
  }

  handlePartyMemberClick(i) {
    var party = this.state.party;
    party.splice(i, 1);
    this.setState({party: party});
  }

  newEncounter(e){
    var encounters = this.state.encounters;
    encounters.push({
      name: "Encounter #" + (encounters.length + 1),
      monsters: [],
    });
    this.setState({encounters: encounters});
    e.preventDefault();
  }

  render() {
    var lvl = [];
    for (var i = 1; i <= 20; i++) {
      lvl.push(<option value={i} key={i}>Level {i}</option>);
    }
    const party = this.state.party.map((e,i) =>
      <span key={i} onClick={() => this.handlePartyMemberClick(i)}><i className="material-icons">person</i> lvl {e}</span>
    );

    return (
      <div className="Menu">
        <Search data={this.state.data} />
        <div className="Party">
          <form onSubmit={this.handleSubmitParty}>
            <select onChange={this.handleChangeParty}>{lvl}</select>
            <input type="submit" value="Add Player" />
          </form>
        </div>
        <div className="PartyMembers">{party}</div>
        <div className="EncounterOptions">
          <form onSubmit={this.newEncounter}><input type="submit" value="New Encounter" /></form>
          <form><input type="submit" value="Generate Encounter" /></form>
        </div>
        <EncounterList encounters={this.state.encounters} select={this.props.select} data={this.state.data} party={this.state.party}/>
      </div>
    );
  }
}

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      monsterList: createMonsterList(this.props.data),
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(v) {
    this.setState({value: v});
    if (this.state.monsterList.includes(v)) {
      updateSearch(getMonsterByName(this.props.data, v));
    } else {
      updateSearch(getMonsterByName(this.props.data, ""));
    }
  }

  handleSubmit(event) {
    updateSearch(getMonsterByName(this.props.data, this.state.value));
    event.preventDefault();
  }

  render() {
    return (
      <div className="Search">
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <div className="autocomplete">
            <Autocomplete suggestions={this.state.monsterList} placeholder="Monster" onChange={this.handleChange} value={this.state.value} />
          </div>
          <input type="submit" value="Show" />
        </form>
      </div>
    );
  }
}

class EncounterList extends React.Component {
  render() {
    var encounters = this.props.encounters;
    if (encounters.length === 0) return null;
    encounters = encounters.map((e,i) =>
      <div key={i} className="encounterBox">
        <div className="encounterName"><span>{e.name}</span><Difficulty list={e.monsters} party={this.props.party} /></div>
        <EncounterMonsterList list={e.monsters} select={this.props.select} data={this.props.data} encounter={i} encounterList={encounters} />
      </div>
    );
    return (
      <div className="EncounterList">
        {encounters}
      </div>
    );
  }
}


class Difficulty extends React.Component {
  render() {
    var monsters = this.props.list;
    var party = this.props.party;

    var monsterXP = 0;
    monsters.forEach((m, i) => {
      monsterXP += m.xp;
    });
    var multiplierLvl = 0;
    if (monsters.length === 2) {
      multiplierLvl = 1;
    } else if (monsters.length >= 3 && monsters.length <= 6) {
      multiplierLvl = 2;
    } else if (monsters.length >= 7 && monsters.length <= 10) {
      multiplierLvl = 3;
    } else if (monsters.length >= 11 && monsters.length <= 14) {
      multiplierLvl = 4;
    } else if (monsters.length >= 15) {
      multiplierLvl = 5;
    }
    const encounterMultiplier = [1,1.5,2,2.5,3,4,5];

    var partyXP = 0;
    const partyXPTable = [25, 50, 75, 125, 250, 300, 350, 450, 550, 600, 800, 1000, 1100, 1250, 1400, 1600, 2000, 2100, 2400, 2800];
    party.forEach((player, i) => {
      partyXP += partyXPTable[player-1];
    });
    if (party.length < 3 && multiplierLvl !== 0) multiplierLvl -= 1;
    if (party.length > 5) multiplierLvl += 1;

    monsterXP = monsterXP * encounterMultiplier[multiplierLvl];

    var difficulty = "Trivial";
    if (monsterXP > partyXP) difficulty = "Easy";
    if (monsterXP > (partyXP * 2)) difficulty = "Medium";
    if (monsterXP > (partyXP * 3)) difficulty = "Hard";
    if (monsterXP >= (partyXP * 4)) difficulty = "Deadly";

    if (partyXP === 0) {
      return <span className="trivial">-</span>;
    }
    return <span className={difficulty.toLowerCase()}>{difficulty}</span>;
  }
}

class EncounterMonsterList extends React.Component {
  render() {
    var addMonsterElem;
    const list = this.props.list.map((m,i) =>
      <div key={i}><span>{i+1}. {m.name}</span><span className="monsterListOptions"><button>hit</button><button onClick={() => showEncounterMonster(i, this.props.encounter, this.props.encounterList)}>show</button><button onClick={() => updateEncounter(this.props.encounter, i, this.props.encounterList, "remove")}>remove</button></span></div>
    );

    if (!(Object.keys(this.props.select).length === 0 && this.props.select.constructor === Object)) {
      addMonsterElem = <div key={list.length} className="enabled" onClick={() => updateEncounter(this.props.encounter, createEncounterMonster(this.props.select, this.props.data), this.props.encounterList)}>{list.length+1}. Add Monster</div>
    } else {
      addMonsterElem = <div key={list.length} className="disabled">{list.length+1}. Add Monster</div>
    }
    list.push(addMonsterElem);

    return (
      <div className="encounterMonsterList">{list}</div>
    );
  }
}

function showEncounterMonster (i, encounter, encounterList) {
  updateSearch(encounterList[encounter].monsters[i], "all");
}

function createEncounterMonster(m, d) {
  //console.log(getMonsterByName(d, m.name));
  var newMonster = _.cloneDeep(m);
  newMonster.hp.calculated = dice(newMonster.hp.formula);
  //console.log(m);
  return newMonster;
}

// calculate the Xp with the CR
function calcXP(cr) {
  const CR2XP = {"0": 10, "1/8": 25, "1/4": 50, "1/2": 100, "1": 200, "2": 450, "3": 700, "4": 1100, "5": 1800, "6": 2300, "7": 2900, "8": 3900, "9": 5000, "10": 5900,
    "11": 7200, "12": 8400, "13": 10000, "14": 11500, "15": 13000, "16": 15000, "17": 18000, "18": 20000, "19": 22000, "20": 25000, "21": 33000, "22": 41000, "23": 50000,
    "24": 62000, "25": 75000, "26": 90000, "27": 105000, "28": 120000, "29": 135000, "30": 155000
  };
  return CR2XP[cr];
}

// Update encounter e with monster m, or remove monster with index m from encounter e
function updateEncounter(e, m, el, type="add") {
  var encounters = el;
  if (type === "add") {
    encounters[e].monsters.push(m);
  } else if (type === "remove") {
    encounters[e].monsters.splice(m, 1);
  }
  this.setState({encounters});
}

// Middleman function
function updateSearch(m, StatblockInfo="all") {
  const monsterToShow = m || {};
  this.setState({monsterToShow, StatblockInfo});
}

function updateStatblockInfo(StatblockInfo) {
  this.setState({StatblockInfo});
}

// Add an index to all monsters
function addID(d) {
  d = d.monster;
  // Search for given monster
  for (var i = 0; i < d.length; i++) {
    d[i].id = i;
    d[i].xp = calcXP(d[i].cr);
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

// Creates an array of the monster names
function createMonsterList(d) {
  return d.map(m => m.name);
}

// Roll dice function
function dice(d) {
  // d can be "xdy + z", "xdy" or "xdy - z"
  // => roll x dice of y-sides and add z
  var o = [];
  if (d.includes("+")) {
    o = d.split("+");
  } else if (d.includes("-")) {
    o = d.split("-");
    o[1] = -o[1];
  } else {
    o = [d, 0];
  }
  o[0] = o[0].split("d");
  o[0] = o[0].map(e => parseInt(e));
  o[1] = parseInt(o[1]);
  var v = o[1];
  for(var i = 0; i < o[0][0]; i++) {
    v += Math.floor(Math.random() * (o[0][1]) + 1);
  }
  return v;
}

// ========================================

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
