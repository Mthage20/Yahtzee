import { useState } from 'react';
import Die from './components/Die';

function App() {
  const NUM_DICE = 5;
  const MAX_ROLLS = 3;

  const [dice, setDice] = useState(
    Array.from({ length: NUM_DICE }, () => ({
      value: Math.floor(Math.random() * 6) + 1,
      locked: false,
    }))
  );

  const [rollsLeft, setRollsLeft] = useState(MAX_ROLLS);

  const [scoreboard, setScoreboard] = useState({
    ones: null,
    twos: null,
    threes: null,
    fours: null,
    fives: null,
    sixes: null,
    threeOfKind: null,
    fourOfKind: null,
    fullHouse: null,
    smallStraight: null,
    largeStraight: null,
    yahtzee: null,
    chance: null,
  });
  

  const [hasRolled, setHasRolled] = useState(false);
  const [turnEnded, setTurnEnded] = useState(false);


  const toggleLock = (index) => {
    if (!hasRolled || turnEnded) return;

    setDice(prev =>
      prev.map((die, i) =>
        i === index ? { ...die, locked: !die.locked } : die
      )
    );
  };


  const rollDice = () => {
    if (rollsLeft === 0 || turnEnded) return;

    setHasRolled(true); 

    setDice(prev =>
      prev.map(die =>
        die.locked
          ? die
          : { ...die, value: Math.floor(Math.random() * 6) + 1 }
      )
    );

    setRollsLeft(prev => prev - 1);
  };

  const newTurn = () => {
    setRollsLeft(MAX_ROLLS);
    setHasRolled(false);
    setTurnEnded(false);

    setDice(() =>
      Array.from({ length: NUM_DICE }, () => ({
        value: Math.floor(Math.random() * 6) + 1,
        locked: false,
      }))
    );
  };

  const scoreCategory = (category) => {
    if (!hasRolled || turnEnded || scoreboard[category] !== null) return;
  
    const counts = Array(7).fill(0);
    dice.forEach(d => counts[d.value]++);
    const values = dice.map(d => d.value).sort();
  
    let score = 0;
  
    switch (category) {
      case 'ones':
      case 'twos':
      case 'threes':
      case 'fours':
      case 'fives':
      case 'sixes':
        const num = parseInt(category[0]); 
        score = dice.filter(d => d.value === num).length * num;
        break;
  
      case 'threeOfKind':
        if (counts.some(c => c >= 3)) score = dice.reduce((sum, d) => sum + d.value, 0);
        break;
  
      case 'fourOfKind':
        if (counts.some(c => c >= 4)) score = dice.reduce((sum, d) => sum + d.value, 0);
        break;
  
      case 'fullHouse':
        if (counts.includes(3) && counts.includes(2)) score = 25;
        break;
  
      case 'smallStraight':
        if (
          hasStraight([1, 2, 3, 4], values) ||
          hasStraight([2, 3, 4, 5], values) ||
          hasStraight([3, 4, 5, 6], values)
        ) score = 30;
        break;
  
      case 'largeStraight':
        if (
          hasStraight([1, 2, 3, 4, 5], values) ||
          hasStraight([2, 3, 4, 5, 6], values)
        ) score = 40;
        break;
  
      case 'yahtzee':
        if (counts.some(c => c === 5)) score = 50;
        break;
  
      case 'chance':
        score = dice.reduce((sum, d) => sum + d.value, 0);
        break;
  
      default:
        return;
    }
  
    setScoreboard(prev => ({
      ...prev,
      [category]: score,
    }));
  
    setTurnEnded(true);
  };
  
  const totalScore = Object.values(scoreboard).reduce(
    (sum, val) => sum + (val ?? 0),
    0
  );
  
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>🎲 Yahtzee</h1>

      <div style={{ marginBottom: "1rem" }}>
        Rolls Left: <strong>{rollsLeft}</strong>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        {dice.map((die, index) => (
          <Die
            key={index}
            value={die.value}
            locked={die.locked}
            onClick={() => toggleLock(index)}
          />
        ))}
      </div>

      <button
        onClick={rollDice}
        disabled={rollsLeft === 0 || turnEnded}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          opacity: rollsLeft === 0 || turnEnded ? 0.5 : 1,
          cursor: rollsLeft === 0 || turnEnded ? "not-allowed" : "pointer",
        }}
      >
        Roll All
      </button>

      <br />

      <button
        onClick={newTurn}
        style={{ marginTop: "0.5rem", padding: "0.3rem 0.8rem" }}
      >
        New Turn
      </button>

      <h2 style={{ marginTop: "2rem" }}>Scoreboard</h2>
<table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
  <thead>
    <tr>
      <th style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Category</th>
      <th style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Score</th>
      <th style={{ padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Action</th>
    </tr>
  </thead>
  <tbody>
    {Object.entries(scoreboard).map(([category, score]) => (
      <tr key={category}>
        <td style={{ padding: "0.5rem" }}>{category}</td>
        <td style={{ padding: "0.5rem" }}>{score ?? "-"}</td>
        <td style={{ padding: "0.5rem" }}>
          <button
            onClick={() => scoreCategory(category)}
            disabled={score !== null || !hasRolled || turnEnded}
          >
            Score
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

<p><strong>Total Score:</strong> {totalScore}</p>

    </div>
  );
}




export default App;
