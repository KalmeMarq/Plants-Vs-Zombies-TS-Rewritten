import Plant from '@/plants/test/Plant'
import RechargeTime from '@/plants/test/RechargeTime'

export default class Plants {
  private static list: Plant[] = []

  public static PEASHOOTER = Plants.register(new Plant('peashooter', 100, RechargeTime.FAST, 0, 'day', 'PeaShooter'))
  public static SUNFLOWER = Plants.register(new Plant('sunflower', 50, RechargeTime.FAST, 1, 'day', 'Sunflower'))
  public static CHERRY_BOMB = Plants.register(new Plant('cherry_bomb', 150, RechargeTime.VERY_SLOW, 2, 'day', ''))
  public static WALL_NUT = Plants.register(new Plant('wall_nut', 50, RechargeTime.SLOW, 3, 'night', 'WallnutBody'))
  public static POTATO_MINE = Plants.register(new Plant('potato_mine', 50, RechargeTime.SLOW, 4, 'day', ''))
  public static SNOWPEA = Plants.register(new Plant('snow_pea', 175, RechargeTime.FAST, 5, 'day', 'SnowPea'))
  // public static CHOMPER = Plants.register(new Plant('chomper', 175, RechargeTime.FAST, 6, 'day', ''))
  // public static REPEATER = Plants.register(new Plant('repeater', 175, RechargeTime.FAST, 7, 'day', ''))
  // public static PUFF_SHROOM = Plants.register(new Plant('puff_shroom', 0, RechargeTime.FAST, 8, 'night', ''))
  // public static SUN_SHROOM = Plants.register(new Plant('sun_shroom', 25, RechargeTime.FAST, 9, 'night', ''))
  // public static FUME_SHROOM = Plants.register(new Plant('fume_shroom', 75, RechargeTime.FAST, 10, 'night', ''))
  public static GRAVE_BUSTER = Plants.register(new Plant('grave_buster', 75, RechargeTime.FAST, 11, 'night', 'GraveBuster'))
  // public static HYPNO_SHROOM = Plants.register(new Plant('hypno_shroom', 75, RechargeTime.SLOW, 12, 'night', ''))
  public static LILY_PAD = Plants.register(new Plant('lily_pad', 25, RechargeTime.SLOW, 0, 'day_pool', 'LilyPad_body'))

  private static register(plant: Plant): Plant {
    this.list.push(plant)
    return plant
  }

  public static getList(): Plant[] {
    return this.list
  }

  public static getById(id: string): Plant {
    return this.list.find(p => p.id === id) ?? Plants.PEASHOOTER
  }
}
