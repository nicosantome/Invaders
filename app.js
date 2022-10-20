"use strict";

const grid = document.querySelector(".grid");
const squares = grid.querySelectorAll("div");
let direction = 1;
let invadersId;
let goingRight = true;
const width = 20;
const messageDisplay = document.querySelector("h3");
let shooterIndex = 370;

let invadersArr = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 40, 41,
  42, 43, 44, 45, 46, 47, 48, 49,
];

//Draw Invaders
function drawInvaders() {
  for (let i = 0; i < invadersArr.length; i++) {
    squares[invadersArr[i]].classList.add("invader");
  }
}

//Remove Invaders
function removeInvaders() {
  for (let i = 0; i < invadersArr.length; i++) {
    squares[invadersArr[i]].classList.remove("invader");
  }
}

drawInvaders();

//Move Invaders
function moveInvaders() {
  let rightEdge = invadersArr[invadersArr.length - 1] % width === width - 1;
  let leftEdge = invadersArr[0] % width === 0;
  removeInvaders();
  //Invaders going right
  if (rightEdge && goingRight) {
    direction = -1;
    goingRight = false;
    for (let i = 0; i < invadersArr.length; i++) {
      invadersArr[i] += width + 1;
    }
  }
  //Invaders going left
  if (leftEdge && !goingRight) {
    direction = 1;
    goingRight = true;
    for (let i = 0; i < invadersArr.length; i++) {
      invadersArr[i] += width - 1;
    }
  }

  for (let i = 0; i < invadersArr.length; i++) {
    invadersArr[i] += direction;
  }
  drawInvaders();
  //Game Over when Invaders touch ground
  if (
    squares[squares.length - 1].classList.contains("invader") ||
    squares[shooterIndex].classList.contains("invader")
  ) {
    clearInterval(invadersId);
    messageDisplay.textContent = "Game Over";
  }
}

//Shooter draw and movement
squares[shooterIndex].classList.add("shooter");

function moveShooter(e) {
  squares[shooterIndex].classList.remove("shooter");
  switch (e.key) {
    case "ArrowLeft":
      if (shooterIndex % width !== 0) shooterIndex -= 1;
      break;

    case "ArrowRight":
      if (shooterIndex % width !== width - 1) shooterIndex += 1;
      break;
  }

  squares[shooterIndex].classList.add("shooter");
}

document.addEventListener("keydown", moveShooter);

//Hit
function hit() {}
//Shoot function
function shoot(e) {
  let laserId;
  let laserIndex = shooterIndex;
  function laserUp() {
    console.log(laserIndex);
    squares[laserIndex].classList.remove("laser");
    laserIndex -= width;
    if (laserIndex > 0) {
      squares[laserIndex].classList.add("laser");

      //Hit
      if (squares[laserIndex].classList.contains("invader")) {
        clearInterval(laserId);
        squares[laserIndex].classList.remove("laser");
        squares[laserIndex].classList.remove("invader");
        squares[laserIndex].classList.add("boom");
        invadersArr.splice(invadersArr.indexOf(laserIndex), 1);
        setTimeout(() => {
          squares[laserIndex].classList.remove("boom");
        }, 100);
        //Win the game
        if (invadersArr.length == 0) {
          clearInterval(invadersId);
          messageDisplay.textContent = "You Won";
        }
      }
    } //Miss
    else if (laserIndex < 0) {
      clearInterval(laserId);
    }
  }

  switch (e.key) {
    case "ArrowUp":
      laserId = setInterval(laserUp, 50);
  }
}
document.addEventListener("keydown", shoot);

//Move Invaders repetition in time
invadersId = setInterval(moveInvaders, 500);
