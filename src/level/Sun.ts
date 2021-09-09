import Level from '@/level/Level'
import Sounds from '@/sound/Sounds'
import { Graphics, Sprite } from 'pixi.js'

enum ISunflowerState {
  Default,
  Collecting,
  Dead
}

export default class Sun extends Graphics {
  private level: Level
  public count: number
  public timer: number
  public minY: number
  private sstate: ISunflowerState
  public speed = 0

  public constructor(level: Level, x?: number, y?: number, count?: number) {
    super()

    this.level = level

    this.count = count ?? 25
    this.timer = 0
    this.position.x = x ?? (Math.round(Math.random() * 300) + 75)
    this.minY = y ?? (400 - Math.round(Math.random() * 20))
    this.position.y = y ?? 0
    this.zIndex = 10

    const s = this.addChild(Sprite.from('Sun'))
    s.scale.set(0.7, 0.7)
    s.anchor.set(0.5, 0.5)

    this.interactive = true
    this.buttonMode = true
    this.beginFill(0xffff33, 0.0001)
    this.drawCircle(0, 0, 25)
    this.endFill()

    this.on('click', this.onClick)

    this.sstate = ISunflowerState.Default
  }

  private onClick(): void {
    this.level.emit('addSun', this.count)

    this.sstate = ISunflowerState.Collecting

    this.interactive = false

    const p0 = {
      x: 140,
      y: 50
    }

    const a = p0.x - this.x
    const b = p0.y - this.y

    const c = Math.sqrt(a * a + b * b)

    this.speed = c / 140

    this.level.core.soundManager.playSound(Sounds.SUN_POINTS)
  }

  public update(dt: number): void {
    this.timer += dt

    if (this.sstate === ISunflowerState.Collecting) {
      const p0 = {
        x: 60,
        y: 40
      }

      const angleDeg = Math.atan2(this.y - p0.y, this.x - p0.x)

      if (angleDeg < 0) {
        this.sstate = ISunflowerState.Dead
      } else {
        this.x = this.x + dt * -Math.cos(angleDeg) * 5.5 * this.speed
        this.y = this.y + dt * -Math.sin(angleDeg) * 5.5 * this.speed
      }
    }

    if ((this.timer > 700 && this.sstate === ISunflowerState.Default) || this.sstate === ISunflowerState.Dead) {
      this.parent.removeChild(this)
      this.destroy()
      this.level.suns.splice(this.level.suns.findIndex(p => p === this), 1)
      return
    }

    if (this.position.y < this.minY && this.sstate === ISunflowerState.Default) { this.position.y += dt * 2 }
  }
}
