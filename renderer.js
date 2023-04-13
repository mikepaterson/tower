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
    if(this.game.currentLevel()) {
      this.renderLevel(this.game.currentLevel());


      //this.renderTowers(this.game.towers);
      //this.renderFarms();
      //this.renderEnemies(this.game.enemies);
      //this.renderBullets(this.game.bullets);

      this.renderObjects();
      this.renderPlacingObject();



    }
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
      if(index===level.path.length-1) {
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

  renderObjects() {
    this.game.objects.forEach(object => {
      var x = object.screenPosition ? object.screenPosition.x : object.gridPosition.x * this.tileWidth;
      var y = object.screenPosition ? object.screenPosition.y : object.gridPosition.y * this.tileHeight;

      var scale = 1;
      if(object instanceof Tower && object.class==='mega')
        scale = 2;

      this.ctx.drawImage(
        object.image,
        0,
        0,
        object.image.width,
        object.image.height,
        x,
        y,
        this.tileWidth * scale,
        this.tileHeight * scale
      );
    });

  }



  // renderTowers(towers) {
  //   towers.forEach(tower => {
  //     var scale = tower.class==='mega' ? 2 : 1;
  //     this.ctx.drawImage(
  //       tower.image,
  //       0,
  //       0,
  //       tower.image.width,
  //       tower.image.height,
  //       tower.gridPosition.x * this.tileWidth,
  //       tower.gridPosition.y * this.tileHeight,
  //       this.tileWidth * scale,
  //       this.tileHeight * scale
  //     );

  //   });
  // }

  // renderFarms() {
  //   this.game.farms.forEach(farm => {
  //     this.ctx.drawImage(
  //       farm.image,
  //       0,
  //       0,
  //       farm.image.width,
  //       farm.image.height,
  //       farm.gridPosition.x * this.tileWidth,
  //       farm.gridPosition.y * this.tileHeight,
  //       this.tileWidth,
  //       this.tileHeight
  //     );

  //   });
  // }

  renderPlacingObject() {
    if(this.game.ui.placingObject) {
      if(this.game.ui.placingObject instanceof Tower) {
        const tower = this.game.ui.placingObject;
        if(tower.gridPosition) {
          this.ctx.globalAlpha = 0.4;
          //todo draw circle showing range

          const centerX = (tower.gridPosition.x * this.tileWidth) + (this.tileWidth/2);
          const centerY = (tower.gridPosition.y * this.tileHeight) + (this.tileHeight/2);
          const radius = tower.attackRange * this.tileWidth;

          this.ctx.beginPath();
          this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
          this.ctx.fillStyle = 'green';
          this.ctx.fill();
          this.ctx.lineWidth = 5;
          this.ctx.strokeStyle = '#003300';
          this.ctx.stroke();

          this.ctx.lineWidth = 1;
          this.ctx.strokeStyle = '#000000';

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
          this.ctx.globalAlpha = 1;
        }
      }

      if(this.game.ui.placingObject instanceof Farm) {
        const farm = this.game.ui.placingObject;
        if(farm.gridPosition) {
          this.ctx.globalAlpha = 0.4;
          this.ctx.drawImage(
            farm.image,
            0,
            0,
            farm.image.width,
            farm.image.height,
            farm.gridPosition.x * this.tileWidth,
            farm.gridPosition.y * this.tileHeight,
            this.tileWidth,
            this.tileHeight
          );
          this.ctx.globalAlpha = 1;
        }
      }

    }
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
