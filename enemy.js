class Enemy {
  constructor(game, enemyTypeData) {
    this.game = game;
    this.type = enemyTypeData.type;
    this.health = enemyTypeData.health;
    this.maxHealth = enemyTypeData.health;
    this.coinValue = enemyTypeData.coinValue;
    this.moveCooldown = enemyTypeData.moveCooldown;
    this.image = new Image();
    this.image.src = enemyTypeData.image;

    this.hitAudio = new Audio('sounds/hit.mp3');

    //this.path = path;
//    this.pathIndex = 0;
    //this.position = { ...this.path[this.pathIndex] };
    this.gridPosition = {};

    this.lastMoveTime = null;
  }



  move(currentTime) {

    if(currentTime > this.lastMoveTime + (this.moveCooldown*1000)) {
      this.gridPosition = this.game.currentLevel().getNextPosition(this.gridPosition);
      this.lastMoveTime = currentTime;
    }

  }

  isDead() {
    return this.health <= 0;
  }

  die() {
    this.health = 0;
  }

  takeDamage(damagePoints) {
    this.hitAudio.play();
    this.health -= damagePoints;
    if (this.health < 0) {
      this.health = 0;
    }
  }
}