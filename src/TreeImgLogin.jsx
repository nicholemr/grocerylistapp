import React, { Component } from 'react';
import tree1 from "./img/tree1.png"
import { useSpring, animated } from 'react-spring';
// import './styles.css';

const calc = (x, y) => [-(y - window.innerHeight / 2) / 40, (x - window.innerWidth / 2) / 40, 1]
const trans = (x, y, s) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`


function TreeImgLogin(){
    const [props, set] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 5, tension: 150, friction: 40 } }))

    return (
        <animated.div
          class="tree-login"
          onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
          onMouseLeave={() => set({ xys: [0, 0, 1] })}
          style={{ transform: props.xys.interpolate(trans) }}>
            <img alt='tree' src={tree1}></img>
        </animated.div>
      )

} 


// const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2]
// const trans = (x, y) => `translate3d(${x / 10}px,${y / 10}px,0)`

// function TreeImg(){
//     const [props, set] = useSpring(() => ({ xy: [0, 0], config: { mass: 10, tension: 550, friction: 140 } }))

//     return (
//         <animated.div
//           class="right"
//           onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}
//         //   onMouseLeave={() => set({ xys: [0, 0, 1] })}
//           style={{ transform: props.xy.interpolate(trans) }}>
//             <img alt='tree' src={tree1}></img>
//         </animated.div>
//       )

// } 
// function TreeImg(){

//     return (
//         <div
//           class="right">
//             <img alt='tree' src={tree1}></img>
//         </div>
//       )

// } 

export default TreeImgLogin;





// <div className="right">
// <img src={tree1}></img>
// </div>