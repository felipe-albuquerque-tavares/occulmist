const Constants = require('../shared/constants');
const Player = require('./objects/player');
const Item = require('./objects/item');
const {applyCollisions, applyCollisionsItems,applyMeleeAttacks} = require('./collisions');
const Enemy = require('./objects/enemy');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.enemys = [];
    this.bullets = [];
    this.items = [];
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
    if (!this.items.length){
      const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
      const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
      const x2 = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
      const y2 = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
      this.items.push(new Item({x,y,name:"minimum_sword",damage:20,type:"melee",cooldown:0.5,weaponWidth:50,weaponLength:20}))
      this.items.push(new Item({x: x2,y: y2,name:"fire_staff",damage:20,type:"ranged",cooldown:0.5}))
    }
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const enemyX = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const enemyY = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    this.players[socket.id] = new Player(socket.id, username, x, y);
    this.enemys.push(new Enemy(enemyX,enemyY,"monster_1"))
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  removeEnemy(index) {
    delete this.enemys[index];
  }


  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  handleKeyInput(socket, key) {
    if (this.players[socket.id]) {
      this.players[socket.id].keyInput(key);
    }
  }

  handleMouseInput(socket, key) {
    if (this.players[socket.id]) {
      const player = this.players[socket.id];

      if (!player.inventory.length || !player.inventory[player.item_selected]){
        return
      }

      const item = player.inventory[player.item_selected]
      if (player.fireCooldown){
        player.fireCooldown = false
        if (item.type == "ranged"){
          const newBullet = player.shotBullet(item.damage);
          if (newBullet) {
            this.bullets.push(newBullet);
          }
          
        }
      } 
      setTimeout(() => {
        player.fireCooldown = true
      },(item.cooldown * 1000))
      
    }
  }

  

  update() {

    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;
    
    // Update each bullet
    const bulletsToRemove = [];
    this.bullets.forEach(bullet => {
      if (bullet.update(dt)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet);
      }
    });
    this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));

    // // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];

      if (player.animations >= 60){
         if (player.frame == 0){
           player.frame = 1
         } else {
           player.frame = 0
         }
         player.animations = 0
       } else {
        player.animations++;
       }

      const newBullet = player.update(dt);
      if (newBullet) {
        this.bullets.push(newBullet);
      }
    });

    Object.keys(this.enemys).forEach(enemyIndex => {
      const enemy = this.enemys[enemyIndex]
      if (enemy.animations >= 10){
        if (enemy.frame != 3){
          enemy.frame += 1
        } else {
          enemy.frame = 0
        }
        enemy.animations = 0
      } else {
        enemy.animations++;
      }
      let nearestPlayer = null;
      let nearestDistance = Infinity;
  
      Object.keys(this.sockets).forEach(playerID => {
        const player = this.players[playerID];
        const distance = Math.sqrt(Math.pow(player.x - enemy.x, 2) + Math.pow(player.y - enemy.y, 2));
        if (distance < nearestDistance) {
          nearestPlayer = player;
          nearestDistance = distance;
        }
       
      })
      if (nearestPlayer) {
        enemy.update(dt,nearestPlayer);
        if (nearestDistance <= Constants.ENEMY_RADIUS && enemy.fireCooldown){
          
          enemy.fireCooldown = false
          nearestPlayer.takeDamage(enemy.damage)
          setTimeout(() => {
            enemy.fireCooldown = true
          },(enemy.cooldown * 1000))
        }
      }
    });

    applyMeleeAttacks(Object.values(this.players),Object.values(this.enemys))

    // Apply collisions, give players score for hitting bullets
    const destroyedBullets = applyCollisions(Object.values(this.players),Object.values(this.enemys), this.bullets);
    destroyedBullets.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage();

      }
    });
    this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));

    const despawnedItems = applyCollisionsItems(Object.values(this.players), this.items);
    despawnedItems.forEach(item => {
      this.players[item.parentID].getItem(item)
      console.log(item)
    });
    this.items = this.items.filter(item => !despawnedItems.includes(item));


    // Check if any players are dead
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
    });
      // Check if any enemys are dead
    Object.keys(this.enemys).map((index) => {
      if (this.enemys[index].hp <= 0) {
        this.removeEnemy(index);

      }
    })

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE,
    );
    const nearbyItems = this.items.filter(
      i => i.distanceTo(player) <= Constants.MAP_SIZE,
    );
    const nearbyEnemys = this.enemys.filter(
      e => e.distanceTo(player) <= Constants.MAP_SIZE,
    );
    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      items: nearbyItems.map(i => i.serializeForUpdate()),
      enemys: nearbyEnemys.map(e => e.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
