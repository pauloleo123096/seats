'use client';
import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Text, Group } from 'react-konva';

const GRID_SIZE = 20;
const DESK_WIDTH = 60;
const DESK_HEIGHT = 40;

const STATE_COLORS = {
  AVAILABLE: '#10B981', 
  OCCUPIED: '#3B82F6',  
  REST_DAY: '#9CA3AF',  
  BROKEN: '#EF4444',    
};

export default function SeatCanvas({ initialDesks = [] }) {
  const [desks, setDesks] = useState(initialDesks);
  const [macroCommand, setMacroCommand] = useState('');
  const stageRef = useRef(null);

  const handleGenerate = () => {
    if (macroCommand === '2x2') {
      const newGroupId = `pod-${Date.now()}`;
      const newDesks = [
        { id: `d1-${Date.now()}`, podId: newGroupId, x: 0, y: 0, status: 'AVAILABLE', rotation: 180 },
        { id: `d2-${Date.now()}`, podId: newGroupId, x: DESK_WIDTH, y: 0, status: 'AVAILABLE', rotation: 180 },
        { id: `d3-${Date.now()}`, podId: newGroupId, x: 0, y: DESK_HEIGHT, status: 'AVAILABLE', rotation: 0 },
        { id: `d4-${Date.now()}`, podId: newGroupId, x: DESK_WIDTH, y: DESK_HEIGHT, status: 'AVAILABLE', rotation: 0 },
      ];
      setDesks([...desks, ...newDesks]);
    }
  };

  const handleDragEnd = (e, podId) => {
    const group = e.target;
    const snapX = Math.round(group.x() / GRID_SIZE) * GRID_SIZE;
    const snapY = Math.round(group.y() / GRID_SIZE) * GRID_SIZE;
    group.position({ x: snapX, y: snapY });
  };

  const getDeskColor = (status) => {
    return STATE_COLORS[status.toUpperCase()] || STATE_COLORS.AVAILABLE;
  };

  const pods = desks.reduce((acc, desk) => {
    if (!acc[desk.podId]) acc[desk.podId] = [];
    acc[desk.podId].push(desk);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ padding: '16px', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '16px' }}>
        <input 
          type="text" 
          placeholder="e.g. 2x2"
          style={{ border: '1px solid #d1d5db', borderRadius: '4px', padding: '8px 12px' }}
          value={macroCommand}
          onChange={(e) => setMacroCommand(e.target.value)}
        />
        <button 
          onClick={handleGenerate}
          style={{ backgroundColor: '#4f46e5', color: 'white', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', border: 'none' }}
        >
          Generate Layout
        </button>
      </div>

      <div style={{ flexGrow: 1, overflow: 'auto', backgroundColor: '#f3f4f6', backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        <Stage width={1200} height={800} ref={stageRef}>
          <Layer>
            {Object.keys(pods).map(podId => (
              <Group key={podId} draggable onDragEnd={(e) => handleDragEnd(e, podId)}>
                {pods[podId].map(desk => (
                  <Group key={desk.id} x={desk.x} y={desk.y} rotation={desk.rotation}>
                    <Rect
                      width={DESK_WIDTH - 2}
                      height={DESK_HEIGHT - 2}
                      fill={getDeskColor(desk.status)}
                      stroke={desk.status === 'BROKEN' ? '#B91C1C' : null}
                      strokeWidth={desk.status === 'BROKEN' ? 2 : 0}
                      cornerRadius={4}
                    />
                  </Group>
                ))}
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
