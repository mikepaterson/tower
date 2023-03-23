class Game {

  player = {
    health: 4,
    coins: 100,
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
    this.player.coins = 100;
    this.enemies = [];
    this.towers = [];
    this.bullets = [];

    this.isPlaying = true;
    this.ui.showGameScreen();
    this.gameLoop();
  }

  restartGame() {
    this.startGame();
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


      this.enemies.forEach(enemy => enemy.move(this.currentLevel(), currentTime));

      this.bullets.forEach(bullet => {
        bullet.move(this, currentTime)
        if(bullet.hasReachedTarget(this)) {
          bullet.hitTarget();
          console.log(bullet.target.type+' taking damage:  '+bullet.target.health+'left');
          if(bullet.target.isDead()) {
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
          const bullet = tower.attack(currentTime, this);
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
        this.spawnIndex = 0;
        this.waveIndex = 0;
        this.levelIndex++;

        if(this.levelIndex > this.levels.length -1) {
          this.isPlaying = false;
          this.ui.showVictoryScreen();
        }
      }

      this.checkEnemyReachEnd();
//      this.checkLevelComplete();
      this.checkGameOver();

  }





  render(currentTime) {
    this.renderer.render();
    this.ui.render();
  }




  spawnEnemies(currentTime) {
    var currentWave = this.currentLevel().waves[this.waveIndex];
    var nextSpawn = currentWave[this.spawnIndex];

    if(nextSpawn && currentTime > this.lastSpawnTime + (nextSpawn.delay*1000)) {
      const newEnemy = new Enemy(this.enemyTypes[nextSpawn.type]);
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






  placeTower(tower, gridPosition) {
    //if(this.currentLevel().canPlaceTower(gridPosition)) {
      tower.gridPosition = gridPosition;

      this.towers.push(tower);
      this.ui.setPlacingTower(null);
    // } else {
    //   //beep
    // }
  }







  checkEnemyReachEnd() {
    this.enemies.forEach(enemy => {
      if (this.currentLevel().isEndTile(enemy.gridPosition)) {
        this.health -= 1;
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
    if (this.health <= 0) {
      this.isPlaying = false;
      this.ui.showGameOverScreen();
    }
  }




}
