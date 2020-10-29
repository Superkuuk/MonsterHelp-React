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
      return (<Loader />);
    } else {
      return (
        <div className="rootContainer">
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
      selectedMonster: {},
    };

    this.handleChangeParty = this.handleChangeParty.bind(this);
    this.handleSubmitParty = this.handleSubmitParty.bind(this);
    this.newEncounter = this.newEncounter.bind(this);
    updateEncounter = updateEncounter.bind(this);
    showMonster = showMonster.bind(this);
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
      <div className="menuContainer">
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
        <Monster
          encounters={this.state.encounters}
          selectedMonster={this.state.selectedMonster}
        />
      </div>
    );
  }
}

class Monster extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      monster: this.props.selectedMonster,
      encounters: this.props.encounters,
      hit: 0,
      dmg: 0,
      condition: [],
      selectedCondition: "Blinded",
      selectedST: "Strength",
    }

    this.handleChangeHit = this.handleChangeHit.bind(this);
    this.handleChangeDmg = this.handleChangeDmg.bind(this);

    this.handleCondition = this.handleCondition.bind(this);
    this.handleConditionClick = this.handleConditionClick.bind(this);
    this.handleSelectedCondition = this.handleSelectedCondition.bind(this);

    this.handleST = this.handleST.bind(this);
    this.handleSelectedST = this.handleSelectedST.bind(this);
  }

  handleChangeHit(e) {
    if (e.target.value.match(/[^0-9]*/g).filter(obj => obj !== "").length > 0) { // Check if field contains non-numbers, if so, prevent.
      e.preventDefault();
    } else if (e.target.value.length === 0) {
      e.preventDefault();
      this.setState({
        hit: 0,
      });
    } else {
      this.setState({
        hit: parseInt(e.target.value),
      });
    }
  }

  handleChangeDmg(e) {
    if (e.target.value.match(/[^0-9]*/g).filter(obj => obj !== "").length > 0) { // Check if field contains non-numbers, if so, prevent.
      e.preventDefault();
    } else if (e.target.value.length === 0) {
      e.preventDefault();
      this.setState({
        hit: 0,
      });
    } else {
      this.setState({
        dmg: parseInt(e.target.value),
      });
    }
  }

  handleHit() {
    // const monster = this.props.selectedMonster;
    // var testAc = monster.ac[0].ac;
    // if (monster.ac.length > 1) {
    //   monster.ac.forEach((item, i) => {
    //     if (item.condition) {
    //
    //       if (window.confirm("Has monster condition: " + item.condition + "?")) {
    //         testAc = item.ac;
    //       }
    //     }
    //   });
    // }
    // if (toHit >= testAc) {
    //   // hit!
    //   var dmg = prompt("Hit! Roll for damage!");
    //   // TODO: add damage type and test for resistance/immunity
    //   monster.hp.current -= parseInt(dmg);
    //   if (monster.hp.current <= 0) {
    //     alert(monster.name + " has died!");
    //     deleteEncounter(i, encounter, encounterList);
    //   } else {
    //     editEncounter(i, encounter, encounterList, monster);
    //   }
    // } else {
    //   alert("Missed!");
    // }
  }

  handleDmg() {

  }

  handleST(e) {
    e.preventDefault();
    const st = this.state.selectedST.substring(0,3).toLowerCase(); // Get selected ST
    var abm = "";
    if (this.props.selectedMonster.save && this.props.selectedMonster.save[st]) {
      abm = this.props.selectedMonster.save[st];
    } else {
      abm = Math.floor((this.props.selectedMonster[st] - 10) / 2); // Get from monster and calculate the modifier
      if (abm > 0) {
        abm = "+" + abm;
      } else {
        abm = "" + abm;
      }
    }
    const v = dice("1d20" + abm);
    alert(this.props.selectedMonster.name + " has rolled a " + v + " on a " + this.state.selectedST + " saving throw!");
  }

  handleSelectedST(e) {
    this.setState({selectedST: e.target.value});
  }

  handleCondition(e) {
    e.preventDefault();
    var c = this.state.condition;
    if (!c.includes(this.state.selectedCondition)) {
      c.push(this.state.selectedCondition);
      this.setState({condition: c});
    }
  }

  handleConditionClick(i) {
    var c = this.state.condition;
    c.splice(i, 1);
    this.setState({condition: c});
  }

  handleSelectedCondition(event) {
    this.setState({selectedCondition: event.target.value});
  }

  render() {
    if ((Object.keys(this.props.selectedMonster).length === 0 && this.props.selectedMonster.constructor === Object)) return null; // Don't show if monster is not selected

    var dmgType = ["Acid", "Bludgeoning", "Cold", "Fire", "Force", "Lightning", "Necrotic", "Piercing", "Poison", "Psychic", "Radiant", "Slashing", "Thunder"];
    dmgType = dmgType.map(i =>
      <option value={i} key={i}>{i}</option>
    );

    var savingThrows = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
    savingThrows = savingThrows.map(i =>
      <option value={i} key={i}>{i}</option>
    );

    var conditions = ["Blinded", "Charmed", "Deafened", "Frightened", "Grappled", "Incapacitated", "Invisible", "Paralyzed", "Petrified", "Poisoned", "Prone", "Restrained", "Stunned", "Unconsious"];
    conditions = conditions.map(i =>
      <option value={i} key={i}>{i}</option>
    );

    const conditionsShow = this.state.condition.map((e,i) =>
      <span key={i} onClick={() => this.handleConditionClick(i)}><i className="material-icons">blur_on</i> {e}</span>
    );

    return(
      <div className="Menu MonsterMenu">
        <div className="title">{this.props.selectedMonster.name}</div>
        <div className="hr"></div>
        <span>Attack</span>
        <form onSubmit={this.handleHit}>
          <input type="text" pattern="[0-9]*" onChange={this.handleChangeHit} value={this.state.hit} />
          <input type="submit" value="Hit" />
          <button className="formButton">Direct Hit</button>
        </form>
        <form onSubmit={this.handleDmg} className="Party">
          <fieldset disabled>
            <input type="text" pattern="[0-9]*" onChange={this.handleChangeDmg} value={this.state.dmg} />
            <select onChange={this.handleChangeParty}>{dmgType}</select>
            <input type="submit" value="Damage" />
          </fieldset>
        </form>
        <span>Saving Throws</span>
        <form onSubmit={this.handleST} className="Party">
          <select onChange={this.handleSelectedST}>{savingThrows}</select>
          <input type="submit" value="Saving Throw" />
        </form>
        <span>Conditions</span>
        <form onSubmit={this.handleCondition} className="Party">
          <select onChange={this.handleSelectedCondition}>{conditions}</select>
          <input type="submit" value="Add Condition" />
        </form>
        <div className="PartyMembers">{conditionsShow}</div>
        <span>Other</span>
        <div>
          <button>Show Statblock</button>
          <button>Remove</button>
        </div>
      </div>
    );
  }
}

