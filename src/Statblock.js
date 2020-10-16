import React from 'react';
//import ReactDOM from 'react-dom';

class StatBlock extends React.Component {
  render() {
    return (
      <div className="StatBlock">
        <div className="name">Duergar</div>
        <div className="description">Large giant, chaotic evil</div>

        <div className="triangleContainer"><div className="triangle"></div></div>

        <div className="red">
            <div ><span className="bold">Armor className</span><span> 11 (hide armor)</span></div>
            <div><span className="bold">Hit Points</span><span> 59 (7d10+21)</span></div>
            <div><span className="bold">Speed</span><span> 40 ft.</span></div>
        </div>

        <div className="triangleContainer"><div className="triangle"></div></div>

        <table>
            <thead><tr><th>STR    </th><th>DEX   </th><th>CON    </th><th>INT   </th><th>WIS   </th><th>CHA   </th></tr></thead>
            <tbody><tr><td>19 (+4)</td><td>8 (-1)</td><td>16 (+3)</td><td>5 (-3)</td><td>7 (-2)</td><td>7 (-2)</td></tr></tbody>
        </table>

        <div className="triangleContainer"><div className="triangle"></div></div>

        <div className="red">
          <div><span className="bold">Senses</span><span> darkvision 60ft., passive Perception 8</span></div>
          <div><span className="bold">Languages</span><span> Common, Giant</span></div>
          <div><span className="bold">Challenge</span><span> 2 (450 XP)</span></div>
        </div>

        <div className="triangleContainer"><div className="triangle"></div></div>

        <div className="attack"><span className="attackname">Greatclub. </span><span>+6 to hit, reach 5 ft., one target. 13 (2d8+4) bludgeoning damage.</span></div>

        <div className="actions red">Actions</div>
        <div className="hr"></div>

        <div className="attack"><span className="attackname">Greatclub.</span><span className="description"> Melee Weapon Attack:</span><span>+6 to hit, reach 5 ft., one target.</span><span className="description">Hit:</span><span>13 (2d8+4) bludgeoning damage.</span></div>
        <div className="attack"><span className="attackname">Javelin.</span><span className="description"> Melee or Ranged Weapon Attack:</span><span>+6 to hit, reach 5 ft. or 30ft./120, one target.</span><span className="description">Hit:</span><span>11 (2d6+4) piercing damage.</span></div>
      </div>
    );
  }
}

export default StatBlock;
