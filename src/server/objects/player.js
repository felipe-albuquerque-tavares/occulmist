const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = true;
    this.damage = Constants.PLAYER_BASE_DAMAGE;
    this.score = 0;
    this.inventory = [];
    this.item_selected = null;
    this.animations = 0;
    this.frame = 0;
    this.flip = 1;
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    // super.update(dt);

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    // Fire a bullet, if needed

    return null;
  }

  takeDamage(damage) {
    this.hp -= damage;
  }

  shotBullet(damage) {
      return new Bullet(this.id, this.x, this.y, this.direction,damage);
  }

  keyInput(key) {
    switch (key) {
      case 'KeyW':
        this.y -= this.speed
        break
  
      case 'KeyA':
        this.flip = 1
        this.x -= this.speed
        break
  
      case 'KeyS':
        this.y += this.speed
        break
  
      case 'KeyD':
        this.flip = -1
        this.x += this.speed
        break
      case 'Digit1':

      case 'Digit2':

      case 'Digit3':

      case 'Digit4':

      case 'Digit5':
        this.selectItem(parseInt(key.replace("Digit","")) - 1)
        break
    }
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }

  getItem(item) {
    this.inventory.push(item)
  }
  
  dropItem(item) {
    if (this.inventory.indexOf(item) !== -1) {
      this.damage = Constants.PLAYER_BASE_DAMAGE
      this.inventory.splice(index, 1);
    }
  }

  selectItem(index) {
    if (this.inventory[index]) {
      this.item_selected = index
      this.damage = this.inventory[index].damage
    } else {
      this.item_selected = null
      this.damage = Constants.PLAYER_BASE_DAMAGE;
    }
    }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      damage: this.damage,
      frame: this.frame,
      fireCooldown: this.fireCooldown,
      flip: this.flip,
      inventory: this.inventory,
      item_selected: this.item_selected,
      hp: this.hp,
    };
  }
}

module.exports = Player;
