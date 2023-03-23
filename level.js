class Level {
  constructor(levelData) {
    this.gridSize = levelData.gridSize;
    this.tileSize = levelData.tileSize;
    this.path = levelData.path;
    this.pathTiles = new Set(levelData.path.map((tile) => tile.x + "," + tile.y));
    this.waves = levelData.waves;
    this.occupiedTiles = new Set();
  }

  // isPath(x, y) {
  //   return this.pathTiles.has(x + "," + y);
  // }

  // isOccupied(occupyTile) {
  //   return this.occupiedTiles.has(x + "," + y);
  // }

  // occupyTile(x, y) {
  //   this.occupiedTiles.add(x + "," + y);
  // }

  isEndTile(gridPosition) {
    const endPathIndex = this.path.length -1;
    return this.path[endPathIndex].x === gridPosition.x && this.path[endPathIndex].y === gridPosition.y;
  }

  isStartTile(gridPosition) {
    return this.path[0].x === gridPosition.x && this.paht[0].y === gridPosition.y;
  }

  getNextPosition(gridPosition) {
    var nextGridPosition = null;
    var hasFoundCurrent = false;
    this.path.forEach(tile => {
      if(hasFoundCurrent && !nextGridPosition) {
        nextGridPosition = tile;
      }

      if(tile.x===gridPosition.x && tile.y===gridPosition.y) {
        hasFoundCurrent = true;
      }
    })

    return nextGridPosition;
  }
}
