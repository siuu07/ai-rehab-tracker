import { useState, useEffect } from 'react'
import './App.css'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PainEntry {
  pain: number
  date: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PAIN_COLORS = {
  low: 'green',
  medium: 'orange',
  high: 'red',
} as const

function getPainColor(pain: number): string {
  if (pain <= 3) return PAIN_COLORS.low
  if (pain <= 6) return PAIN_COLORS.medium
  return PAIN_COLORS.high
}

function isSameDay(date: Date, day: number, month: number, year: number): boolean {
  return (
    date.getDate() === day &&
    date.getMonth() === month &&
    date.getFullYear() === year
  )
}

function loadPainsFromStorage(): PainEntry[] {
  const stored = localStorage.getItem('pains')
  return stored ? JSON.parse(stored) : []
}


// ─── Custom Hooks ─────────────────────────────────────────────────────────────

function usePainLog() {
  const [pains, setPains] = useState<PainEntry[]>(loadPainsFromStorage)

  useEffect(() => {
    localStorage.setItem('pains', JSON.stringify(pains))
  }, [pains])

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  function getEntryForDay(day: number): PainEntry | undefined {
    return pains.find(p => isSameDay(new Date(p.date), day, month, year))
  }

function transformPainData(pains: PainEntry[]): { day: number; pain: number }[] {
  return pains.map(entry => {
      const date = new Date(entry.date)
      return { day: date.getDate(), pain: entry.pain }
    })
    .sort((a, b) => a.day - b.day)
}//step 1

  function saveEntry(day: number, painValue: number) {
    const date = new Date(year, month, day).toISOString()
    const existing = getEntryForDay(day)

    if (existing) {
      setPains(prev =>
        prev.map(p =>
          isSameDay(new Date(p.date), day, month, year)
            ? { ...p, pain: painValue }
            : p
        )
      )
    } else {
      setPains(prev => [...prev, { pain: painValue, date }])
    }
  }

  const chartData = transformPainData(pains)
  console.log(chartData)
  return { pains, today, year, month, getEntryForDay, saveEntry, chartData }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface DayTileProps {
  day: number
  isToday: boolean
  isSelected: boolean
  entry: PainEntry | undefined
  onClick: () => void
}

function DayTile({ day, isToday, isSelected, entry, onClick }: DayTileProps) {
  const backgroundColor = entry ? getPainColor(entry.pain) : '#eee'

  return (
    <div
      className="day"
      key={day}
      onClick={onClick}
      style={{
        backgroundColor,
        fontWeight: isToday ? 'bold' : 'normal',
        transform: isToday ? 'scale(1.05)' : 'scale(1)',
        border: isSelected ? '3px solid black' : '1px solid #ccc',
      }}
    >
      {day}
    </div>
  )
}

interface PainFormProps {
  surgeryDate: string
  pain: string
  onSurgeryDateChange: (date: string) => void
  onPainChange: (pain: string) => void
  onSave: () => void
}

function PainForm({ surgeryDate, pain, onSurgeryDateChange, onPainChange, onSave }: PainFormProps) {
  return (
    <div className="card">
      <label>
        Enter your surgery date:
        <input
          type="date"
          value={surgeryDate}
          onChange={e => onSurgeryDateChange(e.target.value)}
        />
      </label>
      <br />
      <label>
        Enter your pain:
        <input
          type="number"
          min="0"
          max="10"
          step="1"
          value={pain}
          onChange={e => onPainChange(e.target.value)}
        />
      </label>
      <p>Today's pain: {pain}</p>
      <button onClick={onSave}>Save Pain</button>
    </div>
  )
}

interface CalendarProps {
  daysInMonth: number
  today: Date
  month: number
  year: number
  selectedDay: number | null
  getEntryForDay: (day: number) => PainEntry | undefined
  onDayClick: (day: number) => void
}

function Calendar({ daysInMonth, today, month, year, selectedDay, getEntryForDay, onDayClick }: CalendarProps) {
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="calendar">
      {days.map(day => {
        const isToday = isSameDay(today, day, month, year)
        const entry = getEntryForDay(day)

        return (
          <DayTile
            key={day}
            day={day}
            isToday={isToday}
            isSelected={selectedDay === day}
            entry={entry}
            onClick={() => onDayClick(day)}
          />
        )
      })}
    </div>
  )
}
interface ChartProps {
  data: { day: number; pain: number }[]
}

function Chart({ data }: ChartProps) {
  return (
        <div className="card">
      <h2>Pain Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="day" label={{ value: 'Day', position: 'bottom' }} />
          <YAxis label={{ value: 'Pain Level', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="pain" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  const [surgeryDate, setSurgeryDate] = useState('')
  const [pain, setPain] = useState('')
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const { today, year, month, getEntryForDay, saveEntry, chartData } = usePainLog()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  function handleDayClick(day: number) {
    setSelectedDay(day)
    const entry = getEntryForDay(day)
    setPain(entry ? String(entry.pain) : '')
  }

  function handleSave() {
    if (pain === '') return

    const value = Number(pain)
    if (value < 0 || value > 10) {
      alert('Please enter a valid pain level (0–10).')
      return
    }
    if (!selectedDay) {
      alert('Please select a day.')
      return
    }

    saveEntry(selectedDay, value)
    setPain('')
  }

  return (
    <>
      <h1>AI-assisted Rehab Tracker</h1>
      <p>Inspired by ACL recovery!</p>

      <PainForm
        surgeryDate={surgeryDate}
        pain={pain}
        onSurgeryDateChange={setSurgeryDate}
        onPainChange={setPain}
        onSave={handleSave}
      />

      <Calendar
        daysInMonth={daysInMonth}
        today={today}
        month={month}
        year={year}
        selectedDay={selectedDay}
        getEntryForDay={getEntryForDay}
        onDayClick={handleDayClick}
      />

      <Chart data={chartData} />
    </>
  )
}

export default App