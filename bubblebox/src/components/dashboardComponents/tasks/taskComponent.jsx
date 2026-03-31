import * as React from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Matter from 'matter-js';
import { useLayoutEffect, useState } from 'react';
import { render } from 'ejs';
import "./taskCSS/boxCanvas.css"
import { ThumbUpSharp } from '@mui/icons-material';




function TaskComponent(item, width, height,boxRef,added){

    const posx = (Math.random()*width)-item.task_size
    const posy = (Math.random()*height)-item.task_size
    const taskName = item.task_name
    const e1 = document.createElement("div")
    e1.style.position = 'absolute'
    


    


    

    const item1 = {
        x: posx,
        y: posy,
        taskName: taskName,
        body: Matter.Bodies.circle(posx,posy,item.task_size/(height/1200),  {label: item.task_id, frictionAir:0.05, friction:0.1, restitution:0.5, inertia:Infinity, density: 1, render:{fillStyle:item.task_colour, text:{content:"Test",color:"blue",size:16,family:"Papyrus"}}}),
        element: e1, //  my screen height is read as 1045.6 by the app - divided by random numbers, /1200 looks on on my screen, havent tested on other heights. 
        added:false,
        render(){
            const x = this.body.position.x
            const y = this.body.position.y

            this.element.style.top = `${y-10}px`
            this.element.style.left = `${x-15}px` // attempt at centering text
            this.element.style.fontSize = `${Math.sqrt(item.task_size)*2}px` // attempt to scale text based on size of task - looks ok for now.
            

        
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