import "./boxCanvas.css";
import { Stage, Layer, Circle } from 'react-konva';
import { useState } from 'react';

const BoxCanvas = () => {
  const [position, setPosition] = useState({ x: window.innerWidth / 4, y: window.innerHeight / 4 });

  return (
    <Stage width={(window.innerWidth/1.15)} height={(window.innerHeight / 1.25)} className="hi">
      <Layer>
        <Circle
          x={position.x}
          y={position.y}
          radius={70}
          fill="red"
          stroke="black"
          strokeWidth={4}
          draggable
          onMouseEnter={(e) => {
            document.body.style.cursor = 'pointer';
          }}
          onMouseLeave={(e) => {
            document.body.style.cursor = 'default';
          }}
          onDragEnd={(e) => {
            setPosition({
              x: e.target.x(),
              y: e.target.y()
            });
          }}
        />
      </Layer>
    </Stage>
  );
};

export default BoxCanvas;
