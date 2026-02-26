import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import TaskComponent from "./taskComponent";
import Matter from 'matter-js';
import "./taskCSS/boxCanvas.css"




const BoxCanvas = ({taskList}) => {
  const [windowWidth, windowHeight] = useWindowSize()
  const width = windowWidth / 1.15;
  const height = windowHeight / 1.25
  

 const engineRef = useRef(null);
 const boxRef = useRef(null);
 const stepRef=useRef(null);
 const stepRef2 = useRef(null);




  useEffect(()=>{
    let Engine = Matter.Engine;
    let Render = Matter.Render;
    let World = Matter.World;
    let Bodies = Matter.Bodies;
    let Runner = Matter.Runner;
    let MouseConstraint = Matter.MouseConstraint;
    let Mouse = Matter.Mouse;
    let Composite = Matter.Composite;
    let Events = Matter.Events

    engineRef.current = Engine.create({gravity: {y:0}});

    let render = Render.create({
      
      element: boxRef.current,
      engine: engineRef.current,
      options:{
        width: (windowWidth/1.15),
        height: (windowHeight/1.25),
        background: 'rgba(255, 239, 219, 0.5)',
        wireframes: false,
        showVelocity:true,
        pixelRatio: window.devicePixelRatio
      },
    })

    render.canvas.style.position = 'absolute';
    render.canvas.style.top = '0';
    render.canvas.style.left = '0';

    const width = render.options.width
    const height = render.options.height; // https://www.youtube.com/watch?v=dbPixrR9mSw - Given up on trying to get resizing to work for now

    

    
    const wall1 = Bodies.rectangle((width/2),0,width,50,{isStatic:true}) // roof
    const floor = Bodies.rectangle((width/2),height,width,50,{isStatic:true}) // floor 
    const wall3 = Bodies.rectangle((width),(height/2),50,height,{isStatic:true}) //right wall
    const wall4 = Bodies.rectangle(0,(height/2),50,height,{isStatic:true}) //l wall


    
    const taskBodies = taskList.map(item=>
      TaskComponent(item, width,height,boxRef))
      
      console.log("tASKBODIES", taskBodies)

  if (engineRef && engineRef.current.world){
  Matter.Composite.add(engineRef.current.world,[wall1,floor,wall3,wall4]); 
  }

  taskBodies.forEach((taskItem) =>{


    Matter.Composite.add(engineRef.current.world, taskItem.body) // Won't accept taskBodies as a nested array -> can only add item looping over the taskbodies array
    console.log(taskItem)



    console.log("hi") 

})





  Render.run(render);
  const delta = 1000 / 60;
  const subSteps = 3;
  const subDelta = delta / subSteps;

  (function run() {
    stepRef.current = window.requestAnimationFrame(run);
    for (let i = 0; i < subSteps; i += 1) {
      Engine.update(engineRef.current, subDelta);
    }
    taskBodies.forEach(taskItem => taskItem.render()); // calling the render function for each taskItem - tracking where the text is - keeping it centred on the bubble
  })(); // this is the only code that has worked to stop things going through walls
  // https://github.com/liabru/matter-js/issues/5#issuecomment-1050738814
  


 
  
  
  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engineRef.current,{
    mouse: mouse,
    constraint:{
      stiffness: 0.2,
      render:{
        visible:false
      }
    }
  }); 
  
  

  Composite.add(engineRef.current.world,mouseConstraint);
  

  render.mouse = mouse;

  Render.lookAt(render,{
    min:{x:0, y:0},
    max: {x:width, y:height}
  })

  

  let dragBody = null;


      const limitMaxSpeed = (event) => {
      event.source.world.bodies.forEach((body) => {
        let maxSpeed = 10
        Matter.Body.setVelocity(body, {
          x: Math.min(maxSpeed, Math.max(-maxSpeed, body.velocity.x)),
          y: Math.min(maxSpeed, Math.max(-maxSpeed, body.velocity.y)),
        })
      }) 
    }
    Events.on(engineRef.current, 'beforeUpdate', limitMaxSpeed) // more code that stops tunnelling (phasing through walls)
    // https://github.com/liabru/matter-js/issues/840#issuecomment-1881080841
  



  
Events.on(mouseConstraint, 'startdrag', (e)=>{
  dragBody = e.body
 })

 






  return() =>{
    Render.stop(render);
    Engine.clear(engineRef.current);
    World.clear(engineRef.current.world);
    render.canvas.remove();
    render.canvas = null;
    render.context=null;
    render.textures={};
    window.cancelAnimationFrame(stepRef.current)
    window.cancelAnimationFrame(stepRef2.current)
  }

  
  
},[taskList]);


return (
  <div className='center' id="test"
  ref={boxRef}
  ></div> //https://github.com/liabru/matter-js/blob/master/examples/airFriction.js
)
  

  // useEffect(()=>{
  //   if (scene && boxRef.current){
  //     const {width: w, height: h} =  boxRef.current.getBoundingClientRect();
  //     const containerWidth = (w/1.15)
  //     const containerHeight=(h/1.25)

      

  //     scene.bounds.max.x = containerWidth;
  //     scene.bounds.max.y = containerHeight;
  //     scene.options.width = containerWidth;
  //     scene.options.height = containerHeight;
  //     scene.canvas.width = containerWidth;
  //     scene.canvas.height = containerHeight;

  //     const floor = scene.engine.world.bodies[0];


  //     Matter.Body.setPosition(floor,{
  //       x:containerWidth / 2,
  //       y: containerHeight + STATIC_DENSITY /2,
  //     })

  //     Matter.Body.setVertices(floor,[
  //       {x:0, y: containerHeight},
  //       { x: containerWidth, y: containerHeight },
  //       { x: containerWidth, y: containerHeight + STATIC_DENSITY },
  //       { x: 0, y: containerHeight + STATIC_DENSITY },
  //     ])
  // }
  // }, [windowWidth, windowHeight, scene,])  // https://www.paulie.dev/posts/2020/08/react-hooks-and-matter-js/


}


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




export default BoxCanvas;