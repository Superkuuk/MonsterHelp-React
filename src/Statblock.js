import React from 'react';
import Spell from './spells.js';
import SpellData from './spellData.js'


class StatBlock extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedSpell: {},
      spellPlace: {x: 0, y: 0, place: "under"},
    }

    SpellData.data = this.props.spells;
    Object.freeze(SpellData)

    showSpell = showSpell.bind(this);
    hideSpell = hideSpell.bind(this);
  }

  render() {
    if (!(Object.keys(this.props.monster).length === 0 && this.props.monster.constructor === Object)) {
      var monster = this.props.monster;
      if (this.props.info === "all") {
        return (
          <div className="StatBlock">
              <Spell spell={this.state.selectedSpell} place={this.state.spellPlace} />
              <div className="name">{monster.name}</div>
              <Type monster={monster} />
            <TriangleHR />
              <div className="red">
                  <Armor ac={monster.ac} />
                  <Health hp={monster.hp} />
                  <Speed speed={monster.speed} />
              </div>
            <TriangleHR />
              <table>
                  <thead><tr><th>STR</th><th>DEX</th><th>CON</th><th>INT</th><th>WIS</th><th>CHA</th></tr></thead>
                  <tbody><tr><td>{AbilityModifier(monster.str)}</td><td>{AbilityModifier(monster.dex)}</td><td>{AbilityModifier(monster.con)}</td><td>{AbilityModifier(monster.int)}</td><td>{AbilityModifier(monster.wis)}</td><td>{AbilityModifier(monster.cha)}</td></tr></tbody>
              </table>
            <TriangleHR />
              <div className="red">
                <MonsterInfoST type="Saving Throws" value={monster.save} />
                <MonsterInfoSkills type="Skills" value={monster.skill} />
                <MonsterInfoVul type="Damage Vulnerabilities" value={monster.vulnerable} />
                <MonsterInfoRes type="Damage Resistances" value={monster.resist} />
                <MonsterInfoImm type="Damage Immunities" value={monster.immune} />
                <MonsterInfoCImm type="Condition Immunities" value={monster.conditionImmune} />
                <MonsterInfoSenses type="Senses" sense={monster.senses} passive={monster.passive} />
                <MonsterInfoLan type="Languages" value={monster.languages} />
                <MonsterInfoCR type="Challenge" cr={monster.cr} xp={monster.xp} />
              </div>
            <TriangleHR />
              <Traits traits={monster.trait} />
              <Spellcasting spells={monster.spellcasting} />
              <Actions actions={monster.action} />
              <LegendaryActions actions={monster.legendary} />
          </div>
        );
      } else if (this.props.info === "reduced") {
        return (
          <div className="StatBlock">
              <Spell spell={this.state.selectedSpell} place={this.state.spellPlace} />
              <div className="name">{monster.name}</div>
              <Type monster={monster} />
            <TriangleHR />
              <div className="red">
                  <Speed speed={monster.speed} />
              </div>
            <TriangleHR />
              <div className="red">
                <MonsterInfoSkills type="Skills" value={monster.skill} />
                <MonsterInfoSenses type="Senses" sense={monster.senses} passive={monster.passive} />
                <MonsterInfoLan type="Languages" value={monster.languages} />
              </div>
            <TriangleHR />
              <Traits traits={monster.trait} />
              <Spellcasting spells={monster.spellcasting} />
              <Actions actions={monster.action} />
              <LegendaryActions actions={monster.legendary} />
          </div>
        );
      }
    } else {
      return (
        <div className="StatBlock">
          Enter a monster
        </div>
      );
    }
  }
}

function Traits(props) {
  if (!props.traits) return null;
  const t = props.traits.map((e, index) =>
    <div className="action" key={index}><span className="actionname">{bracketText(e.name)}. </span><span className="actionDescription">{bracketText(e.entries)}</span></div>
  );
  return <div>{t}</div>;
}

function Actions(props) {
  if (!props.actions) return null;
  const t = props.actions.map((e, index) =>
    <div className="action" key={index}><span className="actionname">{bracketText(e.name)}. </span><span className="actionDescription">{bracketText(e.entries)}</span></div>
  );
  return (
    <div>
      <div className="actions red">Actions</div>
      <div className="hr"></div>
      {t}
    </div>
  );
}

