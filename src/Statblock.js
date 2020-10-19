import React from 'react';

class StatBlock extends React.Component {
  render() {
    var monster = XML2Monster(this.props.monster);
    var size = "Medium";
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
    return (
      <div className="StatBlock">
        <div className="name">{monster.name}</div>
        <div className="description">{size} {monster.type}, {monster.alignment}</div>

        <TriangleHR />

        <div className="red">
            <div ><span className="bold">Armor </span><span>{monster.ac}</span></div>
            <div><span className="bold">Hit Points </span><span>{monster.hp}</span></div>
            <div><span className="bold">Speed </span><span>{monster.speed}</span></div>
        </div>

        <TriangleHR />

        <table>
            <thead><tr><th>STR</th><th>DEX</th><th>CON</th><th>INT</th><th>WIS</th><th>CHA</th></tr></thead>
            <tbody><tr><td>{AbilityModifier(monster.str)}</td><td>{AbilityModifier(monster.dex)}</td><td>{AbilityModifier(monster.con)}</td><td>{AbilityModifier(monster.int)}</td><td>{AbilityModifier(monster.wis)}</td><td>{AbilityModifier(monster.cha)}</td></tr></tbody>
        </table>

        <div className="triangleContainer"><div className="triangle"></div></div>
        <MonsterInfo monster={monster} />
        <TriangleHR />
        <Actions action={monster.trait} />
        <ActionContainer value={monster.action} />
        <ActionContainer prefix="Legendary" value={monster.legendary} />
      </div>
    );
  }
}

// Shorthand for triangle div
function TriangleHR(props) {
  return <div className="triangleContainer"><div className="triangle"></div></div>;
}

// Container for all actions/traits/attacks, including header. Use prefix as prefix in header
function ActionContainer(props) {
  if (props.value.length === 0) return null;
  var action = "";
  if (typeof props.prefix != 'undefined') action = props.prefix + " ";
  return (
    <div>
      <div className="actions red">{action}Actions</div>
      <div className="hr"></div>
      <Actions action={props.value} />
    </div>
  );
}

// Loop trough all actions/traits/attacks and render divs accordingly. (Without header)
function Actions(props) {
  const listActions = props.action.map((t, index) =>
    <div className="action" key={index}><span className="actionname">{t.name} </span><span>{t.text}</span></div>
  );
  return <div>{listActions}</div>;
}

// Show all different infos of the monster
function MonsterInfo(props) {
  return (
    <div className="red">
      <MonsterInfoSub type="Saving Throws" value={props.monster.save} />
      <MonsterInfoSub type="Skills" value={props.monster.skill} />
      <MonsterInfoSub type="Damage Immunities" value={props.monster.immune} />
      <MonsterInfoSub type="Senses" value={props.monster.senses} />
      <MonsterInfoSub type="Languages" value={props.monster.languages} />
      <MonsterInfoSub type="Challenge" value={props.monster.cr} />
    </div>
  );
}

// individual info, show nothing if not specified in the data
function MonsterInfoSub(props) {
  if (!props.value) return null;
  return <div><span className="bold">{props.type} </span><span>{props.value}</span></div>;
}

// convert XML data into JavaScript object of a monster
function XML2Monster(monsterDOM) {
  var monster = {};

  // Add nested elements (arrays) to the monster
  monster["trait"] = [];
  monster["action"] = [];
  monster["legendary"] = [];

  const elements = monsterDOM.querySelectorAll("monster > *"); // Select only immediate children
	elements.forEach(e => {
    if (e.childNodes.length === 1) {
      monster[e.tagName] = e.childNodes[0].nodeValue;
    } else {
      // Nested elements, loop through children of children of monster
      var tempElem = {};
      const elements2 = e.querySelectorAll("*");
      elements2.forEach(e2 => {
        tempElem[e2.tagName] = e2.childNodes[0].nodeValue;
      });
      monster[e.tagName].push(tempElem);

    }
	});
  return monster;
}

// Returns the given (signed) modifier for an ability as string
function AbilityModifier(n) {
    var x = (n - 10) / 2; // x = (15 - 10) / 2 = 2.5 || x = (7 - 10) / 2 = -1.5
    if (x > 0) { //
      x = Math.floor(x); // x = floor(2.5) = 2
    } else {
      x = Math.ceil(x); // x = ceil(-1.5) = -1
    }

    if (x > 0) {
      x = "+" + x;
    } else if (x < 0) {
      x = "-" + x;
    } else {
      x = "" + x;
    }

    return n + " (" + x + ")";
}

export default StatBlock;
