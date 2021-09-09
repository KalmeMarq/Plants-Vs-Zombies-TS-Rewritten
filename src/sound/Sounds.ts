/** @deprecated */
export default class Sounds {
  public static SHOVEL_TAP: Sounds = new Sounds('ui.shovel_tap')
  public static SUN_POINTS: Sounds = new Sounds('ui.sun_points')
  public static COIN: Sounds = new Sounds('ui.coin')
  public static TAP: Sounds = new Sounds('ui.tap')
  public static BLEEP: Sounds = new Sounds('ui.bleep')
  public static PEA_HIT: Sounds = new Sounds('plant.pea_splat')
  public static PLANT: Sounds = new Sounds('plant.plant')
  public static PAUSE: Sounds = new Sounds('ui.pause_game')
  public static GRASS_WALK: Sounds = new Sounds('music.grasswalk_ingame')
  public static ACHIEVEMENT: Sounds = new Sounds('ui.earn_achievement')
  public static PAPER: Sounds = new Sounds('ui.paper')
  public static GRAVEBUTTON: Sounds = new Sounds('ui.gravebutton')
  public static BUTTONCLICK: Sounds = new Sounds('ui.button_click')

  private location: string
  private constructor(location: string) {
    this.location = location
  }

  public getLocation(): string {
    return this.location
  }
}