function Spellcasting(props) {
  if (!props.spells) return null;
  var list = [];

  props.spells.forEach((spells, i) => {
    var spellsFormated = [];
    if (spells.spells) {
      for (const [lvl, value] of Object.entries(spells.spells)) {
        const spelllist = value.spells.map(s => bracketText(s));
        //var spellistText = spelllist.join(", ");
        var spellistText = spelllist;
        var spelllvl = parseInt(lvl);
        var elem;
        if (spelllvl === 0) {
          elem = <div key={lvl} className="monsterInfoDiv">Cantrips (at will): <span className="description spanList">{spellistText}</span></div>;
        } else {
          var x = "th";
          if (spelllvl === 1) x = "st";
          if (spelllvl === 2) x = "nd";
          if (spelllvl === 3) x = "rd";
          elem = <div key={spelllvl} className="monsterInfoDiv">{spelllvl}{x} level ({value.slots} slots): <span className="description spanList">{spellistText}</span></div>;
        }
        spellsFormated.push(elem);
      }

    } else if (spells.will) {
      const spelllist = spells.will.map(s => bracketText(s));
      spellsFormated.push(<div className="monsterInfoDiv" key={spellsFormated.length}>At will: <span className="description spanList">{spelllist}</span></div>);
    } else if (spells.daily) {
      for (const [day, value] of Object.entries(spells.daily)) {
        const spelllist = value.map(s => bracketText(s));
        var amount = day.replace(/[0-9]/g, '');
        if (amount === "e") amount = " each";
        spellsFormated.push(<div className="monsterInfoDiv" key={spellsFormated.length}>{parseInt(day)}/day{amount}: <span className="description spanList">{spelllist}</span></div>);
      }
    }

    list.push(
      <div key={i} className="action spellcasting">
        <span className="actionname">{spells.name}. </span>
        <span className="actionDescription">{bracketText(spells.headerEntries)}</span>
        <div>
          <span className="actionDescription">{spellsFormated}</span>
        </div><div>
          <span className="actionDescription description">{bracketText(spells.footerEntries)}</span>
        </div>
      </div>
    );
  });

  return <div>{list}</div>;
}

function LegendaryActions(props) {
  if (!props.actions) return null;
  const t = props.actions.map((e, index) =>
    <div className="action" key={index}><span className="actionname">{bracketText(e.name)}. </span><span className="actionDescription">{bracketText(e.entries)}</span></div>
  );
  return (
    <div>
      <div className="actions red">Legendary Actions</div>
      <div className="hr"></div>
      {t}
    </div>
  );
}

function Health(props) {
  if (props.hp.current) return <div><span className="bold">Hit Points </span><span>{props.hp.current} (max: {props.hp.max})</span></div>;
  return <div><span className="bold">Hit Points </span><span>{props.hp.average} ({props.hp.formula})</span></div>;
}

function Speed(props) {
  var speed = "";
  for (const [type, value] of Object.entries(props.speed)) {
    if (typeof value === "boolean") continue;
    var v = value;
    var c = "";
    if (typeof value === "object") {
      v = value.number;
      c = " " + value.condition;
    }
    switch (type) {
      case "walk":
        speed += v + "ft." + c + ", ";
        break;
      default:
        speed += type + " " + v + "ft." + c + ", ";
    }
  }
  speed = speed.slice(0, -2);
  return <div><span className="bold">Speed </span><span>{speed}</span></div>;
}

function Armor(props) {
  var ac = [];
  props.ac.forEach((item, i) => {
    ac.push(<span key={i+"a"}>, </span>);
    if (item.ac) {
      ac.push(<span key={i+"b"}>{item.ac}</span>);
      if (item.from) {
        ac.push(<span key={i+"c"} className="spanList"> ({bracketText(item.from)})</span>);
      }
      if (item.condition) {
        ac.push(<span key={i+"d"} className="spanList"> {bracketText(item.condition)}</span>);
      }
    } else {
      ac.push(<span key={i+"e"}>{item}</span>);
    }
  });
  ac.shift();

  return <div ><span className="bold">Armor </span><span>{ac}</span></div>;
}

