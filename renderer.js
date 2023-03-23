class Renderer {
  game;
  gameCanvas;
  ctx;

  constructor(game) {
    this.game = game;
    this.gameCanvas = document.getElementById("gameCanvas");
    this.ctx = gameCanvas.getContext("2d");
  }


  init() {
    this.tileHeight = this.gameCanvas.height / this.game.gridSize.y;
    this.tileWidth = this.gameCanvas.width / this.game.gridSize.x;
  }


  render() {
    this.clearCanvas();
    this.renderLevel(this.game.currentLevel());
    this.renderTowers(this.game.towers);
    this.renderEnemies(this.game.enemies);
    this.renderBullets(this.game.bullets);

  }


  clearCanvas() {
    this.ctx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
  }

  renderLevel(level) {

    //grid
    for (let x = 0; x < this.game.gridSize.x; x++) {
      for (let y = 0; y < this.game.gridSize.y; y++) {
        this.ctx.fillStyle = 'rgb(0,154,23)';
        this.ctx.fillRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
        this.ctx.strokeRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
      }
    }

    //path
    level.path.forEach((tile,index) => {
      var color;
      if(index===0) {
        //start is blue
        color = 'rgb(70,70,150)';
      } else if(index===level.path.length-1) {
        //end is red
        color = 'rgb(150,70,70)';
      } else {
        //regular path is brown
        color = 'rgb(109,93,70)';
      }

      this.ctx.fillStyle = color;
      this.ctx.fillRect(tile.x * this.tileWidth, tile.y * this.tileHeight, this.tileWidth, this.tileHeight);
      this.ctx.strokeRect(tile.x * this.tileWidth, tile.y * this.tileHeight, this.tileWidth, this.tileHeight);
    });

  }

  renderTowers(towers) {
    towers.forEach(tower => {
      this.ctx.drawImage(
        tower.image,
        0,
        0,
        tower.image.width,
        tower.image.height,
        tower.gridPosition.x * this.tileWidth,
        tower.gridPosition.y * this.tileHeight,
        this.tileWidth,
        this.tileHeight
      );

    });
  }


  renderEnemies(enemies) {
    enemies.forEach(enemy => {
      this.ctx.drawImage(
        enemy.image,
        0,
        0,
        enemy.image.width,
        enemy.image.height,
        enemy.gridPosition.x * this.tileWidth,
        enemy.gridPosition.y * this.tileHeight,
        this.tileWidth,
        this.tileHeight
      );
    });
  }

  renderBullets(bullets) {
    bullets.forEach(bullet => {
      if(bullet) {
        this.ctx.drawImage(
          bullet.image,
          0,
          0,
          bullet.image.width ,
          bullet.image.height,
          bullet.screenPosition.x + (this.tileWidth*.25),
          bullet.screenPosition.y + (this.tileHeight*.25),
          this.tileWidth/2,
          this.tileHeight/2
        );
      }


    });
  }
}
