class Tower {
  constructor(towerData, gridPosition) {
    this.type = towerData.type;
    this.image = new Image();
    this.image.src = towerData.image;
    this.gridPosition = gridPosition;
    this.attackRange = towerData.attackRange;
    this.attackCooldown = towerData.attackCooldown;
    this.attackDamage = towerData.attackDamage;
    this.bulletImageSrc = towerData.bulletImage;
    this.bulletSpeed = towerData.bulletSpeed;
    this.bulletDamage = towerData.bulletDamage;
    this.cost = towerData.cost;
    this.lastAttackTime = 0;


  }

  canAttack(currentTime) {
    if (currentTime > this.lastAttackTime  + (this.attackCooldown * 1000)) {
      return true;
    } else {
      return false;
    }
  }

  attack(currentTime, game) {
    const target = this.findTarget(game.enemies);

    if (target) {
      console.log(this.type+' attacking '+target.type);
      this.lastAttackTime = currentTime

      return new Bullet(this.bulletImageSrc, this.attackDamage, this.bulletSpeed, game.ui.getScreenPositionFromGridPosition(this.gridPosition), target);
    }

    return null;
  }

  findTarget(enemies) {
    let target = null;
    let minDistance = Infinity;

    enemies.forEach(enemy => {
      const dx = enemy.gridPosition.x - this.gridPosition.x;
      const dy = enemy.gridPosition.y - this.gridPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.attackRange && distance < minDistance) {
        target = enemy;
        minDistance = distance;
      }
    });

    return target;
  }


}
