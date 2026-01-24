import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [pain, setPain] = useState("");
  const [pains, setPains] = useState<{ pain: number, date: string }[]>([]);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function getColor(pain: number) {
    if (pain <= 3) return "green";
    if (pain <= 6) return "orange";
    return "red";
  }
  return (
    <>
      {/* <div>
      </div> */}
      <h1>AI-assisted Rehab Tracker</h1>
      <p>Inspired by ACL recovery!</p>
      <div className="card">
        <label>Enter your pain:
          <input
            type="number"
            min="0"
            max="10"
            step="1"
            value={pain}
            onChange={(e) => setPain(e.target.value)}
          />
        </label>
        <p>Today's pain: {pain}</p>
        <button
          onClick={() => {
            if (pain === "") return;
            const value = Number(pain);
            if (value < 0 || value > 10) {
              alert("Please enter a valid pain level (0-10).");
              return;
            }
            const entry = {
              pain: value,
              date: new Date().toISOString(),
            };
            setPains([...pains, entry]);
            setPain("");
          }}
        >
          Save Pain
        </button>
      </div>
      <div className="calendar">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const entry = pains.find(p => new Date(p.date).getDate() === day);
          const color = entry ? getColor(entry.pain) : "#eee";
          return (
            <div
              className="day"
              key={day}
              style={{ backgroundColor: color }}
            >
              {day}
            </div>
          );
        })}
      </div>

    </>
  )
}

export default App
