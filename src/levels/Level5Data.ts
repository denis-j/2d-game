// Level 5: Die vergessenen Zellen (Starting level)
export const Level5Data = {
  name: 'Die vergessenen Zellen',
  levelNumber: 5,
  width: 20,
  height: 15,
  tileSize: 16,

  // Tilemap data (0 = floor, 1 = wall)
  tiles: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ],

  // Player spawn position
  playerSpawn: { x: 10, y: 7 },

  // Enemies
  enemies: [
    { type: 'slime_green', x: 5, y: 5 },
    { type: 'slime_green', x: 15, y: 5 },
    { type: 'slime_green', x: 10, y: 10 },
    { type: 'bat', x: 8, y: 3 },
    { type: 'bat', x: 12, y: 3 }
  ],

  // Items
  items: [
    { type: 'bronze_coin', x: 3, y: 2 },
    { type: 'bronze_coin', x: 17, y: 2 },
    { type: 'bronze_coin', x: 3, y: 12 },
    { type: 'bronze_coin', x: 17, y: 12 },
    { type: 'small_chest', x: 10, y: 2 }
  ],

  // Decorations
  decorations: [
    { type: 'torch_front', x: 2, y: 1 },
    { type: 'torch_front', x: 18, y: 1 },
    { type: 'torch_front', x: 2, y: 13 },
    { type: 'torch_front', x: 18, y: 13 }
  ]
};
