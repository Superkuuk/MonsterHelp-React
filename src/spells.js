import React from 'react';
import bracketText from './bracketText.js';


class Spell extends React.Component {
  componentDidUpdate () {
    // Check if spell contents exceed maximum height
    const elepsis = document.getElementById("elepsis");
    if (elepsis) elepsis.remove();
    const entries = document.querySelectorAll('.textEntries > div');
    const container = document.querySelectorAll('.spell')[0];
    const spellInfo = document.querySelectorAll('.spell > div:first-child')[0];
    //var listHeight = 0;
    var listHeight = ((spellInfo) ? spellInfo.offsetHeight : 0);
    var elementsRemoved = false;
    for(var i = 0; i < entries.length; i++) {
      entries[i].style.display = "block";
      listHeight += entries[i].offsetHeight;
      //If the row is bigger than the container, hides it, [0] to access the DOM Element

      if (container.offsetHeight < listHeight && this.props.place.place !== "centered") {
        entries[i].style.display = "none";
        elementsRemoved = true;
      }
    }
    // If elements are removed, add a new div which indicates that there is more info
    if (elementsRemoved) {
      var node = document.createElement("div");
      var textnode = document.createTextNode("Click to show more...");
      node.appendChild(textnode);
      node.setAttribute("id", "elepsis");
      node.setAttribute("class", "description");
      container.appendChild(node);
    }

  }

  render () {
    const pos = this.props.place;

    if (!this.props.spell[0]) return null;
    const spell = this.props.spell[0];
    var range = "";
    if (spell.range.distance.amount) range += spell.range.distance.amount + " ";
    range += spell.range.distance.type;

    var duration = "";
    spell.duration.forEach((item, i) => {
      if (item.type === "instant") {
        duration += item.type;
      } else if (item.type === "timed") {
        duration += item.duration.amount + " " + item.duration.type;
      }
      if (item.concentration) duration += " (concentration)";
      if (i < spell.duration.length - 1) duration += ", ";
    });

    const description = spell.entries.map((e,i) => {
      if (typeof e === 'object') {
        if (e.type === 'table') {
          const tableBody = e.rows.map((r,ida) => {
            return <tr key={i+"_"+ida}>{r.map((re, idb) => <td key={i+"_"+ida+"_"+idb}>{re}</td>)}</tr>;
          });
          const tableHead = e.colLabels.map((r, id) => <th key={i+"_"+id}>{r}</th>);
          return (
            <div key={i}>
              <table className="entryTable">
                <thead><tr key={i+"_head"}>
                  {tableHead}
                </tr></thead>
                <tbody>
                  {tableBody}
                </tbody>
              </table>
            </div>
          );
        } else if (e.type === 'entries') {
          return <div key={i}><span className="description bold">{e.name}. </span><span>{bracketText(e.entries)}</span></div>;
        } else if (e.type === 'list') {
          const listitems = e.items.map((e,id) => <li key={i+"_"+id}>{bracketText(e)}</li>);
          return <div key={i}><ul>{listitems}</ul></div>;
        } else {
          console.warn("unindentified type (description): " + e.type);
          return <div key={i}>UNIDENTIFIED TYPE. See log.</div>;
        }
      }
      return <div key={i}>{bracketText(e)}</div>;
    });

    var descriptionHigherLevel = [];
    if (spell.entriesHigherLevel) {
      spell.entriesHigherLevel.forEach((item, i) => {
        if (item.type === 'entries') {
          descriptionHigherLevel.push(<span className="bold description" key={i}>{item.name}. </span>);
          descriptionHigherLevel = descriptionHigherLevel.concat(item.entries.map((e, id) => <span key={i+"_"+id}>{bracketText(e)}</span>));
        } else {
          console.warn("unindentified type (description at higher lever): " + item.type);
        }
      });
    }

    // placement (above/under)
    var placement = {};
    var blacked;
    if (pos.place === "under") {
      placement = {
        top: pos.y + 20,
        left: pos.x,
        maxHeight: window.innerHeight - pos.y - 80,
        overflow: 'hidden'
      };
    } else if (pos.place === "above") {
      placement = {
        bottom: window.innerHeight - pos.y,
        left: pos.x, maxHeight: pos.y - 80,
        overflow: 'hidden'
      };
    } else if (pos.place === "centered") {
      placement = {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 450,
        top: 40,
        left: (window.innerWidth - 450) / 2,
        maxHeight: "calc(100vh - 116px)",
        overflow: 'auto'
      };
      blacked = <div className="blacked"></div>;
    }

    return (
      <div>
        <div className="spell" style={placement}>
          <div>
            <div className="name">{spell.name}</div>
            <div className="hr"></div>
            <table>
              <thead className="bold"><tr>
                <th>Casting Time</th>
                <th>Range</th>
                <th>Duration</th>
              </tr></thead>
              <tbody><tr>
                <td>{spell.time[0].number} {spell.time[0].unit}</td>
                <td>{range}</td>
                <td>{duration}</td>
              </tr></tbody>
            </table>
            <div className="hr"></div>
          </div>
          <div className="textEntries">{description}</div>
          <div className="textEntries higherLevel"><div>{descriptionHigherLevel}</div></div>
        </div>
        {blacked}
      </div>
    );
  }
}

export default Spell;
