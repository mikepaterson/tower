class Block {
  constructor(game, blockData, gridPosition) {
    this.game = game;
    this.type = blockData.type;
    this.image = new Image();
    this.image.src = blockData.image;
    this.gridPosition = gridPosition;
  }


}