// Create type div
function Type(props) {
  const monster = props.monster;
  var size;
  switch (monster.size) {
    case "T":
      size = "Tiny";
      break;
    case "S":
      size = "Small";
      break;
    case "M":
      size = "Medium";
      break;
    case "L":
      size = "Large";
      break;
    case "H":
      size = "Huge";
      break;
    case "G":
      size = "Gargantuan";
      break;
    default:
      size = "UNDEFINED ("+monster.size+")";
  }

  var type;
  if (typeof monster.type === 'object') {
    type = monster.type.type + " (" + monster.type.tags[0] + ")";
  } else {
    type = monster.type;
  }

  var alignment = "";
  if (monster.alignment.includes("NX") && monster.alignment.includes("NY")) {
    var all = ["L", "NX", "C", "G", "NY", "E"];
    all = all.filter( ( el ) => !monster.alignment.includes( el ) );
    switch (all[0]) {
      case "G":
        alignment = "any non-good alignment";
        break;
      case "E":
        alignment = "any non-evil alignment";
        break;
      case "L":
        alignment = "any non-lawful alignment";
        break;
      case "C":
        alignment = "any non-chaotic alignment";
        break;
      default:
        alignment = "UNDEFINED (NX, NY present: "+all[0]+")";
    }
  } else if (monster.alignment.includes("NX") || monster.alignment.includes("NY")) {
    if (monster.alignment.includes("NX") && monster.alignment.includes("G")) alignment = "any good alignment";
    if (monster.alignment.includes("NX") && monster.alignment.includes("E")) alignment = "any evil alignment";
    if (monster.alignment.includes("NY") && monster.alignment.includes("L")) alignment = "any lawful alignment";
    if (monster.alignment.includes("NY") && monster.alignment.includes("C")) alignment = "any chaotic alignment";
  } else {
    monster.alignment.forEach(e => {
      var partial;
      switch (e) {
        case "E":
          partial = "evil ";
          break;
        case "N":
          partial = "neutral ";
          break;
        case "G":
          partial = "good ";
          break;
        case "L":
          partial = "lawful ";
          break;
        case "C":
          partial = "chaotic ";
          break;
        case "U":
          partial = "unaligned ";
          break;
        case "A":
          partial = "any alignment ";
          break;
        default:
          partial = "UNDEFINED ("+e+") ";
      }
      alignment += partial;
    });
    alignment = alignment.slice(0,-1); // Remove last space from string
  }

  return <div className="description">{size} {type}, {alignment}</div>;
}

// Shorthand for triangle div
function TriangleHR(props) {
  return <div className="triangleContainer"><div className="triangle"></div></div>;
}

// individual info, show nothing if not specified in the data
function MonsterInfoST(props) {
  if (!props.value) return null;
  var v = "";
  for (const [key, value] of Object.entries(props.value)) {
    v += key.charAt(0).toUpperCase() + key.slice(1) + " " + value + ", ";
  }
  v = v.slice(0, -2);
  return <MonsterInfoDiv type={props.type} value={v} />;
}
function MonsterInfoSkills(props) {
  if (!props.value) return null;
  var v = "";
  for (const [key, value] of Object.entries(props.value)) {
    v += key.charAt(0).toUpperCase() + key.slice(1) + " " + value + ", ";
  }
  v = v.slice(0, -2);
  return <MonsterInfoDiv type={props.type} value={v} />;
}
function MonsterInfoVul(props) {
  if (!props.value) return null;
  var v = "";
  props.value.forEach(e => {
    v += e + ", ";
  });
  v = v.slice(0, -2);
  return <MonsterInfoDiv type={props.type} value={v} />;
}
function MonsterInfoRes(props) {
  if (!props.value) return null;
  var v = "";
  props.value.forEach(e => {
    if (typeof e != 'object') {
      v += e + ", ";
    }
  });
  if (v.length > 0) v = v.slice(0, -2) + "; ";
  props.value.forEach(e => {
    if (typeof e === 'object') {
      if (e.special) {
        v += e.special + "; ";
      } else {
        if (e.preNote) {
          v += e.preNote + " ";
        }
        // e.resist.forEach(a => {
        //   v += a + ", ";
        // });

        v += e.resist.join(", ");
        if (e.note) {
          v += " " + e.note + "; ";
        } else {
          v += "; ";
        }
      }
    }
  });
  v = v.slice(0, -2);
  return <MonsterInfoDiv type={props.type} value={v} />;
}
function MonsterInfoImm(props) {
  if (!props.value) return null;
  var v = "";
  props.value.forEach(e => {
    if (typeof e === 'object') {
      if (v.length > 2) {
        v = v.slice(0, -2) + "; ";
      }
      v += e.immune.join(", ");
      v += " " + e.note + "; ";
    } else {
      v += e + ", ";
    }
  });
  v = v.slice(0, -2);
  return <MonsterInfoDiv type={props.type} value={v} />;
}
function MonsterInfoCImm(props) {
  if (!props.value) return null;
  return <MonsterInfoDiv type={props.type} value={props.value.join(", ")} />;
}
function MonsterInfoSenses(props) {
  var v = "";
  if (props.sense) v += props.sense.join(", ") + ", ";
  v += "passive Perception " + props.passive;
  return <MonsterInfoDiv type={props.type} value={v} />;
}
function MonsterInfoLan(props) {
  if (!props.value) return <MonsterInfoDiv type={props.type} value="–" />;
  return <MonsterInfoDiv type={props.type} value={props.value.join(", ")} />;
}
function MonsterInfoCR(props) {
  if (!props.cr) return null;
  var cr = props.cr;
  if (typeof cr === 'object') cr = cr.cr;
  var v = cr + " (" + props.xp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " XP)";
  return <MonsterInfoDiv type={props.type} value={v} />;
}

