import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Leaderboard() {
  const [rows, setRows] = useState([])
  useEffect(()=>{
    axios.get('/leaderboard').then(res=> setRows(res.data))
  },[])
  return (
    <div className="box">
      <h2>Leaderboard</h2>
      {rows.map((r,i)=>(
        <div key={r.username}>{i+1}. {r.username} — {r.power} power</div>
      ))}
      <p><Link to="/dashboard">Back</Link></p>
    </div>
  )
}
