class Game {

  player = {
    health,
    coins,
  };

  levels = [];

  levelIndex = 0;
  waveIndex = 0;
  spawnIndex = 0;

  objects = [];

  isPlaying = false;
  gridSize = {x: 20, y: 15};
  lastSpawnTime =  0;
  lastRenderTime = 0;


  constructor(levelData, enemyData, towerData, blockData, farmData) {
    this.levels = levelData.map(data => new Level(data));
    this.enemyData = enemyData;
    this.towerData = towerData;
    this.blockData = blockData;
    this.farmData = farmData;

    this.renderer = new Renderer(this);
    this.ui = new UI(this);
    this.audioManager = new AudioManager();

    this.audioManager.load('sounds/click.mp3');
    this.audioManager.load('sounds/shoot.mp3');
    this.audioManager.load('sounds/hit.mp3');
    this.audioManager.load('sounds/coin.mp3');

    this.audioManager.toggleMute();
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
    this.player.health = 4;
    this.player.coins = 100;

    this.gameLoop();
    this.startLevel();
  }

  restartGame() {
    this.startGame();
  }



  startLevel() {

    this.waveIndex = 0;
    this.spanIndex = 0;
    this.objects = [];

    //generate blocks
    var tiles = Math.ceil(this.gridSize.x * this.gridSize.y * .40);
    tiles = (tiles + (this.levelIndex * tiles/3))
    for(var i=0; i<tiles ; i++) {
      var gridPosition = {
        x: Math.floor(Math.random() * this.gridSize.x),
        y: Math.floor(Math.random() * this.gridSize.y)
      }
      if(!this.isTileOccupied(gridPosition)) {
        var block = new Block(this, this.blockData['rock'], gridPosition);
        this.addObject(block);
      }
    }


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

      this.objects.forEach(object => object.update(currentTime));
      this.filterDeadObjects();


      if(this.spawnIndex >= this.currentLevel().waves[this.waveIndex].length && this.enemies().length===0) {
        console.log('next wave');
        //next wave
        this.spawnIndex = 0;
        this.waveIndex++;
      }

      if(this.waveIndex > this.currentLevel().waves.length-1 && this.enemies().length===0) {
        //next level
        console.log('next level');

        //clear towers and give back portion of cost
        // this.towers().forEach(tower => {
        //   if(tower.cost) {
        //     this.player.coins += Math.ceil(tower.cost * 0.25);
        //   }
        // });

        this.player.coins += 100;

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


  filterDeadObjects() {
    this.objects = this.objects.filter(object => !object.dead);
  }

  addObject(object) {
    this.objects.push(object);


    this.objects.sort((a, b) => {
      const order = ['Block', 'Farm', 'Tower', 'Enemy', 'Bullet', 'Coin'];

      const aIndex = order.indexOf(a.constructor.name);
      const bIndex = order.indexOf(b.constructor.name);

      if (aIndex < bIndex) {
        return -1;
      } else if (aIndex > bIndex) {
        return 1;
      } else {
        return 0;
      }
    });
  }


  spawnEnemies(currentTime) {
    var currentWave = this.currentLevel().waves[this.waveIndex];
    var nextSpawn = currentWave[this.spawnIndex];

    if(nextSpawn && currentTime > this.lastSpawnTime + (nextSpawn.delay*1000)) {
      const newEnemy = new Enemy(this, this.enemyData[nextSpawn.type]);
      if (newEnemy) {
        newEnemy.gridPosition = this.currentLevel().path[0];
        newEnemy.lastMoveTime = currentTime;

        this.addObject(newEnemy);

        console.log('spawned '+newEnemy.type+' enemy:  wave'+this.waveIndex+' spawn'+this.spawnIndex);

        this.lastSpawnTime = currentTime;
        this.spawnIndex++;
      }
    }
  }



  spawnCoins(numberOfCoins, gridPosition) {
    for(var i=0; i<numberOfCoins; i++)
    setTimeout(() => {
      var coin = new Coin(this, this.ui.getScreenPositionFromGridPosition(gridPosition));
      coin.spawn();
      this.addObject(coin);
    }, i*75);
  }



  placeTower(tower) {
    this.addObject(tower);
    this.ui.setPlacingObject(null);

    tower.spawn();

    //check for tower upgrades
    this.towers().forEach(checkTower => {
      if(checkTower.upgradeType) {
        var up = false;
        var right = false;
        var diagonal = false;


        this.towers().forEach(tower => {
          if(tower.type === checkTower.type) {
            if(tower.gridPosition.x === checkTower.gridPosition.x && tower.gridPosition.y === checkTower.gridPosition.y + 1)
              up = tower;
            if(tower.gridPosition.x === checkTower.gridPosition.x + 1 && tower.gridPosition.y === checkTower.gridPosition.y)
              right = tower;
            if(tower.gridPosition.x === checkTower.gridPosition.x + 1 && tower.gridPosition.y === checkTower.gridPosition.y + 1)
              diagonal = tower;
          }
        });

        if(up && right && diagonal) {
          up.dead = true;
          right.dead = true;
          diagonal.dead = true;
          checkTower.dead = true;

          this.filterDeadObjects();

          console.log("upgrading to "+checkTower.upgradeType);
          var upgradeTower = new Tower(this, this.towerData[checkTower.upgradeType], {...checkTower.gridPosition});

          this.placeTower(upgradeTower);
        }
      }
    });
  }

  placeFarm(farm) {
      this.addObject(farm);
      this.ui.setPlacingObject(null);
  }



  isTileOccupied(gridPosition) {
    var isOccupied = false;
    this.currentLevel().path.forEach(tile => {
      if(tile.x===gridPosition.x && tile.y===gridPosition.y) {
        isOccupied = true;
      }
    });

    // this.towers().forEach(tower => {
    //   if(tower.gridPosition.x===gridPosition.x && tower.gridPosition.y===gridPosition.y) {
    //     isOccupied = true;
    //   }

    //   if(tower.class === 'mega') {
    //     if(tower.gridPosition && tower.gridPosition.x+1===gridPosition.x && tower.gridPosition.y===gridPosition.y) {
    //       isOccupied = true;
    //     }
    //     if(tower.gridPosition && tower.gridPosition.x===gridPosition.x && tower.gridPosition.y+1===gridPosition.y) {
    //       isOccupied = true;
    //     }
    //     if(tower.gridPosition && tower.gridPosition.x+1===gridPosition.x && tower.gridPosition.y+1===gridPosition.y) {
    //       isOccupied = true;
    //     }
    //   }
    // });

    this.objects.forEach(object => {
      if(object.gridPosition && object.gridPosition.x===gridPosition.x && object.gridPosition.y===gridPosition.y) {
        isOccupied = true;
      }

      if(object instanceof Tower) {
        if(object.class === 'mega') {
          if(object.gridPosition && object.gridPosition.x+1===gridPosition.x && object.gridPosition.y===gridPosition.y) {
            isOccupied = true;
          }
          if(object.gridPosition && object.gridPosition.x===gridPosition.x && object.gridPosition.y+1===gridPosition.y) {
            isOccupied = true;
          }
          if(object.gridPosition && object.gridPosition.x+1===gridPosition.x && object.gridPosition.y+1===gridPosition.y) {
            isOccupied = true;
          }
        }
      }
    });

    return isOccupied;
  }



  enemies() {
    return this.objects.filter((object)=>object instanceof Enemy);
  }

  towers() {
    return this.objects.filter((object)=>object instanceof Tower);
  }

  bullets() {
    return this.objects.filter((object)=>object instanceof Bullet);
  }

  checkEnemyReachEnd() {
    this.enemies().forEach(enemy => {
      if (this.currentLevel().isEndTile(enemy.gridPosition)) {
        this.player.health -= 1;
        enemy.die();
        console.log('enemy reached end')
      }
    });
  }

  checkLevelComplete() {
    if (this.waveIndex=== this.currentLevel().waves.length-1 && this.enemies().length === 0) {
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
