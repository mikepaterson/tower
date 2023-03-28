class Game {

  player = {
    health: 4,
    coins: 75,
  };

  levels = [];
  levelIndex = 0;
  waveIndex = 0;
  spawnIndex = 0;

  enemies = [];
  towers = [];
  bullets = [];

  isPlaying = false;
  gridSize = {x: 20, y: 15};
  lastSpawnTime =  0;
  lastRenderTime = 0;


  constructor(levelData, enemyTypes, towerTypes, ui, renderer) {
    this.levels = levelData.map(data => new Level(data));
    this.enemyTypes = enemyTypes;
    this.towerTypes = towerTypes;

    this.renderer = new Renderer(this);
    this.ui = new UI(this);
  }

  init() {
    this.ui.init(this);
    this.renderer.init(this);
  }


  currentLevel() {
    return this.levels[this.levelIndex];
  }



  startGame() {
    this.levelIndex = 0;
    this.waveIndex = 0;
    this.spanIndex = 0;
    this.player.health = 4;
    this.player.coins = 75;
    this.enemies = [];
    this.towers = [];
    this.bullets = [];

    this.gameLoop();
    this.startLevel();
  }

  restartGame() {
    this.startGame();
  }



  startLevel() {
    this.isPlaying = true;
    this.ui.showGameScreen();
  }


  gameLoop(currentTime) {
    if(this.isPlaying) {
      this.update(currentTime);
      this.render(currentTime);
    }

    requestAnimationFrame((time) => this.gameLoop(time));
  }


  update(currentTime) {
      this.spawnEnemies(currentTime);

      this.enemies = this.enemies.filter(enemy => !enemy.isDead());


      this.enemies.forEach(enemy => enemy.move(currentTime));

      this.bullets.forEach(bullet => {
        bullet.move(currentTime)
        if(bullet.hasReachedTarget(this) && !bullet.target.isDead()) {
          bullet.hitTarget();

          if(bullet.target.isDead()) {
            console.log(bullet.target.type+' taking damage:  '+bullet.target.health+'left');
            console.log(bullet.target.type+' dead:  '+bullet.target.coinValue+' coins');
            this.player.coins += bullet.target.coinValue;
          }
        }
      });

      this.bullets = this.bullets.filter(bullet => !bullet.hasReachedTarget(this));

      this.towers.forEach(tower => {
        if(!tower.lastAttackTime) {
          tower.lastAttackTime = currentTime;
        }

        if(tower.canAttack(currentTime)) {
          const bullet = tower.attack(currentTime);
          if(bullet) {
            this.bullets.push(bullet);
          }
            // const target = bullet.target;
            // target.takeDamage(bullet.damagePoints);

        }
      });

      if(this.spawnIndex >= this.currentLevel().waves[this.waveIndex].length && this.enemies.length===0) {
        console.log('next wave');
        //next wave
        this.spawnIndex = 0;
        this.waveIndex++;
      }

      if(this.waveIndex > this.currentLevel().waves.length-1 && this.enemies.length===0) {
        //next level
        console.log('next level');

        //clear towers and give back portion of cost
        this.towers.forEach(tower => {
          this.player.coins += Math.ceil(tower.cost * 0.25);
        });
        this.towers = [];

        this.spawnIndex = 0;
        this.waveIndex = 0;
        this.levelIndex++;


        this.isPlaying = false;
        if(this.levelIndex > this.levels.length -1) {
          this.ui.showVictoryScreen();
        } else {
          this.ui.showNewLevelScreen();
        }
      }

      this.checkEnemyReachEnd();
//      this.checkLevelComplete();
      this.checkGameOver();

  }





  render(currentTime) {
    if(this.currentLevel()) {
      this.renderer.render();
      this.ui.render();
    }
  }




  spawnEnemies(currentTime) {
    var currentWave = this.currentLevel().waves[this.waveIndex];
    var nextSpawn = currentWave[this.spawnIndex];

    if(nextSpawn && currentTime > this.lastSpawnTime + (nextSpawn.delay*1000)) {
      const newEnemy = new Enemy(this, this.enemyTypes[nextSpawn.type]);
      if (newEnemy) {
        newEnemy.gridPosition = this.currentLevel().path[0];
        newEnemy.lastMoveTime = currentTime;

        this.enemies.push(newEnemy);

        console.log('spawned '+newEnemy.type+' enemy:  wave'+this.waveIndex+' spawn'+this.spawnIndex);

        this.lastSpawnTime = currentTime;
        this.spawnIndex++;
      }
    }
  }






  placeTower(tower) {
    //if(this.currentLevel().canPlaceTower(gridPosition)) {
      //tower.gridPosition = gridPosition;

      this.towers.push(tower);
      this.ui.setPlacingTower(null);
    // } else {
    //   //beep
    // }
  }




  isTileOccupied(gridPosition) {
    var isOccupied = false;
    this.currentLevel().path.forEach(tile => {
      if(tile.x===gridPosition.x && tile.y===gridPosition.y) {
        isOccupied = true;
      }
    });

    this.towers.forEach(tower => {
      if(tower.gridPosition.x===gridPosition.x && tower.gridPosition.y===gridPosition.y) {
        isOccupied = true;
      }
    });

    return isOccupied;
  }





  checkEnemyReachEnd() {
    this.enemies.forEach(enemy => {
      if (this.currentLevel().isEndTile(enemy.gridPosition)) {
        this.player.health -= 1;
        enemy.die();
        console.log('enemy reached end')
      }
    });
  }

  checkLevelComplete() {
    if (this.waveIndex=== this.currentLevel().waves.length-1 && this.enemies.length === 0) {
      this.levelIndex++;
      this.waveIndex = 0;
      this.spawnIndex = 0;
      if (this.levelIndex >= this.levels.length) {
        console.log('game won')
        this.isPlaying = false;
        this.ui.showVictoryScreen();

      } else {
        console.log('next level')
        //this.startLevel();
      }
    }
  }

  checkGameOver() {
    if (this.player.health <= 0) {
      this.isPlaying = false;
      this.ui.showGameOverScreen();
    }
  }




}
