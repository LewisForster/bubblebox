import * as React from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Matter from 'matter-js';
import { useLayoutEffect, useState } from 'react';
import { render } from 'ejs';
import "./taskCSS/boxCanvas.css"




function TaskComponent(item, width, height,boxRef){

    const posx = (Math.random()*width)-item.task_size
    const posy = (Math.random()*height)-item.task_size
    const taskName = item.task_name
    const e1 = document.createElement("div")
    e1.style.position = 'absolute'
    let added = false;

    const circW = boxRef.current.offsetWidth;
    const circH = boxRef.current.offsetHeight;

    if (!added){
        e1.textContent = taskName
        boxRef.current.appendChild(e1)
        added = true
    }

    const item1 = {
        x: posx,
        y: posy,
        body: Matter.Bodies.circle(posx,posy,item.task_size, {frictionAir:0.05, friction:0.1, restitution:0.5, inertia:Infinity, density: 1, render:{fillStyle:item.task_colour, text:{content:"Test",color:"blue",size:16,family:"Papyrus"}}}),
        elem: e1,
        render(){
            const x = this.body.position.x
            const y = this.body.position.y

            this.elem.style.top = `${y-10}px`
            this.elem.style.left = `${x-15}px`
            

        
        }
        
    
    }

    // https://stackoverflow.com/a/72849141
    // https://stackoverflow.com/a/65354225

    // both links used for logic behind this - changed to fit my code more
    // appending divs works, but is the reason why there's phantom text in the background
    
   return item1;
}

// just returns an object which is put into an array which can be mapped over - will update to incorporate more of the DB info - but this is bare min. rn
export default TaskComponent;