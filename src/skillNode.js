class SkillNode {
  constructor(skill, cost) {
    this.skill = skill;
    this.cost = cost;
    // x and y coordinates will be initialised later on in the SkillTree class
    // when the circular arrangement is calculated
    this.x = 0;
    this.y = 0;
    this.defaultRadius = 15;
    this.purchasedRadius = 25;
    this.purchased = false;
    this.connections = [];
  }

  connect(node) {
    this.connections.push(node);
  }

  purchase() {
    this.purchased = true;
  }

  isHovered() {
    const r = this.purchased ? this.purchasedRadius : this.defaultRadius;
    return dist(mouseX, mouseY, this.x, this.y) < r / 2;
  }

  draw() {
    // Determine node fill colour
    if (this.purchased) {
      fill(0, 255, 0);
    } else if (this.isHovered()) {
      fill(0, 255, 0);
    } else {
      fill(255, 255, 255);
    }

    // Determine node radius and draw it
    const r = this.purchased ? this.purchasedRadius : this.defaultRadius;
    ellipse(this.x, this.y, r, r);
    
    // Draw text
    fill(255, 255, 0);
    stroke(0)
    strokeWeight(2);
    textAlign(CENTER, CENTER);
    text(this.skill, this.x, this.y - 12);    
    stroke(255);
    strokeWeight(1);
  }
}
