class UI {
  placingObject = null;
  // placingFarm = null;
  // placingTool = null;
  towerButtons = [];
  farmButtons = [];

  levelStat;
  waveStat;
  coinsStat;
  healthStat;
  cancelBtn;
  startScreen;
  gameScreen;
  victoryScreen;
  gameOverScreen;

  constructor(game) {
    this.game = game;

    this.levelStat = document.getElementById("level");
    this.waveStat = document.getElementById("wave");
    this.coinsStat = document.getElementById("coins");
    this.healthStat = document.getElementById("health");
    this.newLevel = document.getElementById("newLevel");

    this.cancelBtn = document.getElementById("cancelBtn");
    this.startScreen = document.getElementById("startScreen");
    this.gameScreen = document.getElementById("gameScreen");
    this.victoryScreen = document.getElementById("victoryScreen");
    this.gameOverScreen = document.getElementById("gameOverScreen");
    this.newLevelScreen = document.getElementById("newLevelScreen");


    document.getElementById("startBtn").addEventListener("click", () => this.game.startGame());
    document.getElementById("tryAgainBtn").addEventListener("click", () => this.game.restartGame());
    document.getElementById("playAgainBtn").addEventListener("click", () => this.game.restartGame());
    document.getElementById("newLevelBtn").addEventListener("click", () => this.game.startLevel());
    document.getElementById("soundButton").addEventListener("click", () => {
      this.game.audioManager.toggleMute()
      document.getElementById("soundButton").innerHTML = this.game.audioManager.isMuted() ? 'Sound On' : 'Sound Off';
    });

    this.cancelBtn.addEventListener("click", () => this.cancelPurchase());

    this.game.renderer.gameCanvas.addEventListener("click", (event) => this.handleCanvasClick(event));
    this.game.renderer.gameCanvas.addEventListener("mousemove", (event) => this.handleCanvasCursor(event));

  }

  init() {
    this.createTowerButtons();
    this.createFarmButtons();
  }




  render() {
    this.updateStats();
    this.updateTowerButtons();
    this.updateFarmButtons();
  }

  updateStats() {
    this.levelStat.innerHTML = this.game.levelIndex +1;
    this.waveStat.innerHTML = (this.game.waveIndex +1) + '/' + this.game.currentLevel().waves.length;
    this.healthStat.innerHTML = this.game.player.health;
    this.coinsStat.innerHTML = this.game.player.coins;
  }




  handleCanvasClick(event) {
    if (this.placingObject) {
      if(this.placingObject instanceof Tower) {
        this.game.placeTower(this.placingObject);
      }
      if(this.placingObject instanceof Farm) {
        this.game.placeFarm(this.placingObject);
      }

      this.setPlacingObject(null);
      this.showButtons();
      this.game.audioManager.play('sounds/click.mp3');
    }
  }

  handleCanvasCursor(event) {
    const rect = this.game.renderer.gameCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    var gridPosition = this.getGridPositionFromScreenPosition({x: x, y:y});

    if (this.placingObject) {
      if(!this.game.isTileOccupied(gridPosition)) {
        this.placingObject.gridPosition = gridPosition;
      }
    }

  }



  createTowerButtons(game) {
    const towerMenu = document.getElementById("towerMenu");
    Object.values(this.game.towerData).forEach((towerData, index) => {
      const button = document.createElement("button");
      button.innerHTML = `<img src="${towerData.image}"><br/>${towerData.name}<br/>(${towerData.cost} coins)`;
      button.addEventListener("click", () => this.purchaseTower(towerData.type));
      button.towerType = towerData.type;
      towerMenu.appendChild(button);
      this.towerButtons.push(button);
    });
  }

  updateTowerButtons() {
    this.towerButtons.forEach(button => {
      var towerType = button.towerType;
      const towerData = this.game.towerData[towerType];
      button.disabled = this.game.player.coins < towerData.cost;
    });
  }

