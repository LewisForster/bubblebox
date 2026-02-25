import * as React from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Matter from 'matter-js';
import { useLayoutEffect, useState } from 'react';




function TaskComponent(item, width, height){

    return Matter.Bodies.circle(((Math.random()*width)-item.task_size), ((Math.random()*height)-item.task_size),item.task_size, {frictionAir:0.05, friction:0.1, restitution:0.5, inertia:Infinity, density: 1}) 
}

// just returns an object which is put into an array which can be mapped over - will update to incorporate more of the DB info - but this is bare min. rn
export default TaskComponent;