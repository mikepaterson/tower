class Farm {
  constructor(game, farmData, gridPosition) {
    this.game = game;
    this.type = farmData.type;
    this.image = new Image();
    this.image.src = farmData.image;
    this.gridPosition = gridPosition;

    this.payoutCoins = farmData.payoutCoins;
    this.payoutCooldown = farmData.payoutCooldown;
    this.cost = farmData.cost;
    this.lastPayoutTime = 0;
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


}
