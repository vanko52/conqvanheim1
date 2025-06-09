// StatRunes.jsx ─── drag-sources
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function StatRunes() {
    const { stat } = useParams();
    const nav  = useNavigate();
    const [inv, setInv] = useState([]);
    const [eq,  setEq]  = useState([]);

    const refresh = () => {
        axios.get('/me').then(r=> setInv(r.data.inventory));
        axios.get('/equipment').then(r=> setEq(r.data));
    };
    useEffect(refresh, []);

    const equippedId = eq.find(e=>e.slot===stat)?.inventoryId;
    const list = inv.filter(i=> i.rune.stat === stat);

    async function onDrop(res){
        if (!res.destination) return;
        if (res.destination.droppableId === 'trash'){
            // unequip by dropping on header
            await axios.post('/unequip', { slot: stat });
        }
        refresh();
    }

    return (
        <div className="box">
            <h2>{stat.toUpperCase()} Runes</h2>

            <DragDropContext onDragEnd={onDrop}>
                <Droppable droppableId="trash">
                    {(prov)=>(
                        <div ref={prov.innerRef} style={{minHeight:10}}>
                            <em>Drag here to unequip</em>
                            {prov.placeholder}
                        </div>
                    )}
                </Droppable>

                <Droppable droppableId="list">
                    {(prov)=>(
                        <div ref={prov.innerRef} style={{maxHeight:300, overflowY:'auto', border:'1px solid #000', padding:6}}>
                            {list.map((it,idx)=>(
                                <Draggable key={it.id} draggableId={String(it.id)} index={idx}>
                                    {(p)=>(
                                        <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}
                                             className={`rune-pill ${it.rune.rarity} ${it.id===equippedId?'equipped':''}`}>
                                            {it.rune.rarity.toUpperCase()} +{it.rune.value}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {prov.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <p><Link to="/inventory">← Back</Link></p>
        </div>
    );
}
