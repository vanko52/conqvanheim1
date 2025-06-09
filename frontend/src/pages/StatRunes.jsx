// ── StatRunes.jsx  (list page) ──────────────────────────────
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function StatRunes() {
    const { stat } = useParams();
    const [inv, setInv] = useState([]);
    const [eq,  setEq]  = useState([]);

    const refresh = () => {
        axios.get('/me').then(r => setInv(r.data.inventory));
        axios.get('/equipment').then(r => setEq(r.data));
    };
    useEffect(refresh , []);

    const equip   = id => axios.post('/equip',   { inventoryId:id }).then(refresh);
    const unequip = ()  => axios.post('/unequip', { slot:stat }).then(refresh);

    const equippedId = eq.find(e => e.slot === stat)?.inventoryId;
    const list = inv.filter(i => i.rune.stat === stat);

    return (
        <div className="box">
            <h2>{stat.toUpperCase()} Runes</h2>

            {list.map(i => (
                <div key={i.id}>
                    {i.rune.rarity.toUpperCase()} +{i.rune.value}{' '}
                    {i.id === equippedId
                        ? <button onClick={unequip}>Unequip</button>
                        : <button onClick={() => equip(i.id)}>Equip</button>}
                </div>
            ))}

            {!list.length && <p>(You don’t own any {stat} runes yet.)</p>}
            <p><Link to="/inventory">← Back</Link></p>
        </div>
    );
}
