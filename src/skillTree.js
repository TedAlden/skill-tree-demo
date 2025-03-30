class SkillTree {
  constructor(skillTree) {
    this.skillTree = skillTree;
    this.startNode = skillTree.node;
    this.nodes = [];
    this.populateNodes(this.skillTree);
    this.populateConnections(this.skillTree);
    this.nodes[0].purchased = true;
  }

  populateNodes(node) {
    this.nodes.push(node.node);
    node.children.forEach(child => {
      this.populateNodes(child);
    });
  }

  populateConnections(node) {
    node.children.forEach(child => {
      node.node.connect(child.node);
      this.populateConnections(child);
    });
  }

  findNearestPurchasedSkill(node) {
    let nearest = null;
    let minDistance = Infinity;
    this.nodes.forEach(n => {
      if (n.purchased) {
        const path = this.pathFind(n, node);
        if (path.length > 1 && path.length < minDistance) {
          minDistance = path.length;
          nearest = n;
        }
      }
    });
    return nearest;
  }

  pathFind(startNode, endNode) {
    // Path finding using Dijkstra's algorithm
    const queue = [];
    const visited = [];
    const distance = {};
    const previous = {};
    const path = [];
    this.nodes.forEach(node => {
      distance[node.skill] = Infinity;
      previous[node.skill] = null;
    });
    distance[startNode.skill] = 0;
    queue.push(startNode);
    while (queue.length > 0) {
      const node = queue.shift();
      node.connections.forEach(connection => {
        const alt = distance[node.skill] + 1;
        if (alt < distance[connection.skill]) {
          distance[connection.skill] = alt;
          previous[connection.skill] = node;
          queue.push(connection);
        }
      });
    }
    let node = endNode;
    while (node) {
      path.push(node);
      node = previous[node.skill];
    }
    return path.reverse();
  }

  clicked() {
    this.nodes.forEach(node => {
      if (node.isHovered()) {
        if (!node.purchased) {
          // purchase all skill nodes leading up to this skill node, starting
          // from the nearest purchased skill node
          const nearest = this.findNearestPurchasedSkill(node);
          if (nearest) {
            let cost = 0;
            const path = this.pathFind(nearest, node);
            // remove first node in path since it's already purchased
            path.shift();
            path.forEach(n => {
              cost += n.cost;
            });
            // Change 10000 here to implement a point balance
            if (cost <= 10000) {
              path.forEach(n => {
                n.purchase();
              });
              console.log(`Purchased ${path.map(n => n.skill).join(", ")} for ${cost} points`);
            }
          }
        }
      }
    });
  }

  drawTreeRecursive(tree) {
    if (!tree) return;

    let path;
    let end = this.nodes.find(node => node.isHovered());

    if (end && end != this.startNode && !end.purchased) {
      let start = this.findNearestPurchasedSkill(end);
      path = this.pathFind(start, end);
    }
    
    // Draw each connection for this node
    tree.children.forEach(child => {
      if (path && path.includes(tree.node) && path.includes(child.node)) {
        stroke(0, 255, 0);
        strokeWeight(7);
      } else if (tree.node.purchased && child.node.purchased) {
        stroke(0, 255, 0);
        strokeWeight(1);
      } else {
        stroke(255, 255, 255);
        strokeWeight(1);
      }
      line(tree.node.x, tree.node.y, child.node.x, child.node.y);
      this.drawTreeRecursive(child);
    });
    
    // Draw this node
    tree.node.draw();
  }

  getTreeDepth(tree) {
    if (!tree || !tree.children || tree.children.length === 0) return 1;
    let maxDepth = 0;
    tree.children.forEach(child => {
      const childDepth = this.getTreeDepth(child);
      if (childDepth > maxDepth) {
        maxDepth = childDepth;
      }
    });
    return maxDepth + 1;
  }

  arrangeNodes(canvasWidth, canvasHeight) {
    if (!this.startNode) return;

    const maxDepth = this.getTreeDepth(this.skillTree);
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const maxRadius = Math.min(canvasWidth, canvasHeight) * 0.5;

    // Start layout with root at center
    this.layoutNodeRecursive(
      this.skillTree,
      0,
      maxDepth,
      centerX,
      centerY,
      maxRadius,
      -PI*2,
      PI*2
    );
  }

  layoutNodeRecursive(node, depth, maxDepth, centerX, centerY, maxRadius, angle, sectorWidth) {
    // 1. Place this node
    const radius = (depth / maxDepth) * maxRadius;
    if (depth === 0) {
      // Place root node (depth 0) at center
      node.node.x = centerX;
      node.node.y = centerY;
    } 
    else {
      // For all other nodes
      node.node.x = centerX + radius * cos(angle);
      node.node.y = centerY + radius * sin(angle);
    }

    // 2. Place child nodes
    if (node.children && node.children.length > 0) {     
      const childSectorWidth = sectorWidth / node.children.length;
      let childAngle = angle - sectorWidth / 2 + childSectorWidth / 2;

      node.children.forEach(child => {
        this.layoutNodeRecursive(
          child,
          depth + 1,
          maxDepth,
          centerX,
          centerY,
          maxRadius,
          childAngle,
          childSectorWidth
        );        
        // Move to next child's angle
        childAngle += childSectorWidth;
      });
    }
  }

  draw() {
    this.drawTreeRecursive(this.skillTree);
  }
}
