import { Texture } from "@pixi/core";
import Projectile from "./Projectile";
import Zombie from "./Zombies";

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