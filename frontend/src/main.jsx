+import React from 'react';
+import { DragDropContext } from 'react-beautiful-dnd';
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import StatRunes   from './pages/StatRunes';
import Inventory   from './pages/Inventory';


axios.defaults.baseURL = '/api';
axios.interceptors.request.use(config=>{
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = 'Bearer ' + token
  return config
})

const elem = (
    function AppDragWrapper({ children }) {
      function onDragEnd(result) {
        /* we’ll forward to a page-local handler via window */
        window.dispatchEvent(new CustomEvent('dnd', { detail: result }));
      }
      return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>;
    }

<BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/inventory/:stat" element={<StatRunes />} />

    </Routes>
  </BrowserRouter>
)

createRoot(document.getElementById('root')).render(elem)
