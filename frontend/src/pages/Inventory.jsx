// ── Inventory.jsx  (slot-grid page) ─────────────────────────
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const stats = ['length','thickness','power','divinity','vitality','strength'];

export default function Inventory() {
    const [eq, setEq] = useState([]);

    useEffect(() => {
        axios.get('/equipment').then(r => setEq(r.data));
    }, []);

    const equippedFor = slot => eq.find(e => e.slot === slot);

    return (
        <div className="box">
            <h2>Rune Slots</h2>

            <div className="slot-grid">
                {stats.map(slot => {
                    const e = equippedFor(slot);
                    return (
                        <Link key={slot} to={`/inventory/${slot}`} className="slot-square">
                            <strong>{slot.toUpperCase()}</strong>
                            {e
                                ? <span>{e.inventory.rune.rarity.toUpperCase()} +{e.inventory.rune.value}</span>
                                : <span>(empty)</span>}
                        </Link>
                    );
                })}
            </div>

            <p><Link to="/dashboard">Back</Link></p>
        </div>
    );
}
