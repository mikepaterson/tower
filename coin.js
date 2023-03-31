class Coin {
  constructor(game, screenPosition) {
    this.game = game;
    this.image = new Image();
    this.image.src = 'images/coin.png';

    this.screenPosition = screenPosition;
    this.travelSpeed = 15;

    this.lastMoveTime = 0;
    this.dead = false;
  }

  spawn(currentTime) {
    this.lastMoveTime = currentTime;
    this.game.audioManager.play('sounds/coin.mp3');
  }

  update(currentTime) {
    var targetScreenPosition = {
      x: this.game.renderer.tileWidth * this.game.gridSize.x,
      y: 0,
    }

    if(this.lastMoveTime) {
      const dx = targetScreenPosition.x - this.screenPosition.x;
      const dy = targetScreenPosition.y - this.screenPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const moveDistance = this.travelSpeed * this.game.renderer.tileWidth * ((currentTime - this.lastMoveTime)/1000);

      if (moveDistance >= distance) {
        this.screenPosition.x = targetScreenPosition.x;
        this.screenPosition.y = targetScreenPosition.y;
      } else {
        this.screenPosition.x += (dx / distance) * moveDistance;
        this.screenPosition.y += (dy / distance) * moveDistance;
      }

      if(this.screenPosition.x === targetScreenPosition.x && this.screenPosition.y === targetScreenPosition.y) {
        this.game.player.coins++;
        this.dead = true;
        this.game.audioManager.play('sounds/coin.mp3');
      }
    }
    this.lastMoveTime = currentTime;
  }

}
