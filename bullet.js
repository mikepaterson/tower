class Bullet {
  constructor(imageSrc, damagePoints, travelSpeed, screenPosition, target ) {

    this.image = new Image();
    this.image.src = imageSrc;

    this.screenPosition = screenPosition;
    this.target = target;
    this.damagePoints = damagePoints;
    this.travelSpeed = travelSpeed;

    this.lastMoveTime = 0;
  }

  move(game, currentTime) {
    var targetScreenPosition = game.ui.getScreenPositionFromGridPosition(this.target.gridPosition);

    const dx = targetScreenPosition.x - this.screenPosition.x;
    const dy = targetScreenPosition.y - this.screenPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const moveDistance = this.travelSpeed;

    if (moveDistance >= distance) {
      this.screenPosition.x = targetScreenPosition.x;
      this.screenPosition.y = targetScreenPosition.y;
    } else {
      this.screenPosition.x += (dx / distance) * moveDistance;
      this.screenPosition.y += (dy / distance) * moveDistance;
    }
    this.lastMoveTime = currentTime;
  }

  hasReachedTarget(game) {
    var targetScreenPosition = game.ui.getScreenPositionFromGridPosition(this.target.gridPosition);

    return this.screenPosition.x === targetScreenPosition.x && this.screenPosition.y === targetScreenPosition.y;
  }

  hitTarget() {
    this.target.takeDamage(this.damagePoints);
  }
}
