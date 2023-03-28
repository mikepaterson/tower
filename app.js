async function loadData() {
  const [levelsResponse, enemyTypesResponse, towerTypesResponse, blockTypesResponse] = await Promise.all([
    fetch("levels.json"),
    fetch("enemyTypes.json"),
    fetch("towerTypes.json"),
    fetch("blockTypes.json"),
  ]);

  const [levels, enemyTypes, towerTypes, blockTypes] = await Promise.all([
    levelsResponse.json(),
    enemyTypesResponse.json(),
    towerTypesResponse.json(),
    blockTypesResponse.json(),
  ]);

  const game = new Game(levels, enemyTypes, towerTypes, blockTypes);
  game.init();
}

loadData();
