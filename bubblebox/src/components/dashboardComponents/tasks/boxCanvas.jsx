
import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import TaskComponent from "./taskComponent";
import Matter from 'matter-js';


const STATIC_DENSITY = 15;

const BoxCanvas = ({taskList}) => {
  const [windowWidth, windowHeight] = useWindowSize()
  const width = windowWidth / 1.15;
  const height = windowHeight / 1.25
  
  


 const sceneRef = useRef(null);
 const counterRef = useRef(null)


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

    let engine = Engine.create({gravity: {y:0}});

    let render = Render.create({
      
      element: sceneRef.current,
      engine: engine,
      options:{
        width: 800,
        height: 600,
        background: 'rgba(255, 22, 177, 0.5)',
        wireframes: false,
        showVelocity:true,
      },
    })

    const wall1 = Bodies.rectangle(400,0,800,50,{isStatic:true})
    const wall2 = Bodies.rectangle(400,600,800,50,{isStatic:true})
    const wall3 = Bodies.rectangle(800,300,50,600,{isStatic:true})
    const wall4 = Bodies.rectangle(0,300,50,600,{isStatic:true})


    const ball = Bodies.circle(200,100,60, {frictionAir:0.05, friction:0.1, restitution:0.5, inertia:Infinity, density: 1})
    const ball2 = Bodies.circle(200,100,60, {frictionAir:0.05, friction:0.1, restitution:0.5, inertia:Infinity, density: 1})
    
  Render.run(render);
  const runner = Runner.create();
  Runner.run(runner,engine);
  

  Composite.add(engine.world,[ball,ball2,wall1,wall2,wall3,wall4]);

  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engine,{
    mouse: mouse,
    constraint:{
      stiffness: 0.2,
      render:{
        visible:false
      }
    }
  });
  
  

  Composite.add(engine.world,mouseConstraint);

  render.mouse = mouse;

  Render.lookAt(render,{
    min:{x:0, y:0},
    max: {x:800, y:600}
  })


  let dragBody = null;

  Events.on(engine, 'beforeUpdate', ()=>{
     if (dragBody != null) {
        if (dragBody.velocity.x > 5.0) {
            Matter.Body.setVelocity(dragBody, {x: 5, y: dragBody.velocity.y });
                  console.log("1")
        }
        if (dragBody.velocity.y > 15.0) {
            Matter.Body.setVelocity(dragBody, {x: dragBody.velocity.x, y: 5 });
                  console.log("2")
        }
        if (dragBody.positionImpulse.x > 5.0) {
            dragBody.positionImpulse.x = 5.0;
                  console.log("3")
        }
        if (dragBody.positionImpulse.y > 5.0) {
            dragBody.positionImpulse.y = 5.0;
                  console.log("4") //https://stackoverflow.com/a/59404351
        }
    }
    console.log("null")
  })

  
 Events.on(mouseConstraint, 'startdrag', (e)=>{
  dragBody= e.body
 })



  // Events.on(engine,"afterUpdate", ()=>{
  //   const tasks = Composite.allBodies(engine.world);

  //   tasks.map(body =>{ 
  //     if (body.isStatic) return

  //     const {xMovement, yMovement} = body.velocity;
  //     const objVelocity = Math.sqrt((xMovement*xMovement)+(yMovement*yMovement)) // pythagorean theorem - using a velocity vector to calculate velocity (since its impossible to measure the distance or time)

  //     if (objVelocity > 1){
  //       Bodies.setVelocity(body, {
  //         x:x*(1/objVelocity),
  //         y:y*(1/objVelocity)
  //       })
  //     }
  //   }) //

  // })


  return() =>{
    Render.stop(render);
    Runner.stop(runner);
    Engine.clear(engine);
    render.canvas.remove();
    render.textures={};
  }

  
  
},[]);

return (
  <div
  ref={sceneRef}
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
  // }, [windowWidth, windowHeight, scene,])


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