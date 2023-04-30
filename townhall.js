class Townhall {
  constructor(game, gridPosition) {
    this.game = game;
    this.image = new Image();
    this.image.src = './images/townhall.png';
    this.gridPosition = gridPosition;
    this.health = 100;
  }

  spawn(currentTime) {
  }

  update(currentTime) {
    if(this.lastPayoutTime===0) {
      this.lastPayoutTime = currentTime;
    }

    if (currentTime > this.lastPayoutTime  + (this.payoutCooldown * 1000)) {
      //payout
      this.game.spawnCoins(this.payoutCoins, {...this.gridPosition});
      this.lastPayoutTime = currentTime;
    }
  }


  isDead() {
    return this.health <= 0;
  }

  die() {
    this.health = 0;
    this.dead = true;
  }

  takeDamage(enemy, damagePoints) {
    enemy.die();
    this.game.player.health -= 1;
    this.game.audioManager.play('sounds/hit.mp3');

    // console.log('townhall taking damage:  '+this.health+'left');

    // this.game.audioManager.play('sounds/hit.mp3');
    // this.health -= damagePoints;
    // if (this.health < 0) {
    //   this.health = 0;
    // }

    // if(this.isDead()) {
    //   console.log('townhall dead:  '+this.coinValue+' coins');
    //   this.dead = true;
    // }

  }

}
