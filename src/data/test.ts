/*eslint-disable */
const level = {
  name: '1-1',
  progress: 60,
  bank: {
    sunsCount: 30,
    cards: [
      {
        type: 'pea',
        recharging: true
      }
    ]
  },
  suns: [
    {
      type: 'normal',
      x: 39,
      y: 20,
      min_y: 50
    }
  ],
  lawnmowers: [
    {
      x: 0,
      y: 0
    }
  ],
  projectiles: [
    {
      type: 'pea',
      x: 50,
      y: 30
    }
  ],
  zombies: [
    {
      x: 12,
      y: 60,
      type: 'normal'
    }
  ],
  particles: [
  ],
  tiles: [
    {
      x: 40,
      y: 40,
      plant: null
    }
  ]
}

const settings = {
  music: 1.0,
  sound: 1.0,
  fullscreen: false
}

const plannedSettings = {
  master: 1.0,
  music: 0.2,
  plants: 0.8,
  zombies: 0.8,
  crazy_dave: 0.4,
  fullscreen: false
}

const users = [
  {
    name: 'KalmeMarq',
    file: 'user0'
  }
]

const usersData = {
  user0: {
    level: 0,
    achievements: [
      {
        id: 'achiev_id',
        completed: false
      }
    ]
  }
}