  createFarmButtons(game) {
    const farmMenu = document.getElementById("farmMenu");
    Object.values(this.game.farmData).forEach((farmData, index) => {
      const button = document.createElement("button");
      button.innerHTML = `<img src="${farmData.image}"><br/>${farmData.name}<br/>(${farmData.cost} coins)`;
      button.addEventListener("click", () => this.purchaseFarm(farmData.type));
      button.farmType = farmData.type;
      farmMenu.appendChild(button);
      this.farmButtons.push(button);
    });
  }

  updateFarmButtons() {
    this.farmButtons.forEach(button => {
      var farmType = button.farmType;
      const farmData = this.game.farmData[farmType];
      button.disabled = this.game.player.coins < farmData.cost;
    });
  }

  showButtons() {
    document.getElementById("purchaseButtons").style.display = 'block';
  }
  hideButtons() {
    document.getElementById("purchaseButtons").style.display = 'none';
  }



  setPlacingObject(placingObject) {
    this.placingObject = placingObject;
    this.cancelBtn.style.display = placingObject ? "block" : "none";
    this.hideButtons();
  }

  cancelPlacingObject() {
    this.setPlacingObject(null);
    this.showButtons();
  }

  purchaseTower(towerType) {
    const towerCost = this.game.towerData[towerType].cost;
    if (this.game.player.coins >= towerCost) {
      this.game.player.coins -= towerCost;
      this.setPlacingObject(new Tower(this.game, this.game.towerData[towerType]));
      this.game.audioManager.play('sounds/click.mp3');
    }
  }

  purchaseFarm(farmType) {
    const cost = this.game.farmData[farmType].cost;
    if (this.game.player.coins >= cost) {
      this.game.player.coins -= cost;
      this.setPlacingObject(new Farm(this.game, this.game.farmData[farmType]));
      this.game.audioManager.play('sounds/click.mp3');
    }
  }

  cancelPurchase() {
    this.game.player.coins += this.placingObject.cost;

    this.cancelPlacingObject();
    this.game.audioManager.play('sounds/click.mp3');
  }



  getGridPositionFromScreenPosition(screenPosition) {
    return {
      x: Math.floor(screenPosition.x / this.game.renderer.tileWidth),
      y: Math.floor(screenPosition.y / this.game.renderer.tileHeight),
    };
  }

  getScreenPositionFromGridPosition(gridPosition) {
    return {
      x: gridPosition.x * this.game.renderer.tileWidth,
      y: gridPosition.y * this.game.renderer.tileHeight,
    };
  }






  hideStartScreen() {
    this.startScreen.style.display = "none";
  }

  hideGameScreen() {
    this.gameScreen.style.display = "none";
  }

  showGameScreen() {
    this.gameScreen.style.display = "block";
    this.hideStartScreen();
    this.hideGameOverScreen();
    this.hideVictoryScreen();
    this.hideNewLevelScreen();
  }

  showNewLevelScreen() {
    this.newLevel.innerHTML = this.game.levelIndex + 1;
    this.newLevelScreen.style.display = "block";
    this.hideStartScreen();
    this.hideGameScreen();
    this.hideGameOverScreen();
    this.hideVictoryScreen();
  }

  hideNewLevelScreen() {
    this.newLevelScreen.style.display = "none";
  }


  showVictoryScreen() {
    this.victoryScreen.style.display = "block";
    this.hideStartScreen();
    this.hideGameOverScreen();
    this.hideGameScreen();
    this.hideNewLevelScreen();
  }

  hideVictoryScreen() {
    this.victoryScreen.style.display = "none";
  }

  showGameOverScreen() {
    this.gameOverScreen.style.display = "block";
    this.hideStartScreen();
    this.hideVictoryScreen();
    this.hideGameScreen();
    this.hideNewLevelScreen();
  }

  hideGameOverScreen() {
    this.gameOverScreen.style.display = "none";
  }
}
