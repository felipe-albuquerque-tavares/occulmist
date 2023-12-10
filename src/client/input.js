// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import { updateDirection, updateKeys, updateClick } from './networking';

const keys = {
  KeyW: {
    pressed: false
  },
  KeyA: {
    pressed: false
  },
  KeyS: {
    pressed: false
  },
  KeyD: {
    pressed: false
  },
  Digit1:{
    pressed: false
  },
  Digit2:{
    pressed: false
  },
  Digit3:{
    pressed: false
  },
  Digit4:{
    pressed: false
  },
  Digit5:{
    pressed: false
  }
}

function onKeyInput(e) {
  const keyPressed = e.type == "keydown";
  const key = keys[e.code];

  if (key) {
    keys[e.code].pressed = keyPressed;
  }
}

setInterval(() => {
  if (keys.KeyW.pressed) {
    updateKeys("KeyW")
  }
  
  if (keys.KeyA.pressed) {
    updateKeys("KeyA")
  }

  if (keys.KeyS.pressed) {
    updateKeys("KeyS")
  }

  if (keys.KeyD.pressed) {
    updateKeys("KeyD")
  }
  if (keys.Digit1.pressed) {
    updateKeys("Digit1")
  }
  if (keys.Digit2.pressed) {
    updateKeys("Digit2")
  }
  if (keys.Digit3.pressed) {
    updateKeys("Digit3")
  }
  if (keys.Digit4.pressed) {
    updateKeys("Digit4")
  }
  if (keys.Digit5.pressed) {
    updateKeys("Digit5")
  }
}, 15)


function onMouseInput(e) {
  updateClick(e.type);
}

function onMouseMoveInput(e) {
  handleInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function handleInput(x, y) {
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  updateDirection(dir);
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseMoveInput);
  window.addEventListener('click', onMouseInput);
  window.addEventListener('touchstart', onTouchInput);
  window.addEventListener('touchmove', onTouchInput);
  window.addEventListener('keyup', onKeyInput);
  window.addEventListener('keydown', onKeyInput);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseMoveInput);
  window.removeEventListener('click', onMouseInput);
  window.removeEventListener('touchstart', onTouchInput);
  window.removeEventListener('touchmove', onTouchInput);
  window.removeEventListener('keyup', onKeyInput);
  window.removeEventListener('keydown', onKeyInput);
}
