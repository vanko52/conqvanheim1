// Inventory.jsx  ─── drag-targets
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const stats = ['length','thickness','power','divinity','vitality','strength'];

export default function Inventory() {
    const nav = useNavigate();
    const [eq, setEq] = useState([]);

    const load = () =>
        axios.get('/equipment').then(r => setEq(r.data))
            .catch(()=> nav('/login'));

    useEffect(load, []);

    const equippedFor = slot => eq.find(e => e.slot === slot);

    /** handle drops coming from StatRunes */
    async function onDrop(result){
        if (!result.destination) return;
        const { droppableId, draggableId } = result;
        const destSlot = droppableId;             // slot name
        const invId    = Number(draggableId);     // rune inventory id
        await axios.post('/equip', { inventoryId: invId });
        load();
    }

    return (
        <div className="box">
            <h2>Rune Slots</h2>

            <DragDropContext onDragEnd={onDrop}>
                <div className="slot-grid">
                    {stats.map(slot => {
                        const equipped = equippedFor(slot);
                        return (
                            <Droppable key={slot} droppableId={slot}>
                                {(prov, snap)=>(
                                    <div ref={prov.innerRef}
                                         {...prov.droppableProps}
                                         className={`slot-square ${slot}`}
                                         style={snap.isDraggingOver ? {borderColor:'red'} : null}
                                         onClick={()=> nav(`/inventory/${slot}`)}>
                                        <strong>{slot.toUpperCase()}</strong>
                                        {equipped
                                            ? <span>{equipped.inventory.rune.rarity.toUpperCase()} +{equipped.inventory.rune.value}</span>
                                            : <span>(empty)</span>}
                                        {prov.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        );
                    })}
                </div>
            </DragDropContext>

            <p><Link to="/dashboard">Back</Link></p>
        </div>
    );
}
