import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext } from 'react-beautiful-dnd';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Inventory from './pages/Inventory';
import StatRunes from './pages/StatRunes';

axios.defaults.baseURL = '/api';
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

function AppDragWrapper({ children }) {
    function onDragEnd(result) {
        // forward DnD events to any page that cares
        window.dispatchEvent(new CustomEvent('dnd', { detail: result }));
    }
    return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>;
}

const root = createRoot(document.getElementById('root'));
root.render(
    <AppDragWrapper>
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
    </AppDragWrapper>
);