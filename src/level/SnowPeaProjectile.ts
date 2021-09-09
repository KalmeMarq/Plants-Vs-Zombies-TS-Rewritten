import Projectile from '@/level/Projectile'
import Zombie from '@/level/Zombies'
import { Texture } from '@pixi/core'

export default class SnowPeaProjectile extends Projectile {
  protected override init(): void {
    super.init()
    this.pp.texture = Texture.from('SnowPeaProject')
  }

  public override attack(z: Zombie): void {
    z.setCold()
    super.attack(z)
  }
}
