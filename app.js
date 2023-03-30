async function loadData() {
  const [levelsResponse, enemyTypesResponse, towerTypesResponse, blockTypesResponse, farmTypesResponse] = await Promise.all([
    fetch("levels.json"),
    fetch("enemyTypes.json"),
    fetch("towerTypes.json"),
    fetch("blockTypes.json"),
    fetch("farmTypes.json"),
  ]);

  const [levels, enemyTypes, towerTypes, blockTypes, farmTypes] = await Promise.all([
    levelsResponse.json(),
    enemyTypesResponse.json(),
    towerTypesResponse.json(),
    blockTypesResponse.json(),
    farmTypesResponse.json(),
  ]);

  const game = new Game(levels, enemyTypes, towerTypes, blockTypes, farmTypes);
  game.init();
}

loadData();
