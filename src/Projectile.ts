import { Graphics, Sprite } from "pixi.js"
import { Sounds } from "."
import Level from "./Level"

export default class Projectile extends Graphics {
  private level: Level

  public constructor(level: Level, x: number, y: number) {
    super()

    this.level = level
    this.position.set(x +3, y + 3)
    // this.beginFill(0xf4224f)
    // this.drawRect(0, 0, 20, 20)
    // this.endFill()

    const ppS = this.addChild(Sprite.from('PeaProject'))
    ppS.scale.set(0.9, 0.9)
  }

  public update(dt: number): void {
    this.position.x += dt * 3

    if(this.x > 750) {
      const i = this.level.projectiles.findIndex(p => p === this)

      try {
        this.parent.removeChild(this)
        this.level.projectiles[i].destroy()
        this.level.projectiles.splice(i, 1)
        return
      } catch(e) {}
    }

    const { y } = this.getBounds() 
    const z = this.level.zombies.find(p => {
      const l = p.getBounds()
      return this.x > l.x && this.x < l.x + l.width && y > l.y && y < l.y + l.height
    })

    if(z) {
      z.health -= 20
      const i = this.level.projectiles.findIndex(p => p === this)

      try {
        this.level.core.soundManager.playSound(Sounds.PEA_HIT)
        this.parent.removeChild(this)
        this.level.projectiles[i].destroy()
        this.level.projectiles.splice(i, 1)
        return
      } catch(e) {}
    }
  }
}