function MonsterInfoDiv(props){
  return <div className="monsterInfoDiv"><span className="bold">{props.type} </span><span>{props.value}</span></div>;
}

// Style specified text with brackets
function bracketText(s) {
  if (s === undefined) return [];
  if (typeof s !== 'object') s = [s]; // Make string as array, to make it loopable
  var r = [];
  s.forEach((entry, index) => {
    if (typeof entry === 'object') {
      // Loop through all subentries of this entry object
      entry.items.forEach((item, i) => {
        r.push(<span key={index + "_" + i} className="subActionDescriptionParagraph"><span className="bold">{item.name}</span> {alterBracketText(item.entry)}</span>);
      });
    } else {
      r.push(<span key={index} className="actionDescriptionParagraph">{alterBracketText(entry)}</span>);
    }

  });
  return r;
}

function alterBracketText(entry) {
  var textArray = [entry];
  if (entry.match(/{([^}]+)}/g)) { // Only format if there are brackets
    textArray = entry.split(/{([^}]+)}/g);
    textArray.forEach((item, i) => {
      if (item[0] === "@") {
        var type = item.match(/@(\w*)/, '')[1]; // item
        var newText = item.replace(/@(\w*)(\s*)/g,''); // remove first word after @
        newText = newText.replace(/\|(\w*)/g,''); // remove first word after |
        switch (type) {
          case "item":
            break;
          case "dc": //DC
            newText = "DC " + newText;
            break;
          case "dice":
            break;
          case "atk":
            if (newText === "mw") {
              newText = <span key={i} className="description">Melee Weapon Attack: </span>;
            } else if (newText === "mw,rw") {
              newText = <span key={i} className="description">Melee or Ranged Weapon Attack: </span>;
            } else if (newText === "rw") {
              newText = <span key={i} className="description">Ranged Weapon Attack: </span>;
            } else if (newText === "ms") {
              newText = <span key={i} className="description">Melee Spell Attack: </span>;
            } else if (newText === "rs") {
                newText = <span key={i} className="description">Ranged Spell Attack: </span>;
            } else if (newText === "ms,rs") {
              newText = <span key={i} className="description">Melee or Ranged Spell Attack: </span>;
            } else {
              newText = <span key={i} className="description red">UNDEFINED Attack: </span>;
            }
            break;
          case "hit":
            newText = "+" + newText;
            break;
          case "h":
            newText = <span key={i} className="description">Hit: </span>;
            break;
          case "damage":
            break;
          case "creature":
            break;
          case "condition":
            break;
          case "recharge":
            if (newText === "") {
              newText = "(Recharge 6)";
            } else {
              newText = "(Recharge " + newText + ")";
            }
            break;
          case "spell":
            newText = <span key={i} className="description" onMouseOver={(event) => showSpell(event)} onMouseOut={() => hideSpell()}>{newText}</span>;
            break;
          default:

        }
        textArray[i] = newText;
      }
    });
    textArray = textArray.filter(obj => obj !== "");
  }
  return textArray;
}

var showSpell = function(e) {
  const spell = SpellData.data.filter(s => {
    return s.name.toLowerCase() === e.target.innerHTML.toLowerCase()
  });
  const x = e.target.getBoundingClientRect().left;
  const y = e.target.getBoundingClientRect().top;
  var place = ((y > window.innerHeight/2) ? "above" : "under"); // place spell div above or under hovered element

  this.setState({
    selectedSpell: spell,
    spellPlace: {x: x - 350, y: y, place: place},
  });
}

var hideSpell = function() {
  this.setState({
    selectedSpell: {},
    spellX: 0,
    spellY: 0,
  });
}

// Returns the given (signed) modifier for an ability as string (including the original value)
function AbilityModifier(n) {
    var x = (n - 10) / 2; // x = (15 - 10) / 2 = 2.5 || x = (7 - 10) / 2 = -1.5
    x = Math.floor(x);

    if (x > 0) {
      x = "+" + x;
    } else {
      x = "" + x;
    }

    return n + " (" + x + ")";
}

export default StatBlock;
