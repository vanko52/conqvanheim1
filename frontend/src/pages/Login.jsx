import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const [username, setU] = useState('')
  const [password, setP] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()
  async function submit(e){
    e.preventDefault()
    try{
      const { data } = await axios.post('/login', { username, password })
      localStorage.setItem('token', data.token)
      nav('/dashboard')
    }catch(x){
      setErr(x.response?.data?.error || 'Error')
    }
  }
  return (
    <div className="box">
      <h2>Login</h2>
      {err && <p style={{color:'red'}}>{err}</p>}
      <form onSubmit={submit}>
        <div><input placeholder="Username" value={username} onChange={e=>setU(e.target.value)} /></div>
        <div><input type="password" placeholder="Password" value={password} onChange={e=>setP(e.target.value)} /></div>
        <button>Login</button>
      </form>
      <p>No account? <Link to="/register">Register</Link></p>
    </div>
  )
}
