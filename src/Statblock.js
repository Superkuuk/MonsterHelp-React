import React from 'react';

class StatBlock extends React.Component {
  render() {
    if (this.props.monster) {
      var monster = this.props.monster;
      return (
        <div className="StatBlock">
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
          <MonsterInfo monster={monster} />
        <TriangleHR />
          <Traits traits={monster.trait} />
          <Actions actions={monster.action} />
          <LegendaryActions actions={monster.legendary} />
        </div>
      );
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
  var ac = "";
  props.ac.forEach((item, i) => {
    if (item.ac) {
      ac += item.ac;
      if (item.from) {
        var from = "";
        item.from.forEach(e => {
          from += bracketText(e) + ", ";
        });
        from = from.slice(0, -2);
        ac += " (" + from + ")";
      }
      if (item.condition) {
        ac += " " + item.condition;
      }
      ac += ", ";
    } else {
      ac += item + ", ";
    }
  });
  ac = ac.slice(0, -2);

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
    console.log(all);
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

// Show all different infos of the monster
function MonsterInfo(props) {
  return (
    <div className="red">
      <MonsterInfoST type="Saving Throws" value={props.monster.save} />
      <MonsterInfoSkills type="Skills" value={props.monster.skill} />
      <MonsterInfoVul type="Damage Vulnerabilities" value={props.monster.vulnerable} />
      <MonsterInfoRes type="Damage Resistances" value={props.monster.resist} />
      <MonsterInfoImm type="Damage Immunities" value={props.monster.immune} />
      <MonsterInfoCImm type="Condition Immunities" value={props.monster.conditionImmune} />
      <MonsterInfoSenses type="Senses" sense={props.monster.senses} passive={props.monster.passive} />
      <MonsterInfoLan type="Languages" value={props.monster.languages} />
      <MonsterInfoCR type="Challenge" value={props.monster.cr} />
    </div>
  );
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
  v = v.slice(0, -2) + "; ";
  props.value.forEach(e => {
    if (typeof e === 'object') {
      e.resist.forEach(a => {
        v += a + ", ";
      });
      if (e.note) {
        v = v.slice(0, -2) + " " + e.note + "; ";
      } else {
        v = v.slice(0, -2) + "; ";
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
      e.immune.forEach((item, i) => {
        v += item + ", ";
      });
      v = v.slice(0, -2);
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
  var v = "";
  props.value.forEach(e => {
    v += e + ", ";
  });
  v = v.slice(0, -2);
  return <MonsterInfoDiv type={props.type} value={v} />;
}
function MonsterInfoSenses(props) {
  var v = "";
  if (props.sense) {
    props.sense.forEach(e => {
      v += e + ", ";
    });
  }
  v += "passive Perception " + props.passive;
  return <MonsterInfoDiv type={props.type} value={v} />;
}
function MonsterInfoLan(props) {
  if (!props.value) return <MonsterInfoDiv type={props.type} value="–" />;
  var v = "";
  props.value.forEach(e => {
    v += e + ", ";
  });
  v = v.slice(0, -2);
  return <MonsterInfoDiv type={props.type} value={v} />;
}
function MonsterInfoCR(props) {
  if (!props.value) return null;
  return <MonsterInfoDiv type={props.type} value={props.value} />;
}

function MonsterInfoDiv(props){
  return <div className="monsterInfoDiv"><span className="bold">{props.type} </span><span>{props.value}</span></div>;
}

// Style specified text with brackets
function bracketText(s) {
  if (typeof s !== 'object') s = [s]; // Make string as array, to make it loopable
  var r = [];
  s.forEach((entry, index) => {
    if (entry.match(/{([^}]+)}/g)) { // Only format if there are brackets
      var textArray = entry.split(/{([^}]+)}/g);
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
              } else {
                newText = <span key={i} className="description red">UNDEFINED Weapon Attack: </span>;
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
            default:

          }
          textArray[i] = newText;
        }
      });
      textArray = textArray.filter(obj => obj !== "");
      r.push(<span key={index} className="actionDescriptionParagraph">{textArray}</span>);
    } else {
      r.push(<span key={index} className="actionDescriptionParagraph">{entry}</span>);
    }
  });

  return r;
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
