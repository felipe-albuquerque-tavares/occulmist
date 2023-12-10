const shortid = require('shortid');
const ObjectClass = require('./object');

class Item extends ObjectClass {
  constructor({x, y,name,damage,type, cooldown=null, weaponWidth=0,weaponLength=0}) {
    super(shortid(), x, y, null, 0);
    this.name = name;
    this.damage = damage;
    this.parentID = null;
    this.type = type
    this.cooldown = cooldown
    this.weaponWidth = weaponWidth
    this.weaponLength = weaponLength
  }


  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      name: this.name
    };
  }

  getWeaponHitbox(player) {
    const weaponLength = this.weaponLength; 
    const weaponWidth = this.weaponWidth; 
    const weaponOffset = weaponLength * Math.sin(player.direction);
    const hitboxX = player.x + weaponOffset;
    const hitboxY = player.y - weaponLength * Math.cos(player.direction);
  
    return {
      x: hitboxX,
      y: hitboxY,
      width: weaponWidth,
      height: weaponLength
    };
  }
}

module.exports = Item;