class Loader extends React.Component {
  render() {
    return(
      <div className="loader">
        Loading...
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
      <div key={i}><span>{i+1}. {m.name}</span>
        <span className="monsterListOptions">
          <button onClick={() => hitMonster(i, this.props.encounter, this.props.encounterList)}>hit</button>
          <button onClick={() => showEncounterMonster(i, this.props.encounter, this.props.encounterList)}>show</button>
          <button onClick={() => deleteEncounter(this.props.encounter, i, this.props.encounterList)}>remove</button>
        </span>
      </div>
    );

    if (!(Object.keys(this.props.select).length === 0 && this.props.select.constructor === Object)) {
      addMonsterElem = <div key={list.length} className="enabled" onClick={() => addEncounter(this.props.encounter, createEncounterMonster(this.props.select, this.props.data), this.props.encounterList)}>{list.length+1}. Add Monster</div>
    } else {
      addMonsterElem = <div key={list.length} className="disabled">{list.length+1}. Add Monster</div>
    }
    list.push(addMonsterElem);

    return (
      <div className="encounterMonsterList">{list}</div>
    );
  }
}

function hitMonster (i, encounter, encounterList) {
  //updateEncounter();
  var toHit = prompt("How much to hit?");
  if (toHit != null) {
    const monster = encounterList[encounter].monsters[i];
    var testAc = monster.ac[0].ac;
    if (monster.ac.length > 1) {
      monster.ac.forEach((item, i) => {
        if (item.condition) {
          if (window.confirm("Has monster condition: " + item.condition + "?")) {
            testAc = item.ac;
          }
        }
      });
    }
    if (toHit >= testAc) {
      // hit!
      var dmg = prompt("Hit! Roll for damage!");
      // TODO: add damage type and test for resistance/immunity
      monster.hp.current -= parseInt(dmg);
      if (monster.hp.current <= 0) {
        alert(monster.name + " has died!");
        deleteEncounter(i, encounter, encounterList);
      } else {
        editEncounter(i, encounter, encounterList, monster);
      }
    } else {
      alert("Missed!");
    }
  }
}

function showEncounterMonster (i, encounter, encounterList) {
  updateSearch(encounterList[encounter].monsters[i], "all");
  showMonster(encounterList[encounter].monsters[i]);
}

// Bound to the Menu class => shows all actions in the 2nd block
function showMonster (selectedMonster) {
  this.setState({selectedMonster});
}

function createEncounterMonster(m, d) {
  //console.log(getMonsterByName(d, m.name));
  var newMonster = _.cloneDeep(m);
  newMonster.hp.max = dice(newMonster.hp.formula);
  newMonster.hp.current = newMonster.hp.max;
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


function updateEncounter(encounters) {
  this.setState({encounters});
}

function addEncounter (e, m, encounters) {
  encounters[e].monsters.push(m);
  updateEncounter(encounters);
}

function deleteEncounter (e, i, encounters) {
  encounters[e].monsters.splice(i, 1);
  updateEncounter(encounters);
}

function editEncounter (e, i, encounters, m) {
  encounters[e].monsters[i] = m;
  updateEncounter(encounters);
}

// Middleman function
function updateSearch(m, StatblockInfo="all") {
  const monsterToShow = m || {};
  this.setState({monsterToShow, StatblockInfo});
}

function updateStatblockInfo(StatblockInfo) {
  this.setState({StatblockInfo});
}

// Add an index to all monsters. Also add xp to the monster
function addID(d) {
  d = d.monster;
  // Search for given monster
  for (var i = 0; i < d.length; i++) {
    d[i].id = i;
    if (typeof d[i].cr === 'object') {
      d[i].xp = calcXP(d[i].cr.cr);
    } else {
      d[i].xp = calcXP(d[i].cr);
    }
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
