// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');
var swing = 0

const { PLAYER_RADIUS, PLAYER_MAX_HP, ENEMY_MAX_HP,ENEMY_RADIUS, BULLET_RADIUS, MAP_SIZE } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
context.imageSmoothingEnabled = false;

setCanvasDimensions();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = scaleRatio * window.innerWidth * pixelRatio;
  canvas.height = scaleRatio * window.innerHeight * pixelRatio;
  
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

let animationFrameRequestId;

function render() {
  const { me, others, bullets, items, enemys } = getCurrentState();
  if (me) {
    // Draw background
    renderBackground(me.x, me.y);

    // Draw boundaries
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);
    // Draw all bullets
    bullets.forEach(renderBullet.bind(null, me));

    // Draw all playersl
    renderPlayer(me, me);
    renderSelected(me, me)
    
    items.forEach(renderItem.bind(null, me));
    others.forEach(renderPlayer.bind(null, me));
    others.forEach(renderSelected.bind(null,me));
    enemys.forEach(renderEnemy.bind(me,me));

    renderForeground(me.x, me.y);

  }

  // Rerun this render function on the next frame
  animationFrameRequestId = requestAnimationFrame(render);
}

function renderBackground(x, y) {
  // const backgroundX = MAP_SIZE / 2 - x + canvas.width / 2;
  // const backgroundY = MAP_SIZE / 2 - y + canvas.height / 2;
  const backgroundX = MAP_SIZE / 2 - x  - (1530);
  const backgroundY = MAP_SIZE / 2 - y - (2030);
  // const backgroundGradient = context.createRadialGradient(
  //   backgroundX,
  //   backgroundY,
  //   MAP_SIZE / 10,
  //   backgroundX,
  //   backgroundY,
  //   MAP_SIZE / 2,
  // );
  // backgroundGradient.addColorStop(0, 'black');
  // backgroundGradient.addColorStop(1, 'gray');
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  const backgroundLayer = getAsset('testBack.png');
  context.drawImage(backgroundLayer,backgroundX,backgroundY, MAP_SIZE, MAP_SIZE);

  // const floorImage = getAsset('white_floor.png');

  // const pattern = context.createPattern(floorImage, 'repeat');
  // context.fillStyle = pattern;
  // context.fillRect(0,0, MAP_SIZE, MAP_SIZE);


  // context.fillStyle = backgroundGradient;
  // context.fillRect(0, 0, canvas.width, canvas.height);
}

function renderForeground(x, y) {
  const backgroundX = MAP_SIZE / 2 - x  - (1530);
  const backgroundY = MAP_SIZE / 2 - y - (2030);

  const backgroundLayer = getAsset('testFore.png');
  context.drawImage(backgroundLayer,backgroundX,backgroundY, MAP_SIZE, MAP_SIZE);
}

// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  context.imageSmoothingEnabled = false;
  const playerImage = getAsset('player.png');
  const frameWidth = 16;
  const frameHeight = 16;
  const { x, y, direction, frame } = player; // Assuming you have a 'frame' property indicating the current frame
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  // Draw player animation

  context.save();
  context.translate(canvasX, canvasY);
  context.scale(player.flip, 1);
  // context.rotate(direction);
  // Calculate the source rectangle based on the current frame
  const sourceX = frame * frameWidth;
  const sourceY = 0; // Assuming the frames are in the first row
  context.drawImage(
    playerImage,
    sourceX,
    sourceY,
    frameWidth,
    frameHeight,
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2,
  );

  context.restore();

  // Draw health bar
  context.fillStyle = 'white';
  context.fillRect(
    canvasX - PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2,
    2,
  );
  context.fillStyle = 'red';
  context.fillRect(
    canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.hp / PLAYER_MAX_HP,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2 * (1 - player.hp / PLAYER_MAX_HP),
    2,
  );
}

function renderEnemy(me,enemy) {
  context.imageSmoothingEnabled = false;

  const backgroundX = MAP_SIZE / 2 - me.x  - (1530) + enemy.x ;
  const backgroundY = MAP_SIZE / 2 - me.y - (2030) + enemy.y;

  const { x, y, direction, frame } = enemy; 


  context.save();
  // context.translate(canvasX, canvasY);
  const sourceX = frame * ENEMY_RADIUS;
  const sourceY = 0; 
  context.drawImage(
    getAsset(enemy.name+'.png'),
    sourceX,
    sourceY,
    ENEMY_RADIUS,
    ENEMY_RADIUS,
    backgroundX - ENEMY_RADIUS,
    backgroundY - ENEMY_RADIUS,
    ENEMY_RADIUS * 2,
    ENEMY_RADIUS * 2
    
  );
  context.restore();

  // Draw health bar
  context.fillStyle = 'white';
  context.fillRect(
    backgroundX - ENEMY_RADIUS,
    backgroundY + ENEMY_RADIUS + ENEMY_RADIUS / 2,
    ENEMY_RADIUS * 2,
    2,
  );
  context.fillStyle = 'red';
  context.fillRect(
    backgroundX - ENEMY_RADIUS + ENEMY_RADIUS * 2 * enemy.hp / ENEMY_MAX_HP,
    backgroundY + ENEMY_RADIUS + ENEMY_RADIUS / 2,
    ENEMY_RADIUS * 2 * (1 - enemy.hp / ENEMY_MAX_HP),
    2,
  );
}


function renderBullet(me, bullet) {
  const { x, y } = bullet;
  context.drawImage(
    getAsset('basic_bullet.png'),
    canvas.width / 2 + x - me.x - BULLET_RADIUS,
    canvas.height / 2 + y - me.y - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2,
  );
}

function renderItem(me, item) {
  context.imageSmoothingEnabled = false;

  const { x, y } = item;
  const canvasX = Math.round(canvas.width / 2 + x - me.x);
  const canvasY = Math.round(canvas.height / 2 + y - me.y);

  context.save();
  context.translate(canvasX, canvasY);
  context.drawImage(
    getAsset(item.name+'.png'),
    Math.round(-PLAYER_RADIUS),
    Math.round(-PLAYER_RADIUS),
    Math.round(PLAYER_RADIUS * 2),
    Math.round(PLAYER_RADIUS * 2),
  );
  context.restore();

  
} 

function renderSelected(me, player) {
  context.imageSmoothingEnabled = false;

  if (!player || !player.inventory || player.inventory.length <= 0 || player.item_selected === null){
    return
  }
  const { x, y } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  context.save();
  context.translate(canvasX, canvasY);
  context.scale(player.flip, 1);
  if (!player.fireCooldown && player.inventory[player.item_selected].type == "melee"){
    if (swing < 130){
      context.rotate(((0+swing) * -Math.PI) / 180);
      swing += 8
    } else {
      context.rotate(0);
    }
  
  } else {
    swing = 0
    context.rotate(0);
  }
  context.drawImage(
    getAsset(player.inventory[player.item_selected].name+'.png'),
    -PLAYER_RADIUS - PLAYER_RADIUS - 8,
    -PLAYER_RADIUS - PLAYER_RADIUS,
    PLAYER_RADIUS * 3,
    PLAYER_RADIUS * 3,
  );
  context.restore();

}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderBackground(x, y);

  // Rerun this render function on the next frame
  animationFrameRequestId = requestAnimationFrame(renderMainMenu);
}



animationFrameRequestId = requestAnimationFrame(renderMainMenu);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  cancelAnimationFrame(animationFrameRequestId);
  animationFrameRequestId = requestAnimationFrame(render);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  cancelAnimationFrame(animationFrameRequestId);
  animationFrameRequestId = requestAnimationFrame(renderMainMenu);
}
