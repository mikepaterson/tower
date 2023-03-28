class UI {
  placingTower = null;
  towerButtons = [];

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
    this.cancelBtn.addEventListener("click", () => this.cancelTowerPurchase());

    this.game.renderer.gameCanvas.addEventListener("click", (event) => this.handleCanvasClick(event));
    this.game.renderer.gameCanvas.addEventListener("mousemove", (event) => this.handleCanvasCursor(event));

  }

  init() {
    this.createTowerButtons();
  }




  render() {
    this.updateStats();
    this.updateTowerButtons();
  }

  updateStats() {
    this.levelStat.innerHTML = this.game.levelIndex +1;
    this.waveStat.innerHTML = (this.game.waveIndex +1) + '/' + this.game.currentLevel().waves.length;
    this.healthStat.innerHTML = this.game.player.health;
    this.coinsStat.innerHTML = this.game.player.coins;
  }




  handleCanvasClick(event) {
    if (this.placingTower) {
      // const rect = this.game.renderer.gameCanvas.getBoundingClientRect();
      // const x = event.clientX - rect.left;
      // const y = event.clientY - rect.top;

      // var gridPosition = this.getGridPositionFromScreenPosition({x: x, y:y});
      this.game.placeTower(this.placingTower);
      this.setPlacingTower(null);
      this.showTowerMenu();
    }
  }

  handleCanvasCursor(event) {
    if (this.placingTower) {
      const rect = this.game.renderer.gameCanvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      var gridPosition = this.getGridPositionFromScreenPosition({x: x, y:y});
      if(!this.game.isTileOccupied(gridPosition)) {
        this.placingTower.gridPosition = gridPosition;
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

  showTowerMenu() {
    document.getElementById("towerMenu").style.display = 'block';
  }
  hideTowerMenu() {
    document.getElementById("towerMenu").style.display = 'none';
  }



  setPlacingTower(towerType) {
    this.placingTower = towerType;
    this.cancelBtn.style.display = towerType ? "block" : "none";
    this.hideTowerMenu();
  }

  purchaseTower(towerType) {
    const towerCost = this.game.towerData[towerType].cost;
    if (this.game.player.coins >= towerCost) {
      this.game.player.coins -= towerCost;
      this.setPlacingTower(new Tower(this.game, this.game.towerData[towerType]));
    }
  }

  cancelTowerPurchase() {
    this.setPlacingTower(null);
    this.showTowerMenu();
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
