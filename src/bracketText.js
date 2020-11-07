import React from 'react';

// Style specified text with brackets
var bracketText = function(s) {
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
        newText = newText.replace("|phb",''); // remove |phb's
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
            // newText = <span key={i} className="description" onMouseOver={(event) => showSpell(event)} onMouseOut={() => hideSpell()}>{newText}</span>;
            newText = <span key={i} className="description spellHoverAction">{newText}</span>;
            break;
          case "scaledamage":
            const arr = newText.split("|");;
            newText = arr[arr.length-1];
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

export default bracketText;
