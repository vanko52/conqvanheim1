import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function StatRunes() {
    const { stat } = useParams();
    const [inv, setInv] = useState([]);
    const [eq, setEq] = useState([]);
    const [toast, setToast] = useState('');
    const [shake, setShake] = useState(false);

    const refresh = () => {
        axios.get('/me').then(r => setInv(r.data.inventory));
        axios.get('/equipment').then(r => setEq(r.data));
    };

    useEffect(() => {
        refresh();
        const handler = e => onDragEnd(e.detail);
        window.addEventListener('dnd', handler);
        return () => window.removeEventListener('dnd', handler);
    }, []);

    const equipped = eq.find(e => e.slot === stat);
    const stash = inv.filter(i => i.rune.stat === stat && i.id !== equipped?.inventoryId);

    async function onDragEnd(res) {
        if (!res.destination) return;

        const src = res.source.droppableId;
        const dst = res.destination.droppableId;
        const id = Number(res.draggableId);

        try {
            if (src === 'list' && dst === 'slot') {
                if (equipped) {
                    setToast('Only one rune can be equipped at a time!');
                    setShake(true);
                    setTimeout(() => setShake(false), 400);
                    return;
                }
                await axios.post('/equip', { inventoryId: id });
            }
            if (src === 'slot' && dst === 'list') {
                await axios.post('/unequip', { slot: stat });
            }
            refresh();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="box">
            <h2>{stat.toUpperCase()} Runes</h2>
            {toast && <p style={{ color: 'red' }}>{toast}</p>}

            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Droppable droppableId="list">
                        {(prov) => (
                            <div
                                ref={prov.innerRef}
                                {...prov.droppableProps}
                                style={{ width: 180, maxHeight: 300, overflowY: 'auto', border: '1px solid #000', padding: 6 }}
                            >
                                <strong>Stash</strong>
                                {stash.map((it, idx) => (
                                    <Draggable key={it.id} draggableId={String(it.id)} index={idx}>
                                        {(p) => (
                                            <div
                                                ref={p.innerRef}
                                                {...p.draggableProps}
                                                {...p.dragHandleProps}
                                                className={`rune-pill ${it.rune.rarity}`}
                                            >
                                                {it.rune.rarity.toUpperCase()} +{it.rune.value}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {prov.placeholder}
                            </div>
                        )}
                    </Droppable>

                    <Droppable droppableId="slot">
                        {(prov) => (
                            <div
                                ref={prov.innerRef}
                                {...prov.droppableProps}
                                className={`slot-square ${stat} ${shake ? 'shake' : ''}`}
                                style={{ width: 180, height: 180 }}
                            >
                                <strong>Equipped</strong>
                                {equipped && (
                                    <Draggable draggableId={String(equipped.inventoryId)} index={0}>
                                        {(p) => (
                                            <div
                                                ref={p.innerRef}
                                                {...p.draggableProps}
                                                {...p.dragHandleProps}
                                                className={`rune-pill ${equipped.inventory.rune.rarity} equipped`}
                                            >
                                                {equipped.inventory.rune.rarity.toUpperCase()} +{equipped.inventory.rune.value}
                                            </div>
                                        )}
                                    </Draggable>
                                )}
                                {prov.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>

            <p>
                <Link to="/inventory">← Back</Link>
            </p>
        </div>
    );
}
