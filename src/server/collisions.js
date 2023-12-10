const Constants = require('../shared/constants');

// Returns an array of bullets to be destroyed.
function applyCollisions(players,enemys, bullets) {
  const destroyedBullets = [];
  for (let i = 0; i < bullets.length; i++) {
    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    for (let j = 0; j < players.length; j++) {
      const bullet = bullets[i];
      const player = players[j];
      if (
        bullet.parentID !== player.id &&
        player.distanceTo(bullet) <= Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS
      ) {
        destroyedBullets.push(bullet);
        player.takeDamage(bullet.damage);
        break;
      }
    }
    for (let j = 0; j < enemys.length; j++) {
      const bullet = bullets[i];
      const enemy = enemys[j];
      if (
        enemy.distanceTo(bullet) <= Constants.ENEMY_RADIUS + Constants.BULLET_RADIUS
      ) {
        destroyedBullets.push(bullet);
        enemy.takeDamage(bullet.damage);
        break;
      }
    }
  }
  return destroyedBullets;
}

function applyCollisionsItems(players, items) {
  const despawnedItems = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < players.length; j++) {
      const item = items[i];
      const player = players[j];


      if (
        player.distanceTo(item) <= Constants.PLAYER_RADIUS + Constants.ITEM_RADIUS
      ) {
        despawnedItems.push(item);
        item.parentID = player.id
        break;
      }
    }
  }

  return despawnedItems;
}


function applyMeleeAttacks(players,enemys) {
  for (let i = 0; i < players.length; i++) {
    const attackingPlayer = players[i];
    const playerWeapon = attackingPlayer.inventory[attackingPlayer.item_selected]
    if (!playerWeapon) { continue}
    if (attackingPlayer.fireCooldown && playerWeapon.type == "melee") {
      const weaponHitbox = playerWeapon.getWeaponHitbox(attackingPlayer);

      for (let j = 0; j < players.length; j++) {
        const targetPlayer = players[j];
        if (attackingPlayer === targetPlayer) continue; // Don't attack yourself

        if (targetPlayer.distanceTo(weaponHitbox) <= Constants.PLAYER_RADIUS + (weaponHitbox.width / 2)) {
          attackingPlayer.fireCooldown = false
          targetPlayer.takeDamage(playerWeapon.damage);
        }
      }

      for (let j = 0; j < enemys.length; j++) {
        const targetEnemy = enemys[j];
        if (targetEnemy.distanceTo(weaponHitbox)<= ((Constants.ENEMY_RADIUS) + (weaponHitbox.width / 2))) {
          attackingPlayer.fireCooldown = false
          targetEnemy.takeDamage(playerWeapon.damage);
        }
      }
    }
  }
}

module.exports = { applyCollisions,applyCollisionsItems,applyMeleeAttacks }