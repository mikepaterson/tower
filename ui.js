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
    this.cancelBtn = document.getElementById("cancelBtn");
    this.startScreen = document.getElementById("startScreen");
    this.gameScreen = document.getElementById("gameScreen");
    this.victoryScreen = document.getElementById("victoryScreen");
    this.gameOverScreen = document.getElementById("gameOverScreen");

    document.getElementById("startBtn").addEventListener("click", () => this.game.startGame());
    document.getElementById("tryAgainBtn").addEventListener("click", () => this.game.restartGame());
    document.getElementById("playAgainBtn").addEventListener("click", () => this.game.restartGame());
    this.cancelBtn.addEventListener("click", () => this.cancelTowerPurchase());

    this.game.renderer.gameCanvas.addEventListener("click", (event) => this.handleCanvasClick(event));

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

  updateTowerButtons() {
    this.towerButtons.forEach((button, index) => {
      const towerType = this.game.towerTypes[index];
      button.disabled = this.game.player.coins < towerType.cost;
    });
  }




  handleCanvasClick(event) {
    if (this.placingTower) {
      const rect = this.game.renderer.gameCanvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      var gridPosition = this.getGridPositionFromScreenPosition({x: x, y:y});
      this.game.placeTower(this.placingTower, gridPosition);
      this.setPlacingTower(null);
    }
  }



  createTowerButtons(game) {
    const towerMenu = document.getElementById("towerMenu");
    Object.values(this.game.towerTypes).forEach((towerType, index) => {
      const button = document.createElement("button");
      button.textContent = `${towerType.name} (${towerType.cost} coins)`;
      button.addEventListener("click", () => this.purchaseTower(index));
      towerMenu.appendChild(button);
      this.towerButtons.push(button);
    });
  }

  setPlacingTower(towerType) {
    this.placingTower = towerType;
    this.cancelBtn.style.display = towerType ? "block" : "none";
  }

  purchaseTower(towerType) {
    const towerCost = this.game.towerTypes[towerType].cost;
    if (this.game.player.coins >= towerCost) {
      this.game.player.coins -= towerCost;
      this.setPlacingTower(new Tower(this.game, this.game.towerTypes[towerType]));
    }
  }

  cancelTowerPurchase() {
    this.setPlacingTower(null);
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
  }

  showVictoryScreen() {
    this.victoryScreen.style.display = "block";
    this.hideStartScreen();
    this.hideGameOverScreen();
    this.hideGameScreen();
  }

  hideVictoryScreen() {
    this.victoryScreen.style.display = "none";
  }

  showGameOverScreen() {
    this.gameOverScreen.style.display = "block";
    this.hideStartScreen();
    this.hideVictoryScreen();
    this.hideGameScreen();
  }

  hideGameOverScreen() {
    this.gameOverScreen.style.display = "none";
  }
}
