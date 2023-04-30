class PathFinder {
  constructor(grid) {
    this.grid = grid;
    this.openList = [];
    this.closedList = [];
  }

  findPath(startPos, targetPos) {
    this.openList = [];
    this.closedList = [];

    const startNode = {
      pos: startPos,
      parent: null,
      gCost: 0,
      hCost: this.heuristic(startPos, targetPos),
      fCost: 0,
    };
    this.openList.push(startNode);

    while (this.openList.length > 0) {
      // Find the node with the lowest F cost in the open list
      let currentNode = this.openList[0];
      for (let i = 1; i < this.openList.length; i++) {
        if (this.openList[i].fCost < currentNode.fCost) {
          currentNode = this.openList[i];
        }
      }

      // Move the current node to the closed list
      this.openList.splice(this.openList.indexOf(currentNode), 1);
      this.closedList.push(currentNode);

      // If the target position is in the closed list, the path is found
      if (currentNode.pos.x === targetPos.x && currentNode.pos.y === targetPos.y) {
        return this.getPath(currentNode);
      }

      // Check the neighbors of the current node
      const neighbors = this.getNeighbors(currentNode.pos);
      for (let i = 0; i < neighbors.length; i++) {
        const neighborPos = neighbors[i];
        const neighborNode = {
          pos: neighborPos,
          parent: currentNode,
          gCost: currentNode.gCost + this.getDistance(currentNode.pos, neighborPos),
          hCost: this.heuristic(neighborPos, targetPos),
          fCost: 0,
        };
        neighborNode.fCost = neighborNode.gCost + neighborNode.hCost;

        // If the neighbor is already in the closed list, skip it
        if (this.isNodeInList(neighborNode, this.closedList)) {
          continue;
        }

        // If the neighbor is not in the open list, add it
        const openNode = this.getNodeFromList(neighborNode, this.openList);
        if (openNode === null) {
          this.openList.push(neighborNode);
        } else {
          // If the neighbor is already in the open list, update its costs and parent if necessary
          if (neighborNode.gCost < openNode.gCost) {
            openNode.gCost = neighborNode.gCost;
            openNode.fCost = neighborNode.fCost;
            openNode.parent = neighborNode.parent;
          }
        }
      }
    }

    // If the open list is empty and the target position is not in the closed list, there is no path
    return null;
  }

  getNeighbors(pos) {
    const neighbors = [];
    const directions = [
      //{ x: -1, y: -1 },
      { x: 0, y: -1 },
      //{ x: 1, y: -1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      //{ x: -1, y: 1 },
      { x: 0, y: 1 },
      //{ x: 1, y: 1 },
    ];
    for (let i = 0; i < directions.length; i++) {
      const direction = directions[i];
      const neighborPos = { x: pos.x + direction.x, y: pos.y + direction.y };

      if (this.isValidPos(neighborPos)) {
        neighbors.push(neighborPos);
      }
    }
    return neighbors;
  }

  isValidPos(pos) {
    return pos.x >= 0 && pos.x < this.grid.width &&
      pos.y >= 0 && pos.y < this.grid.height &&
      this.grid.nodes[pos.y][pos.x].walkable;
  }

  getDistance(pos1, pos2) {
    const dx = Math.abs(pos1.x - pos2.x);
    const dy = Math.abs(pos1.y - pos2.y);
    if (dx > dy) {
      return 14 * dy + 10 * (dx - dy);
    } else {
      return 14 * dx + 10 * (dy - dx);
    }
  }

  heuristic(pos1, pos2) {
    const dx = Math.abs(pos1.x - pos2.x);
    const dy = Math.abs(pos1.y - pos2.y);
    return dx + dy;
  }

  isNodeInList(node, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].pos.x === node.pos.x && list[i].pos.y === node.pos.y) {
      return true;
      }
    }
    return false;
  }

  getNodeFromList(node, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].pos.x === node.pos.x && list[i].pos.y === node.pos.y) {
      return list[i];
      }
    }
    return null;
  }

  getPath(endNode) {
    const path = [];
    let currentNode = endNode;
    while (currentNode !== null) {
      path.unshift(currentNode.pos);
      currentNode = currentNode.parent;
    }
    return path;
  }
}