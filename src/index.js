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
    toggleStatblockInfo = toggleStatblockInfo.bind(this);
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
          <Menu
            data={this.state.data}
            select={this.state.monsterToShow}
            toggleText={this.state.StatblockInfo}
          />
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
          <Search data={this.state.data} toggleText={this.props.toggleText} />
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
      dmgType: "Acid",
      condition: [],
      selectedCondition: "Blinded",
      selectedST: "Strength",
      ACchecked: false,
      dmgEnabled: false,
      magicAttack: "nonmagical",
      hitAnimation: "",
    }

    this.handleChangeHit = this.handleChangeHit.bind(this);
    this.handleChangeDmg = this.handleChangeDmg.bind(this);

    this.handleCondition = this.handleCondition.bind(this);
    this.handleConditionClick = this.handleConditionClick.bind(this);
    this.handleSelectedCondition = this.handleSelectedCondition.bind(this);

    this.handleST = this.handleST.bind(this);
    this.handleSelectedST = this.handleSelectedST.bind(this);

    this.handleChangeAC = this.handleChangeAC.bind(this);

    this.handleHit = this.handleHit.bind(this);
    this.handleDirectHit = this.handleDirectHit.bind(this);
    this.handleMagical = this.handleMagical.bind(this);
    this.handleDmgType = this.handleDmgType.bind(this);
    this.handleDmg = this.handleDmg.bind(this);

    this.handleRemove = this.handleRemove.bind(this);
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

  handleHit(e) {
    e.preventDefault();
    // Get AC (check condition/setting)
    const monster = this.props.selectedMonster;
    var ac = monster.ac[0];
    if (typeof ac === 'object') ac = ac.ac;
    monster.ac.forEach((item, i) => {
      if (item.condition && this.state.ACchecked) ac = item.ac; // If a condition is met
    });

    if (this.state.hit >= ac) {
      // Hit!
      if (this.state.hitAnimation === " hitAnimated") {
        this.setState({dmgEnabled: true, hitAnimation: " hitAnimated2", hit: 0});
      } else {
        this.setState({dmgEnabled: true, hitAnimation: " hitAnimated", hit: 0});
      }
    } else {
      if (this.state.hitAnimation === " missAnimated") {
        this.setState({dmgEnabled: false, hitAnimation: " missAnimated2", hit: 0});
      } else {
        this.setState({dmgEnabled: false, hitAnimation: " missAnimated", hit: 0});
      }
    }
  }

  handleDirectHit(e) {
    e.preventDefault();
    this.setState({dmgEnabled: true});
  }

  handleMagical(e) {
    e.preventDefault();
    var state = "magical";
    if (this.state.magicAttack === "magical") state = "nonmagical";
    this.setState({magicAttack: state});
  }

  handleDmgType(e) {
    this.setState({dmgType: e.target.value});
  }

  handleDmg(e) {
    e.preventDefault();
    // Damage, type.
    const monster = this.props.selectedMonster;
    const dmgType = this.state.dmgType;
    var dmg = this.state.dmg;

    if (monster.resist) {
      monster.resist.forEach((r, i) => {
        if (typeof r === 'object') {
          if (r.note.includes('from nonmagical attacks') && this.state.magicAttack === "nonmagical") {
            r.resist.forEach((item, i) => {
              if (item.toLowerCase() === dmgType.toLowerCase()) dmg = dmg/2;
            });
          }
        } else {
          if (r.toLowerCase() === dmgType.toLowerCase()) dmg = dmg/2;
        }
      });
    }
    if (monster.immune) {
      monster.immune.forEach((r, i) => {
        if (r.toLowerCase() === dmgType.toLowerCase()) dmg = 0;
      });
    }
    if ((monster.hp.current - dmg) <= 0) {
      monster.hp.current = 0;
    } else {
      monster.hp.current -= dmg;
    }
    this.setState({dmgEnabled: false, dmg: 0}); // update this state
    updateSearch(monster); // update Statblock
  }

  handleST(e) {
    e.preventDefault();
    const st = this.state.selectedST.substring(0,3).toLowerCase(); // Get selected ST
    var abm = "";
    if (this.props.selectedMonster.save && this.props.selectedMonster.save[st]) {
      abm = this.props.selectedMonster.save[st];
    } else {
      abm = Math.floor((this.props.selectedMonster[st] - 10) / 2); // Get from monster and calculate the modifier
      if (abm >= 0) {
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

  handleChangeAC(e) {
    this.setState({ACchecked: !this.state.ACchecked});
  }

  handleRemove(e) {
    e.preventDefault();
    this.setState({hitAnimation: ""});
    deleteEncounter(this.props.selectedMonster.encounter, this.props.selectedMonster.encounterID, this.props.encounters);
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

    var damageform = (
      <fieldset disabled>
        <input type="text" pattern="[0-9]*" onChange={this.handleChangeDmg} value={this.state.dmg} />
        <select onChange={this.handleDmgType}>{dmgType}</select>
        <button onClick={this.handleMagical} className={this.state.magicAttack}></button>
        <input type="submit" value="Damage" />
      </fieldset>
    );

    if (this.state.dmgEnabled) {
      damageform = (
        <fieldset>
          <input type="text" pattern="[0-9]*" onChange={this.handleChangeDmg} value={this.state.dmg} />
          <select onChange={this.handleDmgType}>{dmgType}</select>
          <button onClick={this.handleMagical} className={this.state.magicAttack}></button>
          <input type="submit" value="Damage" />
        </fieldset>
      );
    }

    return(
      <div className={"Menu MonsterMenu" + this.state.hitAnimation}>
        <div className="title">{this.props.selectedMonster.name}</div>
        <div className="hr"></div>
        <span>Attack</span>
        <form onSubmit={this.handleHit}>
          <input type="text" pattern="[0-9]*" onChange={this.handleChangeHit} value={this.state.hit} />
          <input type="submit" value="Hit" />
          <button className="formButton" onClick={this.handleDirectHit}>Direct Hit</button>
        </form>
        <AdjustedAC checked={this.state.ACchecked} onChange={this.handleChangeAC} ac={this.props.selectedMonster.ac}/>
        <form onSubmit={this.handleDmg} className="Party">
          {damageform}
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
          <button onClick={this.handleRemove}>Remove from encounter</button>
        </div>
      </div>
    );
  }
}

function AdjustedAC(props) {
  var elements = [];
  props.ac.forEach((ac, i) => {
    if (ac.condition && ac.condition.includes("with {@spell ")) {
      const spell = ac.condition.replace("with {@spell ", "").slice(0, -1); // only keep the spell name
      elements.push(
        <label className="container" key={i}>has {spell} enabled
          <input type="checkbox" checked={props.checked} onChange={props.onChange} />
          <span className="checkmark"></span>
        </label>
      );
    }
    else if (ac.condition && ac.condition.includes("while ")) {
      const spell = ac.condition.replace("while ", "") // only keep the condition
      elements.push(
        <label className="container" key={i}>is {spell}
          <input type="checkbox" checked={props.checked} onChange={props.onChange} />
          <span className="checkmark"></span>
        </label>
      );
    }
    else if (ac.condition && ac.condition.includes("hybrid form")) {
      const spell = ac.condition; // keep all
      elements.push(
        <label className="container" key={i}>{spell}
          <input type="checkbox" checked={props.checked} onChange={props.onChange} />
          <span className="checkmark"></span>
        </label>
      );
    }
  });

  if (elements.length === 0) return null;
  return <div>{elements}</div>;
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
    event.preventDefault();
    toggleStatblockInfo(this.props.toggleText);
  }

  render() {
    return (
      <div className="Search">
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <div className="autocomplete">
            <Autocomplete suggestions={this.state.monsterList} placeholder="Monster" onChange={this.handleChange} value={this.state.value} />
          </div>
          <input type="submit" value={"Shows " + this.props.toggleText + " info"} />
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
  handleShowMonster(i) {
    showEncounterMonster(i, this.props.encounter, this.props.encounterList);
    updateSearch(this.props.encounterList[this.props.encounter].monsters[i]); // Shows statblock
  }

  render() {
    var addMonsterElem;
    const list = this.props.list.map((m,i) => {
      const dmgPercentage = m.hp.current / m.hp.max;
      var damage = "healthy";
      if (dmgPercentage < 0.65) damage = "wounded";
      if (dmgPercentage < 0.36) damage = "injured";
      if (dmgPercentage < 0.19) damage = "beaten";
      if (dmgPercentage === 0) damage = "dead";
      return <div key={i} onClick={() => this.handleShowMonster(i)}><span>{i+1}. {m.name}</span><span className={damage}>{damage.charAt(0).toUpperCase() + damage.slice(1)}</span></div>;
    });

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

function showEncounterMonster (i, encounter, encounterList) {
  var m = encounterList[encounter].monsters[i];
  m.encounter = encounter;
  m.encounterID = i;
  showMonster(m);
}

// Bound to the Menu class => shows all actions in the 2nd block
var showMonster = function (selectedMonster) {
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


var updateEncounter = function (encounters) {
  this.setState({encounters});
}

function addEncounter (e, m, encounters) {
  encounters[e].monsters.push(m);
  updateEncounter(encounters);
}

function deleteEncounter (e, i, encounters) {
  encounters[e].monsters.splice(i, 1);
  updateEncounter(encounters);
  showMonster({});
  updateSearch();
}

// Middleman function
var updateSearch = function (m) {
  const monsterToShow = m || {};
  this.setState({monsterToShow});
}

var updateStatblockInfo = function (StatblockInfo) {
  this.setState({StatblockInfo});
}

var toggleStatblockInfo = function (state) {
  var newInfo = "all";
  if (state === "all") newInfo = "reduced";
  this.setState({StatblockInfo: newInfo});
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
