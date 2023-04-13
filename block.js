class Block extends BaseObject {

  constructor(game, blockData, gridPosition) {
    super(game);

    this.type = blockData.type;
    this.image = new Image();
    this.image.src = blockData.image;


    this.gridPosition = gridPosition;
  }


}
