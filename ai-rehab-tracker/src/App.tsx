import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [surgeryDate, setSurgeryDate] = useState("");
  const [pain, setPain] = useState("");
  const [pains, setPains] = useState<{ pain: number, date: string }[]>([]);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  function getColor(pain: number) {
    if (pain <= 3) return "green";
    if (pain <= 6) return "orange";
    return "red";
  }
  // function daysFromSurgery(date: Date) {
  //   const diff = date.getTime() - surgeryDate.getTime();
  //   return Math.floor(diff / (1000 * 60 * 60 * 24));
  // }
  return (
    <>
      {/* <div>
      </div> */}
      <h1>AI-assisted Rehab Tracker</h1>
      <p>Inspired by ACL recovery!</p>
      <div className="card">
        <label>Enter your surgery date:
          <input
            type="date"
            value={surgeryDate}
            onChange={(e) => setSurgeryDate(e.target.value)}
          />
        </label>
        <br />
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
          const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const entry = pains.find(p => new Date(p.date).getDate() === day);
          const color = entry ? getColor(entry.pain) : "#eee";
          return (
            <div className="day"
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                backgroundColor: color,
                //border: isToday ? "3px solid #3b82f6" : "1px solid #ccc",
                fontWeight: isToday ? "bold" : "normal",
                transform: isToday ? "scale(1.05)" : "scale(1)",
                border: selectedDay === day ? "3px solid black" : "1px solid #ccc",
              }}
            >
              {day}
            </div>
          );
        })}
      </div >

    </>
  )
}

export default App
