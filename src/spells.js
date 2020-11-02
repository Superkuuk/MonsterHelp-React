import React from 'react';

class Spell extends React.Component {
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
        return <span>TODO</span>;
      }
      return <span key={i}>{e}</span>;
    });
    // var descriptionHigherLevel = [];
    // if (spell.entriesHigherLevel) {
    //   descriptionHigherLevel.push(<span className="bold">{spell.entriesHigherLevel[0].name}</span>);
    //   descriptionHigherLevel = descriptionHigherLevel.concat(spell.entriesHigherLevel[0].map(e => <span>{e}</span>));
    // }

    // placement (above/under)
    var placement = ((pos.place === "under") ? {top: pos.y + 20, left: pos.x} : {bottom: window.innerHeight - pos.y, left: pos.x});
    return (
      <div className="spell" style={placement}>
        <div className="name">{spell.name}</div>
        <div className="spellInfo">
          <span>{spell.time[0].number} {spell.time[0].unit}</span>
          <span>{range}</span>
          <span>{duration}</span>
        </div>
        <div className="textEntries">{description}</div>
      </div>
    );
  }
}

export default Spell;
