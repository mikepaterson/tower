class Enemy {
  constructor(game, enemyTypeData) {
    this.game = game;
    this.type = enemyTypeData.type;
    this.health = enemyTypeData.health;
    this.maxHealth = enemyTypeData.health || this.health;
    this.coinValue = enemyTypeData.coinValue || 1;
    this.moveCooldown = enemyTypeData.moveCooldown;
    this.travelSpeed = enemyTypeData.travelSpeed || 3;
    this.image = new Image();
    this.image.src = enemyTypeData.image;

    //this.path = path;
//    this.pathIndex = 0;
    //this.position = { ...this.path[this.pathIndex] };
    this.gridPosition = {};
    this.screenPosition = {};

    this.lastMoveTime = null;
    this.targetScreenPosition;//where enemy is currently moving to
  }



  update(currentTime) {
    if(!this.targetScreenPosition) {
      this.targetScreenPosition = this.game.ui.getScreenPositionFromGridPosition(this.gridPosition);
      this.screenPosition = this.game.ui.getScreenPositionFromGridPosition({x: this.gridPosition.x -1, y: this.gridPosition.y});
    }


    if(this.lastMoveTime) {
      const dx = this.targetScreenPosition.x - this.screenPosition.x;
      const dy = this.targetScreenPosition.y - this.screenPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const moveDistance = this.travelSpeed * this.game.renderer.tileWidth * ((currentTime - this.lastMoveTime)/1000);

      if (moveDistance >= distance) {
        this.screenPosition.x = this.targetScreenPosition.x;
        this.screenPosition.y = this.targetScreenPosition.y;
      } else {
        this.screenPosition.x += (dx / distance) * moveDistance;
        this.screenPosition.y += (dy / distance) * moveDistance;
      }

      if(this.screenPosition.x === this.targetScreenPosition.x && this.screenPosition.y === this.targetScreenPosition.y) {
        //this.gridPosition = this.game.currentLevel().getNextPosition(this.gridPosition);
        if(this.path.length>0) {
          //move to next position
          this.gridPosition = this.path.shift();
          this.targetScreenPosition = this.game.ui.getScreenPositionFromGridPosition(this.gridPosition)
        } else if(!this.target.dead) {
          //arrived at target
          this.target.takeDamage(this);
          console.log('enemy reached target')
        }
      }
    }
    this.lastMoveTime = currentTime;

  }

  isDead() {
    return this.health <= 0;
  }

  die() {
    this.health = 0;
    this.dead = true;
  }

  takeDamage(damagePoints) {
    console.log(this.type+' taking damage:  '+this.health+'left');

    this.game.audioManager.play('sounds/hit.mp3');
    this.health -= damagePoints;
    if (this.health < 0) {
      this.health = 0;
    }

    if(this.isDead()) {
      console.log(this.type+' dead:  '+this.coinValue+' coins');

      this.game.spawnCoins(this.coinValue, this.gridPosition);
      this.dead = true;
    }

  }


  pickTarget() {
    if(this.target && this.target.dead)
      this.target = null;

    var newPath;
    if(this.target)
      newPath = this.game.pathFinder.findPath(this.gridPosition, this.target.gridPosition);

    if(!newPath) {
      var possibleTargets = this.game.objects.filter(
        object => !object.dead
          && (object instanceof Townhall || object instanceof Farm || object instanceof Tower)
      );

      if(possibleTargets.length === 0) {
        possibleTargets = this.game.objects.filter(
          object => !object.dead
            && (object instanceof Block)
        );
      }

      this.target = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];

      this.path = this.game.pathFinder.findPath(this.gridPosition, this.target.gridPosition);
    }
  }
}