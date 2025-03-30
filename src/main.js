const tree = new SkillTree({
  node: new SkillNode("X", 20),
  children: [
    {
      node: new SkillNode("A1", 20),
      children: [
        {
          node: new SkillNode("A11", 20),
          children: [],
        },
        {
          node: new SkillNode("A12", 20),
          children: [
            {
              node: new SkillNode("A121", 20),
              children: [],
            },
            {
              node: new SkillNode("A122", 20),
              children: [],
            },
          ],
        },
      ],
    },
    {
      node: new SkillNode("B1", 20),
      children: [
        {
          node: new SkillNode("B11", 20),
          children: [
            {
              node: new SkillNode("B111", 20),
              children: [
                {
                  node: new SkillNode("B1111", 20),
                  children: [],
                },
              ],
            },
          ],
        },
        {
          node: new SkillNode("B12", 20),
          children: [],
        },
      ],
    },
    {
      node: new SkillNode("C1", 20),
      children: [
        {
          node: new SkillNode("C11", 20),
          children: [],
        },
        {
          node: new SkillNode("C12", 20),
          children: [
            {
              node: new SkillNode("C121", 20),
              children: [],
            },
          ],
        },
        {
          node: new SkillNode("C13", 20),
          children: [
            {
              node: new SkillNode("C131", 20),
              children: [],
            },
            {
              node: new SkillNode("C132", 20),
              children: [],
            },
          ],
        },
      ],
    },
  ],
});

function setup() {
  createCanvas(800, 800);
  tree.arrangeNodes(width, height);
}

function draw() {
  background(51);
  tree.draw();
}

function mousePressed() {
  tree.clicked();
}
