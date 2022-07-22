import React, { Component, useEffect, useState } from 'react';
import './App.css';
const SPEED = .5;
const MIN_SPEED = 3;
const MAX_SPEED = 7;
const BOARD_SIZE = 15;
const snake_Init = [[2,4]];
const APPLE_POS = [7,7];

const MOVES = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];

let moveDirection = 'ArrowRight';
function App() {
  const [board,setBoard] = useState(
    new Array(BOARD_SIZE).fill(0).map(cell=>new Array(BOARD_SIZE).fill(0))
  )
  const [snake,setSnake] = useState(snake_Init);
  // const [moveDirection,setMoveDirection] = useState("ArrowRight");
  const [applePos,setApplePos] = useState(APPLE_POS);
  const [gameOver,setGameOver] = useState(false);
  const [range,setRange] = useState((MAX_SPEED/10));
  const [score,setScore] = useState(1);


  const renderBoard = board.map((row,rowIndx)=>{
    return (
    <div key={rowIndx} className="row">
      {row.map((column,colIndx)=> (
        column==0?(<div key={colIndx} className="column non-active">{}</div>):
        column==1?(<div key={colIndx} className="column active">{}</div>)
        :(<div key={colIndx} className="column apple">{}</div>)
        
      ))}
    </div>)
    })

  function resetGame(){
    setSnake(snake_Init)
    setApplePos(applePos)
    setBoard(new Array(BOARD_SIZE).fill(0).map(cell=>new Array(BOARD_SIZE).fill(0)))
    setGameOver(false)
    setScore(0)
  }

  useEffect(()=>{
    // GamerOver
  if(gameOver){
    resetGame()
  }

  const intervalId = setInterval(() => {
    let b = new Array(BOARD_SIZE).fill(0).map(cell=>new Array(BOARD_SIZE).fill(0))
    const snakePos = [...snake]
    
    let addLength = false;
    // Next Snake Move
    snakePos.push(nextMoveSnake(snakePos[snakePos.length-1],moveDirection))
    const head = snakePos[snakePos.length-1];

    let overlap = false;
    snakePos.slice(0,snakePos.length-1).forEach(([x,y])=>{
      if(x==head[0] && y==head[1]){
        overlap=true
      }
    })
    // If overlap , game over
    if(overlap){
      setGameOver(true)
    }
    // If head out of bounds , game over
    if(head[0]<0 || head[0]>BOARD_SIZE-1 || head[1]<0 || head[1]>BOARD_SIZE-1){
      setGameOver(true)
    }
    else{

      // Ate apple
      if(applePos!=null && head[0] == applePos[0] && head[1] == applePos[1] ){
        setScore(prev=>prev+1)
        addLength = true;
        setApplePos(null);
        const apple = document.querySelector('.apple')
        apple.className = "column active"
      }
      snakePos.forEach((pos,index)=>{
        
        if(index!=0 || addLength){
          const [x,y] = pos;
          b[x][y] = 1
        }
  
      })
  
  
  
      if(applePos!=null){
        
        b[applePos[0]][applePos[1]] = 2;
      }
      else{
          const x = Math.floor(Math.random()*BOARD_SIZE)
          const y = Math.floor(Math.random()*BOARD_SIZE)
          setApplePos([x,y])
      }
      
      setBoard([...b])
      !addLength?setSnake(snakePos.slice(1)):setSnake(snakePos)
      
    }
    
  }, range*1000);

  window.addEventListener('keydown',e=>{
    const key = e.code
    if(MOVES.includes(key)){
      // setMoveDirection(key)
      moveDirection = key
    }
  })

  return ()=> clearInterval(intervalId);

  

  },[moveDirection,board,gameOver])
  
  function changeRange(event){
    console.log(event)
    setRange(event.target.value/10)
  }

  return (
    <div className="Board">
      {
        renderBoard
      }
      <div className="score">{score}</div>
      <div className="sliderange">
        <input type="range" min={MIN_SPEED} max={MAX_SPEED} onChange={(e)=>changeRange(e)}/>
      </div>
    </div>
  );
}

function nextMoveSnake(pos,direction){
  const [x,y] = pos;
  if(direction=="ArrowUp"){
   return [x-1,y]; 
  }
  if(direction=="ArrowDown"){
    return [x+1,y]; 
  }
  if(direction=="ArrowLeft"){
    return [x,y-1]; 
  }
  if(direction=="ArrowRight"){
    return [x,1+y]; 
  }
}

export default App;
