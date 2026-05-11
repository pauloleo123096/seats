import React, { useState } from 'react';
import { Stage, Layer, Rect, Text, Group } from 'react-konva';

export default function SeatCanvas() {
  // Sample state simulating our database load for a client organization
  const [deskPods, setDeskPods] = useState([
    {
      id: 'pod-1',
      x: 100,
      y: 100,
      config: '2x2', // 2 columns, 2 rows facing each other
      desks: [
        { id: 'd1', label: 'Seat 1', status: 'available' },
        { id: 'd2', label: 'Seat 2', status: 'occupied', employee: 'Alex M.' },
        { id: 'd3', label: 'Seat 3', status: 'rest-day' },
        { id: 'd4', label: 'Seat 4', status: 'broken' },
      ],
    },
  ]);

  const deskWidth = 80;
  const deskHeight = 50;
  const padding = 5;

  // Helper to assign visual states based on our database constraints
  const getDeskColor = (status) => {
    switch (status) {
      case 'available': return '#10B981'; // Emerald Green
      case 'occupied': return '#3B82F6';  // Blue
      case 'rest-day': return '#9CA3AF';  // Grayed out
      case 'broken': return '#EF4444';    // Red
      default: return '#D1D5DB';
    }
  };

  // Handles updating coordinates in state when an admin drags a pod
  const handleDragEnd = (index, e) => {
    // Implement 20px grid snapping for clean office aisles
    const snappedX = Math.round(e.target.x() / 20) * 20;
    const snappedY = Math.round(e.target.y() / 20) * 20;

    const updatedPods = [...deskPods];
    updatedPods[index] = { ...updatedPods[index], x: snappedX, y: snappedY };
    setDeskPods(updatedPods);
    
    // Future API Hook: axios.post('/api/update-coordinates', { id: pod.id, x: snappedX, y: snappedY })
  };

  return (
    <div className="w-full bg-slate-50 border rounded-lg overflow-hidden">
      <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
        <h3 className="font-bold">Live Floor Plan Editor</h3>
        <span className="text-xs bg-slate-700 px-2 py-1 rounded">Grid Snapping: Active (20px)</span>
      </div>
      
      <Stage width={800} height={500} className="cursor-grab active:cursor-grabbing">
        <Layer>
          {deskPods.map((pod, podIndex) => (
            <Group
              key={pod.id}
              x={pod.x}
              y={pod.y}
              draggable
              onDragEnd={(e) => handleDragEnd(podIndex, e)}
            >
              {/* Render 2x2 Configuration */}
              {pod.desks.map((desk, deskIndex) => {
                // Calculate grid positions for 2x2 layout
                const col = deskIndex % 2;
                const row = Math.floor(deskIndex / 2);
                
                const posX = col * (deskWidth + padding);
                const posY = row * (deskHeight + padding);

                return (
                  <Group key={desk.id} x={posX} y={posY}>
                    <Rect
                      width={deskWidth}
                      height={deskHeight}
                      fill={getDeskColor(desk.status)}
                      cornerRadius={4}
                      shadowColor="black"
                      shadowBlur={2}
                      shadowOpacity={0.1}
                    />
                    <Text
                      text={desk.status === 'occupied' ? desk.employee : desk.label}
                      width={deskWidth}
                      height={deskHeight}
                      align="center"
                      verticalAlign="middle"
                      fill="white"
                      fontSize={11}
                      fontFamily="sans-serif"
                      fontStyle="bold"
                    />
                  </Group>
                );
              })}
            </Group>
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
