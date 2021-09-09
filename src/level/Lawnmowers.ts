import Level from '@/level/Level'
import { Graphics } from '@pixi/graphics'
import { Sprite } from '@pixi/sprite'

enum ILawnState {
  StandBy,
  Moving
}

export default class Lawnmowers extends Graphics {
  private level: Level
  public r: number
  public lstate: ILawnState

  public constructor(level: Level, x: number, y: number, r: number) {
    super()

    this.level = level
    this.x = x - 20
    this.y = y
    this.r = r

    // this.beginFill(0x00ff88)
    // this.drawRect(2, 30, 60, 52)
    // this.endFill()

    const lmS = this.addChild(Sprite.from('LawnMover'))
    lmS.scale.set(0.7, 0.7)
    lmS.position.set(-20, 20)

    this.lstate = ILawnState.StandBy
  }

  public update(dt: number): void {
    if (this.lstate === ILawnState.Moving) {
      this.position.x += dt * 2.3

      if (this.x > 750) {
        const i = this.level.lawnmowers.findIndex(l => l === this)
        if (i !== -1) {
          this.level.lawnmowers.splice(i, 1)
          this.parent.removeChild(this)
          this.destroy()
          return
        }
      }
    }

    const z = this.level.zombies.find(f => {
      return f.r === this.r && f.x < this.x + this.width
    })

    if (!z) return
    this.lstate = ILawnState.Moving
    z.parent.removeChild(z)
    const i = this.level.zombies.findIndex(l => l === z)
    this.level.zombies.splice(i, 1)
    z.destroy()
  }
}
