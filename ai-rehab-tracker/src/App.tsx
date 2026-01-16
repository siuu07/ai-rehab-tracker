import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [pain, setPain] = useState("");
  const [pains, setPains] = useState<{ pain: number, date: string }[]>([]);
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
            const entry = {
              pain: Number(pain),
              date: new Date().toLocaleDateString(),
            };
            setPains([...pains, entry]);
            setPain("");
          }}
        >
          Save Pain
        </button>
        <ul>
          {pains.map((p, index) => (
            <li key={index}>{p.date} - Pain: {p.pain}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
