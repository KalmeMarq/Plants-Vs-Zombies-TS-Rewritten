import Level from '@/level/Level'
import Zombie from '@/level/Zombies'
import Sounds from '@/sound/Sounds'
import { Graphics, Sprite } from 'pixi.js'

export default class Projectile extends Graphics {
  private level: Level
  protected pp: Sprite = new Sprite()

  public constructor(level: Level, x: number, y: number) {
    super()

    this.level = level
    this.position.set(x + 3, y + 3)
    this.init()
  }

  protected init(): void {
    this.pp = this.addChild(Sprite.from('PeaProject'))
    this.pp.scale.set(0.9, 0.9)
  }

  public update(dt: number): void {
    this.position.x += dt * 3

    if (this.x > 750) {
      const i = this.level.projectiles.findIndex(p => p === this)

      try {
        this.parent.removeChild(this)
        this.level.projectiles[i].destroy()
        this.level.projectiles.splice(i, 1)
        return
      } catch (e) {}
    }

    const { y } = this.getBounds()
    const z = this.level.zombies.find(p => {
      const l = p.getBounds()
      return this.x > l.x && this.x < l.x + l.width && y > l.y && y < l.y + l.height
    })

    if (z) this.attack(z)
  }

  public attack(z: Zombie): void {
    z.health -= 20
    const i = this.level.projectiles.findIndex(p => p === this)

    try {
      this.level.core.soundManager.playSound(Sounds.PEA_HIT)
      this.parent.removeChild(this)
      this.level.projectiles[i].destroy()
      this.level.projectiles.splice(i, 1)
    } catch (e) {}
  }
}
