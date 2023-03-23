class Enemy {
  constructor(enemyTypeData) {
    this.type = enemyTypeData.type;
    this.health = enemyTypeData.health;
    this.maxHealth = enemyTypeData.health;
    this.coinValue = enemyTypeData.coinValue;
    this.moveCooldown = enemyTypeData.moveCooldown;
    this.image = new Image();
    this.image.src = enemyTypeData.image;

    //this.path = path;
//    this.pathIndex = 0;
    //this.position = { ...this.path[this.pathIndex] };
    this.gridPosition = {};

    this.lastMoveTime = null;
  }



  move(level, currentTime) {

    if(currentTime > this.lastMoveTime + (this.moveCooldown*1000)) {
      this.gridPosition = level.getNextPosition(this.gridPosition);
      this.lastMoveTime = currentTime;
    }

    // if (this.pathIndex < this.path.length - 1) {
    //   const dx = this.path[this.pathIndex + 1].x - this.position.x;
    //   const dy = this.path[this.pathIndex + 1].y - this.position.y;
    //   const distance = Math.sqrt(dx * dx + dy * dy);
    //   const moveDistance = this.travelSpeed;

    //   if (moveDistance >= distance) {
    //     this.pathIndex++;
    //     this.position.x = this.path[this.pathIndex].x;
    //     this.position.y = this.path[this.pathIndex].y;
    //   } else {
    //     this.position.x += (dx / distance) * moveDistance;
    //     this.position.y += (dy / distance) * moveDistance;
    //   }
    // }
  }

  // hasReachedEnd() {
  //   return this.pathIndex === this.path.length - 1;
  // }

  isDead() {
    return this.health <= 0;
  }

  die() {
    this.health = 0;
  }

  takeDamage(damagePoints) {
    this.health -= damagePoints;
    if (this.health < 0) {
      this.health = 0;
    }
  }
}