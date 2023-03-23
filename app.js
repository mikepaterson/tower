async function loadData() {
  const [levelsResponse, enemyTypesResponse, towerTypesResponse] = await Promise.all([
    fetch("levels.json"),
    fetch("enemyTypes.json"),
    fetch("towerTypes.json"),
  ]);

  const [levels, enemyTypes, towerTypes] = await Promise.all([
    levelsResponse.json(),
    enemyTypesResponse.json(),
    towerTypesResponse.json(),
  ]);

  const game = new Game(levels, enemyTypes, towerTypes);
  game.init();
}

loadData();
