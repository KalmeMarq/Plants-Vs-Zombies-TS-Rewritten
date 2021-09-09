import SoundEvent from '@/sound/SoundEvent'

export default class SoundEvents {
  public static SUN_POINTS: SoundEvent = new SoundEvent('ui.sun_points')
  public static PEA_HIT: SoundEvent = new SoundEvent('plant.pea_splat')
  public static PLANT: SoundEvent = new SoundEvent('plant.plant')
  public static PAUSE: SoundEvent = new SoundEvent('ui.pause_game')
}
