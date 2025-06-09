import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import axios from 'axios';

// Pages
import Login        from './pages/Login';
import Register     from './pages/Register';
import Dashboard    from './pages/Dashboard';
import Leaderboard  from './pages/Leaderboard';
import Inventory    from './pages/Inventory';
import StatRunes    from './pages/StatRunes';

// ── Axios base & token helper ──────────────────────────────
axios.defaults.baseURL = '/api';
axios.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// ── Global Drag & Drop wrapper ────────────────────────────
function AppDragWrapper({ children }) {
  const onDragEnd = result => {
    // Relay event so any page can handle it via `window.addEventListener('dnd', …)`
    window.dispatchEvent(new CustomEvent('dnd', { detail: result }));
  };
  return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>;
}

// ── React root ────────────────────────────────────────────
const root = createRoot(document.getElementById('root'));
root.render(
    <AppDragWrapper>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<Register />} />
          <Route path="/dashboard"   element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/inventory"         element={<Inventory />} />
          <Route path="/inventory/:stat"   element={<StatRunes />} />
        </Routes>
      </BrowserRouter>
    </AppDragWrapper>
);
