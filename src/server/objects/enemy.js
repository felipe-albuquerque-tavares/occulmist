const shortid = require('shortid');
const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../../shared/constants');

class Enemy extends ObjectClass {
  constructor(x, y,name) {
    super(shortid(), x, y, Math.random() * 2 * Math.PI, Constants.ENEMY_SPEED);
    this.hp = Constants.ENEMY_MAX_HP;
    this.name = name;
    this.fireCooldown = true;
    this.cooldown = 1;
    this.damage = Constants.ENEMY_BASE_DAMAGE;
    this.animations = 0;
    this.frame = 0;
    this.flip = 1;
  }

  update(dt,player) {
    this.x += this.speed * dt * Math.cos(Math.atan2(player.y - (this.y), player.x - (this.x)));
    this.y += this.speed * dt * Math.sin(Math.atan2(player.y - (this.y ), player.x - (this.x )));
  }

  takeDamage(damage) {
    this.hp -= damage;
  }

  shotBullet(damage) {
      return new Bullet(this.id, this.x, this.y, this.direction,damage);
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      damage: this.damage,
      frame: this.frame,
      name: this.name,
      fireCooldown: this.fireCooldown,
      flip: this.flip,
      hp: this.hp,
    };
  }
}

module.exports = Enemy;
