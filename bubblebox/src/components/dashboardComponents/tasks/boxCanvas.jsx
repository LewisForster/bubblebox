import "./taskCSS/boxCanvas.css";
import { Stage, Layer, Circle } from 'react-konva';
import { useEffect, useLayoutEffect, useState } from 'react';
import TaskComponent from "./taskComponent";
import Konva from 'konva';


function useWindowSize(){
    const [size, setSize] = useState([window.innerWidth,window.innerHeight]);
    useEffect(()=>{
      function updateSize(){
        setSize([window.innerWidth, window.innerHeight]);
        console.log("resized")
      }
      window.addEventListener('resize',updateSize);

      return() => window.removeEventListener('resize',updateSize)
    },[]);
    return size; // https://stackoverflow.com/a/19014495
  }




const BoxCanvas = ({taskList}) => {
  const [position, setPosition] = useState({ x: window.innerWidth / 4, y: window.innerHeight / 4 });
  const [windowWidth, windowHeight] = useWindowSize()

  



  const width = windowWidth / 1.15;
  const height = windowHeight / 1.25

  

  return (
    <Stage width={width} height={height} className="hi">
      <Layer>
        {taskList.map(item=>(
          <TaskComponent key={item.task_id}
         task_size ={item.task_size}
         task_name={item.task_name}
         task_colour={item.task_colour}
         stage_width={width}
         stage_height={height}></TaskComponent>
        ))}
        
      </Layer>
    </Stage>

  );
};

export default BoxCanvas;
