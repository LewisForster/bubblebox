import * as React from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Stage, Layer, Circle } from 'react-konva';
import { useLayoutEffect, useState } from 'react';


function CircleCollision({c1,c2}){
    const xcheck = c1.x() - c2.x();
    const ycheck = c1.y()-c2.y();

}

function TaskComponent({task_size, task_name, task_colour, stage_width, stage_height}){
    const [position, setPosition] = useState({ x: window.innerWidth / 8, y: window.innerHeight / 8 });
    console.log(task_size)
    const radius = task_size
    return(
        <Circle
        x={500}
        y={500}
        radius={radius}
        fill={task_colour}
        stroke="black"
        strokeWidth={4}
        draggable
        dragBoundFunc={(pos)=>{
            const newX = Math.max(radius, Math.min(pos.x,(stage_width-radius)))
            const newY = Math.max(radius, Math.min(pos.y,(stage_height-radius)))

            return{
                x:newX,
                y:newY
            }
        }}
        onMouseEnter={(e, )=>{
            document.body.style.cursor='pointer';
        }}
        onMouseLeave={(e, )=>{
            document.body.style.cursor='default';
        }}
        onDragEnd={(e, )=>{
            setPosition({
                x: e.target.x(),
                y: e.target.y()
            })
        }}

        >

        </Circle>
            )
        }
export default TaskComponent;