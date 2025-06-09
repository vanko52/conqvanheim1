import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Dashboard() {
  const nav = useNavigate()
  const [data, setData] = useState(null)
  const [msg, setMsg] = useState('')
  async function load(){
    try{
      const res = await axios.get('/me')
      setData(res.data)
    }catch{
      nav('/login')
    }
  }
  async function pull(){
    try{
      const res = await axios.post('/pull')
      setMsg('You received a rune!')
      await load()
    }catch(x){
      if (x.response?.status===429){
        setMsg('Cooldown active. Try later.')
      } else setMsg('Error')
    }
  }
  useEffect(()=>{ load() },[])
  if (!data) return <p>Loading…</p>;
  if (!data) return null
  return (
    <div>
      <div className="box">
        <h2>Dashboard</h2>
        <p>Welcome, {data.username} (Power: {data.power})</p>
        <button onClick={pull}>Pull the Horn</button>
        <p><Link to="/inventory">Open Inventory</Link></p>

        {msg && <p>{msg}</p>}

        {/* 👉 new link to the slot-grid page */}
        <p><Link to="/inventory">Open Inventory</Link></p>

        {msg && <p>{msg}</p>}
      </div>
      <div className="box">
        <h3>Inventory</h3>
        {data?.inventory?.map(inv => (
            <div key={inv.id}>
            {inv.rune.rarity.toUpperCase()} {inv.rune.stat} +{inv.rune.value}
          </div>
        ))}
      </div>
      <Link to="/leaderboard">Leaderboard</Link>
    </div>
  )
}
