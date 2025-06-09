// Inventory.jsx  ── simple slot grid (no DragDropContext)
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const stats = ['length','thickness','power','divinity','vitality','strength'];

export default function Inventory() {
    const nav = useNavigate();
    const [eq, setEq] = useState([]);

    const load = () =>
        axios.get('/equipment').then(r => setEq(r.data))
            .catch(() => nav('/login'));

    useEffect(load, []);

    const equippedFor = slot => eq.find(e => e.slot === slot);

    return (
        <div className="box">
            <h2>Rune Slots</h2>

            <div className="slot-grid">
                {stats.map(slot => {
                    const equipped = equippedFor(slot);
                    return (
                        <div key={slot}
                             className={`slot-square ${slot}`}
                             onClick={() => nav(`/inventory/${slot}`)}>
                            <strong>{slot.toUpperCase()}</strong>
                            {equipped
                                ? <span>{equipped.inventory.rune.rarity.toUpperCase()} +{equipped.inventory.rune.value}</span>
                                : <span>(empty)</span>}
                        </div>
                    );
                })}
            </div>

            <p><Link to="/dashboard">Back</Link></p>
        </div>
    );
}
